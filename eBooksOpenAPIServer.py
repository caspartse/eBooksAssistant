#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from common import *
from crawler import c_douban_info

app = Bottle()
_API_VERSION = '1.0'
JWT_SECRET_KEY = rd.get('JWT_SECRET_KEY')


# 预处理请求
_REQUEST_IDS = {}
@app.hook('before_request')
def setup_request():
    request_id = uuid4().hex
    _REQUEST_IDS[threading.get_ident()] = request_id # 线程 ID 与 request_id 的映射
    headers_to_set = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, private, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-ID': request_id
    }
    for key, value in headers_to_set.items():
        response.set_header(key, value)
    return


# 保存请求日志，记录消耗的配额
@app.hook('after_request')
def teardown_request():
    request_id = _REQUEST_IDS.get(threading.get_ident())
    api_key = request.query.api_key or ''
    bearer_token = request.headers.get('Authorization', '').replace('Bearer ', '')
    api_key = api_key or bearer_token

    # api_key 是必需的，如果没有则不记录日志
    if not api_key:
        return

    ip = request.get_header('Cf-Connecting-Ip', '') or request.remote_addr
    request_url = request.urlparts._replace(query=None).geturl()
    request_headers = json.dumps(dict(request.headers)).decode('utf-8')
    status_code = response.status_code
    result = getattr(request, 'result', b'').decode('utf-8')

    conn = db_pool.getconn()
    conn.autocommit = False
    cur = conn.cursor()

    try:
        q = f'''
            INSERT INTO openapi_log (request_id, api_key, ip, request_url, request_headers, status_code, result)
            VALUES ('{request_id}', '{api_key}', '{ip}', '{request_url}', '{request_headers}', {status_code}, '{result}')
            ON CONFLICT (request_id) DO NOTHING;
        '''
        cur.execute(q)
        conn.commit()
    except Exception as e:
        traceback.print_exc()
        conn.rollback()

    try:
        q = f'''
            WITH t1 AS (
                SELECT api_key, COUNT(*) AS cnt
                FROM openapi_log
                WHERE api_key = '{api_key}'
                AND DATE_TRUNC('month', receive_time) = DATE_TRUNC('month', CURRENT_TIMESTAMP)
                AND result <> ''
                GROUP BY api_key
            ), t2 AS (
                SELECT u.api_key, COALESCE(t1.cnt, 0) AS usage
                FROM openapi_user u
                LEFT JOIN t1 USING(api_key)
                WHERE u.api_key = '{api_key}'
            )
            UPDATE openapi_user
            SET credit = quota - t2.usage, usage = t2.usage
            FROM t2
            WHERE openapi_user.api_key = t2.api_key;
        '''
        cur.execute(q)
        conn.commit()
    except Exception as e:
        traceback.print_exc()
        conn.rollback()

    cur.close()
    db_pool.putconn(conn)
    return


# 异常处理
@app.error(400)
@app.error(401)
@app.error(403)
@app.error(404)
@app.error(500)
def error_handler(error):
    request_id = _REQUEST_IDS.get(threading.get_ident())
    code = error.status_code
    errmsg = error.body
    data = {
        'data': {},
        'code': code,
        'errmsg': errmsg,
        'request_id': request_id
    }
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    return json.dumps(data)


@app.route('/favicon.ico')
def favicon():
    return static_file('favicon.ico', root='static')


@app.route('/')
def home():
    response.status = 302
    response.set_header('Location', 'https://github.com/caspartse/eBooksAssistant?utm_source=openapi.youdianzishu.com&utm_medium=redirect')


def query_jwt_token(api_key: str) -> str:
    '''
    查询 JWT token
    :param api_key: API key, 'eba-[32 位字符串]'
    :return: JWT token
    '''
    conn = db_pool.getconn()
    conn.autocommit = False
    cur = conn.cursor()
    q = f'''
        SELECT jwt_token
        FROM openapi_token t
        WHERE api_key = '{api_key}'
        AND is_valid = TRUE
        AND EXISTS (
            SELECT 1
            FROM openapi_user u
            WHERE u.is_blocked = FALSE
            AND u.api_key = t.api_key
        );
    '''
    cur.execute(q)
    jwt_token = cur.fetchone()
    cur.close()
    db_pool.putconn(conn)
    jwt_token = jwt_token[0] if jwt_token else ''
    return jwt_token


def verify_jwt_token(jwt_token: str) -> int:
    '''
    验证 JWT token
    :param jwt_token: JWT token
    :return: 200: 正常, -1: 过期, -2: 无效
    '''
    try:
        jwt.decode(jwt_token, JWT_SECRET_KEY, algorithms=['HS256'])
        return 200
    except jwt.ExpiredSignatureError:
        return -1
    except jwt.InvalidTokenError:
        return -2


def query_credit(api_key: str) -> int:
    '''
    查询 API key 的可用额度 (剩余配额)
    :param api_key: API key
    :return: 可用额度
    '''
    conn = db_pool.getconn()
    conn.autocommit = False
    cur = conn.cursor()
    q = f'''
        SELECT credit
        FROM openapi_user
        WHERE api_key = '{api_key}'
    '''
    cur.execute(q)
    row = cur.fetchone()
    cur.close()
    db_pool.putconn(conn)
    credit = row[0] if row else 0
    return credit


def query_metadata(isbn: str) -> dict:
    '''
    查询元数据
    :param isbn: ISBN
    :return: 元数据字典
    '''
    metadata = {}
    conn = db_pool.getconn()
    conn.autocommit = False
    cur = conn.cursor()
    q = f'''
        SELECT
            md.isbn,
            md.douban_rating_score AS douban_rating,
            md.douban_url,
            mk.url AS weread_url,
            md.title,
            md.author,
            md.publisher,
            md.producer,
            md.subtitle,
            md.original_title,
            md.translator,
            md.published,
            md.pages,
            md.price,
            md.binding,
            md.series,
            md.description AS douban_intro,
            mk.description AS weread_intro,
            md.cover_url
        FROM metadata md
        LEFT JOIN market mk
            ON md.isbn = mk.isbn
            AND mk.vendor = 'weread'
            AND mk.display_isbn = '{isbn}'
            AND mk.description <> ''
        WHERE md.isbn = '{isbn}'
    '''
    # print(q)
    try:
        cur.execute(q)
        meta_tuple = namedtuple('MetaTuple', [desc[0] for desc in cur.description]) # 获取字段名
        metadata = cur.fetchone()
        if metadata:
            metadata = meta_tuple(*metadata)._asdict() # 转换为字典
    except Exception as e:
        traceback.print_exc()
    finally:
        cur.close()
        db_pool.putconn(conn)
    return metadata


def metadata_beautify(metadata: dict) -> dict:
    '''
    元数据内容调整
    :param metadata: 元数据字典
    :return: 调整后的元数据字典
    '''

    # 调整字段名
    if 'douban_intro' not in metadata:
        metadata['douban_intro'] = metadata.get('description', '')
        metadata.pop('description', None)
    if 'douban_rating' not in metadata:
        metadata['douban_rating'] = metadata.get('douban_rating_score', 0.0)
        metadata.pop('douban_rating_score', None)
    if 'weread_url' not in metadata:
        metadata['weread_url'] = ''
    if 'weread_intro' not in metadata:
        metadata['weread_intro'] = ''
    metadata.pop('douban_rating_star', None)

    # 豆瓣评分转换成小数, 保留一位小数
    try:
        metadata['douban_rating'] = round(float(metadata['douban_rating']) * 1.0, 1)
    except Exception as e:
        metadata['douban_rating'] = 0.0
    # douban_intro 移除换行符
    metadata['douban_intro'] = metadata['douban_intro'].replace('\n', '')
    # 页数转换成整数
    try:
        metadata['pages'] = int(metadata['pages'])
    except Exception as e:
        metadata['pages'] = 0
    # 设置图片代理, 用于解决图片防盗链问题
    if metadata['cover_url']:
        cover_url_proxy_weserv = f'https://images.weserv.nl/?url={metadata["cover_url"]}'
        metadata['cover_url_proxy_weserv'] = cover_url_proxy_weserv
        cover_url_proxy_baidu = f'https://image.baidu.com/search/down?url={metadata["cover_url"]}'
        metadata['cover_url_proxy_baidu'] = cover_url_proxy_baidu
    else:
        metadata['cover_url_proxy_weserv'] = ''
        metadata['cover_url_proxy_baidu'] = ''
    return metadata


@app.route('/metadata', method='GET')
def metadata_main() -> str:
    '''
    获取元数据
    :return: json 字符串
    '''
    request_id = _REQUEST_IDS.get(threading.get_ident())
    result = {
        'data': {},
        'code': 200,
        'errmsg': '',
        'request_id': request_id,
        'credit': 0,
        'api_version': _API_VERSION
    }

    api_key = request.query.api_key or ''
    isbn = request.query.isbn or ''
    bearer_token = request.headers.get('Authorization', '').replace('Bearer ', '')
    api_key = api_key or bearer_token

    # 参数检查
    if not isbn:
        abort(400, 'ISBN is required.')
    if not api_key:
        abort(401, 'API key is required.')
    if not re.match(r'^eba-[0-9a-f]{32}$', api_key):
        abort(401, 'Invalid API key: Worng format.')

    # 验证 API key
    jwt_token = query_jwt_token(api_key)
    if not jwt_token:
        abort(401, 'Invalid API key: Record not found.')
    jwt_token_status = verify_jwt_token(jwt_token)
    if jwt_token_status == -1:
        abort(401, 'Expired API key.')
    elif jwt_token_status == -2:
        abort(401, 'Invalid API key: Signature verification failed.')

    # 检查可用额度
    credit = query_credit(api_key)
    if credit <= 0:
        abort(403, 'Exceed the quota.')
    result['credit'] = credit - 1

    metadata = query_metadata(isbn)

    essential_fields = ['title', 'author', 'publisher', 'douban_intro', 'cover_url', 'douban_rating', 'douban_url']
    if not metadata or any(not metadata.get(field) for field in essential_fields):
        metadata = c_douban_info(isbn)

    if not metadata:
        abort(404, 'Not found.')

    metadata = metadata_beautify(metadata)
    result['data'] = metadata
    resp = json.dumps(result)
    request.result = resp # 保存结果
    return resp


if __name__ == '__main__':
    run(app, server='paste', host='0.0.0.0', port=8088, debug=True, reloader=True)

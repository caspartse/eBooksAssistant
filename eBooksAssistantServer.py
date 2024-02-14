#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from crawler import c_dangdang, c_duokan, c_jd, c_weread, c_weread_vbookid, c_ximalaya, c_douban_info
from utilities import *

app = Bottle()


@app.hook('before_request')
def setup_request():
    request_id = uuid4().hex
    # 设置 response headers
    headers_to_set = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate, private, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Request-ID': request_id
    }
    for key, value in headers_to_set.items():
        response.set_header(key, value)


@app.route('/favicon.ico')
def favicon():
    return static_file('favicon.ico', root='static')


@app.route('/')
def home():
    response.status = 302
    response.set_header('Location', 'https://github.com/caspartse/eBooksAssistant?utm_source=api.youdianzishu.com&utm_medium=redirect')


@app.route('/v2/dangdang', method='GET')
def dangdang() -> str:
    '''
    当当云阅读
    :return: JSON 字符串
    '''
    vendor = 'dangdang'
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': vendor,
        'request_id': request_id
    }

    try:
        isbn = request.query.isbn.strip() if request.query.isbn else ''
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'No ISBN or title has been provided.'
            resp = json.dumps(result)
            return resp

        # 使用缓存或重新爬取
        cached_key = f'data_{vendor}_{isbn}'
        if cached_json := rd.get(cached_key):
            data = json.loads(cached_json)
        else:
            data = c_dangdang(
                {
                    'isbn': isbn,
                    'title': title,
                    'subtitle': subtitle,
                    'author': author,
                    'translator': translator,
                    'publisher': publisher
                }
            )

        if data:
            result['data'] = data
        else:
            result['errmsg'] = 'No results found.'
    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/v2/duokan', method='GET')
def duokan() -> str:
    '''
    多看阅读
    :return: JSON 字符串
    '''
    vendor = 'duokan'
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': vendor,
        'request_id': request_id
    }

    try:
        isbn = request.query.isbn.strip() if request.query.isbn else ''
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'No ISBN or title has been provided.'
            resp = json.dumps(result)
            return resp

        # 使用缓存或重新爬取
        cached_key = f'data_{vendor}_{isbn}'
        if cached_json := rd.get(cached_key):
            data = json.loads(cached_json)
        else:
            data = c_duokan(
                {
                    'isbn': isbn,
                    'title': title,
                    'subtitle': subtitle,
                    'author': author,
                    'translator': translator,
                    'publisher': publisher
                }
            )

        if data:
            result['data'] = data
        else:
            result['errmsg'] = 'No results found.'
    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/v2/jd', method='GET')
def jd() -> str:
    '''
    京东读书
    :return: JSON 字符串
    '''
    vendor = 'jd'
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': vendor,
        'request_id': request_id
    }

    try:
        isbn = request.query.isbn.strip() if request.query.isbn else ''
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'No ISBN or title has been provided.'
            resp = json.dumps(result)
            return resp

        # 使用缓存或重新爬取
        cached_key = f'data_{vendor}_{isbn}'
        if cached_json := rd.get(cached_key):
            data = json.loads(cached_json)
        else:
            data = c_jd(
                {
                    'isbn': isbn,
                    'title': title,
                    'subtitle': subtitle,
                    'author': author,
                    'translator': translator,
                    'publisher': publisher
                }
            )

        if data:
            result['data'] = data
        else:
            result['errmsg'] = 'No results found.'
    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/v2/weread', method='GET')
def weread() -> str:
    '''
    微信读书
    :return: JSON 字符串
    '''
    vendor = 'weread'
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': vendor,
        'request_id': request_id
    }

    try:
        isbn = request.query.isbn.strip() if request.query.isbn else ''
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'No ISBN or title has been provided.'
            resp = json.dumps(result)
            return resp

        data = {}
        cached_key = f'data_{vendor}_{isbn}'
        if cached_json := rd.get(cached_key):
            # 避免返回未上架/已下架的图书，所以需要再次查询
            if v := c_weread_vbookid(json.loads(cached_json)['vbookid']):
                data = v
        else:
            data = c_weread(
                {
                    'isbn': isbn,
                    'title': title,
                    'subtitle': subtitle,
                    'author': author,
                    'translator': translator,
                    'publisher': publisher
                }
            )

        if data:
            result['data'] = data
        else:
            result['errmsg'] = 'No results found.'
    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/v2/ximalaya', method='GET')
def ximalaya() -> str:
    '''
    喜马拉雅
    :return: JSON 字符串
    '''
    vendor = 'ximalaya'
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': vendor,
        'request_id': request_id
    }

    try:
        isbn = request.query.isbn.strip() if request.query.isbn else ''
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有标题或作者，返回错误
        if not all([author, title]):
            result['errmsg'] = 'No title or author has been provided.'
            resp = json.dumps(result)
            return resp

        cached_key = f'data_{vendor}_{isbn}'
        cached_data = None
        if cached_json := rd.get(cached_key):
            cached_data = json.loads(cached_json)
            update_time = arrow.get(cached_data['update_time'])
            # 更新时间超过 30 天，重新查询
            if (update_time.shift(days=30) < arrow.now()):
                cached_data = None

        if not cached_data:
            data = c_ximalaya(
                {
                    'isbn': isbn,
                    'title': title,
                    'subtitle': subtitle,
                    'author': author,
                    'translator': translator,
                    'publisher': publisher
                }
            )
        else:
            data = cached_data

        if data:
            result['data'] = data
        else:
            result['errmsg'] = 'No results found.'
    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/sync_metadata', method='POST')
@app.route('/v2/sync_metadata', method='POST')
def sync_metadata() -> str:
    '''
    接收来自客户端同步的图书元数据
    :return: JSON 字符串
    '''
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': 'sync_metadata',
        'request_id': request_id
    }

    metadata = request.json or {}
    if not metadata:
        resp = json.dumps(result)
        return resp

    try:
        metadata['douban_rating_score'] = metadata['rating_score']
        metadata['douban_url'] = metadata['url']
        metadata['douban_sid'] = re.search(r'/subject/(\d+)/', metadata['url']).group(1)
        save_metadata(metadata)
    except Exception as e:
        traceback.print_exc()

    resp = json.dumps(result)
    return resp


@app.route('/weread/douban_info', method='GET')
@app.route('/v2/weread/douban_info', method='GET')
def weread_douban_info() -> str:
    '''
    微信图书页面，查询豆瓣图书信息
    :return: JSON 字符串
    '''
    request_id = response.get_header('X-Request-ID', uuid4().hex)
    result = {
        'data': {},
        'errmsg': '',
        'path': 'weread/douban_info',
        'request_id': request_id
    }

    try:
        vbookid = request.query.vbookid

        # 没有 vbookid，返回错误
        if not vbookid:
            result['errmsg'] = 'No vbookid has been provided.'
            resp = json.dumps(result)
            return resp

        try:
            conn = db_pool.getconn()
            conn.autocommit = False
            cur = conn.cursor()
            q = f'''
                SELECT
                (CASE
                    WHEN douban_url = '' THEN 'https://book.douban.com/isbn/' || isbn || '/'
                    ELSE douban_url
                END) AS url,
                (CASE
                    WHEN douban_rating_score = '' THEN '0.0'
                    ELSE douban_rating_score
                END) AS score
                FROM metadata md
                WHERE EXISTS (
                    SELECT 1
                    FROM market mk
                    WHERE vendor = 'weread'
                    AND vbookid = '{vbookid}'
                    AND mk.isbn = md.isbn
                );
            '''
            cur.execute(q)
            row = cur.fetchone()
        except Exception as e:
            traceback.print_exc()
        finally:
            cur.close()
            db_pool.putconn(conn)

        if row:
            douban_url, douban_rating_score = row
            douban_rating_star = f'douban_rating_star_{round(float(douban_rating_score) + 0.0001)}'
            update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
            data = {
                'url': douban_url,
                'douban_rating_score': douban_rating_score,
                'douban_rating_star': douban_rating_star,
                'update_time': update_time
            }
            result['data'] = data
        else:
            # 先获得 isbn，再查询豆瓣图书信息
            if isbn := (c_weread_vbookid(vbookid).get('isbn', '')):
                metadata = c_douban_info(isbn)
                douban_url = metadata.get('douban_url', f'https://book.douban.com/isbn/{isbn}/')
                douban_rating_score = metadata.get('douban_rating_score', '0.0')
                douban_rating_star = metadata.get('douban_rating_star', 'douban_rating_star_0')
                update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
                data = {
                    'url': douban_url,
                    'douban_rating_score': douban_rating_score,
                    'douban_rating_star': douban_rating_star,
                    'update_time': update_time
                }
                result['data'] = data
            else:
                result['errmsg'] = 'No results found.'

    except Exception as e:
        traceback.print_exc()
        result['errmsg'] = 'Unknow error.'

    resp = json.dumps(result)
    return resp


if __name__ == '__main__':
    run(app, server='paste', host='0.0.0.0', port=8081, debug=True, reloader=True)

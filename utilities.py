#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from common import *


def gen_rqsession(referer_url: str = '', origin_url: str = '') -> requests.Session:
    '''
    生成新的 Requests 会话
    :param referer: 请求来源
    :param origin: 请求源
    :return: 会话对象
    '''
    if referer_url and (not origin_url):
        o = urlparse(referer_url)
        origin_url = o.scheme + "://" + o.netloc
    sess = requests.Session()
    sess.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': referer_url,
        'Origin': origin_url
    })
    return sess


def save_metadata(data: dict) -> None:
    '''
    将图书 metadata 保存到 Postgres 数据库
    :param data: 图书 metadata 字典
    :return: None
    '''
    try:
        conn = db_pool.getconn()
        conn.autocommit = False
        cur = conn.cursor()
        q = f'''
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'metadata'
            AND column_name NOT LIKE '\_%';
        '''
        cur.execute(q)
        rows = cur.fetchall()
        column_names = [x[0] for x in rows]
        obj = {k: v for k, v in data.items() if k in column_names}
        q = f'''
            INSERT INTO metadata ({','.join([f'"{k}"' for k in obj.keys()])})
            VALUES ({','.join(['%s'] * len(obj))})
            ON CONFLICT (isbn) DO UPDATE
            SET {','.join([f'"{k}"=EXCLUDED."{k}"' for k in obj.keys()])};
        '''
        cur.execute(q, tuple(obj.values()))
        conn.commit()
    except Exception as e:
        traceback.print_exc()
        conn.rollback()
    finally:
        cur.close()
        db_pool.putconn(conn)
    return None


def save_vendor_data(data: dict) -> None:
    '''
    将图书信息保存到 Redis 缓存、Postgres 数据库
    :param data: 图书信息字典
    :return: None
    '''
    # 保存到 Redis
    expire_config = {
        'dangdang': 86400 * 30,
        'duokan': 86400 * 30,
        'jd': 86400 * 60,
        'weread': 86400 * 360,
        'ximalaya': 86400 * 30,
    }
    rd = redis.Redis(connection_pool=rd_pool)
    cached_key = f'data_{data["vendor"]}_{data["isbn"]}'
    expire = expire_config[data['vendor']]
    rd.set(cached_key, json.dumps(data), ex=expire)

    # 保存到 Postgres
    try:
        conn = db_pool.getconn()
        conn.autocommit = False
        cur = conn.cursor()
        q = f'''
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'market'
            AND column_name NOT LIKE '\_%';
        '''
        cur.execute(q)
        rows = cur.fetchall()
        column_names = [x[0] for x in rows]
        obj = {k: v for k, v in data.items() if k in column_names}
        q = f'''
            INSERT INTO market ({','.join([f'"{k}"' for k in obj.keys()])})
            VALUES ({','.join(['%s'] * len(obj))})
            ON CONFLICT (isbn, vendor) DO UPDATE
            SET {','.join([f'"{k}"=EXCLUDED."{k}"' for k in obj.keys()])};
        '''
        cur.execute(q, tuple(obj.values()))
        conn.commit()
    except Exception as e:
        traceback.print_exc()
        conn.rollback()
    finally:
        cur.close()
        db_pool.putconn(conn)
    return None


if __name__ == '__main__':
    pass

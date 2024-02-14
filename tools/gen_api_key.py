#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import sys
from os.path import abspath, dirname, join

sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from common import *

JWT_SECRET_KEY = rd.get('JWT_SECRET_KEY')


def create_jwt_token(user_id: str, iat: datetime, exp: datetime, secret_key: str = JWT_SECRET_KEY) -> str:
    '''
    生成 JWT token
    :param user_id: 用户ID
    :param iat: token 签发时间
    :param exp: token 过期时间
    :param secret_key: JWT_SECRET_KEY
    :return: JWT token
    '''
    payload = {
        'user_id': user_id,
        'iat': iat,
        'exp': exp,
    }
    jwt_token = jwt.encode(payload, secret_key, algorithm='HS256')
    return jwt_token


def create_key(user_id: str, days: int, quota: int, secret_key: str = JWT_SECRET_KEY) -> str:
    '''
    生成 API Key
    :param user_id: 用户ID
    :param days: 有效期
    :param quota: 配额
    :param secret_key: JWT_SECRET_KEY
    :return: API Key
    '''
    iat = datetime.datetime.utcnow()
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=days)

    jwt_token = create_jwt_token(user_id, iat, exp, secret_key)
    api_key = 'eba-' + md5(jwt_token.encode()).hexdigest()

    conn = db_pool.getconn()
    conn.autocommit = False
    cur = conn.cursor()

    # 保存用户信息
    q = f'''
        INSERT INTO openapi_user (user_id, api_key, quota, credit, usage)
        VALUES ('{user_id}', '{api_key}', {quota}, {quota}, 0)
        ON CONFLICT (user_id) DO UPDATE
        SET api_key = EXCLUDED.api_key, quota = EXCLUDED.quota, credit = EXCLUDED.credit;
    '''
    cur.execute(q)
    conn.commit()
    # 保存 token 信息
    iat = iat + datetime.timedelta(hours=8) # UTC+8
    exp = exp + datetime.timedelta(hours=8) # UTC+8
    q = f'''
        INSERT INTO openapi_token (api_key, jwt_token, user_id, iat, exp)
        VALUES ('{api_key}', '{jwt_token}', '{user_id}', '{iat}', '{exp}')
        ON CONFLICT (api_key) DO NOTHING;
    '''
    cur.execute(q)
    conn.commit()
    # 失效其他 token
    q = f'''
        UPDATE openapi_token
        SET is_valid = FALSE
        WHERE user_id = '{user_id}' AND api_key != '{api_key}';
    '''
    cur.execute(q)
    conn.commit()

    cur.close()
    db_pool.putconn(conn)
    return api_key


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-u', type=str, required=True, help='user_id (required)') # 用户ID，必填
    parser.add_argument('-d', type=int, default=365, help='expired days (365 by default)') # 默认有效期为一年
    parser.add_argument('-q', type=int, default=1000, help='quota (1000 by default)') # 默认配额为 1000 (次/月)
    args = parser.parse_args()
    user_id = args.u
    days = args.d
    quota = args.q

    api_key = create_key(user_id, days, quota)

    # 输出结果
    result = f'user_id: {user_id}\napi_key: {api_key}'
    print(result)

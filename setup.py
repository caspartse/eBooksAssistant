#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from common import *

conn = db_pool.getconn()
conn.autocommit = False
cur = conn.cursor()


# 遍历 DDL 文件夹中的 sql 脚本创建数据表
print('初始化数据库...')
ddl_files = os.listdir('./DDL')
ddl_files.sort()
for file in ddl_files:
    if file.endswith('.sql'):
        with open(os.path.join('./DDL', file), 'r') as f:
            sql = f.read()
            cur.execute(sql)
            conn.commit()
        print(f'execute {file}')
print('done.')


# 创建 JWT_SECRET_KEY
print('\n' + '-' * 78 + '\n')
JWT_SECRET_KEY = base64.b64encode(os.urandom(32)).decode('utf-8')
rd.set('JWT_SECRET_KEY', JWT_SECRET_KEY)


# 生成 Open API Key
from tools.gen_api_key import create_key
api_key = create_key(user_id='test', days=3, quota=100, secret_key=JWT_SECRET_KEY)
rd.set('test_api_key', api_key)


# 保存相关信息到 installation_notes.txt 文件
info = f'''
JWT_SECRET_KEY : {JWT_SECRET_KEY} (请勿泄露)
请使用 tools/gen_api_key.py 生成新的 API Key。
'''
with open('API_KEY.txt', 'w') as f:
    f.write(info)
print(info + '\n信息已保存在 installation_notes.txt 文件中.')


# 修改 config 下的服务配置文件，并安装服务
print('\n' + '-' * 78 + '\n')
print('安装服务...')

# ebooks_assistant.service
with open('config/ebooks_assistant.service', 'r') as f:
    content = f.read()
    content = content.replace('/path/to/project', CURRENT_PATH)
    with open('/tmp/ebooks_assistant.service', 'w') as f:
        f.write(content)
cmd = '''
sudo cp /tmp/ebooks_assistant.service /usr/lib/systemd/system/ && \
sudo systemctl daemon-reload && \
sudo systemctl enable ebooks_assistant.service && \
sudo systemctl restart ebooks_assistant.service
'''
subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# ebooks_openapi.service
with open('config/ebooks_openapi.service', 'r') as f:
    content = f.read()
    content = content.replace('/path/to/project', CURRENT_PATH)
    with open('/tmp/ebooks_openapi.service', 'w') as f:
        f.write(content)
cmd = '''
sudo cp /tmp/ebooks_openapi.service /usr/lib/systemd/system/ && \
sudo systemctl daemon-reload && \
sudo systemctl enable ebooks_openapi.servic && \
sudo systemctl restart ebooks_openapi.service
'''
subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print('done.')


# 爬取测试数据
print('\n' + '-' * 78 + '\n')
print('爬取测试数据...')
test_book = {
    'isbn': '9787532172313',
    'title': '人类群星闪耀时',
    'subtitle': '十四篇历史特写',
    'author': '[奥]斯蒂芬·茨威格',
    'translator': '姜乙',
    'publisher': '上海文艺出版社',
}
from crawler import c_douban_info, c_weread
c_weread(test_book)
c_douban_info(test_book['isbn'])
print('done.')


# 测试 ebooks_assistant 服务
print('\n' + '-' * 78 + '\n')
print('测试 ebooks_assistant 服务...')
cmd = '''sudo systemctl restart ebooks_assistant.service'''
subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
sleep(3)
url = 'http://127.0.0.1:8081/v2/weread'
session = requests.Session()
response = session.get(url, params=test_book)
result = response.json()
print('\n')
print(result)


# 测试 ebooks_openapi 服务
print('\n' + '-' * 78 + '\n')
print('测试 ebooks_openapi 服务...')
cmd = '''sudo systemctl restart ebooks_openapi.service'''
subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
sleep(3)
url = 'http://127.0.0.1:8088/metadata'
headers = {'Authorization': f'Bearer {api_key}'}
params = {'isbn': test_book['isbn']}
session = requests.Session()
response = session.get(url, headers=headers, params=params)
result = response.json()
print('\n')
print(result)


# 释放资源
cur.close()
db_pool.putconn(conn)


print('\n' + '-' * 78 + '\n')
print('all done.')

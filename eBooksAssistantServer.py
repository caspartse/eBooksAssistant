#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import traceback
from utilities import *
from bottle import Bottle, request, response, run
from uuid import uuid4
import re
import simplejson as json
from thefuzz import fuzz
from random import choice
from headlessBrowser import headlessBrowser
import redis
import arrow
import math


app = Bottle()
rd_pool = redis.ConnectionPool(host='127.0.0.1', port=6379, decode_responses=True)
rd = redis.Redis(connection_pool=rd_pool)


@app.route('/amazon', method='GET')
def amazon():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    token = uuid4().hex
    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'amazon',
        'token': token,
        'ematch': True,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''
        translator = request.query.translator or ''
        publisher = request.query.publisher or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'isbn or title not given.'
            resp = json.dumps(result)
            return resp

        # 存储 token，用于后续接收客户端结果时校验身份
        rd.set(token, isbn, ex=60)

        # 查询已存在的结果
        cached_key = 'amazon_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)

                # 历史数据原因，这里做一下修正
                book['title'] = title
                bookUrl = book['url']
                bookUrl = bookUrl.replace(isbn, title)
                bookUrl = bookUrl.replace('&amp;', '&')
                if 'keywords' not in bookUrl:
                    bookUrl = f'{bookUrl}ref=sr_1_1?__mk_zh_CN=亚马逊网站&keywords={title}&s=digital-text&sr=1-1'
                book['url'] = bookUrl
                # update 修正后的结果
                rd.set(cached_key, json.dumps(book), ex=1209600)

                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        # 出于对抗反爬考虑：将请求解析部分变成一个独立服务（方便在多台服务器上部署）
        urls = [
            'http://127.0.0.1:8083/_amazon',
        ]
        params = {
            'isbn': isbn,
            'title': title,
            'subtitle': subtitle,
            'author': author,
            'translator': translator,
            'publisher': publisher
        }
        resp = requests.get(choice(urls), params=params, timeout=100)
        book = resp.json()

        if book:
            result['data'] = book
            # 保存结果到 Redis
            rd.set(cached_key, json.dumps(result['data']), ex=1209600)
        # 没有结果，返回错误
        else:
            result['errmsg'] = 'book not found.'
            resp = json.dumps(result)
            return resp

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp


# 接收来自客户端的抓取结果
@app.route('/amazon/push', method='POST')
def amazon_push():
    try:
        token = request.forms.get('token')
        isbn = request.forms.get('isbn')
        isbn = str(isbn).strip()
        title = request.forms.get('title')
        title = title.encode('ISO-8859-1').decode('utf-8', 'ignore')
        price = request.forms.get('price')
        price = str('{:.2f}'.format(float(price)))
        url = request.forms.get('url')
        url = re.search(r'(https:\/\/www\.amazon\.cn\/dp\/[0-9a-zA-Z]+\/)', url).group(1)
        url = f'{url}ref=sr_1_1?__mk_zh_CN=亚马逊网站&keywords={title}&s=digital-text&sr=1-1'
        ku = request.forms.get('ku')
        try:
            ku = json.loads(ku.lower())
        except:
            ku = False

        # 校验 token，以及所有参数
        if (rd.get(token) != isbn) or (not all([isbn, price, url])):
            return

        cached_key = 'amazon_' + isbn

        book = {
            'isbn': isbn,
            'title': title,
            'price': price,
            'url': url,
            'ku': ku,
            'vendor': 'amazon',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }
        rd.set(cached_key, json.dumps(book), ex=1209600)
        rd.delete(token)

    except:
        traceback.print_exc()

    return


# 接收来自客户端的反馈结果
@app.route('/amazon/feedback', method='POST')
def amazon_feedback():
    try:
        token = request.forms.get('token')
        isbn = request.forms.get('isbn')
        isbn = str(isbn).strip()
        price = request.forms.get('price')
        price = str('{:.2f}'.format(float(price)))
        ku = request.forms.get('ku')
        try:
            ku = json.loads(ku.lower())
        except:
            ku = False

        # 校验 token，以及所有参数
        if (rd.get(token) != isbn) or (not all([isbn, price])):
            return

        cached_key = 'amazon_' + isbn
        cached_data = rd.get(cached_key)
        book = json.loads(cached_data)
        book.update(
            {
                'price': price,
                'ku': ku,
                'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
            }
        )
        rd.set(cached_key, json.dumps(book), ex=1209600)
        rd.delete(token)

    except:
        traceback.print_exc()

    return


@app.route('/weread', method='GET')
def weread():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'weread',
        'token': '',
        'ematch': True,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()
        title = request.query.title or ''
        subtitle = request.query.subtitle or ''
        author = request.query.author or ''

        # 没有ISBN或标题，返回错误
        if not all([isbn, title]):
            result['errmsg'] = 'isbn or title not given.'
            resp = json.dumps(result)
            return resp

        # 查询已存在的结果
        cached_key = 'weread_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)
                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        sess = genNewSession()

        # 伪装成正常用户访问
        sess.get('https://weread.qq.com/')
        sess.headers.update({'Referer': 'https://weread.qq.com/'})

        bookList = []

        # 优先搜索 ISBN（但 ISBN 不是微信读书的图书必备项，往往没结果）
        url = f'https://weread.qq.com/web/search/global?keyword={isbn}'
        resp = sess.get(url, timeout=100)
        content = resp.json()
        totalCount_isbn = content.get('books') or []

        if totalCount_isbn:
            items = wereadResultHandle(content['books'][:5], isbn, title, author, 1)
            bookList.extend(items)
        # ISBN 没有搜索到，使用其他信息搜索
        else:
            result['ematch'] = False

            # 微信读书启用全文搜索，结果非常不精准，所以同时增加两类关键词的搜索

            # 用标题+副标题搜索
            if subtitle:
                keyword = f'{title}+{subtitle}'
                url = 'https://weread.qq.com/web/search/global'
                params = {'keyword': keyword}
                resp = sess.get(url, params=params, timeout=100)
                content = resp.json()
                totalCount_subtitle = content.get('books') or []
                if totalCount_subtitle:
                    items = wereadResultHandle(content['books'][:5], isbn, title, author, 2)
                    bookList.extend(items)

            # 用标题+作者搜索
            _author = '+'.join(genWordList(author))
            keyword = f'{title}+{_author}'
            url = 'https://weread.qq.com/web/search/global'
            params = {'keyword': keyword}
            resp = sess.get(url, params=params, timeout=100)
            content = resp.json()
            totalCount_author = content.get('books') or []
            if totalCount_author:
                items = wereadResultHandle(content['books'][:5], isbn, title, author, 3)
                bookList.extend(items)

        sess.close()

        # 没有搜索到结果，返回错误
        if not bookList:
            result['errmsg'] = 'book not found.'
            resp = json.dumps(result)
            return resp

        # 按分数排序
        bookList.sort(key=lambda a: a['score'], reverse=True)

        # print(bookList)

        _book = bookList[0]

        # 微信读书搜索结果没有直接返回 URL（URL 是通过解密得到的，暂时破解不了）
        # 这里使用 docker + selenium 模拟查询，根据上面步骤中得到的结果位置、标识符，以及查询类型，获取 URL
        bookUrl = headlessBrowser(_book)

        # 查找URL失败，返回错误
        if not bookUrl:
            result['errmsg'] = 'bookUrl failed.'
            resp = json.dumps(result)
            return resp

        book = {
            'isbn': isbn,
            'title': _book['title'],
            'author': _book['author'],
            'price': _book['price'],
            'url': 'https://weread.qq.com{}'.format(bookUrl),
            'vendor': 'weread',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }
        result['data'] = book

        # 保存结果到 Redis
        rd.set(cached_key, json.dumps(result['data']), ex=1209600)

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp


@app.route('/ximalaya', method='GET')
def ximalaya():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'ximalaya',
        'token': '',
        'ematch': False,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()
        title = request.query.title or ''
        author = request.query.author or ''

        # 没有标题或作者，返回错误
        if not all([title, author]):
            result['errmsg'] = 'title or author not given.'
            resp = json.dumps(result)
            return resp

        # 查询已存在的结果
        cached_key = 'ximalaya_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)
                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        sess = genNewSession()

        # 伪装成正常用户访问
        sess.get('https://www.ximalaya.com/')
        sess.headers.update({'Referer': 'https://www.ximalaya.com/'})

        url = 'https://www.ximalaya.com/revision/search/main'
        params = {
            'core': 'album',
            'kw': title,
            'page': '1',
            'spellchecker': 'true',
            'rows': '20',
            'condition': 'relation',
            'device': 'iPhone',
            'fq': '',
            'paidFilter': 'false'
        }
        resp = sess.get(url, params=params, timeout=100)
        sess.close()
        content = resp.json()
        total = int(content['data']['album']['total'])

        # 没有找到相关专辑，返回错误
        if total == 0:
            result['errmsg'] = 'album not found.'
            resp = json.dumps(result)
            return resp

        # 作者信息转换成关键词列表
        matchWords = genWordList(author)

        albumList = []

        docs = content['data']['album']['docs'][:10]
        for idx, doc in enumerate(docs):
            albumUrl = 'https://www.ximalaya.com{}'.format(doc['url'])
            albumTitle = doc['title']
            nickname = doc['nickname'] # 主播
            intro = doc['intro']
            playCount = doc['playCount'] + 1 # 播放量, 加1是为了避免播放量为0时导致 math.log10(playCount) 报错
            isPaid = doc['isPaid'] # 是否付费
            isFinished = doc['isFinished'] # 是否完本

            # 喜马拉雅有许多相关度很低的内容，所以需要做相似度计算
            titleRatio = fuzz.partial_ratio(title, albumTitle)

            # 统计作者信息关键词出现的次数
            authorMatchCount = 0
            for w in matchWords:
                authorMatchCount = authorMatchCount + len(re.findall(fr'{w}', intro))
            # 设计一个权重分数
            score = (titleRatio / 100) * 0.50 \
            + adjustNum((10 - idx), 10) * 0.15 \
            + adjustNum(math.log10(playCount), 5.00) * 0.15 \
            + adjustNum(authorMatchCount, 10) * 0.10 \
            + adjustNum(isFinished, 2) * 0.05 \
            + int(isPaid) * 0.05

            if score >= 0.75:
                album = {
                    'isbn': isbn,
                    'title': albumTitle,
                    'nickname': nickname,
                    'url': albumUrl,
                    'score': score,
                    'vendor': 'ximalaya',
                    'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
                }
                albumList.append(album)

        # 结果不匹配，返回错误
        if not albumList:
            result['errmsg'] = 'not match result.'
            resp = json.dumps(result)
            return resp

        # 按分数排序
        albumList.sort(key=lambda a: a['score'], reverse=True)
        # print(albumList)
        result['data'] = albumList[0]

        # 保存结果到 Redis
        rd.set(cached_key, json.dumps(result['data']), ex=1209600)

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp


# 多看阅读，只使用 ISBN 查询，返回精确的书籍信息
@app.route('/duokan', method='GET')
def duokan():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'duokan',
        'token': '',
        'ematch': True,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()

        # 没有ISBN，返回错误
        if not isbn:
            result['errmsg'] = 'isbn not given.'
            resp = json.dumps(result)
            return resp

        # 查询已存在的结果
        cached_key = 'duokan_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)
                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        sess = genNewSession()

        # 伪装成正常用户访问
        sess.get('https://www.duokan.com/pc/')
        sess.headers.update({'Referer': 'https://www.duokan.com/pc/'})

        # 查询书籍信息
        url = f'https://www.duokan.com/target/search/web?s={isbn}&p=1'
        resp = sess.get(url, timeout=100)
        sess.close()
        content = resp.json()
        books = content.get('books', [])

        # 没有结果，返回错误
        if not books:
            result['errmsg'] = 'book not found.'
            resp = json.dumps(result)
            return resp

        book = books[0]
        title = book['title']
        author = book['authors'].replace('\n', ' / ')
        price = book['price']
        price = str('{:.2f}'.format(float(price)))
        bookUrl = 'https://www.duokan.com/pc/detail/{}'.format(book['book_id'])

        book = {
            'isbn': isbn,
            'title': title,
            'author': author,
            'price': price,
            'url': bookUrl,
            'vendor': 'duokan',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }
        result['data'] = book
        # 保存结果到 Redis
        rd.set(cached_key, json.dumps(result['data']), ex=1209600)

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp

# 京东读书，只使用 ISBN 查询，返回精确的书籍信息
@app.route('/jd', method='GET')
def jd():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'jd',
        'token': '',
        'ematch': True,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()
        title = request.query.title or ''

        # 没有ISBN，返回错误
        if not isbn:
            result['errmsg'] = 'isbn not given.'
            resp = json.dumps(result)
            return resp

        # 查询已存在的结果
        cached_key = 'jd_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)
                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        sess = genNewSession()

        # 伪装成正常用户访问
        sess.get('https://s-e.jd.com/')
        sess.headers.update({'Referer': 'https://s-e.jd.com/'})

        # 查询书籍信息
        url = 'https://s-e.jd.com/Search'
        params = {
            'key': isbn,
            'enc': 'utf-8',
            'pvid': genPvid(),
        }
        resp = sess.get(url, params=params, timeout=100)
        content = resp.text
        pattern = r'<div class="p-price">\s*<strong id="(J_\d+)">'
        skuid = re.findall(pattern, content)

        # 没有结果，返回错误
        if not skuid:
            sess.close()
            result['errmsg'] = 'book not found.'
            resp = json.dumps(result)
            return resp

        # 获取价格
        skuid = skuid[0]
        url = f'https://p.3.cn/prices/mgets?skuids={skuid}&type=1'
        resp = sess.get(url, timeout=100)
        sess.close()
        content = resp.json()
        price = str('{:.2f}'.format(float(content[0]["p"])))
        bookUrl = 'https://e.jd.com/{}.html'.format(skuid.replace('J_', ''))

        book = {
            'isbn': isbn,
            'title': title,
            'price': price,
            'url': bookUrl,
            'vendor': 'jd',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }
        result['data'] = book
        # 保存结果到 Redis
        rd.set(cached_key, json.dumps(result['data']), ex=1209600)

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp


# 当当阅读，只使用 ISBN 查询，返回精确的书籍信息
@app.route('/dangdang', method='GET')
def dangdang():
    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    result = {
        'data': {},
        'errmsg': '',
        'vendor': 'dangdang',
        'token': '',
        'ematch': True,
        'ext': ''
    }

    try:
        isbn = request.query.isbn or ''
        isbn = str(isbn).strip()

        # 没有ISBN，返回错误
        if not isbn:
            result['errmsg'] = 'isbn not given.'
            resp = json.dumps(result)
            return resp

        # 查询已存在的结果
        cached_key = 'dangdang_' + isbn
        cached_data = rd.get(cached_key)
        if cached_data:
            try:
                book = json.loads(cached_data)
                result['data'] = book
                result['ext'] = 'r'
                resp = json.dumps(result)
                return resp
            except:
                pass

        sess = genNewSession()

        # 伪装成正常用户访问
        sess.get('http://e.dangdang.com/index_page.html')
        sess.headers.update({'Referer': 'http://e.dangdang.com/index_page.html'})

        # 查询书籍信息
        url = f'http://e.dangdang.com/media/api.go?action=searchMedia&keyword={isbn}'
        resp = sess.get(url, timeout=100)
        sess.close()
        content = resp.json()
        books = content['data'].get('searchMediaPaperList', [])

        # 没有结果，返回错误
        if not books:
            result['errmsg'] = 'book not found.'
            resp = json.dumps(result)
            return resp

        book = books[0]
        title = book['title']
        author = book['author']
        price = book['salePrice']
        price = str('{:.2f}'.format(float(price)))
        bookUrl = f"http://e.dangdang.com/products/{book['saleId']}.html"

        book = {
            'isbn': isbn,
            'title': title,
            'author': author,
            'price': price,
            'url': bookUrl,
            'vendor': 'dangdang',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }
        result['data'] = book
        # 保存结果到 Redis
        rd.set(cached_key, json.dumps(result['data']), ex=1209600)

    except:
        traceback.print_exc()
        result['errmsg'] = 'unknow error.'

    resp = json.dumps(result)
    return resp

if __name__ == '__main__':
    run(app, server='paste', host='127.0.0.1', port=8082, debug=True, reloader=True)

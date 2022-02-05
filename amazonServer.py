#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import traceback
from bottle import Bottle, request, response, run
import requests
import simplejson as json
import re
from time import sleep
import arrow


app = Bottle()


def hasResult(content):
    pattern = r'("totalResultCount"\:0|在Kindle商店中未找到|Kindle商店中没有)'
    innerText = re.sub(r'</?[^>]+>', '', content)
    isEmpty = re.search(pattern, innerText)
    return not isEmpty


def fetchContent(keyword):
    keyword = keyword.replace('|', ' ')
    sess = requests.Session()
    sess.trust_env = False
    sess.verify = False
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.amazon.cn/',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
    }
    sess.headers.update(headers)

    # 伪装成正常用户访问
    sess.get('https://www.amazon.cn/b?node=116087071')

    url = 'https://www.amazon.cn/s'
    params = {
        '__mk_zh_CN': '亚马逊网站',
        'i': 'digital-text',
        'k':  keyword,
        'ref': 'nb_sb_noss',
        'url': 'search-alias=digital-text',
        'field-keywords': keyword
    }
    resp = sess.get(url, params=params, timeout=200)
    content = resp.text
    return content


@app.route('/_amazon', method='GET')
def amazon():
    isbn = request.query.isbn or ''
    title = request.query.title or ''
    subtitle = request.query.subtitle or ''
    author = request.query.author or ''
    translator = request.query.translator or ''
    publisher = request.query.publisher or ''

    response.set_header('Content-Type', 'application/json; charset=UTF-8')
    response.add_header('Cache-Control', 'no-cache; must-revalidate')
    response.add_header('Expires', '-1')

    book = {}

    try:
        # 优先使用 ISBN 搜索
        content = fetchContent(isbn)
        result_isbn = hasResult(content)

        # ISBN 没有搜索到，使用其他信息搜索
        if not result_isbn:
            result_publisher, result_translator_author = None
            if publisher:
                # 书名+出版社，优先搜索同一出版社的其他版本
                keyword = f'{title} {subtitle} {publisher}'
                content = fetchContent(keyword)
                result_publisher = hasResult(content)

            # 书名+出版社，搜索不到，再搜索同一译者/作者的其他版本
            if not result_publisher:
                # 书名+译者/作者，外国作者缩写不规范，优先级低于译者
                if translator:
                    keyword = f'{title} {subtitle} {translator}'
                else:
                    keyword = f'{title} {subtitle} {author}'
                content = fetchContent(keyword)
                result_translator_author = hasResult(content)

            # 还是没有搜索结果，返回空值
            if not result_translator_author:
                resp = json.dumps(book)
                return resp

        pattern = r'href="(\S+keywords=[^"]+)"[^>]*>Kindle电子书</a>'
        bookUrl = re.findall(pattern, content)[0]
        bookUrl = 'https://www.amazon.cn{}'.format(bookUrl)
        # 为了改善交互体验：将书名带入搜索框（URL 中的 keywords/field-keywords），如果对结果不满意，可以直接点击按钮搜索，而不需要再次输入书名
        title = title
        bookUrl = bookUrl.replace(str(isbn), title)
        bookUrl = bookUrl.replace('&amp;', '&')

        try:
            pattern = r'class="a-offscreen"[^>]*>\s*[￥|¥]([0-9\.]+)\s*<\/span>'
            price = re.findall(pattern, content)[0]
        except:
            pattern = r'id="kindle-price"[^>]*>\s*[￥|¥]([0-9\.]+)\s*<\/span>'
            price = re.findall(pattern, content)[0]
        price = str('{:.2f}'.format(float(price)))

        pattern = r'(免费借阅)|(免费阅读此书)|(涵盖在您的会员资格中)|(或者[￥¥][0-9\.]+购买)'
        if re.search(pattern, content) and (price == '0.00'):
            isKindleUnlimited = True
            pattern = r'或者[￥¥]([0-9\.]+)购买'
            price = re.findall(pattern, content)[0]
            price = str('{:.2f}'.format(float(price)))
        else:
            isKindleUnlimited = False

        book = {
            'isbn': isbn,
            'title': title,
            'price': price,
            'url': bookUrl,
            'ku': isKindleUnlimited,
            'vendor': 'amazon',
            'update_time': arrow.now().format('YYYY-MM-DD HH:mm:ss')
        }

        resp = json.dumps(book)
        return resp

    except:
        traceback.print_exc()
        resp = json.dumps(book)
        return resp


if __name__ == '__main__':
    run(app, server='paste', host='127.0.0.1', port=8083, debug=True, reloader=True)

    # curl 'http://127.0.0.1:8083/_amazon?isbn=9787559610782&title=%E5%AD%98%E5%9C%A8%E4%B8%BB%E4%B9%89%E5%92%96%E5%95%A1%E9%A6%86'

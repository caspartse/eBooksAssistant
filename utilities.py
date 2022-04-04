#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import requests
import re
from thefuzz import fuzz
import js2py


def genNewSession():
    sess = requests.Session()
    sess.trust_env = False
    sess.verify = False
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
    }
    sess.headers.update(headers)
    return sess

def genWordList(string):
    wordList = re.sub(
        r'•|·|▪|\.|\-|\[|\]|\/|\||\(|\)|（|）|<|>|【|】|\?|？|〔|〕', '\t', string).split('\t')
    wordList = [w.strip() for w in wordList]
    return wordList

def adjustNum(numerator, denominator):
    result = numerator / denominator
    if result > 1.0:
        result = 1.0
    return result


def wereadResultHandle(books, isbn, title, author, queryKind):
    itemList = []
    for idx, b in enumerate(books):
        book = b['bookInfo']
        # 不知道为什么，有的书籍售价为负数，这里做一下处理
        if float(book['price']) < 0.00:
            continue

        # 微信读书启用全文（含书本内容）匹配，所以需要做标题相似度计算
        titleRatio = fuzz.partial_ratio(book['title'], title)
        if (titleRatio < 50):
            continue

        # 微信读书启用全文（含书本内容）匹配，所以需要做作者相似度计算
        author = ''.join(genWordList(author))
        authorRatio = fuzz.partial_ratio(book['author'], author)
        if authorRatio < 50:
            continue

        # 设计一个权重分数
        score = (titleRatio / 100) * 0.50 \
        + (authorRatio / 100) * 0.40 \
        + adjustNum((5 - idx), 5) * 0.05 \
        + (1 / queryKind) * 0.05

        item = {
            'bookId': str(book['bookId']),
            'bookCover': book['cover'][-9:], # 取封面图片的最后 9 个字符作为标记，后面会用到
            'isbn': isbn,
            'title': book['title'],
            'author': book['author'],
            'price': str('{:.2f}'.format(float(book['price']))),
            'idx': idx, # 取序号，后面会用到
            'queryKind': queryKind,
            'score': score
        }
        itemList.append(item)
    return itemList


def genPvid():
    js_fnc = '''
        function(){var a=(new Date).getTime();var b="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,function(b){var c=(a+16*Math.random())%16|0;return a=Math.floor(a/16),("x"==b?c:3&c|8).toString(16)});return b}
    '''
    pvid = js2py.eval_js(js_fnc)()
    return pvid


if __name__ == '__main__':
    pass

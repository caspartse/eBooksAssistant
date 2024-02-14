#!/usr/bin/env python3
# -*- coding:utf-8 -*-
from utilities import *
# from tools import chatgpt as gpt


def c_dangdang(metadata: dict) -> dict:
    '''
    通过当当的搜索引擎，搜索图书
    :param metadata: 图书元数据
    :return: 图书信息字典
    '''
    data = {}
    candidate_list = []
    keyword_list = [
        metadata['isbn'],
        metadata['title'],
        f"{metadata['title']} {metadata['subtitle']}",
        f"{metadata['title']} {metadata['author']}",
        f"{metadata['title']} {metadata['publisher']}"
    ]
    keyword_list = sorted(set([k.strip() for k in keyword_list]))
    display_isbn_dict = {}

    for keyword in keyword_list:
        try:
            referer_url = 'http://e.dangdang.com/index_page.html'
            with gen_rqsession(referer_url) as sess:
                url = f'http://e.dangdang.com/media/api.go?action=searchMedia&keyword={keyword}'
                resp = sess.get(url, timeout=(3, 5))
                content = resp.json()
                items = content['data'].get('searchMediaPaperList', None)

            for item in items[:5]:
                try:
                    display_title = item['title']
                    display_author = item['author']
                    display_isbn = item['isbn']
                    display_isbn_dict[display_isbn] = 1
                    promotion_price = item.get('promotionPrice', '9999.99')
                    sale_price = item['salePrice']
                    price = f'{min(float(promotion_price), float(sale_price)):.2f}'
                    vbookid = str(item['mediaId'])
                    book_url = f'http://e.dangdang.com/products/{vbookid}.html'
                    description = item['description'].replace('\n', '').strip()

                    item = {
                        'department': 'book',
                        'isbn': metadata['isbn'],
                        'display_isbn': display_isbn,
                        'display_title': display_title,
                        'display_author': display_author,
                        'price': price,
                        'url': book_url,
                        'vendor': 'dangdang',
                        'vbookid': vbookid,
                        'description': description
                    }
                    candidate_list.append(item)
                except Exception as e:
                    continue

            # 如果 ISBN 匹配成功了，就不用再继续搜索了
            if metadata['isbn'] in display_isbn_dict:
                break

        except Exception as e:
            traceback.print_exc()

    # 计算权重得分
    for item in candidate_list:
        isbn_ratio = fuzz.partial_ratio(metadata['isbn'], item['display_isbn'])
        title_ratio = fuzz.partial_ratio(f"{metadata['title']} {metadata['subtitle']}", item['display_title'])
        author_ratio = fuzz.partial_ratio(metadata['author'], item['display_author'])
        translator_ratio = fuzz.partial_ratio( metadata['translator'], item['display_author'])  # 当当没有独立的译者字段，但译者偶尔会出现在作者字段中
        if isbn_ratio == 100.0:
            item['weight'] = 100.0
        else:
            item['weight'] = title_ratio * 0.60 + author_ratio * 0.35 + translator_ratio * 0.05

    candidate_list.sort(key=lambda x: (-x['weight'], x['price']))
    if candidate_list:
        candidate = candidate_list[0]
        if candidate['weight'] >= 65.0:
            isbn = metadata['isbn']
            department = 'book'
            vendor = 'dangdang'
            update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
            keys_to_copy = ['display_isbn', 'display_title', 'display_author', 'price', 'url', 'vbookid', 'description', 'weight']
            data = {key: candidate[key] for key in keys_to_copy}
            data.update({
                'department': department,
                'isbn': isbn,
                'vendor': vendor,
                'update_time': update_time
            })

    # 保存结果到数据库
    if data:
        save_vendor_data(data)

    return data


def c_duokan(metadata: dict) -> dict:
    '''
    通过多看的搜索引擎，搜索图书
    :param metadata: 图书元数据
    :return: 图书信息字典
    '''
    data = {}
    candidate_list = []
    keyword_list = [
        metadata['isbn'],
        metadata['title'],
        f"{metadata['title']} {metadata['subtitle']}",
        f"{metadata['title']} {metadata['author']}",
        f"{metadata['title']} {metadata['publisher']}"
    ]
    keyword_list = sorted(set([k.strip() for k in keyword_list]))

    for keyword in keyword_list:
        try:
            referer_url = 'https://www.duokan.com/pc/'
            with gen_rqsession(referer_url) as sess:
                url = f'https://www.duokan.com/target/search/web?s={keyword}&p=1'
                resp = sess.get(url, timeout=(3, 5))
                content = resp.json()
                items = content.get('books', None)

            for item in items[:1]:
                try:
                    display_title = item['title']
                    display_author = item['authors'].replace('\n', ', ')
                    promotion_price = item.get('new_price', '9999.99')
                    sale_price = item['price']
                    price = f'{min(float(promotion_price), float(sale_price)):.2f}'
                    vbookid = item['book_id']
                    book_url = f'https://www.duokan.com/pc/detail/{vbookid}'

                    item = {
                        'department': 'book',
                        'isbn': metadata['isbn'],
                        'display_title': display_title,
                        'display_author': display_author,
                        'price': price,
                        'url': book_url,
                        'vendor': 'duokan',
                        'vbookid': str(vbookid)
                    }
                    candidate_list.append(item)
                except Exception as e:
                    continue

        except Exception as e:
            traceback.print_exc()

    # 计算权重得分
    for item in candidate_list:
        title_ratio = fuzz.partial_ratio(f"{metadata['title']} {metadata['subtitle']}", item['display_title'])
        author_ratio = fuzz.partial_ratio(metadata['author'], item['display_author'])
        translator_ratio = fuzz.partial_ratio(metadata['translator'], item['display_title'])  # 多看没有独立的译者字段，但译者偶尔会出现在标题字段中
        item['weight'] = title_ratio * 0.60 + author_ratio * 0.35 + translator_ratio * 0.05

    candidate_list.sort(key=lambda x: (-x['weight'], x['price']))
    if candidate_list:
        candidate = candidate_list[0]
        if candidate['weight'] >= 65.0:
            isbn = metadata['isbn']
            department = 'book'
            vendor = 'duokan'
            update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
            keys_to_copy = ['display_title', 'display_author', 'price', 'url', 'vbookid', 'weight']
            data = {key: candidate[key] for key in keys_to_copy}
            data.update({
                'department': department,
                'isbn': isbn,
                'vendor': vendor,
                'update_time': update_time
            })

    # 保存结果到数据库
    if data:
        save_vendor_data(data)

    return data


def c_jd(metadata: dict) -> dict:
    '''
    通过京东的搜索引擎，搜索图书
    :param metadata: 图书元数据
    :return: 图书信息字典
    '''
    data = {}
    candidate_list = []
    keyword_list = [
        metadata['isbn'],
        metadata['title'],
        f"{metadata['title']} {metadata['subtitle']}",
        f"{metadata['title']} {metadata['author']}",
        f"{metadata['title']} {metadata['publisher']}"
    ]
    keyword_list = sorted(set([k.strip() for k in keyword_list]))

    for keyword in keyword_list:
        try:
            referer_url = 'https://search-e.jd.com/'
            with gen_rqsession(referer_url) as sess:
                reqtime = str(int(time() * 1000))
                sess.headers.update({
                    'reqtime': reqtime,
                    'x-referer-page': 'https://search-e.jd.com/searchList',
                    'x-rp-client': 'h5_1.0.0',
                })
                url = 'https://api.m.jd.com/api?functionId=jdread_api_search_v2'
                rq_boday = {
                    'client': 'mac',
                    'app': 'jdread-m',
                    'tm': reqtime,
                    'os': 'web',
                    'uuid': uuid4().hex,
                    'keyword': keyword,
                    'order_by': '',
                    'page': '1',
                    'page_size': '20',
                    'cv': '3.4.0'
                }
                payload = {
                    'appid': 'jdread-m',
                    't': int(time() * 1000),
                    'client': 'mac',
                    'clientVersion': '1.0.0',
                    'body': json.dumps(rq_boday),
                    'x-api-eid-token': '',
                    'h5st': '',
                }
                resp = sess.post(url, data=payload, timeout=(3, 5))
                content = resp.json()
                items = content.get('data', {}).get('product_search_infos', None)

            for item in items[:5]:
                try:
                    vbookid = item['product_id']
                    display_title = item['product_name']
                    display_author = item['author']
                    display_translator = item['translator']
                    promotion_price = item.get('promotion_price', '9999.99') / 100.0
                    sale_price = item['jd_price'] / 100.0
                    price = f'{min(float(promotion_price), float(sale_price)):.2f}'
                    book_url = f'https://e.jd.com/{vbookid}.html'
                    description = item['content_info'].replace('\n', '').strip()

                    item = {
                        'display_title': display_title,
                        'display_author': display_author,
                        'display_translator': display_translator,
                        'price': price,
                        'url': book_url,
                        'vbookid': str(vbookid),
                        'description': description
                    }
                    candidate_list.append(item)
                except Exception as e:
                    continue

        except Exception as e:
            traceback.print_exc()

    # 计算权重得分
    for item in candidate_list:
        title_ratio = fuzz.partial_ratio(f"{metadata['title']} {metadata['subtitle']}", item['display_title'])
        author_ratio = fuzz.partial_ratio(metadata['author'], item['display_author'])

        if all([metadata['translator'], display_translator]):
            translator_ratio = fuzz.partial_ratio(metadata['translator'], item['display_translator'])
            item['weight'] = title_ratio * 0.60 + author_ratio * 0.30 + translator_ratio * 0.10
        else:
            item['weight'] = title_ratio * 0.60 + author_ratio * 0.40

    candidate_list.sort(key=lambda x: (-x['weight'], x['price']))
    if candidate_list:
        candidate = candidate_list[0]
        if candidate['weight'] >= 65.0:
            isbn = metadata['isbn']
            department = 'book'
            vendor = 'jd'
            update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
            keys_to_copy = ['display_title', 'display_author', 'price', 'url', 'vbookid', 'description', 'weight']
            data = {key: candidate[key] for key in keys_to_copy}
            data.update({
                'department': department,
                'isbn': isbn,
                'vendor': vendor,
                'update_time': update_time
            })

    # 保存结果到数据库
    if data:
        save_vendor_data(data)

    return data


def c_weread(metadata: dict) -> dict:
    '''
    通过微信读书的搜索引擎，搜索图书
    :param metadata: 图书元数据
    :return: 图书信息字典
    '''
    data = {}
    candidate_list = []

    # Selenium 比较慢，所以这里先用 requests 判断一下 ISBN 是否有搜索结果
    try:
        referer_url = 'https://weread.qq.com/'
        with gen_rqsession(referer_url) as sess:
            url = f'https://weread.qq.com/web/search/global?keyword={metadata["isbn"]}'
            resp = sess.get(url, timeout=(3, 5))
            content = resp.json()
            have_isbn_result = bool(content.get('totalCount', None))
    except:
        have_isbn_result = False

    if have_isbn_result:
        # 直接用 ISBN 搜索
        with Driver(uc=True, incognito=True, headless=True, block_images=True) as driver:
            try:
                url = 'https://weread.qq.com/'
                driver.get(url)
                search_input = WebDriverWait(driver, 2.0).until(EC.presence_of_element_located((By.CLASS_NAME, 'navBar_home_inputText')))
                search_input.clear()
                search_input.send_keys(metadata['isbn'])
                search_input.send_keys(Keys.RETURN)
                WebDriverWait(driver, 1.0).until(EC.presence_of_element_located((By.CLASS_NAME, 'search_result_global_item')))

                search_result_list = driver.find_elements(By.CLASS_NAME, 'search_result_global_item')

                for item in search_result_list[:5]:
                    try:
                        display_title = item.find_element(By.CLASS_NAME, 'search_result_global_bookTitle').text
                        display_author = item.find_element(By.CLASS_NAME, 'search_result_global_bookAuthor').text
                        book_url = item.find_element(By.CLASS_NAME, 'search_result_global_bookLink').get_attribute('href')
                        vbookid = re.search(r'bookDetail/([0-9a-zA-Z]+)', book_url).group(1)

                        item = {
                            'display_title': display_title,
                            'display_author': display_author,
                            'url': book_url,
                            'vbookid': vbookid,
                            'kind_weight': 100
                        }
                        candidate_list.append(item)
                    except Exception as e:
                        continue

            except Exception as e:
                traceback.print_exc()
    else:
        # 用标题、副标题、作者、出版社搜索
        keyword_list = [
            metadata['title'],
            f"{metadata['title']} {metadata['subtitle']}",
            f"{metadata['title']} {metadata['author']}",
            f"{metadata['title']} {metadata['publisher']}"
        ]
        keyword_list = sorted(set([k.strip() for k in keyword_list]))

        with Driver(uc=True, incognito=True, headless=True, block_images=True) as driver:
            for keyword in keyword_list:
                try:
                    url = 'https://weread.qq.com/'
                    driver.get(url)
                    search_input = WebDriverWait(driver, 2.0).until(EC.presence_of_element_located((By.CLASS_NAME, 'navBar_home_inputText')))
                    search_input.clear()
                    search_input.send_keys(keyword)
                    search_input.send_keys(Keys.RETURN)
                    WebDriverWait(driver, 1.0).until(EC.presence_of_element_located((By.CLASS_NAME, 'search_result_global_item')))

                    search_result_list = driver.find_elements(By.CLASS_NAME, 'search_result_global_item')

                    for item in search_result_list[:5]:
                        try:
                            display_title = item.find_element(By.CLASS_NAME, 'search_result_global_bookTitle').text
                            display_author = item.find_element(By.CLASS_NAME, 'search_result_global_bookAuthor').text
                            book_url = item.find_element(By.CLASS_NAME, 'search_result_global_bookLink').get_attribute('href')
                            vbookid = re.search(r'bookDetail/([0-9a-zA-Z]+)', book_url).group(1)

                            item = {
                                'display_title': display_title,
                                'display_author': display_author,
                                'url': book_url,
                                'vbookid': vbookid,
                                'kind_weight': 80
                            }
                            candidate_list.append(item)
                        except Exception as e:
                            continue

                except Exception as e:
                    traceback.print_exc()
                finally:
                    driver.refresh()

    # 计算权重得分（微信读书启用全文匹配，搜索结果不精准）
    for item in candidate_list:
        title_ratio = fuzz.partial_ratio(f"{metadata['title']} {metadata['subtitle']}", item['display_title'])
        author_ratio = fuzz.partial_ratio(metadata['author'], item['display_author'])
        item['weight'] = title_ratio * 0.60 + author_ratio * 0.30 + item['kind_weight'] * 0.10

    candidate_list.sort(key=lambda x: x['weight'], reverse=True)

    # 调用 c_weread_vbookid， 进一步获取图书价格和实际的 ISBN
    for item in candidate_list:
        if item['weight'] < 65.0:
            continue

        if not (data := c_weread_vbookid(item['vbookid'])):
            continue

        data.update(
            {
                'isbn': metadata['isbn'],
                'weight': item['weight']
            }
        )

        # 匹配到第一个合适的结果即退出循环
        break

    # 保存结果到数据库
    if data:
        save_vendor_data(data)

    return data


def c_weread_vbookid(vbookid: str) -> dict:
    '''
    微信读书，通过给定的 vbookid 获取图书信息
    :param vbookid: 图书 vbookid
    :return: 图书信息字典
    '''
    data = {}
    try:
        referer_url = 'https://weread.qq.com/#search'
        with gen_rqsession(referer_url) as sess:
            url = f'https://weread.qq.com/web/bookDetail/{vbookid}'
            resp = sess.get(url, timeout=(3, 5))
            content = resp.text

        # 微信读书习惯将未取得版权的书籍也放在搜索结果中 🤪
        if ('开始阅读' not in content) or ('订阅上架通知' in content):
            return data

        matches = re.search(r'"isbn":"([^"]+)"', content)
        if matches:
            display_isbn = matches.group(1)
            display_isbn = display_isbn.replace('-', '')
            if not re.search(r'97[89]\d{10}', display_isbn):
                display_isbn = ''
        else:
            display_isbn = ''

        # 如果没有 ISBN 进一步在图书内搜索
        if not display_isbn:
            try:
                bookid = re.search(r'initialBookId=(\d+)', content).group(1)
                _url = 'https://weread.qq.com/web/book/search'
                params = {
                    'bookId': bookid,
                    'keyword': 'ISBN',
                    'maxIdx': '0',
                    'count': '10',
                    'fragmentSize': '150',
                    'onlyCount': '0'
                }
                _resp = sess.get(_url, params=params, timeout=(3, 5))
                _content = _resp.json()
                abstract = _content['result'][0]['abstract'].replace('-', '')
                matches = re.search(r'(97[89]\d{10})', abstract)
                display_isbn = matches.group(1) if matches.group(1) else ''
            except Exception as e:
                traceback.print_exc()

        matches = re.search(r'"title":"([^"]+)"', content)
        display_title = matches.group(1) if matches.group(1) else ''

        matches = re.search(r'"author":"([^"]+)"', content)
        display_author = matches.group(1) if matches.group(1) else ''

        matches = re.search(r'"centPrice":(\d+)', content)
        if matches:
            price = float(matches.group(1)) / 100.0
            price = 0.00 if price < 0.00 else price
            price = f'{price:.2f}'
        else:
            price = '0.00'

        matches = re.search(r'<meta property="og:description" content="([^"]+?)"', content)
        description = matches.group(1) if matches.group(1) else ''

        department = 'book'
        vendor = 'weread'
        update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
        data = {
            'department': department,
            'isbn': display_isbn,
            'display_isbn': display_isbn,
            'display_title': display_title,
            'display_author': display_author,
            'price': price,
            'url': url,
            'vendor': vendor,
            'vbookid': vbookid,
            'description': description,
            'update_time': update_time
        }

    except Exception as e:
        traceback.print_exc()

    # 保存结果到数据库 (如果有 ISBN)
    if data.get('isbn', None):
        save_vendor_data(data)

    return data


def c_ximalaya(metadata: dict) -> dict:
    '''
    通过喜马拉雅的搜索引擎，搜索声音专辑
    :param metadata: 专辑元数据
    :return: 专辑信息字典
    '''
    data = {}
    candidate_list = []
    keyword_list = [
        metadata['title'],
        f"{metadata['title']} {metadata['subtitle']}",
        f"{metadata['title']} {metadata['author']}",
    ]
    keyword_list = sorted(set([k.strip() for k in keyword_list]))

    for keyword in keyword_list:
        try:
            referer = 'https://www.ximalaya.com/'
            with gen_rqsession(referer) as sess:
                url = 'https://www.ximalaya.com/revision/search/main'
                params = {
                    'core': 'album',
                    'kw': keyword,
                    'page': '1',
                    'spellchecker': 'true',
                    'rows': '20',
                    'condition': 'relation',
                    'device': 'iPhone',
                    'fq': '',
                    'paidFilter': 'false'
                }
                resp = sess.get(url, params=params, timeout=(3, 5))
                content = resp.json()
                items = content['data']['album']['docs']

            for item in items[:5]:
                try:
                    display_title = item['title']
                    anchor = item['nickname']
                    vbookid = item['albumId']
                    book_url = f'https://www.ximalaya.com/album/{vbookid}'
                    custom_title = item.get('customTitle', '')
                    intro = item.get('intro', '')
                    play_count = item['playCount']
                    is_paid = bool(item['isPaid'])
                    is_finished = bool(item['isFinished'])

                    item = {
                        'display_title': display_title,
                        'anchor': anchor,
                        'vbookid': str(vbookid),
                        'book_url': book_url,
                        'custom_title': custom_title,
                        'intro': intro,
                        'play_count': play_count,
                        'is_paid': is_paid,
                        'is_finished': is_finished,
                        'detail_intro': ''
                    }
                    # 获得专辑详细介绍
                    try:
                        referer = 'https://www.ximalaya.com/'
                        with gen_rqsession(referer) as sess:
                            url = f'https://www.ximalaya.com/revision/album/v1/simple?albumId={vbookid}'
                            resp = sess.get(url, timeout=(3, 5))
                            content = resp.json()
                            detail_rich_intro = content.get('detailRichIntro', '')
                            detail_intro = re.sub(r'<[^>]+>', '', detail_rich_intro)
                            item['detail_intro'] = detail_intro
                    except Exception as e:
                        pass

                    candidate_list.append(item)
                except Exception as e:
                    continue

        except Exception as e:
            traceback.print_exc()

    # 移除 vbookid 相同的 item
    candidate_list = [dict(t) for t in set([tuple(d.items()) for d in candidate_list])]

    # 从数据库中获取图书简介
    try:
        metadata['description'] = ''
        conn = db_pool.getconn()
        conn.autocommit = False
        cur = conn.cursor()
        q = f'''
            SELECT description
            FROM (
                SELECT description
                FROM market
                WHERE isbn = '{metadata["isbn"]}' AND description <> '' AND vendor <> 'ximalaya'
                UNION ALL
                SELECT description
                FROM metadata
                WHERE isbn = '{metadata["isbn"]}' AND description <> ''
            ) t
            WHERE description IS NOT <> ''
            ORDER BY LENGTH(description) DESC
            LIMIT 1;
        '''
        cur.execute(q)
        row = cur.fetchone()
        metadata['description'] = row[0] if row[0] else ''
    except Exception as e:
        traceback.print_exc()
    finally:
        cur.close()
        db_pool.putconn(conn)

    # 计算权重得分（喜马拉雅有许多相关度很低的内容）
    for idx, item in enumerate(candidate_list):
        # # use ChatGPT to compare text.
        # relevance_score = gpt.compare_text(
        #     f'{metadata["title"] + metadata["subtitle"] + metadata["author"] + metadata["description"]}',
        #     f'{item["display_title"] + item["custom_title"] + item["intro"] + item["detail_intro"]}'
        # )
        relevance_score = 70.0
        item['relevance'] = relevance_score
        title_ratio = fuzz.partial_ratio(
            metadata['title'],
            f'{item["display_title"] + item["custom_title"] + item["intro"] + item["detail_intro"]}'
        )
        author_ratio = fuzz.partial_ratio(
            metadata['author'],
            f'{item["display_title"] + item["custom_title"] + item["intro"] + item["detail_intro"]}'
        )
        play_count_score = min((math.log10(item['play_count'] + 1) / 6.5) * 100, 100)
        idx_score = ((20 - idx) / 20) * 100
        is_finished_score = 100 if item['is_finished'] else 80
        is_paid_score = 100 if item['is_paid'] else 80 # 付费内容的质量相对更好
        item['weight'] = relevance_score * 0.30 + title_ratio * 0.30 + play_count_score * 0.30 + \
                         idx_score * 0.04 + author_ratio * 0.02 + is_finished_score * 0.02 + is_paid_score * 0.02
        debug_info = f'''
            No.{idx + 1}. {item['anchor']}, {item['display_title']}
            total_score: {item['weight']}
            \t relevance_score: {relevance_score}
            \t title_ratio: {title_ratio}
            \t play_count_score: {play_count_score}
            \t idx_score: {idx_score}
            \t author_ratio: {author_ratio}
            \t is_finished_score: {is_finished_score}
            \t is_paid_score: {is_paid_score}
        '''
        # print(debug_info)

    candidate_list.sort(key=lambda x: x['weight'], reverse=True)
    if candidate_list:
        if candidate_list[0]['weight'] >= 70.0:
            isbn = metadata['isbn']
            department = 'album'
            vendor = 'ximalaya'
            update_time = arrow.now().format('YYYY-MM-DD HH:mm:ss')
            data = {
                'department': department,
                'isbn': isbn,
                'display_title': candidate_list[0]['display_title'],
                'anchor': candidate_list[0]['anchor'],
                'url': candidate_list[0]['book_url'],
                'vendor': vendor,
                'vbookid': candidate_list[0]['vbookid'],
                'weight': candidate_list[0]['weight'],
                'relevance': candidate_list[0]['relevance'],
                'update_time': update_time
            }

    # 保存结果到数据库
    if data:
        save_vendor_data(data)

    return data


def c_douban_info(isbn: str) -> dict:
    '''
    从豆瓣获取图书评分
    :param isbn: ISBN 号
    :return: 图书评分字典
    '''
    data = {}
    try:
        referer_url = f'https://search.douban.com/book/subject_search?search_text={isbn}&cat=1001'
        with gen_rqsession(referer_url) as sess:
            url = f'https://book.douban.com/j/subject_suggest?q={isbn}'
            resp = sess.get(url, timeout=(3, 5))
            content = resp.json()[0]
            # 标题 title
            title = content['title']
            # 作者 author
            author = content['author_name']
            # 豆瓣图书 ID douban_sid
            douban_sid = content['id']
            # 豆瓣图书 URL
            douban_url = content['url']
            # 封面图片 cover_url
            cover_url = content['pic'].replace('/s/', '/l/')

            resp = sess.get(douban_url, timeout=(3, 5))
            content = resp.text
            content = content.replace('&nbsp;', ' ')

            # 豆瓣评分-数值 douban_rating_score
            matches = re.search(r'<strong class="ll rating_num " property="v:average">([\s\S]+?)</strong>', content)
            douban_rating_score = matches.group(1).strip() if matches else '0.0'
            # 豆瓣评分-星星 douban_rating_star
            douban_rating_star = f'douban_rating_star_{round(float(douban_rating_score) + 0.0001)}'
            # 出版社 publisher
            matches = re.search(r'<span class="pl">\s*出版社:?</span>\s*:?\s*<a[^>]+>([\s\S]+?)</a>', content)
            publisher = matches.group(1).strip() if matches else ''
            if not publisher:
                matches = re.search(r'<span class="pl">\s*出版社:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
                publisher = matches.group(1).strip() if matches else ''
            # 出品方 producer
            matches = re.search(r'<span class="pl">\s*出品方:?</span>\s*:?\s*<a[^>]+>([\s\S]+?)</a>', content)
            producer = matches.group(1).strip() if matches else ''
            if not producer:
                matches = re.search( r'<span class="pl">\s*出品方:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
                producer = matches.group(1).strip() if matches else ''
            # 副标题 subtitle
            matches = re.search(r'<span class="pl">\s*副标题:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            subtitle = matches.group(1).strip() if matches else ''
            # 原作名 original_title
            matches = re.search(r'<span class="pl">\s*原作名:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            original_title = matches.group(1).strip() if matches else ''
            # 译者 translator
            matches = re.search(r'<span class="pl">\s*译者:?</span>\s*:?\s*<a[^>]+>([\s\S]+?)</a>', content)
            translator = matches.group(1).strip() if matches else ''
            if not translator:
                matches = re.search(r'<span class="pl">\s*译者:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
                translator = matches.group(1).strip() if matches else ''
            # 出版年 published
            matches = re.search(r'<span class="pl">\s*出版年:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            published = matches.group(1).strip() if matches else ''
            # 页数 pages
            matches = re.search(r'<span class="pl">\s*页数:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            pages = matches.group(1).strip() if matches else ''
            # 定价 price
            matches = re.search(r'<span class="pl">\s*定价:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            price = matches.group(1).strip() if matches else ''
            # 装帧 binding
            matches = re.search(r'<span class="pl">\s*装帧:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
            binding = matches.group(1).strip() if matches else ''
            # 丛书 series
            matches = re.search(r'<span class="pl">\s*丛书:?</span>\s*:?\s*<a[^>]+>([\s\S]+?)</a>', content)
            series = matches.group(1).strip() if matches else ''
            if not series:
                matches = re.search(r'<span class="pl">\s*丛书:?</span>\s*:?\s*([\s\S]+?)<br/?>', content)
                series = matches.group(1).strip() if matches else ''
            # 内容简介 description
            matches = re.search(r'<meta property="og:description" content="([\s\S]+?)" />', content)
            description = matches.group(1).strip() if matches else ''
            description = re.sub(r'<[^>]+>|\n', '', description)

            data = {
                'isbn': isbn,
                'douban_sid': douban_sid,
                'douban_rating_score': douban_rating_score,
                'douban_rating_star': douban_rating_star,
                'douban_url': douban_url,
                'title': title,
                'author': author,
                'producer': producer,
                'publisher': publisher,
                'subtitle': subtitle,
                'original_title': original_title,
                'translator': translator,
                'published': published,
                'pages': pages,
                'price': price,
                'binding': binding,
                'series': series,
                'description': description,
                'cover_url': cover_url
            }
    except Exception as e:
        traceback.print_exc()

    # 保存结果到数据库
    if data:
        save_metadata(data)

    return data


if __name__ == '__main__':
    test_books = [
        {
            'isbn': '9787559610782',
            'title': '存在主义咖啡馆',
            'subtitle': '自由、存在和杏子鸡尾酒',
            'author': '[英] 莎拉·贝克韦尔',
            'translator': '沈敏一',
            'publisher': '北京联合出版公司',
        },
        {
            'isbn': '9787222065413',
            'title': '我的阿勒泰',
            'subtitle': '',
            'author': '李娟',
            'translator': '',
            'publisher': '云南人民出版社'
        },
        {
            'isbn': '9787513941242',
            'title': '金钱心理学',
            'subtitle': '财富、人性和幸福的永恒真相',
            'author': '[美] 摩根 · 豪泽尔 / Morgan Housel',
            'translator': '李青宗',
            'publisher': '民主与建设出版社'
        },
        {
            'isbn': '9787533971014',
            'title': '荒原狼',
            'subtitle': '',
            'author': '[德] 赫尔曼·黑塞',
            'translator': '姜乙',
            'publisher': '浙江文艺出版社'
        },
        {
            'isbn': '9787547059999',
            'title': '人类群星闪耀时',
            'subtitle': '点缀人类文明的14颗星辰',
            'author': '斯蒂芬·茨威格',
            'translator': '王秀莉',
            'publisher': '万卷出版有限责任公司'
        }
    ]

    # 豆瓣图书信息
    for metadata in test_books:
        print('test c_douban_info:', metadata['isbn'])
        print(c_douban_info(metadata['isbn']))
        print('\n')

    # 当当
    for metadata in test_books:
        print('test c_dangdang:', metadata['title'])
        print(c_dangdang(metadata))
        print('\n')

    # 多看
    for metadata in test_books:
        print('test c_duokan:', metadata['title'])
        print(c_duokan(metadata))
        print('\n')

    # 京东
    for metadata in test_books:
        print('test c_jd:', metadata['title'])
        print(c_jd(metadata))
        print('\n')

    # 喜马拉雅
    for metadata in test_books:
        print('test c_ximalaya:', metadata['title'])
        print(c_ximalaya(metadata))
        print('\n')

    # 微信读书
    for metadata in test_books:
        print('test c_weread:', metadata['title'])
        print(c_weread(metadata))
        print('\n')

#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import traceback
from utilities import *
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import TimeoutException
from random import choice
from time import sleep


# 可以在多台服务器上部署 docker + selenium
# https://github.com/SeleniumHQ/docker-selenium
executors = [
    'http://127.0.0.1:4444/wd/hub',
    # 'http://127.0.0.1:4445/wd/hub',
    # 'http://127.0.0.1:4446/wd/hub',
    # 'http://127.0.0.1:4447/wd/hub',
]


def hb_weread(book):
    bookUrl = ''
    executor = choice(executors)
    try:
        queryKind = book['queryKind']
        if queryKind == 1:
            keyword = book['isbn']
        elif queryKind == 2:
            keyword = f"{book['title']}+{book['subtitle']}"
        elif queryKind == 3:
            _author = '+'.join(genWordList(book['author']))
            keyword = f"{book['title']}+{_author}"
        elif queryKind == 4:
            keyword = f"{book['title']}"

        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--blink-settings=imagesEnabled=false')
        driver = webdriver.Remote(command_executor=executor, options=chrome_options)

        # for local debugging
        # from selenium.webdriver.chrome.service import Service
        # service = Service('/opt/drivers/chromedriver')
        # driver = webdriver.Chrome(service=service, options=chrome_options)

        driver.get('https://weread.qq.com/')

        searchBar = driver.find_elements(By.CLASS_NAME, 'navBar_home_inputText')[0]
        searchBar.clear()
        searchBar.send_keys(keyword.strip())
        searchBar.send_keys(Keys.RETURN)

        try:
            elementPresent = EC.presence_of_element_located((By.CLASS_NAME, 'search_result_global_item'))
            WebDriverWait(driver, 5).until(elementPresent)
        except TimeoutException:
            driver.quit()
            return ''

        targetItem = driver.find_elements(By.CLASS_NAME, 'search_result_global_item')[book['idx']]
        targetItemHTML = targetItem.get_attribute('innerHTML')

        if (book['bookId'] in targetItemHTML) or (book['bookCover'] in targetItemHTML):
            pattern = r'<a href="([^"]+)" class="search_result_global_bookLink">|<a class="search_result_global_bookLink" href="([^"]+)">'
            bookUrl = re.search(pattern, targetItemHTML).group(1)

        driver.quit()

    except:
        traceback.print_exc()
        pass

    try:
        driver.quit()
    except:
        pass

    return bookUrl


def hb_jd(keyword):
    bookUrl = ''
    executor = choice(executors)
    try:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--blink-settings=imagesEnabled=false')
        driver = webdriver.Remote(command_executor=executor, options=chrome_options)

        # for local debugging
        # from selenium.webdriver.chrome.service import Service
        # service = Service('/opt/drivers/chromedriver')
        # driver = webdriver.Chrome(service=service, options=chrome_options)

        driver.get(f'https://s-e.jd.com/searchList')

        searchInp = driver.find_elements(By.CLASS_NAME, 'serch-inp')[0]
        searchInp.clear()
        searchInp.send_keys(keyword.strip())
        searchInp.send_keys(Keys.RETURN)
        searchBtn = driver.find_elements(By.CLASS_NAME, 'search-btn')[0]
        searchBtn.click()

        try:
            elementPresent = EC.presence_of_element_located((By.CLASS_NAME, 'container-list'))
            WebDriverWait(driver, 5).until(elementPresent)
        except TimeoutException:
            driver.quit()
            return bookUrl

        bookTile = driver.find_elements(By.CLASS_NAME, 'infos-name')[0]
        bookTile.click()
        driver.switch_to.window(driver.window_handles[1])
        sleep(0.5)
        bookUrl = driver.current_url

        driver.quit()

    except:
        traceback.print_exc()
        pass

    try:
        driver.quit()
    except:
        pass

    return bookUrl


if __name__ == '__main__':
    isbn = '9787559610782'
    title = '存在主义咖啡馆'
    subtitle = '自由、存在和杏子鸡尾酒'
    author = '[英] 莎拉·贝克韦尔'

    # weread
    for queryKind in range(1, 5):
        book = {
            'isbn': isbn,
            'title': title,
            'subtitle': subtitle,
            'author': author,
            'idx': 0,
            'bookId': '932498',
            'bookCover': 's_932498.jpg',
            'queryKind': queryKind
        }
        bookUrl = hb_weread(book)
        print('https://weread.qq.com{}'.format(bookUrl))

    # jd
    bookUrl = hb_jd(isbn)
    print(bookUrl)

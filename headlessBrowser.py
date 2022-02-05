#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import traceback
from utilities import *
import re
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from random import choice


def headlessBrowser(book):
    bookUrl = ''
    # 可以在多台服务器上部署 docker + selenium
    # https://github.com/SeleniumHQ/docker-selenium
    executors = [
        'http://127.0.0.1:4444/wd/hub',
    ]
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

        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--blink-settings=imagesEnabled=false')
        driver = webdriver.Remote(command_executor=executor, options = chrome_options)
        driver.get('https://weread.qq.com/')

        searchBar = driver.find_elements(By.CLASS_NAME, 'navBar_home_inputText')[0]
        searchBar.clear()
        searchBar.send_keys(keyword.strip())
        searchBar.send_keys(Keys.RETURN)

        try:
            elementPresent = EC.presence_of_element_located((By.CLASS_NAME, 'search_result_global_item'))
            WebDriverWait(driver, 10).until(elementPresent)
        except TimeoutException:
            driver.quit()
            return ''

        targetItem = driver.find_elements(By.CLASS_NAME, 'search_result_global_item')[book['idx']]
        targetItemHTML = targetItem.get_attribute('innerHTML')

        if (book['bookId'] in targetItemHTML) or (book['bookCover'] in targetItemHTML):
            pattern = r'<a href="([^"]+)" class="search_result_global_bookLink">'
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


if __name__ == '__main__':
    isbn = '9787208130500'
    title = '斯通纳'
    subtitle = 'Stoner'
    author = '[美] 约翰·威廉斯'
    book = {
        'isbn': isbn,
        'title': title,
        'subtitle': subtitle,
        'author': author,
        'idx': 0,
        'bookId': '831600',
        'bookCover': 's_831600.jpg',
        'queryKind': 1
    }
    bookUrl = headlessBrowser(book)
    print('https://weread.qq.com{}'.format(bookUrl))

    isbn = ''
    title = '斯通纳'
    subtitle = 'Stoner'
    author = ''
    book = {
        'isbn': isbn,
        'title': title,
        'subtitle': subtitle,
        'author': author,
        'idx': 0,
        'bookId': '831600',
        'bookCover': 's_831600.jpg',
        'queryKind': 2
    }
    bookUrl = headlessBrowser(book)
    print('https://weread.qq.com{}'.format(bookUrl))


    isbn = ''
    title = '斯通纳'
    subtitle = ''
    author = '[美] 约翰·威廉斯'
    book = {
        'isbn': isbn,
        'title': title,
        'subtitle': subtitle,
        'author': author,
        'idx': 0,
        'bookId': '831600',
        'bookCover': 's_831600.jpg',
        'queryKind': 3
    }
    bookUrl = headlessBrowser(book)
    print('https://weread.qq.com{}'.format(bookUrl))

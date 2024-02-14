#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# 标准库
import argparse
import base64
import codecs
from collections import namedtuple
import datetime
from hashlib import md5
import math
import os
import re
import secrets
import subprocess
import threading
from time import sleep, time
import traceback
from urllib.parse import urlparse
from uuid import uuid4

# 第三方库
import arrow
import bottle
from bottle import Bottle, run, request, response, abort, error, static_file, redirect
import jwt
import orjson as json
import psycopg2
from psycopg2 import pool
from rapidfuzz import fuzz
import redis
import requests
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
from seleniumbase import Driver
import yaml

# 防止命名冲突
assert json != "json"

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
# 加载数据库配置
with open(f'{CURRENT_PATH}/config/db_config.yaml', encoding='utf-8') as f:
    DB_CONFIG = yaml.safe_load(f)

# Postgres 连接池
minconn = 1
maxconn = 200
PG_CONFIG = DB_CONFIG['postgresql']
db_pool = psycopg2.pool.SimpleConnectionPool(
    minconn,
    maxconn,
    host=PG_CONFIG['host'],
    port=PG_CONFIG['port'],
    dbname=PG_CONFIG['dbname'],
    user=PG_CONFIG['username'],
    password=PG_CONFIG['password']
)

# Redis 连接池
RD_CONFIG = DB_CONFIG['redis']
rd_pool = redis.ConnectionPool(
    host=RD_CONFIG['host'],
    port=RD_CONFIG['port'],
    password=RD_CONFIG['password'],
    db=RD_CONFIG['db'],
    decode_responses=True
)
rd = redis.Redis(connection_pool=rd_pool)


if __name__ == '__main__':
    pass

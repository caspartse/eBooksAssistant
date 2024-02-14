# ebooks_assistant_gunicorn.conf.py
bind = '0.0.0.0:8081'
workers = 8
threads = 8
# worker_class = 'gevent'
worker_connections = 1000
accesslog = "/var/log/ebooks_assistant.access.log"
errorlog = "/var/log/ebooks_assistant.error.log"
capture_output = True
loglevel = "info"

from html import unescape
from urllib.parse import unquote_to_bytes, unquote_plus


def pre_request(worker, req):
    # Decode query
    try:
        query = unquote_to_bytes(req.query).decode('gb2312')
    except UnicodeDecodeError as e:
        pass
        # print(f"Unicode decode error: {e}")
    else:
        req.query = query
    unquoted_query = unquote_plus(req.query or '')
    if 'title=&#' in unquoted_query:
        req.query = unescape(unquoted_query)

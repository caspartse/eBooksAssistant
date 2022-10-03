# ebooks_assistant_gunicorn.conf.py
# more info: https://docs.gunicorn.org/en/stable/settings.html#worker-processes
bind = "0.0.0.0:8081"
workers = 8
accesslog = "/var/log/ebooks_assistant.access.log"
errorlog = "/var/log/ebooks_assistant.error.log"
capture_output = True
loglevel = "info"


from urllib.parse import unquote_to_bytes, unquote_plus
from html import unescape

def pre_request(worker, req):

    # UTF-8编码的URL解码
    try:
        queryString = unquote_to_bytes(req.query).decode('gb2312')
        req.query = queryString
    except:
        pass

    # HTML实体解码
    try:
        if 'title=&#' in unquote_plus(req.query):
            queryString = unescape(unquote_plus(req.query))
            req.query = queryString
    except:
        pass

'''
# block bad ip with ufw
# sudo apt-get install ufw && sudo ufw default allow incoming && sudo ufw enable
# reference: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04
import subprocess
def post_request(worker, req, environ, resp):
    try:
        peer_addr = req.peer_addr[0]
        method = req.method
        if method not in ('GET', 'POST'):
            cmd = f'ufw reject from {peer_addr} to any'
            subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except:
        pass
'''

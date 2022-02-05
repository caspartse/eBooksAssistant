# ebooks_assistant_gunicorn.conf.py
# more info: https://docs.gunicorn.org/en/stable/settings.html#worker-processes
bind = "0.0.0.0:8081"
workers = 8
accesslog = "/var/log/ebooks_assistant.access.log"
errorlog = "/var/log/ebooks_assistant.error.log"
capture_output = True
loglevel = "info"

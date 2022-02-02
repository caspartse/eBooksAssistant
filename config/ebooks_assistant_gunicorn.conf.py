# ebooks_assistant_gunicorn.conf.py
bind = "0.0.0.0:8081"
workers = 8
accesslog = "/var/log/ebooks_assistant.access.log"
errorlog = "/var/log/ebooks_assistant.error.log"
capture_output = True
loglevel = "info"

from datetime import timedelta

BROKER_URL = "amqp://celery:celery@localhost:5672/celery"
# BROKER_HOST = "localhost"
# BROKER_PORT = 5672
# BROKER_USER = "celery"
# BROKER_PASSWORD = "celery"
# BROKER_VHOST = "celery"
# CELERY_RESULT_BACKEND = "amqp"
# CELERY_IMPORTS = ("tasks", )
CELERY_IMPORTS = ("processfiles", )

CELERYBEAT_SCHEDULE = {
    'processfiles-every-30-seconds': {
        'task': 'processfiles.startProcess',
        'schedule': timedelta(seconds=30),
        'args': ([1, "FEEDCONFIG"])
    },
}

CELERY_TIMEZONE = 'UTC'
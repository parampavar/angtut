from datetime import timedelta

BROKER_URL = "amqp://celery:celery@localhost:5672/celery"
CELERY_IMPORTS = ("processfiles", )

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_EVENT_SERIALIZER = 'json'

CELERYBEAT_SCHEDULE = {
    # 'processfiles-every-30-seconds': {
    #     'task': 'processfiles.startProcess',
    #     'schedule': timedelta(seconds=30),
    #     'args': ([1, "FEEDCONFIG"])
    # },
    'processfiles-every-30-seconds': {
        'task': 'processfiles.startErrorReportProcess',
        'schedule': timedelta(seconds=30),
        'args': ([1, "FEEDCONFIG"])
    },
}

CELERY_TIMEZONE = 'UTC'
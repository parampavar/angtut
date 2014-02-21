from celery import Celery

app = Celery('tasks', broker='amqp://celery:celery@localhost:5672/celery')

@app.task()
def add(x, y):
	print("Here")
	return x + y
FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN python -m venv venv

RUN ./venv/bin/pip install --upgrade pip
RUN ./venv/bin/pip install -r requirements.txt


EXPOSE 8000

CMD ["/app/venv/bin/python", "/app/app/main.py"]
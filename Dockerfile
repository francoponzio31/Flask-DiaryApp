FROM python:3.11

WORKDIR /usr/src/app

COPY ./ ./

RUN pip install -r requirements.txt

EXPOSE ${FLASK_APP_PORT}

CMD ["python", "main.py"]

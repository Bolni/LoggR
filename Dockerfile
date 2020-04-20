FROM python:3.6-jessie

EXPOSE 5000

ADD . /opt/loggR

COPY ./requirements.txt /opt/loggR/requirements.txt

WORKDIR /opt/loggR

RUN pip3 install -r requirements.txt

CMD ["python3", "server.py"]
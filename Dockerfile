# This dockerfile use to dockerize flask application
# VERSION 1
# MAINTAINER jprouty jeff.prouty@gmail.com

FROM python:3

ARG CONFIG=development
ENV FLASK_CONFIG ${CONFIG}

# RUN mkdir /flask
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install all source code in the WORKDIR
COPY . .

ENTRYPOINT ["gunicorn"]
CMD ["-w", "4", "-b", "0.0.0.0:8000","app:app"]
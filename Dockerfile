FROM python:3.8-slim

ENV PATH="/scripts:${PATH}"

COPY ./Requirments.txt /Requirments.txt
COPY ./environment /environment

RUN apt-get update \
&& apt-get install gcc python3-dev libpq-dev postgresql postgresql-contrib build-essential -y \
&& apt-get clean

# RUN apk add --update --no-cache --virtual .tmp gcc libc-dev linux-headers python3 py3-pip python3-dev linux-headers
RUN pip install --upgrade pip
RUN pip install -r /Requirments.txt
# RUN apk del .tmp
RUN mkdir /erpserver

COPY ./erpserver /erpserver

RUN find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

WORKDIR /erpserver

COPY ./scripts /scripts

RUN chmod +x /scripts/*
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser  user
RUN chown -R user:user /vol
RUN chown -R 777 /vol

USER root

CMD ["entrypoint.sh"]




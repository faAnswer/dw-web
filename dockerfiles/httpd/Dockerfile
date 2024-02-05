FROM httpd:2.4.57-alpine3.18

RUN apk update && apk add nano

RUN apk add -U tzdata

ENV TZ=Asia/Hong_Kong

RUN cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime

WORKDIR /app

COPY httpd.conf /usr/local/apache2/conf/httpd.conf

COPY httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

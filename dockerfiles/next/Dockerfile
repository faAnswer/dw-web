FROM node:18.16.0-alpine3.17

RUN apk update && apk add nano

WORKDIR /app

RUN npm install -D @swc/cli @swc/core

CMD ["tail", "-f", "/dev/null"]

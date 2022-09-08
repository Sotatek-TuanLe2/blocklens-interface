FROM node:14.20.0-alpine

RUN apk add make g++ git
WORKDIR /app
ENTRYPOINT ["tail", "-f", "/dev/null"]


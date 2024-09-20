FROM node:20-alpine

# RUN apk update && apk add bash

# SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /usr/src/test

COPY ./ ./

RUN npm install

CMD [ "/bin/sh" ]

EXPOSE 5000

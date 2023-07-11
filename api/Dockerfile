FROM node:18.16-alpine

ENV INSTALL_PATH /kanban_board

RUN mkdir ${INSTALL_PATH}

WORKDIR ${INSTALL_PATH}

COPY package.json .
COPY package-lock.json .


COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

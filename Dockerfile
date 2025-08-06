FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN yarn install

COPY . .

ARG APP_PORT

EXPOSE ${APP_PORT}

CMD ["yarn", "dev"]
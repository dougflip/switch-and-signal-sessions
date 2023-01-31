FROM node:18.13.0-buster

WORKDIR /app

COPY package-lock.json ./package-lock.json
COPY package.json ./package.json

RUN npm install

RUN chown -R 1000:1000 "/root/.npm"

CMD tail -f /dev/null
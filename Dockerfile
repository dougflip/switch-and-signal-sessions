FROM node:18.13.0-buster

WORKDIR /app

COPY package-lock.json ./package-lock.json
COPY package.json ./package.json

RUN npm install

# ensure acces to dirs that vite and vitest require
# this usually occurs as a result of mounting files into the container
RUN mkdir -p node_modules/.vitest && chmod -R 777 node_modules/.vitest
RUN mkdir -p node_modules/.vite && chmod -R 777 node_modules/.vite
RUN chown -R 1000:1000 "/root/.npm"

CMD tail -f /dev/null
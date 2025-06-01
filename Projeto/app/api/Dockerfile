FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads repository upload

EXPOSE 3333

CMD ["npm", "start"]
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install typescript -g
COPY . .
EXPOSE 8080
CMD ["node", "./dist/index.js"] 
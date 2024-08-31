FROM node:18-alpine
LABEL authors="aultrainstinct"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

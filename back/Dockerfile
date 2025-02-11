FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install typeorm

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

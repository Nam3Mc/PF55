FROM node

WORKDIR /back

COPY package*.json ./

RUN npm install typeorm

RUN npm install

COPY . .
COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "start"]

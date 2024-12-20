FROM node:20

WORKDIR /back

COPY package*.json ./

RUN npm install

RUN npm instal bcrypt

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

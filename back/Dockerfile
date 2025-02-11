FROM node

WORKDIR /back

COPY . /app/.

RUN npm install typeorm

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]

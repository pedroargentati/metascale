FROM node:20

WORKDIR /app/metascale/

COPY package.json .

RUN npm install --production

COPY .env .
COPY ./dist ./dist

EXPOSE 8080

CMD ["npm", "run", "start-prod"]
FROM node:20

ARG TOKEN

WORKDIR /app/metascale/

ENV CODEARTIFACT_AUTH_TOKEN=$TOKEN

COPY package.json .
COPY .npmrc .

RUN npm install --production

COPY .env .
COPY ./dist ./dist

EXPOSE 8080

CMD ["npm", "run", "start-prod"]
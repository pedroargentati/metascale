FROM public.ecr.aws/amazonlinux/amazonlinux:latest

RUN yum update -y && \
  rm -rf /var/cache/yum

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \ 
  && apt-get install -y nodejs

WORKDIR /app/metascale/

COPY package.json .

RUN npm install --production

COPY .env .
COPY ./dist ./dist

EXPOSE 8080

CMD ["npm", "run", "start-prod"]
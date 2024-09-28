@echo off
docker run --rm -d --name db -p 1111:3306 -e MYSQL_DATABASE=db -e MYSQL_USER=user -e MYSQL_PASSWORD=user -e MYSQL_ROOT_PASSWORD=root --network testeVivoNetwork vivo-mock-db

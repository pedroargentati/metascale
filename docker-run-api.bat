@echo off
docker run -d -p 8080:8080 -e INSTANCE_TYPE=API -e DEV_MODE=true --network testeVivoNetwork --name metascale metascale
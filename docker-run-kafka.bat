@echo off
docker run -d -p 8080:8080 -e INSTANCE_TYPE=KAFKA -e KAFKA_BROKERS=kafka:9094 -e DEV_MODE=true --network testeVivoNetwork --name metascale metascale
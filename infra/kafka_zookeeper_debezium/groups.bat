@echo off
docker run -it --rm --network testeVivoNetwork bitnami/kafka:latest kafka-consumer-groups.sh --list --bootstrap-server kafka:9094
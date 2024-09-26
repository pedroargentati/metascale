@echo off
docker run -it --rm --network testeVivoNetwork bitnami/kafka:latest kafka-topics.sh --list --bootstrap-server kafka:9094
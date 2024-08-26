@echo off
docker run -it --rm --network testeVivoNetwork bitnami/kafka:latest kafka-console-consumer.sh --bootstrap-server kafka:9094 --topic db1.VivoTest.Produtos --from-beginning
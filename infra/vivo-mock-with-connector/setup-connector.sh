#!/bin/bash

echo "Verificando versao"
curl -H "Accept: application/json" http://localhost:8083

echo "."

echo "Listando conectores"
curl -H "Accept:application/json" localhost:8083/connectors/

echo "."

echo "Criando conector"
curl -i -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d @mysql-connector.json localhost:8083/connectors/

echo "."

echo "Conector criado"
curl -i -X GET -H "Accept: application/json" localhost:8083/connectors/db1-connector

echo "."

echo "Listando conectores"
curl -H "Accept:application/json" localhost:8083/connectors/
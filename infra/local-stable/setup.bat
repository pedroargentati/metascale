@echo off

call ../create-network-test.bat

docker-compose up -d

call monitor-setup-connector.bat
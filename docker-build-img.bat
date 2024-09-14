@echo off
docker build --build-arg TOKEN=%CODEARTIFACT_AUTH_TOKEN% -t metascale .

docker image prune
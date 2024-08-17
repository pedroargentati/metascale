@echo off
for /F "tokens=*" %%g in ('aws codeartifact get-authorization-token --domain metascale --domain-owner 649601077399 --region us-east-2 --query authorizationToken --output text') do (
    set CODEARTIFACT_AUTH_TOKEN=%%g
)

aws codeartifact login --tool npm --repository metascale-dependency-repository --domain metascale --domain-owner 649601077399 --region us-east-2
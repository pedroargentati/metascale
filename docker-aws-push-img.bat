@echo off
docker tag metascale:prod 649601077399.dkr.ecr.us-east-2.amazonaws.com/metascale-repository
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 649601077399.dkr.ecr.us-east-2.amazonaws.com
docker push 649601077399.dkr.ecr.us-east-2.amazonaws.com/metascale-repository
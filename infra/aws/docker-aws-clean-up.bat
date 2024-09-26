@echo off
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 649601077399.dkr.ecr.us-east-2.amazonaws.com
aws ecr delete-repository --repository-name metascale-repository --region us-east-2 --force
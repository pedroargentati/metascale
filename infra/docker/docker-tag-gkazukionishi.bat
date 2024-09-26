@echo off

docker tag vivo-mock-db gkazukionishi/vivo-mock-db
docker push gkazukionishi/vivo-mock-db

docker tag metascale gkazukionishi/metascale
docker push gkazukionishi/metascale

docker tag metascale-api-mock-test gkazukionishi/metascale-api-mock-test
docker push gkazukionishi/metascale-api-mock-test

docker tag metascale-access gkazukionishi/metascale-access
docker push gkazukionishi/metascale-access
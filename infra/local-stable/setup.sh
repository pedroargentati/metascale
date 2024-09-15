#!/bin/bash

./../create-network-test.sh

docker-compose up -d

./monitor-setup-connector.sh
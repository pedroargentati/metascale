#!/bin/bash

container_name="local-stable-connect-1"
string_a_procurar="Finished starting connectors and tasks"

echo "Procurando a string \"$string_a_procurar\" no log do container $container_name."

while true; do
    resultado=$(docker logs "$container_name" | grep -i "$string_a_procurar")

    if [ -n "$resultado" ]; then
        echo "A string \"$string_a_procurar\" foi encontrada no log do container $container_name."

        ./setup-connector.sh

        break
    else
        echo "A string \"$string_a_procurar\" não foi encontrada no log do container $container_name."
    fi

    sleep 5
done

echo "Loop encerrado."
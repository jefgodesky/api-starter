#!/bin/bash
export COMPOSE_FILE=docker/dev/compose.yaml

docker compose down
if [ "$1" != "down" ]; then
  docker compose build api
  docker compose up -d
fi
#!/bin/bash
if [ "$1" = "down" ]; then
  docker compose -f test.yml down
else
  docker compose -f test.yml up --build -d
fi
#!/bin/bash
if [ "$1" = "down" ]; then
  docker compose -f dev.yml down
else
  docker compose -f dev.yml up -d
fi
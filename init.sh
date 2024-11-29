#!/bin/sh
set -e
for sql_file in /scripts/collections/**/init.sql; do
  echo "Running $sql_file"
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "$sql_file"
done

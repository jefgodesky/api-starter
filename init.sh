#!/bin/sh
for sql_file in /docker-entrypoint-initdb.d/collections/**/*.sql; do
  echo "Running $sql_file"
  psql -U "$POSTGRES_USER" -f "$sql_file"
done

#!/bin/sh
set -e
deno task migrate
exec "$@"
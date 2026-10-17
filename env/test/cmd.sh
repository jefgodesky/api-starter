#!/bin/bash

echo "🏁 Starting test environment..."
pnpm run build
docker compose -f env/test/compose.yaml up --build -d

echo ""
echo "🤖 Running tests..."
docker logs -f test 2>&1
TEST_EXIT_CODE=$(docker inspect test --format='{{.State.ExitCode}}')


echo ""
echo -e "🧹 Cleaning up..."
docker compose -f env/test/compose.yaml down

exit $TEST_EXIT_CODE

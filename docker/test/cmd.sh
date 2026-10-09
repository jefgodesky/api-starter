#!/bin/bash

echo "🏁 Starting test environment..."
docker compose -f docker/test/compose.yaml up --build -d

echo ""
echo "🤖 Running tests..."
docker logs -f test 2>&1
TEST_EXIT_CODE=$(docker inspect test --format='{{.State.ExitCode}}')


echo ""
echo -e "🧹 Cleaning up..."
docker compose -f docker/test/compose.yaml down

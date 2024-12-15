#!/bin/bash

echo "🏁 Starting test environment..."
docker compose -f test.yml up --build -d

echo ""
echo "🤖 Running tests..."
docker logs -f tests 2>&1 | tee test_output.log
TEST_EXIT_CODE=$(docker inspect tests --format='{{.State.ExitCode}}')


echo ""
echo -e "🧹 Cleaning up..."
docker compose -f test.yml down

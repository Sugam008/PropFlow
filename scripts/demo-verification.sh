#!/bin/bash

# PropFlow Demo Environment Verification Script
# This script checks all critical components to ensure a smooth demo.

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting PropFlow Demo Verification...${NC}\n"

# 1. Check Infrastructure (Docker)
echo -e "Checking Infrastructure..."
if docker ps > /dev/null 2>&1; then
    echo -e "  [${GREEN}PASS${NC}] Docker is running."
else
    echo -e "  [${RED}FAIL${NC}] Docker is not running. Please start Docker Desktop."
fi

# 2. Check Backend API
echo -e "\nChecking Backend API..."
HEALTH_URL="http://localhost:8000/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ "$RESPONSE" == "200" ]; then
    echo -e "  [${GREEN}PASS${NC}] Backend API is healthy (200 OK)."
elif [ "$RESPONSE" == "503" ]; then
    echo -e "  [${RED}FAIL${NC}] Backend API reporting service error (503). Check DB/Redis."
else
    echo -e "  [${RED}FAIL${NC}] Backend API unreachable (Status: $RESPONSE). Run 'docker-compose up'."
fi

# 3. Check Valuer Dashboard
echo -e "\nChecking Valuer Dashboard..."
DASHBOARD_URL="http://localhost:3000/api/health"
D_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $DASHBOARD_URL)

if [ "$D_RESPONSE" == "200" ]; then
    echo -e "  [${GREEN}PASS${NC}] Valuer Dashboard is healthy (200 OK)."
else
    echo -e "  [${RED}FAIL${NC}] Valuer Dashboard unreachable (Status: $D_RESPONSE)."
fi

# 4. Check Seed Data (Mock Check)
echo -e "\nChecking Demo Seed Data..."
# We check if the properties endpoint returns data (assuming local dev auth is bypassed or uses default)
PROP_COUNT=$(curl -s http://localhost:8000/api/v1/properties/ | grep -c "id")
if [ "$PROP_COUNT" -gt 0 ]; then
    echo -e "  [${GREEN}PASS${NC}] Found $PROP_COUNT pre-loaded properties for demo."
else
    echo -e "  [${BLUE}WARN${NC}] No properties found. Run 'pnpm run seed:demo' if needed."
fi

echo -e "\n${BLUE}Verification Complete.${NC}"

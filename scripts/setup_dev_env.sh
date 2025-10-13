#!/bin/bash

echo "NYCMG Development Environment Setup Checker"
echo "=========================================="
echo

node "$(dirname "$0")/setup_dev_env.js"

echo
echo "Press any key to exit..."
read -n 1 -s
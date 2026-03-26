#!/bin/bash
cd "$(dirname "$0")"

echo "==================================================="
echo "     Starting TradeLedger Pro India (Local)"
echo "==================================================="
echo ""

echo "Step 1: Checking if Node.js is installed..."
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js is not installed!"
    echo "Please download and install it from https://nodejs.org/"
    echo "Once installed, run this file again."
    exit
fi

echo ""
echo "Step 2: Installing required files (this takes a minute the first time)..."
npm install

echo ""
echo "Step 3: Starting the application..."
echo "(A browser window will open automatically)"
echo ""

sleep 3 && open "http://localhost:3000" &
npm run dev

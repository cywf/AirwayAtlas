#!/bin/bash

# Update package list
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify the installed versions
node -v
npm -v

# Navigate to the project directory
cd /path/to/your/project

# Install the required packages
npm init -y
npm install express stripe crypto

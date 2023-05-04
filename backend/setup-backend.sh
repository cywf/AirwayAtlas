#!/bin/bash

# Create directories
mkdir -p backend/{terraform,mysql,api} frontend/assets .github/workflows

# Initialize Terraform
cd backend/terraform
terraform init

# Apply Terraform configuration
terraform apply

# Initialize MySQL database
mysql -u <username> -p <password> < backend/mysql/schema.sql

# Install API dependencies
cd ../api
pip install -r requirements.txt

# Start API server
python app.py


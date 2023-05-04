#!/bin/bash

# Create directories
mkdir -p backend/{terraform,mysql,api} frontend/assets .github/workflows

# Create empty files
touch backend/terraform/{main.tf,variables.tf,outputs.tf}
touch backend/mysql/schema.sql
touch backend/api/{app.py,requirements.txt}
touch frontend/{index.html,styles.css,scripts.js}
touch .github/workflows/{security.yml,ci_cd.yml}
touch {master-list.md,investor_proposal.md,financial_breakdown.md,README.md}

echo "The AirwayAtlas project repository has been successfully provisioned."

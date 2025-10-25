# GitHub Pages Setup Instructions

To enable the automated demo deployment, the repository owner needs to configure GitHub Pages:

## Steps:

1. Go to your repository on GitHub
2. Click on **Settings** (top navigation)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. Save the settings

## Workflow Permissions:

1. In repository **Settings**, go to **Actions** → **General**
2. Scroll down to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click **Save**

## Triggering the First Deployment:

Once the settings are configured, the next push to the `main` branch will automatically:
1. Build the airport data
2. Package the frontend files
3. Deploy to GitHub Pages
4. Make the demo available at: `https://[username].github.io/AirwayAtlas/`

## Verifying Deployment:

1. Go to the **Actions** tab in your repository
2. Check that the "Deploy to GitHub Pages" workflow runs successfully
3. Once completed, visit `https://[username].github.io/AirwayAtlas/`

## Troubleshooting:

- If deployment fails, check the workflow logs in the Actions tab
- Ensure the `frontend/` directory contains all required files
- Verify that `npm ci` can install dependencies
- Check that `node scripts/parse-airports.js` runs successfully

## Local Testing:

Before deploying, you can test locally:

```bash
npm install
npm run build
npm run serve
```

Then visit `http://localhost:8080` in your browser.

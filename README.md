# ✈️ AirwayAtlas 🌎

Your go-to resource for airport city data in North America & the Caribbean! Featuring an interactive map 🗺️, powerful search 🔍, and an easy-to-integrate RESTful API 🚀.

[![Deploy to GitHub Pages](https://github.com/cywf/AirwayAtlas/actions/workflows/pages.yml/badge.svg)](https://github.com/cywf/AirwayAtlas/actions/workflows/pages.yml)

🌐 **[View Live Demo](https://cywf.github.io/AirwayAtlas/)** - Check out the interactive demo!

![alt text](frontend/assets/airwayatlas_img_3.png)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Release History](#release-history)
- [License](#license)

## Features

- 📊 **Comprehensive database** of 200+ airport cities in the USA, Canada, Mexico, and the Caribbean
- 🗺️ **Interactive map** for easy visualization of airport locations and control centers
- 🔍 **Powerful search** functionality - search by airport code, city, state, or region
- 🚀 **RESTful API** for seamless integration with third-party applications
- 📱 **Responsive design** - works great on mobile, tablet, and desktop
- ⚡ **Fast and lightweight** - static site with no backend dependencies for the demo

## Demo

Visit **[https://cywf.github.io/AirwayAtlas/](https://cywf.github.io/AirwayAtlas/)** to explore the full-featured website with:
- **Home** - Project overview and quick start guide
- **Map** - Live airport search with interactive Leaflet map
- **Statistics** - Real-time repository metrics and activity
- **Discussions** - Browse GitHub discussions
- **Dev Board** - Track project progress with Kanban board
- **Docs** - Complete documentation
- **Visualizer** - Project diagrams with Mermaid

The site is built with Astro + React + TailwindCSS + daisyUI and features 7 dark themes. All data is automatically deployed via GitHub Actions on every push to the main branch.

## Website Architecture

The AirwayAtlas website is a multi-page GitHub Pages site that showcases the project with enhanced functionality:

### Route Map

| Route | Description |
|-------|-------------|
| `/` | Project information, features, quick links, and dataset scope |
| `/map` | Interactive Leaflet map (embedded from `frontend/`) with airport search |
| `/statistics` | Repository stats (stars, forks, languages, commit activity) |
| `/discussions` | Latest GitHub discussions with search/filter |
| `/development-board` | Projects v2 Kanban board or issues grouped by labels |
| `/create-issue` | Quick shortcuts for creating bug reports, feature requests, and docs issues |
| `/docs` | Documentation hub with links to README, contributing guide, and more |
| `/visualizer` | Interactive Mermaid diagrams showing project architecture |

### Data Snapshot System

Repository data (statistics, discussions, project status) is fetched **server-side during CI/CD build time** and saved as static JSON snapshots in `site/public/data/`. This approach ensures:
- ✅ No GitHub API tokens exposed to the client
- ✅ Fast page loads (no client-side API calls)
- ✅ Works reliably on GitHub Pages
- ✅ All data is public information from this repository

**Privacy Note:** The site only displays public repository data. No personal tokens or private information are ever exposed.

### Map Integration

The existing Leaflet demo in `/frontend` is preserved and integrated into the site:
1. CI/CD parses airport data with `npm run parse`
2. Frontend files are copied to `site/public/app/`
3. The `/map` page embeds the app via iframe
4. Full search and marker functionality is maintained

### Theme System

Seven carefully crafted dark themes with localStorage persistence:
- **nightfall** (default) - Deep blue with indigo accents
- **dracula** - Classic dark theme
- **cyberpunk** - Neon pink and yellow
- **dark-neon** - Vibrant neon colors
- **hackerman** - Matrix-inspired green
- **gamecore** - Retro gaming aesthetic
- **neon-accent** - Purple and cyan neon

The theme switcher honors `prefers-color-scheme` on first load and persists user selection.

## Getting Started

### Quick Start (View Demo Locally)

1. Clone the repository:
```bash
git clone https://github.com/cywf/AirwayAtlas.git
cd AirwayAtlas
```

2. Install dependencies:
```bash
npm install
```

3. Build the airport data:
```bash
npm run build
```

4. Serve the frontend locally:
```bash
npm run serve
```

The demo will open in your browser at `http://localhost:8080`

### Development

```bash
# Parse airport data from master list
npm run parse

# Run tests
npm test

# Serve locally
npm run serve
```

## Development Setup

The project structure:

```
AirwayAtlas/
├── frontend/           # Static Leaflet demo
│   ├── index.html     # Main HTML page
│   ├── scripts.js     # JavaScript functionality
│   ├── styles.css     # CSS styling
│   ├── airports.json  # Generated airport data
│   └── assets/        # Images and media
├── site/              # Astro website (GitHub Pages)
│   ├── src/
│   │   ├── pages/     # Route pages (index, map, stats, etc.)
│   │   ├── components/ # React components (ThemeSwitcher, Charts, etc.)
│   │   ├── layouts/   # Shared layout templates
│   │   └── styles/    # Global CSS
│   ├── public/
│   │   ├── app/       # Copied from frontend/ during build
│   │   ├── data/      # JSON snapshots (stats, discussions, projects)
│   │   └── diagrams/  # Mermaid diagram files
│   └── scripts/       # Data fetching scripts for CI
├── docs/              # Documentation
│   └── master-airport-list.md  # Source airport data
├── scripts/           # Build scripts
│   ├── parse-airports.js  # Parse master list to JSON
│   └── test.js        # Test suite
├── backend/           # Backend infrastructure (optional)
│   ├── api/          # Flask API
│   ├── mysql/        # Database schema
│   └── terraform/    # Infrastructure as code
└── .github/
    └── workflows/
        ├── pages.yml  # Astro site deployment
        └── ci_cd.yml  # Legacy frontend deployment
```

## API Documentation

For detailed API documentation for the backend service, visit the [backend README](backend/api/README.md).

The frontend demo uses a static JSON file for airport data, making it fast and easy to deploy without backend dependencies.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Airports

To add new airports to the database:

1. Edit `docs/master-airport-list.md` following the existing format
2. Run `npm run parse` to regenerate the JSON data
3. Run `npm test` to verify the data is valid
4. Submit a pull request

## Release History

- `v1.1.0` - Added automated GitHub Pages deployment and functional demo
  - ✨ Interactive map with Leaflet.js
  - 🔍 Search functionality
  - 📱 Responsive design
  - 🚀 Automated CI/CD with GitHub Actions
- `v1.0.0` - AirwayAtlas v1.0.0 - Initial Release

## License

This project is licensed under the AGPL License - see the [LICENSE.md](LICENSE.md) file for details.

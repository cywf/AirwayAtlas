# ✈️ AirwayAtlas 🌎

Your go-to resource for airport city data in North America & the Caribbean! Featuring an interactive map 🗺️, powerful search 🔍, and an easy-to-integrate RESTful API 🚀.

[![Deploy to GitHub Pages](https://github.com/cywf/AirwayAtlas/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/cywf/AirwayAtlas/actions/workflows/ci_cd.yml)

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

Visit **[https://cywf.github.io/AirwayAtlas/](https://cywf.github.io/AirwayAtlas/)** to see the interactive demo with:
- Live airport search
- Interactive map with markers for major airports
- Detailed airport information cards
- Region-based filtering

The demo is automatically deployed via GitHub Actions on every push to the main branch.

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
├── frontend/           # Static website files
│   ├── index.html     # Main HTML page
│   ├── scripts.js     # JavaScript functionality
│   ├── styles.css     # CSS styling
│   ├── airports.json  # Generated airport data
│   └── assets/        # Images and media
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
        └── ci_cd.yml  # Automated deployment
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

# Contributing to AirwayAtlas

Thank you for your interest in contributing to AirwayAtlas! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check the [issue tracker](https://github.com/cywf/AirwayAtlas/issues) to see if it's already been reported
2. If not, create a new issue with:
   - A clear, descriptive title
   - Detailed description of the issue or suggestion
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Screenshots if applicable

### Adding New Airports

To add airports to the database:

1. Fork the repository
2. Edit `docs/master-airport-list.md`
3. Follow the existing format:
   ```
   - CODE - Airport Name, City, State/Province
   ```
   For example:
   ```
   - JFK - John F. Kennedy International Airport, New York City, New York
   ```
4. Add airports under the appropriate region and state sections
5. Run `npm run parse` to regenerate the JSON data
6. Run `npm test` to verify the data is valid
7. Submit a pull request

### Code Contributions

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Test your changes:
   ```bash
   npm run build
   npm test
   npm run serve  # Test locally
   ```
5. Commit with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Write clear, descriptive variable names
- Add comments for complex logic
- Follow existing patterns in the codebase
- Test your changes thoroughly

### Pull Request Guidelines

- Reference any related issues in the PR description
- Provide a clear description of what the PR does
- Include screenshots for UI changes
- Make sure all tests pass
- Keep PRs focused on a single feature or fix

### Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/AirwayAtlas.git
   cd AirwayAtlas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build and test:
   ```bash
   npm run build
   npm test
   ```

4. Run locally:
   ```bash
   npm run serve
   ```

### Project Structure

```
AirwayAtlas/
├── frontend/           # Static website files
│   ├── index.html     # Main page
│   ├── scripts.js     # JavaScript
│   ├── styles.css     # Styling
│   └── airports.json  # Generated data
├── docs/              # Documentation
│   └── master-airport-list.md  # Source data
├── scripts/           # Build scripts
│   ├── parse-airports.js
│   └── test.js
└── .github/workflows/ # CI/CD
```

### Testing

Run tests before submitting:

```bash
npm test
```

Tests verify:
- Airport data is valid JSON
- All required fields are present
- Airport codes are 3 characters
- All frontend files exist

### Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Check existing issues for answers
- Review the documentation in the `docs/` folder

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment
- Follow project guidelines

## License

By contributing to AirwayAtlas, you agree that your contributions will be licensed under the AGPL License.

Thank you for contributing! 🚀✈️

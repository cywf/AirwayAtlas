# Project Documentation

This project is a Node.js application that leverages the Stripe API to handle subscription payments and generate API keys for customers. The application is structured as follows:

## Directory Structure

src/
├─ controllers/
│ └─ subscriptionController.js
├─ database/
│ └─ dataModel.js
├─ middleware/
│ └─ rawBodyParser.js
├─ utils/
│ └─ apiKeyGenerator.js
├─ routes/
│ └─ apiRoutes.js
└─ app.js

## Files and Modules

### `src/controllers/subscriptionController.js`

This module contains the main controller functions for handling checkout sessions and Stripe webhooks. It exports two functions:

- `createCheckoutSession(req, res)`: Creates a new Stripe Checkout Session for subscribing to a plan and sends the session to the client.
- `handleWebhook(req, res)`: Handles incoming webhooks from Stripe for events such as `checkout.session.completed`, `invoice.paid`, and `invoice.payment_failed`.

### `src/database/dataModel.js`

This module serves as a placeholder for a real database, containing two objects that store customer and API key data:

- `customers`: A key-value store where the key is the Stripe customer ID and the value is an object containing customer data.
- `apiKeys`: A key-value store where the key is the hashed API key and the value is the corresponding Stripe customer ID.

### `src/middleware/rawBodyParser.js`

This module exports a single function, `rawBodyParser(req, res, buffer)`, which is used as middleware for Express to capture and store the raw request body in the `req['rawBody']` property. This is necessary for verifying the signature of incoming Stripe webhooks.

### `src/utils/apiKeyGenerator.js`

This module contains utility functions for generating and hashing API keys:

- `generateAPIKey()`: Generates a unique random string to be used as an API key.
- `hashAPIKey(apiKey)`: Hashes the input API key using the SHA-256 algorithm.

### `src/routes/apiRoutes.js`

This module sets up the Express routes for the API, including the following endpoints:

- `POST /api/checkout`: Calls the `createCheckoutSession` function from the `subscriptionController`.
- `POST /api/webhook`: Calls the `handleWebhook` function from the `subscriptionController`.

### `src/app.js`

This is the main entry point for the application. It sets up the Express application, configures the middleware, mounts the routes, and starts the server on port 8080.
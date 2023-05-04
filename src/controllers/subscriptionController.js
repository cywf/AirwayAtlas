const stripe = require('stripe')('sk_test_YOUR-KEY');
const { generateAPIKey, hashAPIKey } = require('../utils/apiKeyGenerator');
const { customers, apiKeys } = require('../database/dataModel');

async function createCheckoutSession(req, res) {
  //...
}

async function handleWebhook(req, res) {
  //...

  switch (eventType) {
    //...
  }

  res.sendStatus(200);
}

module.exports = {
  createCheckoutSession,
  handleWebhook,
};

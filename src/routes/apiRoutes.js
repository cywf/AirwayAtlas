const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/webhook', subscriptionController.handleWebhook);

module.exports = router;

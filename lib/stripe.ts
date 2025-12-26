export const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-01-27.acacia',
    typescript: true,
});

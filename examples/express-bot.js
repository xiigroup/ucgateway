const express = require('express');
const { WebhookValidator } = require('../src/node/WebhookValidator');

const app = express();

// IMPORTANT: Parse body as Raw Buffer/String to preserve exact HMAC byte input
app.use(express.raw({ type: 'application/json' }));

// Stateful Bot State Router
class BotStateRouter {
  static handle(incomingPayload) {
    const currentState = incomingPayload.state || 'START';
    const userMessage = (incomingPayload.message || '').trim().toLowerCase();
    const memory = incomingPayload.memory || {};

    switch (currentState) {
      case 'START':
        return {
          state: 'AWAITING_CHOICE',
          message: `Hello ${incomingPayload.name || 'there'}! Select an option:\n1. Claim Voucher\n2. Support`,
          memory: { ...memory, session_started: true },
          api: null,
          error: null
        };

      case 'AWAITING_CHOICE':
        if (userMessage === '1') {
          return {
            state: 'VOUCHER_CLAIMED',
            message: 'Your R200 voucher has been claimed!',
            memory: { ...memory, voucher: { amount: '200', status: 'claimed' } },
            api: null,
            error: null
          };
        }
        return {
          state: 'AWAITING_CHOICE',
          message: 'Invalid choice. Please reply with 1 or 2.',
          memory,
          api: null,
          error: null
        };

      default:
        return {
          state: 'START',
          message: 'Session reset. Type "Hi" to begin.',
          memory: {},
          api: null,
          error: null
        };
    }
  }
}

app.post('/webhook', (req, res) => {
  const secret = process.env.PORTAL_SHARED_SECRET || 'your_portal_shared_secret';
  const incomingSignature = req.headers['x-uc-signature'];
  const rawBody = req.body.toString('utf8');

  // 1. Verify HMAC SHA-256 Signature
  const isValid = WebhookValidator.validate(rawBody, incomingSignature, secret);
  if (!isValid) {
    return res.status(401).json({
      state: 'START',
      message: null,
      memory: [],
      api: null,
      error: 'Invalid Signature/Secret'
    });
  }

  // 2. Process payload and issue synchronous response
  const payload = JSON.parse(rawBody);
  const botResponse = BotStateRouter.handle(payload);

  return res.status(200).json(botResponse);
});

app.listen(3000, () => console.log('UC Gateway Server running on port 3000'));

/**
 * XII Group UC Gateway - Stateful Express Chatbot Example
 *
 * Repository: github.com/xiigroup/ucgateway
 * File Path:  /examples/express-chatbot.ts
 */

import express, { Request, Response } from 'express';
import { WebhookValidator } from '../src/node/WebhookValidator';

const app = express();

// IMPORTANT: Parse body as Raw Buffer/String to preserve exact HMAC byte input
app.use(express.raw({ type: 'application/json' }));

interface IncomingPayload {
  id?: string;
  sender?: string;
  from?: string;
  name?: string;
  type?: string;
  message?: string;
  state?: string;
  memory?: any[];
  files?: Array<Record<string, any>>;
}

interface BotResponse {
  state: string;
  message: string | null;
  memory: any[];
  read: boolean;
  error: string | null;
}

// Stateful Bot State Router
class BotStateRouter {
  static handle(incomingPayload: IncomingPayload): BotResponse {
    const currentState = incomingPayload.state || 'START';
    const userMessage = (incomingPayload.message || '').trim().toLowerCase();
    const memory = Array.isArray(incomingPayload.memory) ? incomingPayload.memory : [];

    switch (currentState) {
      case 'START':
        return {
          state: 'AWAITING_CHOICE',
          message: `Hello ${incomingPayload.name || 'there'}! Select an option:\n1. Claim Voucher\n2. Support`,
          memory: [...memory, 'session_started'],
          read: true,
          error: null,
        };

      case 'AWAITING_CHOICE':
        if (userMessage === '1') {
          return {
            state: 'VOUCHER_CLAIMED',
            message: 'Your R200 voucher has been claimed!',
            memory: [...memory, { voucher: { amount: '200', status: 'claimed' } }],
            read: true,
            error: null,
          };
        }

        if (userMessage === '2') {
          return {
            state: 'SUPPORT_CONNECTED',
            message: 'A support representative will be with you shortly.',
            memory: [...memory, 'requested_support'],
            read: true,
            error: null,
          };
        }

        return {
          state: 'AWAITING_CHOICE',
          message: 'Invalid choice. Please reply with 1 or 2.',
          memory,
          read: true,
          error: null,
        };

      default:
        return {
          state: 'START',
          message: 'Session reset. Type "Hi" to begin.',
          memory: [],
          read: true,
          error: null,
        };
    }
  }
}

app.post('/webhook', (req: Request, res: Response) => {
  const secret = process.env.PORTAL_SHARED_SECRET || 'your_portal_shared_secret';
  
  // Normalize header lookup for case-insensitivity across node environments
  const signatureKey = Object.keys(req.headers).find(
    (key) => key.toLowerCase() === 'x-uc-signature'
  );
  const incomingSignature = signatureKey ? (req.headers[signatureKey] as string) : undefined;
  
  const rawBody = req.body ? req.body.toString('utf8') : '';

  // 1. Verify HMAC SHA-256 Signature
  const isValid = WebhookValidator.validate(rawBody, incomingSignature, secret);
  if (!isValid) {
    return res.status(401).json({
      state: 'START',
      message: null,
      memory: [],
      read: false,
      error: 'Invalid Signature/Secret',
    });
  }

  // 2. Process payload and issue synchronous response
  try {
    const payload: IncomingPayload = JSON.parse(rawBody);
    const botResponse = BotStateRouter.handle(payload);
    return res.status(200).json(botResponse);
  } catch (error) {
    return res.status(400).json({
      state: 'START',
      message: null,
      memory: [],
      read: false,
      error: 'Invalid JSON Payload',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`UC Gateway Express Server running on port ${PORT}`));

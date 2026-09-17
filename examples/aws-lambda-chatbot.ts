/**
 * XII Group UC Gateway - Serverless AWS Lambda Chatbot Example
 *
 * Repository: github.com/xiigroup/ucgateway
 * File Path:  /examples/aws-lambda-chatbot.ts
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { WebhookValidator } from '../src/node/WebhookValidator';

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
export class BotStateRouter {
  static async handle(incomingPayload: IncomingPayload): Promise<BotResponse> {
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

export const handler = async (
  event: APIGatewayProxyEvent,
  _context?: Context
): Promise<APIGatewayProxyResult> => {
  const secret = process.env.PORTAL_SHARED_SECRET || 'your_portal_shared_secret';
  
  // Normalize HTTP headers for robust case-insensitive signature extraction
  const headers = event.headers || {};
  const signatureKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === 'x-uc-signature'
  );
  const signature = signatureKey ? headers[signatureKey] : undefined;

  // Decode Base64 body if API Gateway passes encoded binary
  const rawBody = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body || '';

  // 1. Verify HMAC SHA-256 Signature
  if (!WebhookValidator.validate(rawBody, signature, secret)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: 'START',
        message: null,
        memory: [],
        read: false,
        error: 'Invalid Webhook Signature',
      }),
    };
  }

  // 2. Process Payload and Issue Synchronous Response
  try {
    const payload: IncomingPayload = JSON.parse(rawBody);
    const botResponse = await BotStateRouter.handle(payload);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botResponse),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        state: 'START',
        message: null,
        memory: [],
        read: false,
        error: 'Invalid JSON Payload',
      }),
    };
  }
};

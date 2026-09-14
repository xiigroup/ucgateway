import crypto from 'crypto';
import { WebhookValidator } from '../../src/node/WebhookValidator';

describe('UC Gateway Webhook Signature Verification', () => {
  const secret = 'test_portal_shared_secret';
  const rawPayload = JSON.stringify({
    id: 'wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=',
    sender: '27128801496',
    from: '27716629021',
    name: 'Dev',
    type: 'text',
    message: 'hi',
    state: 'LOGIN_DECIDE',
    memory: { login: '', voucher: { amount: '200' } }
  });

  it('should return true for a valid signature', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    const result = WebhookValidator.validate(rawPayload, validSignature, secret);
    expect(result).toBe(true);
  });

  it('should return false if payload is tampered with', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    const tamperedPayload = rawPayload.replace('"message":"hi"', '"message":"tampered"');
    const result = WebhookValidator.validate(tamperedPayload, validSignature, secret);
    expect(result).toBe(false);
  });

  it('should return false if the shared secret does not match', () => {
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    const result = WebhookValidator.validate(rawPayload, validSignature, 'wrong_secret');
    expect(result).toBe(false);
  });

  it('should return false for missing inputs', () => {
    expect(WebhookValidator.validate('', 'sig', secret)).toBe(false);
  });
});

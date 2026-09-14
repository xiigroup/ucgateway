import crypto from 'crypto';

export class WebhookValidator {
  /**
   * Validates the incoming raw JSON webhook body against the X-Uc-Signature header.
   */
  static validate(rawPayload: string, signature: string, secret: string): boolean {
    if (!rawPayload || !signature || !secret) {
      return false;
    }

    const calculatedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawPayload)
      .digest('hex');

    const calculatedBuffer = Buffer.from(calculatedSignature, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (calculatedBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(calculatedBuffer, signatureBuffer);
  }
}

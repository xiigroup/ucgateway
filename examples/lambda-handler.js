const { WebhookValidator } = require('../dist/WebhookValidator');
const { BotStateRouter } = require('../dist/BotStateRouter');

exports.handler = async (event) => {
  const secret = process.env.PORTAL_SHARED_SECRET;
  const signature = event.headers['x-uc-signature'] || event.headers['X-Uc-Signature'];
  const rawBody = event.isBase64Encoded 
    ? Buffer.from(event.body, 'base64').toString('utf8') 
    : event.body;

  if (!WebhookValidator.validate(rawBody, signature, secret)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid Webhook Signature' })
    };
  }

  const payload = JSON.parse(rawBody);
  const response = await BotStateRouter.handle(payload);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response)
  };
};

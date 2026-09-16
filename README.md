<div align="center">

# 🚀 UC Gateway API

**Official Integration SDK & Technical Specification for XII Group UC Gateway**

*A unified, stateful HTTP interface for sending WhatsApp and SMS communications.*

[![API Version](https://img.shields.io/badge/API_Version-v1.0-blue.svg?style=for-the-badge)](https://uc-api.xiigroup.co.za/)
[![Transport](https://img.shields.io/badge/Transport-HTTPS_/_TLS_1.2+-green.svg?style=for-the-badge)](https://uc-api.xiigroup.co.za/)
[![Build Status](https://img.shields.io/badge/Status-Active-brightgreen.svg?style=for-the-badge)](#)
[![Publisher](https://img.shields.io/badge/Publisher-XII_Group-orange.svg?style=for-the-badge)](https://github.com/xiigroup)

[Key Features](#-key-features) • [Quick Start](#-quick-start) • [Message Payloads](#-whatsapp-message-payloads) • [SMS API](#-sms-api) • [Webhooks & Security](#-webhooks--signature-validation) • [Stateful Chatbots](#-stateful-chatbot-engine) • [Support](#-author--support)

</div>

---

## 📌 Overview

**UC Gateway** simplifies multi-channel messaging by exposing a single endpoint to handle **WhatsApp** and **SMS**. It features a built-in state engine for serverless, persistent chatbot integrations—eliminating the need for external caching layers like Redis for basic conversational flows.


```

              ┌─────────────────┐
              │   Your App /    │
              │ Serverless Bot  │
              └────────┬────────┘
                       │
         HTTPS POST    │    Incoming Webhook
      (Send Payload)   │    (With Raw HMAC)
                       ▼
              ┌─────────────────┐
              │   UC Gateway    │
              └────────┬────────┘
                       │
     ┌─────────────────┴─────────────────┐
     ▼                                   ▼

🟢 WhatsApp Cloud              📡 SMS Telco Network

```

---

## ✨ Key Features

- **Unified Messaging Interface:** Send text, templates, interactive lists, CTA links, quick reply buttons, media, and locations across WhatsApp & SMS.
- **Built-in Chatbot State & Memory:** Native `state` and `memory` objects returned inside webhooks to easily maintain user sessions.
- **Synchronous Webhook Replies:** Respond directly to an incoming webhook with a `200 OK` JSON payload to issue an instant messaging reply.
- **Granular Webhook Separation:** Independent endpoints for incoming messages vs. Delivery Receipts (DLR / Statuses).
- **HMAC SHA-256 Webhook Security:** Enterprise-grade signature verification over raw request payloads.

---

## ⚙️ Base Configuration

| Parameter | Value |
| :--- | :--- |
| **Base URL** | `https://uc-api.xiigroup.co.za/` |
| **Current API Version** | `v1.0` |
| **Authentication** | HTTP Basic Auth (`Authorization: Basic <Base64(username:password)>`) |
| **Data Format** | JSON (`Content-Type: application/json`) |

> ⚠️ **Note:** WhatsApp and SMS use **separate credentials** and **separate portal-configured Number IDs (`nid`)**.

---

## 🚀 Quick Start

### 📦 SDK Installation

#### PHP
Install via Composer:
```bash
composer require xiigroup/ucgateway

```

#### Node.js / TypeScript

Install via npm or yarn:

```bash
npm install @xiigroup/ucgateway
# or
yarn add @xiigroup/ucgateway

```

---

### 💻 SDK Initialization & Usage

#### PHP SDK

```php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use Xiigroup\UcGateway\UcGatewayClient;

// Initialize the SDK client
$client = new UcGatewayClient(
    username: 'YOUR_API_USERNAME',
    password: 'YOUR_API_PASSWORD'
);

// Plain Text (Optionally pass $msgId to send a direct reply)
$client->sendWhatsAppText(
    nid: 12345678,
    to: '27716629021',
    body: 'Hello from UC Gateway PHP SDK!',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA', //uncomment to send reply to previous message
);

// Template Message
$client->sendWhatsAppTemplate(
    nid: 12345678,
    to: '27716629021',
    name: 'welcome_template',
    language: 'en',
    header: [['text' => 'Welcome']],
    body: [['text' => 'John']]
);

// Quick Reply Buttons
$client->sendWhatsAppButtons(
    nid: 12345678,
    to: '27716629021',
    body: 'How can we assist you today?',
    buttons: ['Billing Inquiry', 'Technical Support'],
    header: 'Support Desk',
    footer: 'Automated Helpdesk',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA',
);

// Interactive List
$client->sendWhatsAppList(
    nid: 12345678,
    to: '27716629021',
    body: 'Please choose an option below:',
    listItems: [
        'Option 1 Description' => 'Option 1',
        'Option 2 Description' => 'Option 2'
    ],
    label: 'Select Option',
    header: 'Main Menu',
    footer: 'XII Group',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA',
);

// Media (image, video, audio, document)
$client->sendWhatsAppMedia(
    nid: 12345678,
    to: '27716629021',
    type: 'image',
    mediaUrl: 'https://domain.com/assets/banner.jpg',
    caption: 'Check out our latest release!',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA',
);

// Send Location
$client->sendWhatsAppLocation(
    nid: 12345678,
    to: '27716629021',
    longitude: '28.422152',
    latitude: '-25.723444',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA',
);

// Request Location
$client->requestWhatsAppLocation(
    nid: 12345678,
    to: '27716629021',
    body: 'Please share your location to proceed.',
//  msgId: 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJCM0I3QjFGRUNDRTVGMUREMjkA',
);
```

```
$smsClient = new Xiigroup\UcGateway\UcGatewayClient(
    username: 'YOUR_SMS_USERNAME',
    password: 'YOUR_SMS_PASSWORD'
);

$smsClient->sendSms(
    nid: 12345678,
    to: '27670826044',
    body: 'Your verification code is: 4829'
);
```

#### TypeScript / Node.js SDK

```typescript
import { UcGatewayClient } from '@xiigroup/ucgateway';

// Initialize the SDK client
const client = new UcGatewayClient({
  username: process.env.UC_API_USERNAME!,
  password: process.env.UC_API_PASSWORD!
});

async function sendWhatsAppExamples() {
  const nid = 12345678;
  const to = '27716629021';

  // Plain Text (Optionally pass msgId to reply directly)
  await client.sendWhatsAppText(nid, to, 'Hello from UC Gateway Node.js SDK!');

  // Template Message
  await client.sendWhatsAppTemplate(
    nid,
    to,
    'welcome_template',
    'en',
    [{ text: 'Welcome' }],
    [{ text: 'John' }]
  );

  // Quick Reply Buttons
  await client.sendWhatsAppButtons(
    nid,
    to,
    'How can we assist you today?',
    ['Billing Inquiry', 'Technical Support'],
    'Support Desk',
    'Automated Helpdesk'
  );

  // Interactive List
  await client.sendWhatsAppList(
    nid,
    to,
    'Please choose an option below:',
    {
      'Option 1 Description': 'Option 1',
      'Option 2 Description': 'Option 2'
    },
    { label: 'Select Option', header: 'Main Menu', footer: 'XII Group' }
  );

  // Call To Action (CTA) Link
  await client.sendWhatsAppCTA(
    nid,
    to,
    'https://xiigroup.co.za',
    'Click the link below to visit our website',
    { header: 'XII Group', footer: 'Official Portal' }
  );

  // Media (image, video, audio, document, sticker)
  await client.sendWhatsAppMedia(
    nid,
    to,
    'image',
    'https://domain.com/assets/banner.jpg',
    'Check out our latest release!'
  );

  // Send Location Coordinates
  await client.sendWhatsAppLocation(
    nid,
    to,
    -25.7479,
    28.2293,
    'XII Group HQ',
    'Pretoria, South Africa'
  );

  // Request Location
  await client.requestWhatsAppLocation(nid, to, 'Please share your location to proceed.');

  // Pinpad / Dialpad Interactive Interface
  await client.sendWhatsAppKeypad(nid, to, 'Enter your 4-digit PIN code:', 'pinpad');

  // Mark Received Message as Read
  await client.markAsRead(nid, 'wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJEOTAzMDUyNzZCNUVFNzg1RDkA');
}
```

```
const smsClient = new UcGatewayClient({
  username: process.env.UC_SMS_USERNAME!,
  password: process.env.UC_SMS_PASSWORD!
});

async function sendSmsExample() {
  await smsClient.sendSms(
    12345678,
    '27670826044',
    'Your verification code is: 4829'
  );
}
```

---

### 🌐 Direct HTTP / cURL Example

#### 1. Send WhatsApp Text Message (cURL)

```bash
curl -X POST "https://uc-api.xiigroup.co.za/" \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -H "HTTP_API_VERSION: v1.0" \
  -d '{
    "endpoint": "whatsapp",
    "action": "send",
    "type": "text",
    "nid": 12345678,
    "to": "27716629021",
    "body": "Hello from UC Gateway!"
  }'

```

#### 2. Send SMS Message (cURL)

```bash
curl -X POST "https://uc-api.xiigroup.co.za/" \
  -u "sms_username:sms_password" \
  -H "Content-Type: application/json" \
  -H "HTTP_API_VERSION: v1.0" \
  -d '{
    "endpoint": "sms",
    "action": "send",
    "nid": 12345678,
    "to": "27670826044",
    "body": "Your verification code is: 4829"
  }'

```

---

## 💬 WhatsApp Message Payloads

Below are the JSON payload structures for various WhatsApp message types supported by the gateway.

### 1. Template Message
Used to send pre-approved transactional or promotional WhatsApp templates containing header and body variable parameters.
```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "template",
  "nid": 12345678,
  "to": "27716629021",
  "name": "welcome_template",
  "language": "en",
  "header": [
    { "text": "Welcome" }
  ],
  "body": [
    { "text": "John" }
  ]
}

```

### 2. Interactive List Message

Displays a menu button (`label`) that opens a structured list of selectable options with titles and descriptions.

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "list",
  "nid": 12345678,
  "to": "27716629021",
  "label": "Select Option",
  "header": "Main Menu",
  "body": "Please choose an option below:",
  "footer": "XII Group",
  "list": {
    "Option 1 Description": "Option 1",
    "Option 2 Description": "Option 2"
  }
}

```

### 3. Quick Reply Buttons Message

Sends an interactive message with up to 3 quick reply action buttons for fast user responses.

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "buttons",
  "nid": 12345678,
  "to": "27716629021",
  "header": "Support Desk",
  "body": "How can we assist you today?",
  "footer": "Automated Helpdesk",
  "button": [
    "Billing Inquiry",
    "Technical Support"
  ]
}

```

### 4. Media Message (Image / Document / Audio / Video)

Sends hosted media files via a direct URL link with an optional caption text body.

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "image",
  "nid": 12345678,
  "to": "27716629021",
  "link": "https://domain.com/assets/banner.jpg",
  "body": "Check out our latest release!"
}

```

### 5. Direct Message Reply

Replies directly to a previously received incoming message by referencing its unique WhatsApp Message ID (`msg_id`).

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "text",
  "nid": 12345678,
  "to": "27716629021",
  "body": "This is a direct reply",
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJEOTAzMDUyNzZCNUVFNzg1RDkA"
}

```

## 📡 SMS API

### Outgoing SMS Payload

To send an SMS, set `"endpoint": "sms"` and supply the standard dispatch fields:

```json
{
  "endpoint": "sms",
  "action": "send",
  "nid": 12345678,
  "to": "27670826044",
  "body": "Your verification code is: 4829"
}

```

### Incoming SMS Webhook Payload

Incoming SMS messages are delivered to your portal-configured SMS webhook as `type="text"`:

```json
{
  "id": "b27e8723-b8bb-4604-0109-09140000a61d",
  "mo_msg_id": "18361924",
  "charset": "UTF-8",
  "type": "text",
  "sender": "27990794903081",
  "from": "27603166427",
  "name": "Guest",
  "message": "Hi",
  "state": 1,
  "memory": []
}

```

### SMS Delivery Receipt (DLR / Status Webhook)

Status updates regarding outbound SMS delivery are dispatched asynchronously to your SMS status webhook:

```json
{
  "id": "1789370565",
  "platform": "sms",
  "status": "delivered",
  "recipient_id": "27603166427",
  "timestamp": "1789372457"
}

```

---

## ⚖️ WhatsApp vs. SMS Feature Comparison

| Feature | WhatsApp | SMS |
| --- | --- | --- |
| **API Version** | `v1.0`<br> | `v1.0`<br> |
| **Endpoint Parameter** | `whatsapp`<br> | `sms`<br> |
| **Credentials** | WhatsApp API Credentials | SMS API Credentials |
| **Supported Message Types** | Text, Templates, Lists, CTA, Buttons, Media, Location, Keypad | Plain Text (`type="text"`) |
| **Supported DLR Statuses** | `sent`, `delivered`, `read`<br> | `sent`, `delivered`, `undelivered`, `queued`, `failed`<br> |
| **Webhooks** | Configured via WhatsApp Portal Settings | Configured via SMS Portal Settings |
| **Stateful Engine** | Native `state` & `memory`<br> | Native `state` & `memory`<br> |

---

## 🔒 Webhooks & Signature Validation

Incoming webhooks include the following authentication headers for verification:

| Header | Description |
| --- | --- |
| `X-Uc-Signature` | Calculated HMAC SHA-256 signature string |
| `X-Uc-Nonce` | 32-character random nonce string |
| `X-Uc-Timestamp` | Unix epoch timestamp of request execution |

### Signature Algorithm

The gateway signs the **entire raw JSON request body** using HMAC SHA-256 with your portal shared secret:
$$\text{Signature} = \text{HMAC-SHA256}(\text{SharedSecret}, \text{RawRequestBody})$$

### Implementation Examples

#### PHP Signature Validation

```php
<?php
// 1. Fetch raw request body & signature header
$rawPayload = file_get_contents('php://input');
$incomingSignature = $_SERVER['HTTP_X_UC_SIGNATURE'] ?? '';
$secret = 'YOUR_PORTAL_SHARED_SECRET';

// 2. Compute HMAC SHA-256 hash
$calculatedSignature = hash_hmac('sha256', $rawPayload,$secret);

// 3. Constant-time string comparison
if (hash_equals($calculatedSignature,$incomingSignature)) {
    http_response_code(200);
    echo json_encode(["status" => "validated"]);
} else {
    http_response_code(401);
    exit("Invalid Webhook Signature");
}

```

#### Node.js (Express) Signature Validation

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.raw({ type: 'application/json' })); // Capture raw body bytes

app.post('/webhook', (req, res) => {
  const secret = 'YOUR_PORTAL_SHARED_SECRET';
  const incomingSignature = req.headers['x-uc-signature'];
  const rawPayload = req.body.toString('utf8');

  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawPayload)
    .digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(incomingSignature))) {
    res.status(200).send({ status: 'validated' });
  } else {
    res.status(401).send('Invalid Signature');
  }
});

```

---

## 🤖 Stateful Chatbot Engine

UC Gateway automatically passes user conversational context inside incoming webhook payloads using the `state` and `memory` parameters.

### Incoming Webhook Structure

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Jane Doe",
  "type": "text",
  "message": "Start",
  "state": "MAIN_MENU",
  "memory": {
    "user_id": 482,
    "cart": []
  }
}

```

### Instant Synchronous Webhook Response

If your server acts as an automated bot, you can return a `200 OK` HTTP response containing updated state data. UC Gateway will automatically route the message reply back to the end-user:

```json
{
  "state": "AWAITING_SELECTION",
  "message": "Welcome back, Jane! Please select an option from the menu.",
  "memory": {
    "user_id": 482,
    "last_seen": "2026-09-14"
  },
  "api": null,
  "error": null
}

```

---

## 🚦 HTTP Status Code Reference

| Code | Status | Meaning |
| --- | --- | --- |
| **`200`** | OK | Request accepted and processed successfully. |
| **`400`** | Bad Request | Validation failure or missing mandatory parameters (`to`, `nid`, `endpoint`). |
| **`401`** | Unauthorized | Authentication header failure or invalid API credentials. |
| **`429`** | Rate Limited | API quota or rate limit thresholds exceeded. |
| **`500`** | Server Error | Gateway processing failure. Contact support. |

---

## 👤 Author & Support

* **Author:** Sipho Selabe

* **Email:** [sg.selabe@xiigroup.co.za](https://www.google.com/search?q=mailto%3Asg.selabe%40xiigroup.co.za)

* **Organization:** XII Group

* **GitHub Repository:** [xiigroup](https://github.com/xiigroup)

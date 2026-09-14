Here is a high-converting, professional **`README.md`** tailored specifically for the **UC Gateway WhatsApp & SMS API**.

It incorporates modern GitHub documentation standards: clear visual structure, badging, quick-start code snippets, copy-paste JSON specs, and step-by-step webhook signature validation examples.

---

### Copyable `README.md` Source Code

```markdown
<div align="center">

# 🚀 UC Gateway API

**Official Integration SDK & Technical Specification for XII Group UC Gateway**

*A unified, stateful HTTP interface for sending WhatsApp and SMS communications.*

[![API Version](https://img.shields.io/badge/API_Version-v1.0-blue.svg?style=for-the-badge)](https://uc-api.xiigroup.co.za/)
[![Transport](https://img.shields.io/badge/Transport-HTTPS_/_TLS_1.2+-green.svg?style=for-the-badge)](https://uc-api.xiigroup.co.za/)
[![Build Status](https://img.shields.io/badge/Status-Active-brightgreen.svg?style=for-the-badge)](#)
[![Publisher](https://img.shields.io/badge/Publisher-XII_Group-orange.svg?style=for-the-badge)](https://github.com/xiigroup)

[Key Features](#-key-features) • [Quick Start](#-quick-start) • [Message Payloads](#-whatsapp-message-payloads) • [Webhooks & Security](#-webhooks--signature-validation) • [Stateful Chatbots](#-stateful-chatbot-engine) • [Support](#-author--support)

</div>

---

## 📌 Overview

**UC Gateway** simplifies multi-channel messaging by exposing a single endpoint to handle **WhatsApp** and **SMS**. It features a built-in state engine for serverless, persistent chatbot integrations—eliminating the need for external caching layers like Redis for basic conversational flows.


```

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

```

🟢 WhatsApp Cloud                  📡 SMS Telco Network

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

### Authentication Header
Generate your Base64 string from your portal credentials:
```bash
echo -n "your_username:your_password" | base64

```

### 1. Send WhatsApp Text Message (cURL)

```bash
curl -X POST "[https://uc-api.xiigroup.co.za/](https://uc-api.xiigroup.co.za/)" \
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

### 2. Send SMS Message (cURL)

```bash
curl -X POST "[https://uc-api.xiigroup.co.za/](https://uc-api.xiigroup.co.za/)" \
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

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "image",
  "nid": 12345678,
  "to": "27716629021",
  "link": "[https://domain.com/assets/banner.jpg](https://domain.com/assets/banner.jpg)",
  "body": "Check out our latest release!"
}

```

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
$rawPayload = file_get_contents('php://input');$incomingSignature = $_SERVER['HTTP_X_UC_SIGNATURE'] ?? '';$secret = 'YOUR_PORTAL_SHARED_SECRET';

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

---

# UC Gateway WhatsApp & SMS API — Master Technical Documentation & Integration Guide

This document serves as the official technical specification for integrating with XII Group’s **UC Gateway WhatsApp and SMS API**.

**API Version:** `v1.0`  
**Author:** Sipho Selabe  
**Email:** sg.selabe@xiigroup.co.za  
**Developer Resources:** https://github.com/xiigroup/ucgateway

---

## 1. System Overview & Architecture

UC Gateway provides a programmatic HTTP interface for sending and receiving WhatsApp and SMS communications.

### Key Capabilities

- WhatsApp messaging
- SMS messaging
- Plain text messages
- WhatsApp templates
- Interactive CTA messages
- Interactive lists
- Quick-reply buttons
- Media messages
- Location messages
- Location requests
- Keypad interfaces
- Message replies
- Incoming message webhooks
- Message status webhooks
- Webhook signature validation
- Chatbot state and persistent memory

The API currently uses version **`v1.0`** for both WhatsApp and SMS.

---

# 2. Portal Setup & Prerequisites

Before using the API, the required configuration must be completed through the UC Gateway portal.

### Portal Requirements

The portal provides:

- WhatsApp template creation
- WhatsApp Number ID (`nid`)
- API credentials
- WhatsApp webhook configuration
- SMS webhook configuration
- SMS credentials
- Basic chat GUI

### WhatsApp Templates

WhatsApp templates must be created through the portal before they can be sent using the API.

### Number ID

The `nid` is the internal Number ID assigned to the WhatsApp or SMS service.

The `nid` is **8 digits long**.

Example:

```text
12345678
```

---

# 3. Base Configuration & Global Parameters

## Environment

**Base Endpoint:**

```text
https://uc-api.xiigroup.co.za/
```

**Transport:** HTTPS

**TLS:** TLS 1.2 or higher

---

## Authentication

API requests require HTTP Basic Authentication.

Credentials are supplied using:

```http
Authorization: Basic <Base64(username:password)>
```

Example:

```http
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

Credentials are generated through the UC Gateway portal.

WhatsApp and SMS use separate credentials.

---

## Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | HTTP Basic Authentication |
| `HTTP_API_VERSION` | No | API version |
| `Content-Type` | Conditional | Required when sending a JSON request body |

Example:

```http
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
HTTP_API_VERSION: v1.0
Content-Type: application/json
```

If `HTTP_API_VERSION` is omitted, the default is `latest`.

---

# 4. Integration Modes

The API supports three request formats.

| Method | Payload | Description |
|---|---|---|
| `GET` | URL query | Parameters are passed in the URL |
| `POST` | URL query | Parameters are passed in the URL query string |
| `POST` | JSON | Parameters are passed in the JSON request body |

---

## 4.1 HTTP GET

```http
GET /?endpoint=whatsapp&action=send&type=text&nid=12345678&to=27716629021&body=Hello HTTP/1.1
Host: uc-api.xiigroup.co.za
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
HTTP_API_VERSION: v1.0
```

---

## 4.2 HTTP POST — Query String

```bash
curl -X POST "https://uc-api.xiigroup.co.za/?endpoint=whatsapp&action=send&type=text&nid=12345678&to=27716629021&body=Hello" \
  -u "username:password" \
  -H "HTTP_API_VERSION: v1.0"
```

---

## 4.3 HTTP POST — JSON Data

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
    "body": "Hello"
  }'
```

---

# 5. Mandatory Core Parameters

The following parameters are used by API requests.

| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `endpoint` | string | Yes | Service endpoint | `"whatsapp"` |
| `action` | string | Yes | Gateway operation | `"send"` |
| `nid` | integer | Yes | Internal 8-digit Number ID | `12345678` |
| `to` | string | Yes | Recipient MSISDN | `"27716629021"` |
| `type` | string | Yes | Message type | `"text"` |

### `to`

Recipient numbers must contain the country code and must not contain `+`.

Example:

```text
27716629021
```

---

# 6. WhatsApp API

WhatsApp requests use:

```json
{
  "endpoint": "whatsapp"
}
```

---

# 7. WhatsApp Plain Text

**Type:**

```text
text
```

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "text",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Hello from UC Gateway!"
}
```

---

# 8. WhatsApp Template

**Type:**

```text
template
```

Templates must be created through the UC Gateway portal.

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "template",
  "nid": 12345678,
  "to": "27716629021",
  "name": "hello",
  "language": "en",
  "header": [
    {
      "text": "Welcome"
    }
  ],
  "body": [
    {
      "text": "Fatso"
    }
  ]
}
```

### Template Variables

The number of variables supplied in the API request must match the number of variables configured in the template.

Header and body variables are handled separately.

---

# 9. WhatsApp CTA

**Type:**

```text
cta
```

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "cta",
  "nid": 12345678,
  "to": "27716629021",
  "link": "https://wa.me/",
  "header": "https://domain.com/banner.jpg",
  "body": "Check out our new offerings!",
  "footer": "XII Group"
}
```

---

# 10. WhatsApp List

**Type:**

```text
list
```

A list can contain:

- A list title only
- A list title and list body/description

The `label` parameter can be used to change the list button label.

If `label` is not provided, the default list label is used.

---

# 11. List Button Label

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "list",
  "nid": 12345678,
  "to": "27716629021",
  "label": "select option",
  "header": "hello",
  "body": "body",
  "footer": "footer",
  "list": {
    "item 1 description": "item 1",
    "item 2 description": "item 2"
  }
}
```

`label` sets the name displayed on the list button.

If omitted, the gateway uses the default list label.

---

# 12. List With Descriptions

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "list",
  "nid": 12345678,
  "to": "27716629021",
  "header": "hello",
  "body": "body",
  "footer": "footer",
  "list": {
    "item 1 description": "item 1",
    "item 2 description": "item 2"
  }
}
```

---

# 13. List Without Descriptions

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "list",
  "nid": 12345678,
  "to": "27716629021",
  "header": "hello",
  "body": "body",
  "footer": "footer",
  "list": {
    "1": "item 1",
    "2": "item 2"
  }
}
```

---

# 14. WhatsApp Buttons

**Type:**

```text
buttons
```

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "buttons",
  "nid": 12345678,
  "to": "27716629021",
  "header": "hello",
  "body": "How can we assist you today?",
  "footer": "footer",
  "button": [
    "button 1",
    "button 2"
  ]
}
```

---

# 15. WhatsApp Media

Supported media types include:

```text
image
video
audio
document
sticker
```

Media is supplied using a hosted URL.

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "image",
  "nid": 12345678,
  "to": "27716629021",
  "link": "https://domain.com/image.jpg",
  "body": "Image caption"
}
```

`body` may be used as a caption where supported.

---

# 16. WhatsApp Location

**Type:**

```text
location
```

A location message contains latitude and longitude.

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "location",
  "nid": 12345678,
  "to": "27716629021",
  "latitude": -25.7116577,
  "longitude": 28.4156354,
  "name": "Head Office",
  "address": "Pretoria, South Africa"
}
```

---

# 17. WhatsApp Location Request

**Type:**

```text
location_request
```

A location request asks the WhatsApp user to share their location.

The outgoing location request contains a `body`.

It does **not** require latitude or longitude.

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "location_request",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Please share your location"
}
```

When the user responds with their location, the incoming webhook contains the latitude and longitude.

---

# 18. WhatsApp Keypad

Supported keypad types include:

```text
pinpad
dialpad
```

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "pinpad",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Enter your 4-digit PIN"
}
```

---

# 19. Replying to WhatsApp Messages

A previously received WhatsApp message can be replied to by passing its message ID as `msg_id` in the outgoing API request.

Example:

```text
msg_id=wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJEOTAzMDUyNzZCNUVFNzg1RDkA
```

JSON example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "text",
  "nid": 12345678,
  "to": "27716629021",
  "body": "This is a reply",
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgARGBJEOTAzMDUyNzZCNUVFNzg1RDkA"
}
```

---

# 20. Mark Incoming Messages as Read

Any received WhatsApp message can be marked as read through the API.

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "read",
  "nid": 12345678,
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGBYzRUIwOEMzRDFFQzM2NkZCNzM2NjVBAA=="
}
```

---

# 21. Incoming WhatsApp Webhooks

UC Gateway sends incoming WhatsApp messages to the webhook configured on the portal.

Webhook payloads may include:

- Text messages
- Reactions
- Locations
- Images
- Documents
- Audio
- Video
- Stickers

The incoming webhook also provides chatbot `state` and `memory`.

---

# 22. Webhook Headers

Webhook requests contain headers used to validate authenticity.

Example:

```http
Accept: */*
X-Uc-Nonce: 8f7c6a5b4e3d2c1b0a9f8e7d6c5b4a3
X-Uc-Signature: 74b74bc775eda061a4d87af1311d2dce01b7500006b9f2df5abfc49c05caed76
X-Uc-Timestamp: 1789306231
```

### Headers

| Header | Description |
|---|---|
| `X-Uc-Nonce` | 32-character nonce |
| `X-Uc-Signature` | HMAC SHA-256 signature |
| `X-Uc-Timestamp` | Timestamp supplied with the webhook for additional verification |

---

# 23. Webhook Signature Validation

The webhook signature is calculated using the **complete JSON payload as received**.

The signature calculation must use the **raw JSON request body**, not individual JSON fields.

### Signature Algorithm

The gateway uses:

```text
HMAC SHA-256
```

The HMAC key is the shared secret obtained from the UC Gateway portal.

### Signing Input

The signing input is:

```text
The complete raw JSON payload exactly as received by the webhook.
```

For example, if the webhook body is:

```json
{
  "id": "wamid.example123",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Dev",
  "type": "text",
  "message": "hi",
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

the HMAC must be calculated over the **entire JSON request body**.

Do not construct the signature input by concatenating:

```text
sender
from
name
id
type
message
```

Do not extract and rebuild the payload before calculating the signature.

The application should validate the signature against the raw request body as received.

### Verification Process

1. Receive the webhook request.
2. Capture the raw JSON request body.
3. Retrieve the shared secret configured for the webhook.
4. Calculate HMAC-SHA256 using the raw JSON body as the message.
5. Compare the calculated signature with `X-Uc-Signature`.
6. Use constant-time comparison when comparing signatures.
7. Use `X-Uc-Nonce` and `X-Uc-Timestamp` as additional verification data.

The exact raw JSON representation received by the application must be preserved for signature calculation.

---

# 24. WhatsApp Text Webhook

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "",
  "type": "text",
  "message": "hi",
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

---

# 25. WhatsApp Context

For normal WhatsApp message webhooks, `context` is used when the incoming message is a reply to a previously sent message.

`context` is only present when the message webhook is a reply.

It replaces `msg_id` for this purpose in normal WhatsApp message webhooks.

Applications should not expect `context` to be present on every incoming message.

---

# 26. WhatsApp Reaction Webhook

Reaction webhooks retain `msg_id`.

`msg_id` identifies the previous message that the user reacted to.

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0QxOTlGMkUwN0JDQzA0MUFDNkM1OTA1OTFGQjg4MAA=",
  "type": "reaction",
  "emoji": "😂",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Dev",
  "message": "",
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

For reactions:

- `msg_id` is always retained.
- `msg_id` identifies the message being reacted to.
- `emoji` contains the reaction.
- `message` is an empty string in the reaction example.

---

# 27. WhatsApp Location Webhook

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "name": "Dev",
  "sender": "27128801496",
  "from": "27716629021",
  "type": "location",
  "location": {
    "name": null,
    "address": null,
    "latitude": -25.7116577,
    "longitude": 28.4156354
  },
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

The received location contains:

- `name`
- `address`
- `latitude`
- `longitude`

---

# 28. WhatsApp File Webhook

The file webhook can be used for:

```text
image
document
audio
video
```

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "type": "image",
  "image": [
    {
      "mime": "image/jpeg",
      "url": "https://cdn.xiigroup.co.za/media/12345678/27603166427/image/2026/09/1776522790138158.jpeg",
      "size": 21795,
      "sha256": "1ed74e9caf2e6c746ebd70d940544120a0aa04b95c99e65c833241e63c2d42d6"
    }
  ],
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Dev",
  "message": "",
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

### File URL Structure

The general file URL structure is:

```text
https://cdn.xiigroup.co.za/media/<8digit_INTERNAL_NUMBER_ID>/<SENDER_NUMBER>/<FILE_TYPE>/YYYY/MM/<FILENAME>
```

Example structure:

```text
https://cdn.xiigroup.co.za/media/12345678/27603166427/image/2026/09/1776522790138158.jpeg
```

---

# 29. WhatsApp Sticker Webhook

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "type": "sticker",
  "sticker": [
    {
      "mime": "image/webp",
      "url": "https://cdn.xiigroup.co.za/media/12345678/27603166427/sticker/2026/09/1776522790138158.webp",
      "size": 188358,
      "sha256": "6959056bfb31323d34530f378f3c8299464b8a06e3703f6d61e792341ec708f4"
    }
  ],
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Dev",
  "message": "",
  "state": "LOGIN_DECIDE",
  "memory": {
    "login": "",
    "voucher": {
      "amount": "200"
    }
  }
}
```

---

# 30. Chatbot State & Memory

Incoming webhook payloads contain:

```text
state
memory
```

These fields are useful for maintaining chatbot context.

### State

`state` represents the current chatbot/application state.

Example:

```text
LOGIN_DECIDE
```

### Memory

`memory` stores persistent chatbot data.

Memory can be updated or deleted.

Example:

```json
{
  "login": "",
  "voucher": {
    "amount": "200"
  }
}
```

`state` and `memory` are not set through the normal message-sending API.

They are provided through webhook payloads and can be updated when an automated chatbot processes the webhook.

---

# 31. Automated Chatbot Response

A webhook receiver does **not** have to respond.

If the receiving application is an automated chatbot, it can respond to the webhook request with updated:

- `state`
- `message`
- `memory`
- `api`
- `error`

Example:

```json
{
  "state": "HANDLE_HELP_OPTION",
  "message": "Hello, how can i help",
  "memory": [],
  "api": null,
  "error": null
}
```

Applications that are not automated chatbots do not need to provide this chatbot response.

---

# 32. Chatbot Error Response

If an automated chatbot experiences an error, `error` must contain the error information.

Example:

```json
{
  "state": "START",
  "message": null,
  "memory": [],
  "api": null,
  "error": "Invalid Signature/Secret"
}
```

Developer chatbot examples:

```text
https://github.com/xiigroup
```

---

# 33. WhatsApp Status Webhook

After sending a WhatsApp message through the API, UC Gateway sends a status webhook.

Supported WhatsApp status values are:

```text
sent
delivered
read
```

Example:

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgARGBI2Q0FFODRGNEFDM0NCMjcwNzUA",
  "platform": "whatsapp",
  "status": "sent",
  "recipient_id": "27716629021",
  "timestamp": "1789306231"
}
```

The `id` identifies the message.

---

# 34. WhatsApp Webhook Configuration

The WhatsApp webhook URLs are configured through the UC Gateway portal.

The incoming message webhook and status webhook are configured separately.

---

# 35. SMS API

UC Gateway also provides SMS functionality.

SMS uses the same API endpoint:

```text
https://uc-api.xiigroup.co.za/
```

The current SMS API version is:

```text
v1.0
```

SMS credentials are separate from WhatsApp credentials.

SMS webhooks are also configured separately from WhatsApp webhooks.

---

# 36. Sending SMS

Use:

```text
endpoint=sms
```

Example:

```json
{
  "endpoint": "sms",
  "action": "send",
  "nid": 12345678,
  "to": "27670826044",
  "body": "sending sms"
}
```

---

# 37. SMS Success Response

Example:

```json
{
  "status": "success",
  "results": {
    "id": "b144ff6c-5af1-4887-0104-09140000a61d",
    "from": "27990794903081",
    "status_code": 1,
    "status_msg": "received",
    "parts": 1,
    "location": {
      "country": "ZA"
    },
    "network": {
      "name": "8ta (Heita)",
      "mcc": "655",
      "mnc": "02"
    },
    "charge": {
      "price": null,
      "tid": null
    }
  }
}
```

---

# 38. SMS Error Response

Example:

```json
{
  "status": "error",
  "messages": [
    "Failed to send sms, Route not found (512: Number blocked)"
  ]
}
```

---

# 39. SMS Message Webhook

SMS provides a message/response webhook.

The SMS message webhook is `type="text"`.

Example:

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

### SMS Webhook Fields

| Field | Description |
|---|---|
| `id` | Gateway message identifier |
| `mo_msg_id` | Mobile-originated message ID |
| `charset` | Message character encoding |
| `type` | Webhook type |
| `sender` | SMS service sender |
| `from` | Incoming sender number |
| `name` | Sender name |
| `message` | Received SMS text |
| `state` | Application/chatbot state |
| `memory` | Persistent memory data |

---

# 40. SMS Status Webhook

After sending an SMS, UC Gateway sends a status webhook.

Example:

```json
{
  "id": "1789370565",
  "platform": "sms",
  "status": "sent",
  "recipient_id": "27603166427",
  "timestamp": "1789372457"
}
```

Supported SMS status values are:

```text
sent
delivered
undelivered
queued
failed
```

---

# 41. SMS Webhook Configuration

SMS webhooks are configured separately from WhatsApp webhooks.

The SMS webhook configuration is managed through the UC Gateway portal.

SMS supports:

- Message/response webhook
- Status webhook

---

# 42. SMS Credentials

SMS credentials are separate from WhatsApp credentials.

SMS authentication credentials are generated through the UC Gateway portal.

---

# 43. WhatsApp vs SMS

| Feature | WhatsApp | SMS |
|---|---|---|
| API Version | `v1.0` | `v1.0` |
| Endpoint | `whatsapp` | `sms` |
| Credentials | Separate | Separate |
| Message Types | Multiple | Text |
| Incoming Webhook | Yes | Yes |
| Status Webhook | Yes | Yes |
| Status Values | `sent`, `delivered`, `read` | `sent`, `delivered`, `undelivered`, `queued`, `failed` |
| Webhook Configuration | Separate | Separate |
| State | Supported | Included in webhook |
| Memory | Supported | Included in webhook |

---

# 44. General Success Response

A successful API request uses:

```json
{
  "status": "success",
  "results": {}
}
```

WhatsApp success responses contain message and dispatch information such as the message ID, status, network and charge information.

---

# 45. General Error Response

An unsuccessful request uses:

```json
{
  "status": "error",
  "messages": [
    "Missing link"
  ]
}
```

The `messages` array contains the reported error messages.

---

# 46. HTTP Status Codes

| HTTP Code | Status | Description |
|---|---|---|
| `200` | Success | Request successfully processed |
| `400` | Error | Invalid request or validation error |
| `401` | Unauthorized | Authentication failure |
| `429` | Rate Limited | Request threshold exceeded |
| `500` | Server Error | Gateway processing error |

---

# 47. Typical WhatsApp Integration Flow

```text
Application
    |
    | API request
    v
UC Gateway
    |
    | WhatsApp message
    v
WhatsApp
    |
    | Status webhook
    v
Application
```

For incoming messages:

```text
WhatsApp User
    |
    | Message
    v
UC Gateway
    |
    | Signed webhook
    v
Application / Chatbot
    |
    | Optional chatbot response
    v
UC Gateway
```

The chatbot response is optional and is only required when the receiving application is using the webhook as an automated chatbot interaction.

---

# 48. Typical SMS Integration Flow

```text
Application
    |
    | SMS API request
    v
UC Gateway
    |
    | SMS
    v
Mobile Network
    |
    | Status webhook
    v
Application
```

Incoming SMS:

```text
Mobile User
    |
    | SMS
    v
UC Gateway
    |
    | SMS message webhook
    v
Application
```

---

# 49. Developer Resources

Official developer examples and resources:

```text
https://github.com/xiigroup
```

---

# 50. API Summary

## WhatsApp Send

```text
POST https://uc-api.xiigroup.co.za/
```

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "text",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Hello"
}
```

## SMS Send

```text
POST https://uc-api.xiigroup.co.za/
```

Example:

```json
{
  "endpoint": "sms",
  "action": "send",
  "nid": 12345678,
  "to": "27670826044",
  "body": "Hello"
}
```

---

# 51. Important Integration Notes

1. The current API version is **`v1.0`**.
2. The `nid` is an **8-digit internal Number ID**.
3. WhatsApp and SMS use separate credentials.
4. WhatsApp and SMS webhook configurations are separate.
5. WhatsApp templates are created through the portal.
6. `location_request` does not require latitude or longitude.
7. An outgoing `msg_id` can be supplied when replying to a previous WhatsApp message.
8. Normal incoming WhatsApp message replies use `context`.
9. WhatsApp reaction webhooks retain `msg_id` to identify the message being reacted to.
10. Incoming webhook requests contain `X-Uc-Nonce`, `X-Uc-Signature` and `X-Uc-Timestamp` headers.
11. `X-Uc-Nonce` is a 32-character nonce.
12. The webhook HMAC signature is calculated from the **complete raw JSON payload as received**.
13. The JSON payload must not be reconstructed from individual fields before calculating the signature.
14. The shared secret used for HMAC validation is obtained from the UC Gateway portal.
15. Constant-time comparison should be used when comparing the calculated signature with `X-Uc-Signature`.
16. `X-Uc-Nonce` and `X-Uc-Timestamp` provide additional verification data.
17. Webhook `state` and `memory` provide chatbot/application context.
18. Persistent `memory` can be updated or deleted.
19. A normal webhook receiver does not have to return a chatbot response.
20. An automated chatbot can respond with updated `state`, `message`, `memory`, `api` and `error`.
21. If an automated chatbot encounters an error, the `error` field must contain the error.
22. WhatsApp status values are `sent`, `delivered` and `read`.
23. SMS status values are `sent`, `delivered`, `undelivered`, `queued` and `failed`.
24. SMS message webhooks are `type="text"`.
25. File webhooks can contain image, document, audio or video data.
26. Sticker webhooks contain sticker media information.

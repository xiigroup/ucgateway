# UC Gateway API Documentation

**API Version:** `v1.0`
**Author:** Sipho Selabe
**Email:** [sg.selabe@xiigroup.co.za](mailto:sg.selabe@xiigroup.co.za)`

UC Gateway is a messaging gateway supporting **WhatsApp, MoyaApp and SMS** through a unified API.

## Developer Resources

GitHub:

https://github.com/xiigroup

---

# 1. Portal Setup

Before using the API, configure the required services through the UC Gateway portal.

The portal provides:

* WhatsApp template creation
* Internal Number ID (`nid`) retrieval
* API credential generation
* WhatsApp webhook configuration
* WhatsApp status webhook configuration
* MoyaApp webhook configuration
* MoyaApp status webhook configuration
* SMS webhook configuration
* SMS status webhook configuration
* SMS credential generation
* Basic chat GUI

## Internal Number ID

The `nid` is the internal Number ID assigned to a service.

The `nid` is **8 digits long**.

Example:

```text
12345678
```

WhatsApp templates must be created through the UC Gateway portal before they can be sent using the template API.

---

# 2. Authentication

UC Gateway uses HTTP Basic Authentication.

```http
Authorization: Basic <Base64(username:password)>
```

Credentials are generated through the UC Gateway portal.

Each channel has its own credentials:

* WhatsApp API Credentials
* MoyaApp API Credentials
* SMS API Credentials

---

# 3. API Version

The current API version is:

```text
v1.0
```

The same API version is used for:

* WhatsApp
* MoyaApp
* SMS

---

# 4. Request Headers

For JSON requests:

```http
Authorization: Basic <Base64(username:password)>
HTTP_API_VERSION: v1.0
Content-Type: application/json
```

---

# 5. Integration Modes

UC Gateway supports:

1. HTTP GET
2. HTTP POST with query parameters
3. HTTP POST with JSON data

### POST JSON Example

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

---

# WhatsApp API

# 6. Core Parameters

| Parameter  | Type    | Required | Description                |
| ---------- | ------- | -------: | -------------------------- |
| `endpoint` | string  |      Yes | API service, `whatsapp`    |
| `action`   | string  |      Yes | Operation, e.g. `send`     |
| `nid`      | integer |      Yes | 8-digit internal Number ID |
| `to`       | string  |      Yes | Recipient MSISDN           |
| `type`     | string  |      Yes | Message type               |

Recipient numbers must contain the country code and must not contain `+`.

Example:

```text
27716629021
```

---

# 7. Plain Text

**Type:** `text`

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

# 8. Templates

**Type:** `template`

Templates must first be created through the UC Gateway portal.

Example with one header variable and one body variable:

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

The number of variables supplied in the API payload must match the number of variables configured in the template.

For example, if a template contains:

* 1 header variable
* 1 body variable

the API payload must contain:

* 1 object in `header`
* 1 object in `body`

---

# 9. CTA

**Type:** `cta`

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "cta",
  "nid": 12345678,
  "to": "27716629021",
  "link": "https://domain.com",
  "header": "hello",
  "body": "Visit our website",
  "footer": "XII Group"
}
```

---

# 10. List Messages

**Type:** `list`

A list can contain list items with descriptions or list items without descriptions.

### List With Description

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

### List Without Description

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

### Custom List Label

The list button label can be changed using `label`.

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

If `label` is not provided, the default list label is used.

---

# 11. Buttons

**Type:** `buttons`

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "buttons",
  "nid": 12345678,
  "to": "27716629021",
  "body": "How can we assist you today?",
  "button": [
    "Billing Inquiry",
    "Technical Support"
  ]
}
```

---

# 12. Media Messages

Supported WhatsApp media types include:

* `image`
* `document`
* `audio`
* `video`

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

---

# 13. Location

**Type:** `location`

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

# 14. Location Request

**Type:** `location_request`

WhatsApp `location_request` displays an interactive map to the user.

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

The application does not provide latitude or longitude when sending the request.

The user's location is returned through the incoming webhook.

---

# 15. Keypad / PIN Pad

Supported message types include:

* `keypad`
* `pinpad`

Example:

```json
{
  "endpoint": "whatsapp",
  "action": "send",
  "type": "pinpad",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Enter your PIN"
}
```

---

# 16. WhatsApp Message Replies

The `msg_id` parameter can be supplied to reply to a previously sent WhatsApp message.

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

`msg_id` is supported when sending WhatsApp messages.

**MoyaApp does not support `msg_id` when sending messages.**

---

# 17. Mark WhatsApp Messages as Read

Received WhatsApp messages can be marked as read.

```json
{
  "endpoint": "whatsapp",
  "action": "read",
  "nid": 12345678,
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGBYzRUIwOEMzRDFFQzM2NkZCNzM2NjVBAA=="
}
```

---

# WhatsApp Webhooks

# 18. Incoming WhatsApp Webhooks

UC Gateway can send incoming WhatsApp events to the message webhook configured in the portal.

Supported incoming message types include:

* Text
* Reaction
* Location
* Image
* Document
* Audio
* Video
* Sticker

---

# 19. Webhook Headers

Every webhook includes the following headers.

Example:

```http
Accept: */*
X-Uc-Nonce: 8f7c6a5b4e3d2c1b0a9f8e7d6c5b4a3
X-Uc-Signature: 74b74bc775eda061a4d87af1311d2dce01b7500006b9f2df5abfc49c05caed76
X-Uc-Timestamp: 1789306231
```

| Header           | Description                           |
| ---------------- | ------------------------------------- |
| `Accept`         | Request accept header                 |
| `X-Uc-Nonce`     | 32-character nonce                    |
| `X-Uc-Signature` | HMAC-SHA256 signature                 |
| `X-Uc-Timestamp` | Timestamp for additional verification |

---

# 20. Webhook Signature Verification

The webhook signature must be calculated using the **complete JSON payload exactly as received**.

The application must use the raw HTTP request body.

The signature is calculated using:

```text
HMAC-SHA256(raw JSON payload, shared secret)
```

The shared secret is generated in the UC Gateway portal.

### Important

The JSON must not be reconstructed or re-serialized before calculating the signature.

The signature must be calculated from the original raw request body.

### Verification

1. Receive the webhook.
2. Capture the raw JSON request body.
3. Retrieve the shared secret.
4. Calculate HMAC-SHA256 using the raw JSON body.
5. Compare the calculated signature with `X-Uc-Signature`.
6. Use a constant-time comparison.
7. Validate the `X-Uc-Nonce`.
8. Validate the `X-Uc-Timestamp`.

If verification fails, reject the request as unauthorized.

---

# 21. Text Webhook

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "",
  "type": "text",
  "message": "hi",
  "state": "HANDLE_START",
  "memory": []
}
```

---

# 22. WhatsApp Message Context

When an incoming WhatsApp message is a reply to a previously sent message, the webhook contains `context`.

```json
{
  "id": "wamid.HBgLMjc2MDMxNjY0MjcVAgASGCBBQzkwNTkxQjBDMjkxM0E2QTJBMjg1QzA0NjlENDNDMgA=",
  "context": {
    "id": "wamid.HBgLMjc2MDMxNjY0MjcVAgARGBJERjNDRjA3NDJCMjZBRDVGNjYA",
    "from": "27128801496"
  },
  "type": "text",
  "sender": "27128801496",
  "from": "27603166427",
  "name": "Lavia💋",
  "message": "Hi",
  "state": "START",
  "memory": []
}
```

`context` is present only when the incoming message is a reply to a previously sent message.

---

# 23. Reaction Webhook

Reaction webhooks retain `msg_id`.

```json
{
  "id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0Q3N0M0M0EyNEEyMkZFQTdBQTkwQ0QxQjA5NUFGNQA=",
  "msg_id": "wamid.HBgLMjc3MTY2MjkwMjEVAgASGCBBQ0UxOTlGMkUwN0JDQzA0MUFDNkM1OTA1OTFGQjg4MAA=",
  "type": "reaction",
  "emoji": "😂",
  "sender": "27128801496",
  "from": "27716629021",
  "name": "Dev",
  "message": "",
  "state": "HANDLE_START",
  "memory": []
}
```

---

# 24. Location Webhook

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
  "state": "HANDLE_START",
  "memory": []
}
```

---

# 25. File Webhook

Files can be received as:

* `image`
* `document`
* `audio`
* `video`

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
  "state": "HANDLE_START",
  "memory": []
}
```

---

# 26. File URL Format

All files received through the webhook use:

```text
https://cdn.xiigroup.co.za/media/<8digit_INTERNAL_NUMBER_ID>/<SENDER_NUMBER>/<FILE_TYPE>/YYYY/MM/<FILENAME>
```

Example:

```text
https://cdn.xiigroup.co.za/media/12345678/27603166427/image/2026/09/1776522790138158.jpeg
```

---

# 27. Sticker Webhook

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
  "state": "HANDLE_START",
  "memory": []
}
```

---

# 28. State and Memory

All three channels support native:

* `state`
* `memory`

These fields are useful for stateful applications and chatbots.

## State

`state` represents the current application or chatbot state.

Example:

```text
HANDLE_START
```

The actual state depends on the application or chatbot developer.

## Memory

`memory` contains persistent application data.

Example:

```json
[]
```

or:

```json
{
  "login": "",
  "voucher": {
    "amount": "200"
  }
}
```

Memory can be:

* Updated
* Deleted
* Used for persistent application data

The structure depends on the application or chatbot developer.

---

# 29. Automated Chatbot Response

A webhook receiver does not have to reply.

If the receiving application is an automated chatbot, it can return:

```json
{
  "state": "HANDLE_HELP_OPTION",
  "message": "Hello, how can i help",
  "memory": [],
  "api": null,
  "error": null
}
```

The chatbot can use the response to update:

* `state`
* `memory`

If the application is not an automated chatbot, no chatbot response is required.

---

# 30. Chatbot Error Response

If an automated chatbot encounters an error:

```json
{
  "state": "START",
  "message": null,
  "memory": [],
  "api": null,
  "error": "Invalid Signature/Secret"
}
```

The `error` field should contain the error experienced by the chatbot.

---

# 31. WhatsApp Status Webhook

After sending a WhatsApp message, UC Gateway sends a status webhook.

Supported statuses:

* `sent`
* `delivered`
* `read`

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

The `id` is the message ID.

The WhatsApp status webhook URL is configured separately from the WhatsApp message webhook.

---

# SMS API

# 32. Sending SMS

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

# 33. SMS Success Response

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

# 34. SMS Error Response

```json
{
  "status": "error",
  "messages": [
    "Failed to send sms, Route not found (512: Number blocked)"
  ]
}
```

---

# 35. SMS Message Webhook

SMS incoming messages use `type: text`.

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

---

# 36. SMS Status Webhook

Supported SMS DLR statuses are:

* `sent`
* `delivered`
* `undelivered`
* `queued`
* `failed`

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

---

# 37. SMS Webhook Configuration

SMS webhooks are configured separately through the SMS Portal Settings.

SMS supports:

* Message webhook
* Status webhook

---

# MoyaApp API

# 38. Sending MoyaApp Messages

MoyaApp uses:

```text
endpoint=moyaapp
```

MoyaApp uses API version:

```text
v1.0
```

MoyaApp does **not** support `msg_id` when sending messages.

---

# 39. MoyaApp Text Message

```json
{
  "endpoint": "moyaapp",
  "action": "send",
  "nid": 12345678,
  "to": "27670826044",
  "body": "Your verification code is: 4829"
}
```

---

# 40. MoyaApp Buttons

```json
{
  "endpoint": "moyaapp",
  "action": "send",
  "type": "buttons",
  "nid": 12345678,
  "to": "27716629021",
  "body": "How can we assist you today?",
  "button": [
    "Billing Inquiry",
    "Technical Support"
  ]
}
```

---

# 41. MoyaApp Lists

MoyaApp does **not** support list messages.

List message types and list-specific parameters available on WhatsApp are not available for MoyaApp.

---

# 42. MoyaApp CTA

MoyaApp does **not** support CTA messages.

CTA message types and CTA-specific parameters available on WhatsApp are not available for MoyaApp.

---

# 43. MoyaApp Location Requests

MoyaApp supports two location request types.

## GPS Location Request

**Type:**

```text
gps_location_request
```

This requests the user's current GPS location **without displaying an interactive map**.

```json
{
  "endpoint": "moyaapp",
  "action": "send",
  "type": "gps_location_request",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Send your current location"
}
```

## Location Request

**Type:**

```text
location_request
```

This displays an **interactive map**.

```json
{
  "endpoint": "moyaapp",
  "action": "send",
  "type": "location_request",
  "nid": 12345678,
  "to": "27716629021",
  "body": "Select your location"
}
```

---

# 44. MoyaApp Media

MoyaApp supports:

* `image`
* `document`
* `audio`
* `video`

However, MoyaApp media sending is **not activated by default**.

Clients must contact **XII Group** to activate MoyaApp media messaging.

### Image Example

```json
{
  "endpoint": "moyaapp",
  "action": "send",
  "type": "image",
  "nid": 12345678,
  "to": "27716629021",
  "link": "https://domain.com/assets/banner.jpg",
  "body": "Check out our latest release!"
}
```

---

# 45. MoyaApp Message Sending Notes

MoyaApp supports multiple message types, including:

* `text`
* `buttons`
* `location_request`
* `gps_location_request`
* `image`*
* `document`*
* `audio`*
* `video`*

`*` Requires media activation by XII Group.

MoyaApp does not support `msg_id` when sending messages.

---

# 46. WhatsApp vs. MoyaApp vs. SMS Feature Comparison

| Feature                     | WhatsApp                                                                                                        | MoyaApp                                                                     | SMS                                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ |
| **API Version**             | `v1.0`                                                                                                          | `v1.0`                                                                      | `v1.0`                                                 |
| **Endpoint Parameter**      | `whatsapp`                                                                                                      | `moyaapp`                                                                   | `sms`                                                  |
| **Credentials**             | WhatsApp API Credentials                                                                                        | MoyaApp API Credentials                                                     | SMS API Credentials                                    |
| **Supported Message Types** | text, templates, lists, cta, buttons, image, document, audio, video, location, location_request, keypad, pinpad | text, image, document, audio, video, location_request, gps_location_request | text                                                   |
| **Supported DLR Statuses**  | `sent`, `delivered`, `read`                                                                                     | `sent`, `delivered`, `read`, `failed`                                       | `sent`, `delivered`, `undelivered`, `queued`, `failed` |
| **Webhooks**                | Configured via WhatsApp Portal Settings                                                                         | Configured via MoyaApp Portal Settings                                      | Configured via SMS Portal Settings                     |
| **Stateful Engine**         | Native `state` & `memory`                                                                                       | Native `state` & `memory`                                                   | Native `state` & `memory`                              |

### Additional Channel Notes

**WhatsApp**

* Supports message replies using `msg_id`.
* Incoming replies use `context`.
* Supports WhatsApp templates.
* Supports interactive messages and location requests.

**MoyaApp**

* Does not support `msg_id` when sending messages.
* Supports `location_request` with an interactive map.
* Supports `gps_location_request` without displaying an interactive map.
* Media messaging requires activation by XII Group.
* Supports native `state` and `memory`.

**SMS**

* Supports text messaging.
* Supports `sent`, `delivered`, `undelivered`, `queued` and `failed` DLR statuses.
* Uses separate SMS credentials.
* Uses separately configured SMS message and status webhooks.
* Supports native `state` and `memory`.

---

# 47. Integration Flow — WhatsApp

```text
Application
     |
     | API Request
     v
UC Gateway
     |
     | WhatsApp Message
     v
WhatsApp
     |
     | Status Webhook
     v
Application
```

Incoming:

```text
WhatsApp User
     |
     | Message
     v
UC Gateway
     |
     | Signed Webhook
     v
Application / Chatbot
```

---

# 48. Integration Flow — SMS

```text
Application
     |
     | SMS API Request
     v
UC Gateway
     |
     | SMS
     v
Mobile Network
     |
     | Status Webhook
     v
Application
```

Incoming:

```text
Mobile User
     |
     | SMS
     v
UC Gateway
     |
     | SMS Webhook
     v
Application
```

---

# 49. Integration Flow — MoyaApp

```text
Application
     |
     | MoyaApp API Request
     v
UC Gateway
     |
     | MoyaApp Message
     v
MoyaApp
```

---

# 50. Integration Checklist

Before integrating:

* Create WhatsApp templates through the portal.
* Retrieve the 8-digit `nid` from the portal.
* Generate API credentials through the portal.
* Configure channel-specific webhook URLs.
* Configure status webhook URLs separately where applicable.
* Use API version `v1.0`.
* Use HTTPS.
* Use Basic Authentication.
* Use the correct endpoint:

  * `whatsapp`
  * `moyaapp`
  * `sms`
* Use the correct recipient MSISDN format.
* Preserve the raw webhook JSON body.
* Calculate webhook signatures from the complete raw JSON payload.
* Do not reconstruct the JSON before signature calculation.
* Validate `X-Uc-Signature`.
* Validate `X-Uc-Nonce`.
* Validate `X-Uc-Timestamp`.
* Use constant-time signature comparison.
* Use `context` for WhatsApp message replies received from users.
* Use `msg_id` when replying to previously sent WhatsApp messages.
* Do not use `msg_id` when sending MoyaApp messages.
* Use `location_request` for interactive-map location selection.
* Use `gps_location_request` on MoyaApp when requesting current GPS without an interactive map.
* Contact XII Group to activate MoyaApp media messaging.
* Track WhatsApp DLR statuses using the WhatsApp status webhook.
* Track MoyaApp DLR statuses using the MoyaApp status webhook.
* Track SMS DLR statuses using the SMS status webhook.

---

# 51. Developer Resources

GitHub:

https://github.com/xiigroup

---

# 52. Support

For:

* API credentials
* `nid` retrieval
* WhatsApp templates
* Webhook configuration
* MoyaApp activation
* MoyaApp media activation
* API integration support

use the UC Gateway portal or contact XII Group.

---

**UC Gateway API v1.0**
**Author:** Sipho Selabe
**Email:** [sg.selabe@xiigroup.co.za](mailto:sg.selabe@xiigroup.co.za)
**GitHub:** https://github.com/xiigroup

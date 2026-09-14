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

🟢 WhatsApp Cloud                  📡 SMS Telco Network

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

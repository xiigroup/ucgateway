import axios, { AxiosInstance } from 'axios';

export interface UcGatewayConfig {
  username: string;
  password: string;
  baseUrl?: string;
}

export class UcGatewayClient {
  private http: AxiosInstance;

  constructor(config: UcGatewayConfig) {
    const authHeader = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    
    this.http = axios.create({
      baseURL: config.baseUrl || 'https://uc-api.xiigroup.co.za/',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        'HTTP_API_VERSION': 'v1.0'
      }
    });
  }

  /** Plain Text */
  async sendWhatsAppText(nid: number, to: string, body: string, msgId?: string) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'text',
      nid,
      to,
      body,
      ...(msgId && { msg_id: msgId })
    });
  }

  /** Template Message */
  async sendWhatsAppTemplate(
    nid: number, 
    to: string, 
    name: string, 
    language: string = 'en', 
    header: Record<string, string>[] = [], 
    body: Record<string, string>[] = []
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'template',
      nid,
      to,
      name,
      language,
      header,
      body
    });
  }

  /** Interactive Buttons */
  async sendWhatsAppButtons(
    nid: number, 
    to: string, 
    body: string, 
    buttons: string[], 
    header?: string, 
    footer?: string
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'buttons',
      nid,
      to,
      body,
      button: buttons,
      ...(header && { header }),
      ...(footer && { footer })
    });
  }

  /** Interactive List */
  async sendWhatsAppList(
    nid: number, 
    to: string, 
    body: string, 
    listItems: Record<string, string>, 
    options?: { label?: string; header?: string; footer?: string }
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'list',
      nid,
      to,
      body,
      list: listItems,
      ...(options?.label && { label: options.label }),
      ...(options?.header && { header: options.header }),
      ...(options?.footer && { footer: options.footer })
    });
  }

  /** CTA Link */
  async sendWhatsAppCTA(
    nid: number, 
    to: string, 
    link: string, 
    body: string, 
    options?: { header?: string; footer?: string }
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'cta',
      nid,
      to,
      link,
      body,
      ...(options?.header && { header: options.header }),
      ...(options?.footer && { footer: options.footer })
    });
  }

  /** Media Message (image, video, audio, document, sticker) */
  async sendWhatsAppMedia(
    nid: number, 
    to: string, 
    type: 'image' | 'video' | 'audio' | 'document' | 'sticker', 
    mediaUrl: string, 
    caption?: string
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type,
      nid,
      to,
      link: mediaUrl,
      ...(caption && { body: caption })
    });
  }

  /** Send Location */
  async sendWhatsAppLocation(
    nid: number, 
    to: string, 
    latitude: number, 
    longitude: number, 
    name?: string, 
    address?: string
  ) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'location',
      nid,
      to,
      latitude,
      longitude,
      ...(name && { name }),
      ...(address && { address })
    });
  }

  /** Request Location */
  async requestWhatsAppLocation(nid: number, to: string, body: string) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type: 'location_request',
      nid,
      to,
      body
    });
  }

  /** Keypad / Pinpad */
  async sendWhatsAppKeypad(nid: number, to: string, body: string, type: 'pinpad' | 'dialpad' = 'pinpad') {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'send',
      type,
      nid,
      to,
      body
    });
  }

  /** Mark Message as Read */
  async markAsRead(nid: number, msgId: string) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'read',
      nid,
      msg_id: msgId
    });
  }

  /** SMS Send */
  async sendSms(nid: number, to: string, body: string) {
    return this.http.post('', {
      endpoint: 'sms',
      action: 'send',
      nid,
      to,
      body
    });
  }
}

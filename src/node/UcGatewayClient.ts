import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface UcGatewayConfig {
  username: string;
  password: string;
  baseUrl?: string;
}

export interface UcGatewayApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

export class UcGatewayClient {
  private http: AxiosInstance;

  constructor(config: UcGatewayConfig) {
    const authHeader = Buffer.from(`${config.username}:${config.password}`).toString('base64');

    this.http = axios.create({
      baseURL: config.baseUrl || 'https://uc-api.xiigroup.co.za/',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
        HTTP_API_VERSION: 'v1.0',
      },
    });
  }

  /** Extract response data directly */
  private async request<T = any>(payload: Record<string, any>): Promise<UcGatewayApiResponse<T>> {
    const response: AxiosResponse<UcGatewayApiResponse<T>> = await this.http.post('', payload);
    return response.data;
  }

  /** Plain Text */
  async sendWhatsAppText(nid: number, to: string, body: string, msgId?: string) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'text',
      nid,
      to,
      body,
      ...(msgId && { msg_id: msgId }),
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
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'template',
      nid,
      to,
      name,
      language,
      header,
      body,
    });
  }

  /** Interactive Buttons */
  async sendWhatsAppButtons(
    nid: number,
    to: string,
    body: string,
    buttons: string[],
    options?: { header?: string; footer?: string; msgId?: string }
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'buttons',
      nid,
      to,
      body,
      button: buttons,
      ...(options?.header && { header: options.header }),
      ...(options?.footer && { footer: options.footer }),
      ...(options?.msgId && { msg_id: options.msgId }),
    });
  }

  /** Interactive List */
  async sendWhatsAppList(
    nid: number,
    to: string,
    body: string,
    listItems: Record<string, string> | string[],
    options?: { label?: string; header?: string; footer?: string; msgId?: string }
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'list',
      nid,
      to,
      body,
      list: listItems,
      ...(options?.label && { label: options.label }),
      ...(options?.header && { header: options.header }),
      ...(options?.footer && { footer: options.footer }),
      ...(options?.msgId && { msg_id: options.msgId }),
    });
  }

  /** CTA Link */
  async sendWhatsAppCTA(
    nid: number,
    to: string,
    link: string,
    body: string,
    options?: { header?: string; footer?: string; msgId?: string }
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'cta',
      nid,
      to,
      link,
      body,
      ...(options?.header && { header: options.header }),
      ...(options?.footer && { footer: options.footer }),
      ...(options?.msgId && { msg_id: options.msgId }),
    });
  }

  /** Media Message (image, video, audio, document, sticker) */
  async sendWhatsAppMedia(
    nid: number,
    to: string,
    type: 'image' | 'video' | 'audio' | 'document' | 'sticker',
    mediaUrl: string,
    caption?: string,
    msgId?: string
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type,
      nid,
      to,
      link: mediaUrl,
      ...(caption && { body: caption }),
      ...(msgId && { msg_id: msgId }),
    });
  }

  /** Send Location */
  async sendWhatsAppLocation(
    nid: number,
    to: string,
    latitude: number | string,
    longitude: number | string,
    options?: { name?: string; address?: string; msgId?: string }
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'location',
      nid,
      to,
      latitude: String(latitude),
      longitude: String(longitude),
      ...(options?.name && { name: options.name }),
      ...(options?.address && { address: options.address }),
      ...(options?.msgId && { msg_id: options.msgId }),
    });
  }

  /** Request Location */
  async requestWhatsAppLocation(nid: number, to: string, body: string, msgId?: string) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type: 'location_request',
      nid,
      to,
      body,
      ...(msgId && { msg_id: msgId }),
    });
  }

  /** Keypad / Pinpad */
  async sendWhatsAppKeypad(
    nid: number,
    to: string,
    body: string,
    type: 'pinpad' | 'dialpad' = 'pinpad',
    msgId?: string
  ) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'send',
      type,
      nid,
      to,
      body,
      ...(msgId && { msg_id: msgId }),
    });
  }

  /** Mark Message as Read */
  async markWhatsAppAsRead(nid: number, msgId: string) {
    return this.request({
      endpoint: 'whatsapp',
      action: 'read',
      nid,
      msg_id: msgId,
    });
  }

  /** Plain Text */
  async sendMoyaAppText(nid: number, to: string, body: string) {
    return this.request({
      endpoint: 'moyaapp',
      action: 'send',
      type: 'text',
      nid,
      to,
      body,
    });
  }

  /** Interactive Buttons */
  async sendMoyaAppButtons(
    nid: number,
    to: string,
    body: string,
    buttons: string[],
  ) {
    return this.request({
      endpoint: 'moyaapp',
      action: 'send',
      type: 'buttons',
      nid,
      to,
      body,
      button: buttons,
    });
  }
  
  /** Media Message (image, video, audio, document) */
  async sendMoyaAppMedia(
    nid: number,
    to: string,
    type: 'image' | 'video' | 'audio' | 'document',
    mediaUrl: string
  ) {
    return this.request({
      endpoint: 'moyaapp',
      action: 'send',
      type,
      nid,
      to,
      link: mediaUrl,
    });
  }
  
  /** Request Location */
  async requestMoyaAppLocation(nid: number, to: string, body: string) {
    return this.request({
      endpoint: 'moyaapp',
      action: 'send',
      type: 'location_request',
      nid,
      to,
      body,
    });
  }
  
  /** SMS Send */
  async sendSms(nid: number, to: string, body: string) {
    return this.request({
      endpoint: 'sms',
      action: 'send',
      nid,
      to,
      body,
    });
  }
}

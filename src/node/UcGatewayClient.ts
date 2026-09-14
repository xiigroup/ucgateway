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

  async markAsRead(nid: number, msgId: string) {
    return this.http.post('', {
      endpoint: 'whatsapp',
      action: 'read',
      nid,
      msg_id: msgId
    });
  }

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

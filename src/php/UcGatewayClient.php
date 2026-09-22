<?php

namespace Xiigroup\UcGateway;

class UcGatewayClient 
{
    private string $baseUrl;
    private string $authHeader;

    public function __construct(string $username, string $password, string $baseUrl = 'https://uc-api.xiigroup.co.za/') 
    {
        $this->baseUrl = $baseUrl;
        $this->authHeader = 'Basic ' . base64_encode("{$username}:{$password}");
    }

    private function request(array $payload): array 
    {
        $ch = curl_init($this->baseUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: ' . $this->authHeader,
                'Content-Type: application/json',
                'HTTP_API_VERSION: v1.0'
            ],
            CURLOPT_POSTFIELDS => json_encode($payload)
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            return [
                'code' => $httpCode ?: 500,
                'data' => [
                    'status' => 'error',
                    'message' => 'cURL Request Failed: ' . $curlError
                ]
            ];
        }

        return [
            'code' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }

    public function sendWhatsAppText(int $nid, string $to, string $body, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'text',
            'nid' => $nid,
            'to' => $to,
            'body' => $body
        ];
        if ($msgId !== null) $payload['msg_id'] = $msgId;

        return $this->request($payload);
    }

    public function sendWhatsAppTemplate(int $nid, string $to, string $name, string $language = 'en', array $header = [], array $body = []): array 
    {
        return $this->request([
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'template',
            'nid' => $nid,
            'to' => $to,
            'name' => $name,
            'language' => $language,
            'header' => $header,
            'body' => $body
        ]);
    }

    public function sendWhatsAppButtons(int $nid, string $to, string $body, array $buttons, ?string $header = null, ?string $footer = null, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'buttons',
            'nid' => $nid,
            'to' => $to,
            'body' => $body,
            'button' => $buttons
        ];
        if ($header) $payload['header'] = $header;
        if ($footer) $payload['footer'] = $footer;
        if ($msgId !== null) $payload['msg_id'] = $msgId;

        return $this->request($payload);
    }

    public function sendWhatsAppList(int $nid, string $to, string $body, array $listItems, ?string $label = null, ?string $header = null, ?string $footer = null, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'list',
            'nid' => $nid,
            'to' => $to,
            'body' => $body,
            'list' => $listItems
        ];
        if ($label) $payload['label'] = $label;
        if ($header) $payload['header'] = $header;
        if ($footer) $payload['footer'] = $footer;
        if ($msgId !== null) $payload['msg_id'] = $msgId;

        return $this->request($payload);
    }

    public function sendWhatsAppMedia(int $nid, string $to, string $type, string $mediaUrl, ?string $caption = null, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => $type,
            'nid' => $nid,
            'to' => $to,
            'link' => $mediaUrl
        ];
        if ($caption) $payload['body'] = $caption;
        if ($msgId !== null) $payload['msg_id'] = $msgId;

        return $this->request($payload);
    }

    public function sendWhatsAppLocation(int $nid, string $to, float|string $longitude, float|string $latitude, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'location',
            'nid' => $nid,
            'to' => $to,
            'longitude' => (string) $longitude,
            'latitude' => (string) $latitude
        ];
        if ($msgId !== null) $payload['msg_id'] = $msgId;
        
        return $this->request($payload);
    }
    
    public function requestWhatsAppLocation(int $nid, string $to, string $body, ?string $msgId = null): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'send',
            'type' => 'location_request',
            'nid' => $nid,
            'to' => $to,
            'body' => $body
        ];
        if ($msgId !== null) $payload['msg_id'] = $msgId;
        
        return $this->request($payload);
    }

    public function markWhatsAppAsRead(int $nid, string $msgId): array 
    {
        $payload = [
            'endpoint' => 'whatsapp',
            'action' => 'read',
            'nid' => $nid,
            'msg_id' => $msgId
        ];
        
        return $this->request($payload);
    }

    public function sendMoyaAppText(int $nid, string $to, string $body): array 
    {
        $payload = [
            'endpoint' => 'moyaapp',
            'action' => 'send',
            'type' => 'text',
            'nid' => $nid,
            'to' => $to,
            'body' => $body
        ];

        return $this->request($payload);
    }
    
    public function sendMoyaAppButtons(int $nid, string $to, string $body, array $buttons): array 
    {
        $payload = [
            'endpoint' => 'moyaapp',
            'action' => 'send',
            'type' => 'buttons',
            'nid' => $nid,
            'to' => $to,
            'body' => $body,
            'button' => $buttons
        ];

        return $this->request($payload);
    }

    public function sendMoyaAppMedia(int $nid, string $to, string $type, string $mediaUrl): array 
    {
        $payload = [
            'endpoint' => 'moyaapp',
            'action' => 'send',
            'type' => $type,
            'nid' => $nid,
            'to' => $to,
            'link' => $mediaUrl
        ];

        return $this->request($payload);
    }
    
    public function sendSms(int $nid, string $to, string $body): array 
    {
        return $this->request([
            'endpoint' => 'sms',
            'action' => 'send',
            'nid' => $nid,
            'to' => $to,
            'body' => $body
        ]);
    }
}

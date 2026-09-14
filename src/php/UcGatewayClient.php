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
        curl_close($ch);

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

        if ($msgId !== null) {
            $payload['msg_id'] = $msgId;
        }

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

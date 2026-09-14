<?php

namespace Xiigroup\UcGateway;

class WebhookValidator 
{
    /**
     * Validates the HMAC SHA-256 signature against the exact raw JSON request body.
     */
    public static function validate(string $rawPayload, string $incomingSignature, string $secret): bool 
    {
        if (empty($rawPayload) || empty($incomingSignature) || empty($secret)) {
            return false;
        }

        $calculatedSignature = hash_hmac('sha256', $rawPayload, $secret);

        return hash_equals($calculatedSignature, $incomingSignature);
    }
}

<?php

namespace Xiigroup\UcGateway\Tests;

use PHPUnit\Framework\TestCase;
use Xiigroup\UcGateway\WebhookValidator;

class WebhookValidatorTest extends TestCase
{
    private string $secret = 'test_shared_secret';
    private string $payload = '{"state":"START","message":"Hi"}';

    public function test_validates_correct_signature(): void
    {
        $validSignature = hash_hmac('sha256', $this->payload, $this->secret);

        $result = WebhookValidator::validate($this->payload, $validSignature, $this->secret);

        $this->assertTrue($result);
    }

    public function test_rejects_invalid_signature(): void
    {
        $invalidSignature = 'invalid_hash_string';

        $result = WebhookValidator::validate($this->payload, $invalidSignature, $this->secret);

        $this->assertFalse($result);
    }
}

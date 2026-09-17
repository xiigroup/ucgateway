<?php

/**
 * XII Group UC Gateway - Stateful WhatsApp Bot Example
 *
 * Repository: github.com/xiigroup/ucgateway
 * File Path:  /examples/chatbot.php
 */

declare(strict_types=1);

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

date_default_timezone_set('Africa/Johannesburg');

// Load Composer Autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

use Xiigroup\UcGateway\UcGatewayClient;
use Xiigroup\UcGateway\WebhookValidator;

// Configuration Credentials
$sharedSecret = getenv('PORTAL_SHARED_SECRET') ?: 'YOUR_PORTAL_SHARED_SECRET';
$apiUsername  = getenv('UC_API_USERNAME')      ?: 'YOUR_API_USERNAME';
$apiPassword  = getenv('UC_API_PASSWORD')      ?: 'YOUR_API_PASSWORD';
$numberId     = (int) (getenv('UC_NUMBER_ID')  ?: 'YOUR_WEBHOOK_SECRET');

$stateController = [
    'BOT_DECIDE'     => 'botDecide',
    'FILES_RESPONSE' => 'filesResponse',
];

class BotApp 
{
    public string $sender;
    public string $phone;
    private string $name;
    public string $state;
    public array $memory;
    public ?string $message = null;
    public bool $read = false;

    private UcGatewayClient $client;
    private int $nid;

    public function __construct(
        string $sender,
        string $phone,
        string $name,
        string $state,
        mixed $memory,
        string $username,
        string $password,
        int $nid
    ) {
        $this->sender = $sender;
        $this->phone  = $phone;
        $this->name   = $name;
        $this->state  = $state;
        $this->memory = $memory;
        $this->nid    = $nid;

        // Initialize Official SDK Client
        $this->client = new UcGatewayClient(
            username: $username,
            password: $password
        );
    }

    public function startBot(string $message, array $files = []): string 
    {
        $header = 'Welcome to UC Gateway (PHP)';
        $body   = 'This example demonstrates using the UC Gateway SDK to build stateful chatbots.';
        $footer = 'XII Group SDK';

        $listItems = [
            'Simple Text'          => 'Simple Text',
            'Smart Text (Buttons)' => 'Smart Text (Buttons)',
            'Smart Text (List)'    => 'Smart Text (List)',
            'Send Files'           => 'Send Files',
        ];

        $response = $this->client->sendWhatsAppList(
            nid: $this->nid,
            to: $this->phone,
            body: $body,
            listItems: $listItems,
            label: 'View Options',
            header: $header,
            footer: $footer
        );

        $this->state = 'BOT_DECIDE';
        $this->read = true; //mark previous message as read

        return '';
    }

    public function botDecide(string $message, array $files = []): string 
    {
        $messageMatch = strtolower(trim($message));

        if ($messageMatch === 'simple text') {
            $this->message = 'Simple messaging text response.';
        } elseif ($messageMatch === 'smart text (buttons)') {
            $response = $this->client->sendWhatsAppButtons(
                nid: $this->nid,
                to: $this->phone,
                body: 'This message has interactive quick reply buttons attached:',
                buttons: ['Show Button Payload'],
                header: 'Button Demo',
                footer: 'Max 3 buttons supported'
            );
        } elseif ($messageMatch === 'smart text (list)') {
            $response = $this->client->sendWhatsAppList(
                nid: $this->nid,
                to: $this->phone,
                body: 'This message has an interactive list attached:',
                listItems: ['Option 1' => 'Show List Payload'],
                label: 'Select Option',
                header: 'List Demo',
                footer: 'Interactive List'
            );
        } elseif ($messageMatch === 'send files') {
            $this->message = 'Please send a media file or document:';
            $this->state = 'FILES_RESPONSE';
        }
        $this->read = true; //mark previous message as read

        return '';
    }

    public function filesResponse(string $message, array $files = []): string 
    {
        if (empty($files)) {
            $this->message = "No files attached.\n";
            return '';
        }

        $summary = "Received Files:\n\n";
        foreach ($files as $file) {
            $summary .= "*Preview:* " . ($file['url'] ?? 'N/A') . "\n";
            $summary .= "Size: " . ($file['size'] ?? 'N/A') . " bytes\n";
            $summary .= "Mime: " . ($file['mime'] ?? 'N/A') . "\n";
            $summary .= "SHA256: " . ($file['sha256'] ?? 'N/A') . "\n\n";
        }

        $this->message = $summary;
        $this->read = true; //mark previous message as read
        return '';
    }
}

// 1. Capture Incoming Webhook Payload
$rawPayload = file_get_contents('php://input');
$data       = json_decode($rawPayload, true) ?? [];

$incomingState  = trim($data['state'] ?? 'START');
$incomingMemory = $data['memory'] ?? [];
$signature      = $_SERVER['HTTP_X_UC_SIGNATURE'] ?? '';

$stateController['START'] = 'startBot';

$errorMessage = null;
$app          = null;

// 2. Validate Signature & Execute Route
if ($incomingState && isset($stateController[$incomingState])) {
    $sender  = $data['sender'] ?? '';
    $name    = $data['name']   ?? '';
    $from    = $data['from']   ?? '';
    $message = stripcslashes($data['message'] ?? '');
    $files   = $data['files']   ?? [];

    try {
        $app = new BotApp(
            sender: $sender,
            phone: $from,
            name: $name,
            state: $incomingState,
            memory: $incomingMemory,
            username: $apiUsername,
            password: $apiPassword,
            nid: $numberId
        );

        // Verify HMAC SHA-256 Signature using SDK WebhookValidator
        if (WebhookValidator::validate($rawPayload, $signature, $sharedSecret)) {
            $methodName = $stateController[$incomingState];

            if (method_exists($app, $methodName)) {
                $errorMessage = $app->$methodName($message, $files);
            } else {
                $errorMessage = "Method for state {$incomingState} not found.";
            }
        } else {
            http_response_code(401);
            $errorMessage = 'Invalid Webhook Signature.';
        }
    } catch (Throwable $e) {
        $errorMessage = $e->getMessage();
    }
} else {
    $errorMessage = "State \"{$incomingState}\" is not defined in the state controller.";
}

// 3. Respond with Synchronous Bot Payload
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'state'   => $app->state   ?? null,
    'message' => $app->message ?? null,
    'memory'  => $app->memory  ?? [],
    'read'    => $app->read    ?? false,
    'error'   => $errorMessage ?: null,
]);

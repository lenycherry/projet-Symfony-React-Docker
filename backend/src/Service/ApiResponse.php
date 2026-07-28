<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;

class ApiResponse
{
    public function success(
        string $message,
        array $data = [],
        int $status = 200
    ): JsonResponse {
        return new JsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }


    public function error(
        string $message,
        array $errors = [],
        int $status = 400
    ): JsonResponse {
        return new JsonResponse([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
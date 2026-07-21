<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ApiController extends AbstractController
{
    #[Route('/api/hello', methods: ['GET'])]
    public function hello(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Bonjour depuis Symfony !'
        ]);
    }
}

<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class ApiController extends AbstractController
{
    #[Route('/api/hello', methods: ['GET'])]
    public function hello(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Bonjour depuis Symfony !'
        ]);
    }


  #[Route('/api/users', methods: ['GET'])]
    public function users(UserRepository $userRepository)
    {
        $users = $userRepository->findAll();

        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d')
            ];
        }

    return new JsonResponse([
        'users' => $data
        ]);
    }
    #[Route('/api/users', methods: ['POST'])]
        public function createUser(
        Request $request,
        EntityManagerInterface $entityManager
    )   : JsonResponse
{
    $data = json_decode($request->getContent(), true);

    $user = new User();

    $user->setEmail($data['email']);
    $user->setCreatedAt(new \DateTimeImmutable());

    $entityManager->persist($user);
    $entityManager->flush();

    return new JsonResponse([
        'message' => 'Utilisateur créé',
        'id' => $user->getId()
    ], 201);
}
}

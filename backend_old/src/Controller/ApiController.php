<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;


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
    public function users(UserRepository $userRepository): JsonResponse
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
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);


        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'error' => 'Email et mot de passe obligatoires'
            ], 400);
        }


        $user = new User();

        $user->setEmail($data['email']);


        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $data['password']
        );


        $user->setPassword($hashedPassword);
        $user->setCreatedAt(new \DateTimeImmutable());


        // Validation Symfony
        $errors = $validator->validate($user);


        if (count($errors) > 0) {

            $messages = [];

            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }

            return new JsonResponse([
                'errors' => $messages
            ], 400);
        }


        $entityManager->persist($user);
        $entityManager->flush();


        return new JsonResponse([
            'message' => 'Utilisateur créé',
            'id' => $user->getId()
        ], 201);
    }




    #[Route('/api/users/{id}', methods: ['PUT'])]
    public function updateUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $user = $userRepository->find($id);


        if (!$user) {
            return new JsonResponse([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }


        $data = json_decode($request->getContent(), true);


        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }


        $entityManager->flush();


        return new JsonResponse([
            'message' => 'Utilisateur modifié',
            'id' => $user->getId()
        ]);
    }




    #[Route('/api/users/{id}', methods: ['DELETE'])]
    public function deleteUser(
        int $id,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $user = $userRepository->find($id);


        if (!$user) {
            return new JsonResponse([
                'error' => 'Utilisateur non trouvé'
            ], 404);
        }


        $entityManager->remove($user);
        $entityManager->flush();


        return new JsonResponse([
            'message' => 'Utilisateur supprimé'
        ]);
    }
}
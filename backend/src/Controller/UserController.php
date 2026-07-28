<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\ApiResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class UserController extends AbstractController
{
    #[Route('/api/users/me', name: 'api_user_me', methods: ['GET'])]
    public function me(
        ApiResponse $apiResponse
    ): JsonResponse {

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $apiResponse->error(
                'Utilisateur non authentifié',
                [],
                401
            );
        }

        return $apiResponse->success(
            'Profil utilisateur',
            [
                'id' => $user->getId(),
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
            ]
        );
    }


    #[Route('/api/users/me', name: 'api_user_update', methods: ['PUT'])]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        ApiResponse $apiResponse,
        ValidatorInterface $validator
    ): JsonResponse {

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $apiResponse->error(
                'Utilisateur non authentifié',
                [],
                401
            );
        }


        $data = json_decode(
            $request->getContent(),
            true
        );


        $constraints = new Assert\Collection([
            'email' => [
                new Assert\NotBlank(),
                new Assert\Email(),
            ],
        ]);


        $errors = $validator->validate(
            $data,
            $constraints
        );


        if (count($errors) > 0) {
            return $apiResponse->error(
                'Erreur de validation',
                [
                    'details' => (string) $errors,
                ],
                400
            );
        }


        if ($data['email'] !== $user->getUserIdentifier()) {

            $existingUser = $entityManager
                ->getRepository(User::class)
                ->findOneBy([
                    'email' => $data['email']
                ]);


            if ($existingUser) {
                return $apiResponse->error(
                    'Cet email existe déjà',
                    [],
                    409
                );
            }


            $user->setEmail(
                $data['email']
            );
        }


        $entityManager->flush();


        return $apiResponse->success(
            'Profil mis à jour',
            [
                'email' => $user->getUserIdentifier(),
            ]
        );
    }


    #[Route('/api/users/me/password', name: 'api_user_password', methods: ['PUT'])]
    public function updatePassword(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ApiResponse $apiResponse,
        ValidatorInterface $validator
    ): JsonResponse {

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $apiResponse->error(
                'Utilisateur non authentifié',
                [],
                401
            );
        }


        $data = json_decode(
            $request->getContent(),
            true
        );


        $constraints = new Assert\Collection([
            'oldPassword' => [
                new Assert\NotBlank(),
            ],
            'newPassword' => [
                new Assert\NotBlank(),
                new Assert\Length(min: 8),
            ],
        ]);


        $errors = $validator->validate(
            $data,
            $constraints
        );


        if (count($errors) > 0) {
            return $apiResponse->error(
                'Erreur de validation',
                [
                    'details' => (string) $errors,
                ],
                400
            );
        }


        if (
            !$passwordHasher->isPasswordValid(
                $user,
                $data['oldPassword']
            )
        ) {
            return $apiResponse->error(
                'Ancien mot de passe incorrect',
                [],
                401
            );
        }


        $user->setPassword(
            $passwordHasher->hashPassword(
                $user,
                $data['newPassword']
            )
        );


        $entityManager->flush();


        return $apiResponse->success(
            'Mot de passe modifié'
        );
    }


    #[Route('/api/users/me', name: 'api_user_delete', methods: ['DELETE'])]
    public function deleteAccount(
        EntityManagerInterface $entityManager,
        ApiResponse $apiResponse
    ): JsonResponse {

        $user = $this->getUser();

        if (!$user instanceof User) {
            return $apiResponse->error(
                'Utilisateur non authentifié',
                [],
                401
            );
        }


        $entityManager->remove($user);
        $entityManager->flush();


        return $apiResponse->success(
            'Compte supprimé'
        );
    }
}
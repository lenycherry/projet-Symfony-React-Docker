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
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Service\ApiResponse;
use App\Service\ValidationErrorFormatter;

final class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function index(
    Request $request,
    ValidatorInterface $validator,
    UserRepository $userRepository,
    UserPasswordHasherInterface $passwordHasher,
    EntityManagerInterface $entityManager,
    ApiResponse $apiResponse,
    ValidationErrorFormatter $formatter,

): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $constraints = new Assert\Collection([
            'email' => [
                new Assert\NotBlank(),
                new Assert\Email(),
            ],
            'password' => [
                new Assert\NotBlank(),
                new Assert\Length(min: 8),
            ],
        ]);

        $errors = $validator->validate($data, $constraints);

        if (count($errors) > 0) {
            return $apiResponse->error(
    'Erreur de validation',
    $formatter->format($errors),
    400
);
        }

        $existingUser = $userRepository->findOneBy([
            'email' => $data['email'],
        ]);

        if ($existingUser) {
            return $apiResponse->error(
    'Cet email existe déjà',
    [],
    409
);
        }

        $user = new User();

        $user->setEmail($data['email']);

        $user->setPassword(
            $passwordHasher->hashPassword(
                $user,
                $data['password']
            )
        );

        $user->setRoles(['ROLE_USER']);

        $entityManager->persist($user);
        $entityManager->flush();

        return $apiResponse->success(
    'Utilisateur créé',
    [
        'email' => $user->getEmail(),
    ],
    201
);
    }
}
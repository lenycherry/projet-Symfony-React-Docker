<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\ValidationErrorFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
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
        ValidatorInterface $validator,
        ValidationErrorFormatter $formatter
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
                $formatter->format($errors),
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
        ValidatorInterface $validator,
        ValidationErrorFormatter $formatter
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

                new Assert\Length(
                    min: 8,
                    minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.'
                ),

            ],

        ]);



        $errors = $validator->validate(
            $data,
            $constraints
        );



        if (count($errors) > 0) {

            return $apiResponse->error(
                'Erreur de validation',
                $formatter->format($errors),
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





    #[IsGranted('ROLE_ADMIN')]
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    public function list(
        EntityManagerInterface $entityManager,
        ApiResponse $apiResponse
    ): JsonResponse {



        $users = $entityManager
            ->getRepository(User::class)
            ->findAll();



        $data = array_map(

            static function (User $user) {

                return [

                    'id' => $user->getId(),

                    'email' => $user->getEmail(),

                    'roles' => $user->getRoles(),

                ];

            },

            $users

        );



        return $apiResponse->success(
            'Liste des utilisateurs',
            $data
        );

    }

    #[IsGranted('ROLE_ADMIN')]
#[Route('/api/users/{id}', name: 'api_user_show', methods: ['GET'])]
public function show(
    int $id,
    EntityManagerInterface $entityManager,
    ApiResponse $apiResponse
): JsonResponse {

    $user = $entityManager
        ->getRepository(User::class)
        ->find($id);



    if (!$user instanceof User) {

        return $apiResponse->error(
            'Utilisateur introuvable',
            [],
            404
        );

    }



    return $apiResponse->success(
        'Utilisateur',
        [
            'id' => $user->getId(),

            'email' => $user->getEmail(),

            'roles' => $user->getRoles(),
        ]
    );

}

#[IsGranted('ROLE_ADMIN')]
#[Route('/api/users/{id}', name: 'api_user_admin_update', methods: ['PUT'])]
public function adminUpdate(
    int $id,
    Request $request,
    EntityManagerInterface $entityManager,
    ApiResponse $apiResponse,
    ValidatorInterface $validator,
    ValidationErrorFormatter $formatter
): JsonResponse {

    $currentUser = $this->getUser();

    $user = $entityManager
        ->getRepository(User::class)
        ->find($id);



    if (!$user instanceof User) {

        return $apiResponse->error(
            'Utilisateur introuvable',
            [],
            404
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


        'roles' => [

            new Assert\NotBlank(),

        ],

    ]);



    $errors = $validator->validate(
        $data,
        $constraints
    );



    if (count($errors) > 0) {

        return $apiResponse->error(
            'Erreur de validation',
            $formatter->format($errors),
            400
        );

    }



    $existingUser = $entityManager
        ->getRepository(User::class)
        ->findOneBy([
            'email' => $data['email']
        ]);



    if (
        $existingUser &&
        $existingUser->getId() !== $user->getId()
    ) {

        return $apiResponse->error(
            'Cet email existe déjà',
            [],
            409
        );

    }



    $user->setEmail(
        $data['email']
    );


// Protection contre la suppression de son propre rôle ADMIN

if (
    $user->getId() === $currentUser->getId()
    && !in_array('ROLE_ADMIN', $data['roles'])
    && in_array('ROLE_ADMIN', $user->getRoles())
) {

    return $apiResponse->error(
        'Vous ne pouvez pas retirer votre propre rôle administrateur',
        [],
        403
    );

}




// Protection contre la suppression du dernier administrateur

if (
    in_array('ROLE_ADMIN', $user->getRoles())
    && !in_array('ROLE_ADMIN', $data['roles'])
) {


    $admins = $entityManager
        ->getRepository(User::class)
        ->createQueryBuilder('u')
        ->where('u.roles LIKE :role')
        ->setParameter(
            'role',
            '%ROLE_ADMIN%'
        )
        ->getQuery()
        ->getResult();



    if (count($admins) <= 1) {

        return $apiResponse->error(
            'Impossible de retirer le rôle administrateur du dernier administrateur',
            [],
            403
        );

    }

}


    $user->setRoles(
        $data['roles']
    );



    $entityManager->flush();



    return $apiResponse->success(
        'Utilisateur modifié',
        [
            'id' => $user->getId(),

            'email' => $user->getEmail(),

            'roles' => $user->getRoles(),

        ]
    );

}

#[IsGranted('ROLE_ADMIN')]
#[Route('/api/users/{id}', name: 'api_user_admin_delete', methods: ['DELETE'])]
#[IsGranted('ROLE_ADMIN')]
public function adminDelete(
    int $id,
    EntityManagerInterface $entityManager,
    ApiResponse $apiResponse
): JsonResponse {

    $currentUser = $this->getUser();


    if (!$currentUser instanceof User) {

        return $apiResponse->error(
            'Utilisateur non authentifié',
            [],
            401
        );

    }



    $user = $entityManager
        ->getRepository(User::class)
        ->find($id);



    if (!$user) {

        return $apiResponse->error(
            'Utilisateur introuvable',
            [],
            404
        );

    }




    // Empêche un administrateur de supprimer son propre compte

    if ($user->getId() === $currentUser->getId()) {

        return $apiResponse->error(
            'Vous ne pouvez pas supprimer votre propre compte administrateur',
            [],
            403
        );

    }





    // Vérifie si l'utilisateur supprimé est administrateur

    if (in_array('ROLE_ADMIN', $user->getRoles())) {


        $admins = $entityManager
            ->getRepository(User::class)
            ->createQueryBuilder('u')
            ->where('u.roles LIKE :role')
            ->setParameter(
                'role',
                '%ROLE_ADMIN%'
            )
            ->getQuery()
            ->getResult();



        if (count($admins) <= 1) {

            return $apiResponse->error(
                'Impossible de supprimer le dernier administrateur',
                [],
                403
            );

        }

    }





    $entityManager->remove($user);

    $entityManager->flush();



    return $apiResponse->success(
        'Utilisateur supprimé'
    );

}

}
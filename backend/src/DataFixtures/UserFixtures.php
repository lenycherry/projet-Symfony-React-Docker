<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UserFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }


    public function load(ObjectManager $manager): void
    {

        // Utilisateur classique

        $user = new User();

        $user->setEmail(
            'securise@test.com'
        );

        $user->setRoles([
            'ROLE_USER'
        ]);

        $user->setPassword(
            $this->passwordHasher->hashPassword(
                $user,
                'MonMotDePasse123'
            )
        );


        $manager->persist($user);



        // Administrateur

        $admin = new User();

        $admin->setEmail(
            'admin@test.com'
        );

        $admin->setRoles([
            'ROLE_ADMIN'
        ]);

        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                'AdminMotDePasse123'
            )
        );


        $manager->persist($admin);



        $manager->flush();

    }
}
<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);

        $user = new User();

        $user->setEmail('test@example.com');
        $user->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($user);

        $manager->flush();
    }
}

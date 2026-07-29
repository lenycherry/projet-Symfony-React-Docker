<?php

namespace App\Service;

use Symfony\Component\Validator\ConstraintViolationListInterface;

class ValidationErrorFormatter
{
    public function format(
        ConstraintViolationListInterface $violations
    ): array {
        $errors = [];

        foreach ($violations as $violation) {
            $field = $violation->getPropertyPath();

            $errors[$field] = $violation->getMessage();
        }

        return $errors;
    }
}
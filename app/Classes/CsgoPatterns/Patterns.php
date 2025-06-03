<?php

namespace App\Classes\CsgoPatterns;

use App\Classes\CsgoPatterns\Events\CsgoEvent;
use App\Classes\CsgoPatterns\Events\EnteredGame;

class Patterns
{
    protected array $patterns = [
        'EnteredGame' => EnteredGame::PATTERN,
    ];

    public static function match($log): CsgoEvent|false
    {
        foreach (static::all() as $type => $regex) {
            $matches = [];
            if (preg_match($regex, $log, $matches)) {
                $class = 'App\\Classes\\CsgoPatterns\\Events\\' . $type;

                if (class_exists($class)) {
                    return new $class($matches);
                }
            }
        }

        return false;
    }

    public static function all(): array
    {
        $obj = new static();

        return $obj->patterns;
    }

    public static function __callStatic($name, $arguments): ?string
    {
        $obj = new static();

        return $obj->patterns[$name] ?? null;
    }
}
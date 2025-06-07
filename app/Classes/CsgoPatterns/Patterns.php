<?php

namespace App\Classes\CsgoPatterns;

use App\Classes\CsgoPatterns\Events\CsgoEvent;
use App\Classes\CsgoPatterns\Events\EnteredGame;
use App\Classes\CsgoPatterns\Events\SwitchTeam;
use App\Classes\CsgoPatterns\Events\MatchStart;
use App\Classes\CsgoPatterns\Events\RoundStart;
use App\Classes\CsgoPatterns\Events\TeamPlayingSide;
use App\Classes\CsgoPatterns\Events\Kill;
use App\Classes\CsgoPatterns\Events\RoundEnd;
use App\Classes\CsgoPatterns\Events\RoundScored;

class Patterns
{
    protected array $patterns = [
        'EnteredGame' => EnteredGame::PATTERN,
        'TeamPlayingSide' => TeamPlayingSide::PATTERN,
        'SwitchTeam' => SwitchTeam::PATTERN,
        'MatchStart' => MatchStart::PATTERN,
        'RoundStart' => RoundStart::PATTERN,
        'Kill' => Kill::PATTERN,
        'RoundEnd' => RoundEnd::PATTERN,
        'RoundScored' => RoundScored::PATTERN,
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
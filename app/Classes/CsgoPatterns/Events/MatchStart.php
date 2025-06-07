<?php

namespace App\Classes\CsgoPatterns\Events;

class MatchStart extends CsgoEvent
{
    public const PATTERN = '/World triggered "Match_Start" on "(?P<map>[a-z0-9_]+)"/';
    public string $type = 'MatchStart';

    public string $map;
}

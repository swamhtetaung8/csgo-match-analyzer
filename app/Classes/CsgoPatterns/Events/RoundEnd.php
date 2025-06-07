<?php

namespace App\Classes\CsgoPatterns\Events;

class RoundEnd extends CsgoEvent
{
    public const PATTERN = '/World triggered "Round_End"/';

    public string $type = 'RoundEnd';
}
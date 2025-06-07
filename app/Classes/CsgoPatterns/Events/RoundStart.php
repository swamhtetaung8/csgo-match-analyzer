<?php

namespace App\Classes\CsgoPatterns\Events;

class RoundStart extends CsgoEvent
{
    public const PATTERN = '/World triggered "Round_Start"/';

    public string $type = 'RoundStart';

    public int $time;

    public function __construct($data = [])
    {
        parent::__construct($data);
        $this->time = time();
    }
}
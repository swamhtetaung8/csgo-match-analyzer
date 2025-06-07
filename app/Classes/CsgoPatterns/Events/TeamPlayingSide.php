<?php

namespace App\Classes\CsgoPatterns\Events;

class TeamPlayingSide extends CsgoEvent
{
    public const PATTERN = '/MatchStatus: Team playing "(?P<side>CT|TERRORIST)": (?P<teamName>\S+)/';

    public string $type = 'TeamPlayingSide';

    public string $teamName;

    public string $side;
}
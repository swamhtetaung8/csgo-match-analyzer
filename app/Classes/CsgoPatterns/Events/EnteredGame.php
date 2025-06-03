<?php

namespace App\Classes\CsgoPatterns\Events;

class EnteredGame extends CsgoEvent
{
    public const PATTERN = '/"(?P<userName>.+)[<](?P<userId>\d+)[>][<](?P<steamId>.*)[>][<][>]" entered the game/';

    public string $type = 'EnteredGame';

    public string $userId;

    public string $userName;

    public string $steamId;
  }
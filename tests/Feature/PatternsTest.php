<?php

use App\Classes\CsgoPatterns\Patterns;
use App\Classes\CsgoPatterns\Events\EnteredGame;
use App\Classes\CsgoPatterns\Events\Kill;
use App\Classes\CsgoPatterns\Events\MatchStart;
use App\Classes\CsgoPatterns\Events\RoundEnd;
use App\Classes\CsgoPatterns\Events\RoundScored;
use App\Classes\CsgoPatterns\Events\RoundStart;
use App\Classes\CsgoPatterns\Events\SwitchTeam;
use App\Classes\CsgoPatterns\Events\TeamPlayingSide;

test('patterns can match entered game log', function () {
  $log = '11/28/2021 - 20:27:51: "apEX<25><STEAM_1:1:14739219><>" entered the game';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(EnteredGame::class);
  expect($result->type)->toBe('EnteredGame');
  expect($result->userName)->toBe('apEX');
  expect($result->steamId)->toBe('STEAM_1:1:14739219');
});

test('patterns can match kill log', function () {
  $log = '11/28/2021 - 20:36:19: "s1mple<30><STEAM_1:1:36968273><TERRORIST>" [1248 -484 -416] killed "shox <33><STEAM_1:1:23327283><CT>" [2656 -360 -289] with "ak47" (headshot)
';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(Kill::class);
  expect($result->type)->toBe('Kill');
  expect($result->killerSteamId)->toBe('STEAM_1:1:36968273');
  expect($result->killedSteamId)->toBe('STEAM_1:1:23327283');
});

test('patterns can match match start log', function () {
  $log = '11/28/2021 - 20:27:43: World triggered "Match_Start" on "de_nuke"';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(MatchStart::class);
  expect($result->type)->toBe('MatchStart');
  expect($result->map)->toBe('de_nuke');
});

test('patterns can match round start log', function () {
  $log = '11/28/2021 - 20:27:25: World triggered "Round_Start"';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(RoundStart::class);
  expect($result->type)->toBe('RoundStart');
});

test('patterns can match round end log', function () {
  $log = '11/28/2021 - 20:43:11: World triggered "Round_End"';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(RoundEnd::class);
  expect($result->type)->toBe('RoundEnd');
});

test('patterns can match round scored log', function () {
  $log = '11/28/2021 - 20:45:36: Team "CT" triggered "SFUI_Notice_Bomb_Defused" (CT "2") (T "0")';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(RoundScored::class);
  expect($result->type)->toBe('RoundScored');
  expect($result->winType)->toBe('bomb_defused');
  expect($result->teamWin)->toBe('CT');
});

test('patterns can match switch team log', function () {
  $log = '11/28/2021 - 20:46:04: "b1t<35><STEAM_1:0:143170874>" switched from team <Unassigned> to <TERRORIST>';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(SwitchTeam::class);
  expect($result->type)->toBe('SwitchTeam');
  expect($result->steamId)->toBe('STEAM_1:0:143170874');
  expect($result->newTeam)->toBe('TERRORIST');
});

test('patterns can match team playing side log', function () {
  $log = '11/28/2021 - 20:47:58: MatchStatus: Team playing "TERRORIST": NAVI GGBET';
  $result = Patterns::match($log);

  expect($result)->toBeInstanceOf(TeamPlayingSide::class);
  expect($result->type)->toBe('TeamPlayingSide');
  expect($result->teamName)->toBe('NAVI');
  expect($result->side)->toBe('TERRORIST');
});

test('patterns returns false for unmatched log', function () {
  $log = '11/28/2021 - 20:47:58: Random log that does not match the patterns';
  $result = Patterns::match($log);

  expect($result)->toBeFalse();
});

test('patterns all method returns all patterns', function () {
  $patterns = Patterns::all();

  expect($patterns)->toBeArray()
    ->toHaveKeys(['EnteredGame', 'TeamPlayingSide', 'SwitchTeam', 'MatchStart', 'RoundStart', 'Kill', 'RoundEnd', 'RoundScored']);
});

test('patterns can get individual pattern via magic method', function () {
  $enteredGamePattern = Patterns::EnteredGame();
  $killPattern = Patterns::Kill();

  expect($enteredGamePattern)->toBeString()
    ->and($killPattern)->toBeString();
});

test('patterns returns null for non-existent pattern', function () {
  $nonExistentPattern = Patterns::NonExistentPattern();

  expect($nonExistentPattern)->toBeNull();
});

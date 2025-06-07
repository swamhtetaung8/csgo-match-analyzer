<?php

namespace App\Http\Services;

use App\Classes\CsgoPatterns\Events\CsgoEvent;
use App\Classes\CsgoPatterns\Events\EnteredGame;
use App\Classes\CsgoPatterns\Events\MatchStart;
use App\Classes\CsgoPatterns\Events\RoundEnd;
use App\Classes\CsgoPatterns\Events\RoundScored;
use App\Classes\CsgoPatterns\Events\RoundStart;
use App\Classes\CsgoPatterns\Events\TeamPlayingSide;
use App\Classes\CsgoPatterns\Events\Kill;
use App\Classes\CsgoPatterns\Events\SwitchTeam;
use App\Classes\CsgoPatterns\Patterns;
use Carbon\Carbon;

class CsgoLogParserService
{
    private array $eventLogs = [];
    private array $rounds = [];
    private string $currentMap = '';

    private array $teams = [];

    private array $players = [];

    private int $currentRound = 0;
    private int $currentRoundStartTime = 0;

    private int $currentLine = 0;
    private int $lastMatchStartLine = 0;

    /**
     * Entry point which will be called from other part of the code by passing in the log file content
     * @param string $logContent
     * @return array{map: string, players: array, rounds: array, teams: array}
     */
    public function parse(string $logContent): array
    {
        $lines = explode("\n", trim($logContent));
        $this->findLastMatchStartLine($lines);

        foreach ($lines as $line) {
            $this->parseLine($line);
            $this->currentLine++;
        }

        $this->rounds = array_filter($this->rounds, fn($round) => !empty($round['duration']));

        return [
            'players' => $this->players,
            'teams' => $this->teams,
            'map' => $this->currentMap,
            'rounds' => $this->rounds,
        ];
    }

    /**
     * Goes through each line, extract the timestamp and event type
     * And process each event according to event type
     * @param string $line
     * @return void
     */
    private function parseLine(string $line): void
    {
        $line = trim($line);
        if (empty($line)) return;

        if (!preg_match('/^(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}): (.*)$/', $line, $matches)) {
            return;
        }

        $timestamp = $this->parseTimestamp(timestampStr: $matches[1]);
        $content = $matches[2];

        $event = Patterns::match($content);

        if ($event) {
            $this->processEvent($event, $timestamp);
        }
    }

    /**
     * Format the timestamp form log file to something usable
     * @param string $timestampStr
     * @return Carbon|null
     */
    private function parseTimestamp(string $timestampStr): Carbon
    {
        return Carbon::createFromFormat('m/d/Y - H:i:s', $timestampStr);
    }

    /**
     * Process each event according to the type
     * @param \App\Classes\CsgoPatterns\Events\CsgoEvent $event
     * @param \Carbon\Carbon $timestamp
     * @return void
     */
    private function processEvent(CsgoEvent $event, Carbon $timestamp): void
    {
        $this->eventLogs[] = $event;

        if ($this->lastMatchStartLine <= $this->currentLine) {
            switch (true) {
                case $event instanceof MatchStart:
                    $this->processMatchStart($event->map);
                    break;
                case $event instanceof RoundStart:
                    $this->startNewRound($timestamp);

                    if ($this->currentRound === 16) {
                        $this->swapTeamSides();
                    }
                    break;
                case $event instanceof Kill:
                    $this->processKill($event->killerSteamId, $event->killedSteamId);
                    break;
                case $event instanceof RoundScored:
                    $this->processRoundScored($event->team, $event->winType);
                    break;
                case $event instanceof RoundEnd:
                    $this->endCurrentRound($timestamp);
                    break;
            }
        } else {
            switch (true) {
                case $event instanceof EnteredGame:
                    $this->processPlayerEntered($event->steamId, $event->userName);
                    break;
                case $event instanceof TeamPlayingSide:
                    $this->processTeamPlayingSide($event->teamName, $event->side);
                    break;
                case $event instanceof SwitchTeam:
                    $this->processPlayerSwitchTeam($event->steamId, $event->newTeam);
                    break;
            }
        }
    }

    /**
     * This method stores the player information when they enter the game.
     * It checks if the player is a bot and skips them.
     * It also checks if the player already exists in the players array to avoid duplicates.
     * @param string $steamId
     * @param string $playerName
     * @return void
     */
    private function processPlayerEntered(string $steamId, string $playerName): void
    {
        // Skips bots and players who enter the game more than once
        if ($steamId === 'BOT') {
            return;
        }

        foreach ($this->players as $player) {
            if ($player['steamId'] === $steamId) {
                return;
            }
        }

        $this->players[] = [
            'name' => $playerName,
            'steamId' => $steamId,
            'kills' => 0,
            'deaths' => 0,
            'team' => '',
            'side' => ''
        ];
    }

    /**
     * This method trakcs which team is playing on which side (CT or T).
     * It initializes the team if it does not exist and updates the side if it changes.
     * And updates the side if it changes.
     * @param string $teamName
     * @param string $side
     * @return void
     */
    private function processTeamPlayingSide(string $teamName, string $side): void
    {
        // Initialize team if not already done
        if (!isset($this->teams[$teamName])) {
            $this->teams[$teamName] = [
                'name' => $teamName,
                'side' => $side,
                'score' => 0
            ];
        } else {
            // Update the side if it changes
            $this->teams[$teamName]['side'] = $side;

            foreach ($this->players as &$player) {
                if ($player['side'] === $side) {
                    $player['team'] = $teamName;
                }
            }
        }
    }

    /**
     * Stores the current map name when the match starts.
     * @param string $mapName
     * @return void
     */
    private function processMatchStart(string $mapName): void
    {
        $this->currentMap = $mapName;
    }

    /**
     * Increase local variables currentRound and store round start time to calculate round length
     * @param \Carbon\Carbon $timestamp
     * @return void
     */
    private function startNewRound(Carbon $timestamp): void
    {
        $this->currentRound++;
        $this->currentRoundStartTime = $timestamp->timestamp;

        $this->rounds[$this->currentRound] = [
            'round' => $this->currentRound,
            'kills' => [],
            'start_time' => $timestamp->toDateTimeString(),
            'end_time' => null,
            'duration' => null,
            'winner' => null,
            'score' => null,
        ];
    }

    /**
     * Process player kill event and increase kill, death count for players accordingly
     * @param string $killerSteamId
     * @param string $victimSteamId
     * @return void
     */
    private function processKill(string $killerSteamId, string $victimSteamId): void
    {
        // Update player stats
        foreach ($this->players as &$player) {
            if ($player['steamId'] === $killerSteamId) {
                $player['kills']++;
            }

            if ($player['steamId'] === $victimSteamId) {
                $player['deaths']++;
            }
        }

        // Log kill to current round
        $this->rounds[$this->currentRound]['kills'][] = [
            'killer' => $killerSteamId,
            'victim' => $victimSteamId,
        ];
    }

    /**
     * Process how a round ended
     * 'normal' => Wiped out the entire opponent team
     * 'target_bombed' => Terroist won by successfully bombing the target
     * 'bomb_defused' => CT won by successfully defusing the bomb
     * @param string $winSide
     * @param string $winType
     * @return void
     */
    private function processRoundScored(string $winSide, string $winType): void
    {
        $this->rounds[$this->currentRound]['score'] = $winType;

        // find the team with the same 'team', 'team' is the side so you have to find the team with the same side
        foreach ($this->teams as &$teamData) {
            if ($teamData['side'] === $winSide) {
                $teamData['score']++;
                $this->rounds[$this->currentRound]['winner'] = [
                    'name' => $teamData['name'],
                    'side' => $winSide
                ];
                break;
            }
        }
    }

    /**
     * Calculate the duration of current round according to end_time
     * @param \Carbon\Carbon $timestamp
     * @return void
     */
    private function endCurrentRound(Carbon $timestamp): void
    {
        $end = $timestamp->timestamp;
        $start = $this->currentRoundStartTime;

        $this->rounds[$this->currentRound]['end_time'] = $timestamp->toDateTimeString();
        $this->rounds[$this->currentRound]['duration'] = $end - $start;
    }

    /**
     * Assigns a team to a player who has no team yet.
     *
     * This runs only once per player (if they haven't been assigned a team yet).
     *
     * @param string $steamId
     * @param string $side
     * @return void
     */
    private function processPlayerSwitchTeam(string $steamId, string $side): void
    {
        foreach ($this->players as &$player) {
            if ($player['steamId'] !== $steamId) {
                continue;
            }

            if ($side === 'Spectator') {
                $player['team'] = 'Spectator';
                return;
            }

            $matchingTeam = collect($this->teams)->first(fn($team) => $team['side'] === $side);
            $player['team'] = $matchingTeam['name'] ?? null;
            $player['side'] = $side;

            return;
        }
    }

    /**
     * This method is used to scan the entire log file one time first before starting any parsing
     * To track the real Match_start event because there are a lot of Match_start events and
     * only the last one starts the match for real
     * @param array $lines
     * @return void
     */
    private function findLastMatchStartLine(array $lines)
    {
        $lastIndex = 0;
        foreach ($lines as $index => $line) {
            if (preg_match(MatchStart::PATTERN, $line)) {
                $lastIndex = $index;
            }
        }
        $this->lastMatchStartLine = $lastIndex;
    }

    /**
     * This method is used to switch team sides for players
     * after 15 rounds have been played
     * @return void
     */
    private function swapTeamSides(): void
    {
        foreach ($this->teams as &$team) {
            if ($team['side'] === 'TERRORIST') {
                $team['side'] = 'CT';
            } elseif ($team['side'] === 'CT') {
                $team['side'] = 'TERRORIST';
            }
        }
        unset($team);
    }
}

import { MatchData } from '@/types/match';

/**
 * Custom hook that takes parsed match data from the backend
 * and performs various calculations to generate insights 
 * for frontend display.
 */

export const useMatchStats = (matchData: MatchData) => {
    const { players, teams, rounds, map } = matchData;
    const roundsArray = Object.values(rounds);

    // Get team names dynamically
    const teamNames = Object.keys(teams);
    const team1 = teamNames[0];
    const team2 = teamNames[1];

    // Get team players
    const team1Players = players.filter((p) => p.team === team1 && p.kills > 0);
    const team2Players = players.filter((p) => p.team === team2 && p.kills > 0);

    // Calculate match statistics
    const totalRounds = roundsArray.length;
    const matchDuration = roundsArray.reduce((total, round) => total + round.duration, 0);
    const totalKills = roundsArray.reduce((total, round) => total + round.kills.length, 0);
    const winner = teams[team1].score > teams[team2].score ? team1 : team2;

    // Determine background color for teams according to winner
    const team1BadgeBackgroundColor = winner === team1 ? 'bg-primary' : 'bg-gray-500';
    const team2BadgeBackgroundColor = winner === team2 ? 'bg-primary' : 'bg-gray-500';

    // Get player by Steam ID
    const getPlayerName = (steamId: string) => {
        const player = players.find((p) => p.steamId === steamId);
        return player ? player.name : 'Unknown';
    };

    // Get player side by Steam ID
    const getPlayerSide = (steamId: string) => {
        const player = players.find((p) => p.steamId === steamId);
        return player ? player.side : 'Unknown';
    };

    // Get player stats with additional calculations
    const getEnhancedPlayerStats = (teamPlayers: typeof team1Players) => {
        return teamPlayers
            .map((player) => ({
                ...player,
                kd: player.deaths > 0 ? (player.kills / player.deaths).toFixed(2) : player.kills.toFixed(2),
            }))
            .sort((a, b) => b.kills - a.kills);
    };

    return {
        map,
        teams,
        team1,
        team2,
        team1Players,
        team2Players,
        team1BadgeBackgroundColor,
        team2BadgeBackgroundColor,
        totalRounds,
        matchDuration,
        totalKills,
        getPlayerName,
        getPlayerSide,
        getEnhancedPlayerStats,
        roundsArray,
    };
}; 
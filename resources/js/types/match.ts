export interface Player {
    name: string;
    steamId: string;
    kills: number;
    deaths: number;
    team: string;
    side: string;
}

export interface Team {
    name: string;
    side: string;
    score: number;
}

export interface Kill {
    killer: string;
    victim: string;
}

export interface Round {
    round: number;
    kills: Kill[];
    start_time: string;
    end_time: string;
    duration: number;
    winner: {
        name: string;
        side: string;
    };
    score: string;
}

export interface MatchData {
    players: Player[];
    teams: Record<string, Team>;
    map: string;
    rounds: Record<string, Round>;
} 
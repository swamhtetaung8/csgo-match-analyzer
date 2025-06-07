import { Badge } from '@/components/ui/badge';
import useMatchAnalyticHelper from '@/hooks/useMatchAnalyticHelper';
import { cn } from '@/lib/utils';
import { Clock, Crosshair } from 'lucide-react';
import { Round } from '@/types/match';

interface RoundCardProps {
    round: Round;
    index: number;
    selectedRound: number | null;
    setSelectedRound: (round: number | null) => void;
    getPlayerName: (steamId: string) => string;
    getPlayerSide: (steamId: string) => string;
    team1BadgeBackgroundColor: string;
    team2BadgeBackgroundColor: string;
    team1: string;
}

export const RoundCard = ({
    round,
    index,
    selectedRound,
    setSelectedRound,
    getPlayerName,
    getPlayerSide,
    team1BadgeBackgroundColor,
    team2BadgeBackgroundColor,
    team1,
}: RoundCardProps) => {
    const roundNum = index + 1;
    const { formatTime, getWinTypeIcon } = useMatchAnalyticHelper();

    return (
        <div
            className="hover:border-primary cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-3 transition-all duration-200 hover:shadow-md"
            onClick={() => setSelectedRound(selectedRound === roundNum ? null : roundNum)}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-white">Round {roundNum}</span>
                <div className="flex items-center gap-2">
                    <Badge className={cn(round.winner.name === team1 ? team1BadgeBackgroundColor : team2BadgeBackgroundColor, 'text-white')}>
                        {round.winner.name} ({round.winner.side})
                    </Badge>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                    <Clock className="text-primary mr-2 h-4 w-4" />
                    {formatTime(round.duration)}
                </div>
                <div className="flex items-center">
                    <Crosshair className="text-primary mr-2 h-4 w-4" />
                    {round.kills.length}
                </div>
                {getWinTypeIcon(round.score)}
            </div>
            {selectedRound === roundNum && (
                <div className="mt-3 border-t border-gray-700 pt-3">
                    <h4 className="mb-2 text-sm font-semibold text-white">Kill Timeline:</h4>
                    <div className="space-y-1">
                        {round.kills.map((kill, i) => (
                            <div key={i} className="flex items-center text-xs text-gray-400">
                                <Crosshair className="text-primary mr-1 h-3 w-3" />
                                <span className="font-medium">
                                    {getPlayerName(kill.killer)} ({getPlayerSide(kill.killer)})
                                </span>
                                <span className="mx-1">→</span>
                                <span>
                                    {getPlayerName(kill.victim)} ({getPlayerSide(kill.victim)})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

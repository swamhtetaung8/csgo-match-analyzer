import { Badge } from '@/components/ui/badge';
import useMatchAnalyticHelper from '@/hooks/useMatchAnalyticHelper';
import { cn } from '@/lib/utils';
import { Round } from '@/types/match';

interface MatchProgressionCardProps {
    roundNum: number;
    round: Round;
    team1: string;
    team1BadgeBackgroundColor: string;
    team2BadgeBackgroundColor: string;
}

export default function MatchProgressionCard({
    roundNum,
    round,
    team1,
    team1BadgeBackgroundColor,
    team2BadgeBackgroundColor,
}: Readonly<MatchProgressionCardProps>) {
    const { formatTime, getWinTypeIcon } = useMatchAnalyticHelper();

    return (
        <div key={round.round} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
            <div>
                <h3 className="font-semibold text-white">Round {roundNum}</h3>
                <p className="text-sm text-gray-400">
                    Duration: {formatTime(round.duration)} | Kills: {round.kills.length}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Badge className={cn(round.winner.name === team1 ? team1BadgeBackgroundColor : team2BadgeBackgroundColor, 'text-white')}>
                    {round.winner.name}
                </Badge>
                <span>{getWinTypeIcon(round.score)}</span>
            </div>
        </div>
    );
}

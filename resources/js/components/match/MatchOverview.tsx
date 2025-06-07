import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import useMatchAnalyticHelper from '@/hooks/useMatchAnalyticHelper';
import { cn } from '@/lib/utils';
import { Team } from '@/types/match';

import { Trophy } from 'lucide-react';

interface MatchOverviewProps {
    map: string;
    matchDuration: number;
    teams: Record<string, Team>;
    team1BadgeBackgroundColor: string;
    team2BadgeBackgroundColor: string;
    team1: string;
    team2: string;
    onBack: () => void;
}

export default function MatchOverview({
    map,
    matchDuration,
    teams,
    team1,
    team2,
    team1BadgeBackgroundColor,
    team2BadgeBackgroundColor,
    onBack,
}: Readonly<MatchOverviewProps>) {
    const { formatTime } = useMatchAnalyticHelper();

    return (
        <Card className="border border-gray-700 bg-slate-900/80 text-white">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                    <Trophy className="text-primary h-6 w-6" />
                    <span>Match Overview</span>
                </CardTitle>
                <Button className="cursor-pointer" onClick={onBack}>
                    Back
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-white">{map}</div>
                        <div className="text-gray-400">Map</div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-white">
                            {teams[team1].score} - {teams[team2].score}
                        </div>
                        <div className="mb-2 text-gray-400">Final Score</div>
                        <div className="space-x-2">
                            <Badge className={cn(team1BadgeBackgroundColor, 'text-white')}>{team1}</Badge>
                            <Badge className={cn(team2BadgeBackgroundColor, 'text-white')}>{team2}</Badge>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-white">{formatTime(matchDuration)}</div>
                        <div className="text-gray-400">Total Duration</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

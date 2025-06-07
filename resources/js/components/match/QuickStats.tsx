import { Card, CardContent } from '@/components/ui/card';
import { Clock, Crosshair, Swords, Target } from 'lucide-react';

interface QuickStatsProps {
    totalKills: number;
    totalRounds: number;
    matchDuration: number;
    formatTime: (seconds: number) => string;
}

export const QuickStats = ({ totalKills, totalRounds, matchDuration, formatTime }: QuickStatsProps) => {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border border-gray-700 bg-slate-900/80">
                <CardContent className="p-4 text-center">
                    <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-white">{totalKills}</div>
                    <div className="text-sm text-gray-400">Total Kills</div>
                </CardContent>
            </Card>
            <Card className="border border-gray-700 bg-slate-900/80">
                <CardContent className="p-4 text-center">
                    <Swords className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-white">{totalRounds}</div>
                    <div className="text-sm text-gray-400">Rounds Played</div>
                </CardContent>
            </Card>
            <Card className="border border-gray-700 bg-slate-900/80">
                <CardContent className="p-4 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-white">{formatTime(Math.round(matchDuration / totalRounds))}</div>
                    <div className="text-sm text-gray-400">Avg Round Time</div>
                </CardContent>
            </Card>
            <Card className="border border-gray-700 bg-slate-900/80">
                <CardContent className="p-4 text-center">
                    <Crosshair className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold text-white">{(totalKills / totalRounds).toFixed(1)}</div>
                    <div className="text-sm text-gray-400">Kills/Round</div>
                </CardContent>
            </Card>
        </div>
    );
}; 
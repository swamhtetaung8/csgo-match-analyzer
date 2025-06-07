import { Dispatch, SetStateAction, useState } from 'react';

import MatchOverview from '@/components/match/MatchOverview';
import PlayerCard from '@/components/match/PlayerCard';
import QuickStats from '@/components/match/QuickStats';
import RoundCard from '@/components/match/RoundCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import useMatchAnalyticHelper from '@/hooks/useMatchAnalyticHelper';
import { useMatchStats } from '@/hooks/useMatchStats';

import MatchProgressionCard from '@/components/match/MatchProgressionCard';
import { MatchData } from '@/types/match';

interface MatchDashboardProps {
    matchData: MatchData;
    setMatchData: Dispatch<SetStateAction<MatchData | null>>;
}

export default function MatchDashboard({ matchData, setMatchData }: Readonly<MatchDashboardProps>) {
    const [selectedRound, setSelectedRound] = useState<number | null>(null);

    const {
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
    } = useMatchStats(matchData);

    const { formatTime } = useMatchAnalyticHelper();

    return (
        <div className="min-h-screen bg-gradient-to-bl from-indigo-800 to-gray-900 p-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-4">
                <MatchOverview
                    map={map}
                    teams={teams}
                    matchDuration={matchDuration}
                    team1={team1}
                    team2={team2}
                    team1BadgeBackgroundColor={team1BadgeBackgroundColor}
                    team2BadgeBackgroundColor={team2BadgeBackgroundColor}
                    onBack={() => setMatchData(null)}
                />

                <QuickStats totalKills={totalKills} totalRounds={totalRounds} matchDuration={matchDuration} formatTime={formatTime} />

                <Tabs defaultValue="players" className="flex w-full flex-col gap-4">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-900/80">
                        <TabsTrigger value="players" className="data-[state=active]:text-primary text-gray-400 data-[state=active]:bg-gray-800">
                            Player Statistics
                        </TabsTrigger>
                        <TabsTrigger value="rounds" className="data-[state=active]:text-primary text-gray-400 data-[state=active]:bg-gray-800">
                            Round Analysis
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="data-[state=active]:text-primary text-gray-400 data-[state=active]:bg-gray-800">
                            Match Timeline
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="players" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {/* Team 1 */}
                            <Card className="border border-gray-700 bg-slate-900/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-white">
                                        {team1} {matchData.teams[team1].score > matchData.teams[team2].score ? '(Winners)' : ''}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {getEnhancedPlayerStats(team1Players).map((player, index) => (
                                            <PlayerCard key={player.steamId} player={player} isTopFragger={index === 0} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Team 2 */}
                            <Card className="border border-gray-700 bg-slate-900/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-white">
                                        {team2} {matchData.teams[team2].score > matchData.teams[team1].score ? '(Winners)' : ''}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {getEnhancedPlayerStats(team2Players).map((player, index) => (
                                            <PlayerCard key={player.steamId} player={player} isTopFragger={index === 0} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="rounds" className="space-y-4">
                        <Card className="border border-gray-700 bg-slate-900/80">
                            <CardHeader>
                                <CardTitle className="text-white">Round by Round Breakdown</CardTitle>
                                <p className="text-sm text-gray-400">Click on any round to see detailed kill timeline</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {roundsArray.map((round, index) => (
                                        <RoundCard
                                            key={round.round}
                                            round={round}
                                            index={index}
                                            selectedRound={selectedRound}
                                            setSelectedRound={setSelectedRound}
                                            getPlayerName={getPlayerName}
                                            getPlayerSide={getPlayerSide}
                                            team1BadgeBackgroundColor={team1BadgeBackgroundColor}
                                            team2BadgeBackgroundColor={team2BadgeBackgroundColor}
                                            team1={team1}
                                            team2={team2}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-4">
                        <Card className="border border-gray-700 bg-slate-900/80">
                            <CardHeader>
                                <CardTitle className="text-white">Match Progression</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border border-emerald-700 bg-gray-800 p-4">
                                        <div>
                                            <h3 className="font-semibold text-white">Match Started</h3>
                                            <p className="text-sm text-gray-400">Map: {matchData.map}</p>
                                        </div>
                                        <Badge className="bg-emerald-500 text-white">Start</Badge>
                                    </div>

                                    {roundsArray.map((round, index) => {
                                        const roundNum = index + 1;
                                        return (
                                            <MatchProgressionCard
                                                key={round.round}
                                                round={round}
                                                roundNum={roundNum}
                                                team1={team1}
                                                team1BadgeBackgroundColor={team1BadgeBackgroundColor}
                                                team2BadgeBackgroundColor={team2BadgeBackgroundColor}
                                            />
                                        );
                                    })}

                                    <div className="flex items-center justify-between rounded-lg border border-blue-700 bg-gray-800 p-4">
                                        <div>
                                            <h3 className="font-semibold text-white">Match Completed</h3>
                                            <p className="text-sm text-gray-400">
                                                {matchData.teams[team1].score > matchData.teams[team2].score ? team1 : team2} wins{' '}
                                                {matchData.teams[team2].score}-{matchData.teams[team1].score}
                                            </p>
                                        </div>
                                        <Badge className="bg-blue-500 text-white">End</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

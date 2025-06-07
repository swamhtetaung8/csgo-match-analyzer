import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

import MatchDashboard from './match-dashboard';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FeatureCard from '@/components/match/FeatureCard';

import { BarChart3Icon, FileUpIcon, Loader, MedalIcon, TargetIcon, UsersRoundIcon } from 'lucide-react';

import { MatchData } from '@/types/match';

const initialFormData = {
    logFile: null as File | null,
};

export default function HomePage() {
    const [mode, setMode] = useState('existing');
    const [matchData, setMatchData] = useState<MatchData | null>(null);
    const { data, setData, post, processing } = useForm(initialFormData);

    /**
     * This function updates the uploaded file in the form data
     * and returns validation error if file size exceeds 5MB
     */
    const handleLogFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.warning('File size cannot exceed 5MB.');
                e.target.value = ''; // Reset input
                return;
            }
            setData('logFile', file);
        }
    };

    /**
     * This function makes request to backend to parse the sample log
     * or the log file user provided
     */
    const handleParseLog = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'upload' && !data.logFile) {
            toast.info('Please select a log file to upload.');
            return;
        }

        post('/parse-match-log', {
            onSuccess: (page) => {
                if (page.props.success) {
                    setMatchData(page.props.match_analytics);
                }
            },
            onError: () => {
                toast.error('Error parsing log, something is wrong with the log file.');
            },
        });
    };

    /**
     * This useEffect resets the logFile when switching to the 'existing' mode.
     * - To ensure that if a user switches back to using the sample log, any previously uploaded file is cleared.
     */
    useEffect(() => {
        if (mode === 'existing') {
            setData('logFile', null);
        }
    }, [mode, setData]);

    /**
     * If there is match data already, meaning parsing is successful
     * Show the match-dashboard component
     */
    if (matchData) {
        return <MatchDashboard matchData={matchData} setMatchData={setMatchData} />;
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-bl from-indigo-800 to-gray-900 p-6 text-white">
            <div className="mb-8 w-full max-w-3xl">
                <Card className="w-full border border-gray-700 bg-slate-900/80 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-white">CS:GO Match Analyzer</CardTitle>
                        <CardDescription>Instantly turn raw csgo match logs into beautiful, insightful dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FeatureCard
                                icon={<BarChart3Icon className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />}
                                title="Match Summary"
                                description="Quick overview of the final score, map, and match duration."
                            />
                            <FeatureCard
                                icon={<UsersRoundIcon className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />}
                                title="Team Breakdown"
                                description="Identify team names, sides, and complete player lineups."
                            />
                            <FeatureCard
                                icon={<TargetIcon className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />}
                                title="Round Analysis"
                                description="See key moments: player kills, deaths and how a round ended."
                            />
                            <FeatureCard
                                icon={<MedalIcon className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300" />}
                                title="MVP & Kill Leaders"
                                description="Spot the top fraggers and who made the biggest impact."
                            />
                        </div>

                        <form onSubmit={handleParseLog}>
                            <div className="space-y-4 pt-2">
                                <RadioGroup value={mode} onValueChange={setMode} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="existing" id="existing" />
                                        <Label className="text-white" htmlFor="existing">
                                            Use sample log (NAVI vs Team Vitality – BLAST Fall Finals 2021, Playoff, Final Game 2)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="upload" id="upload" />
                                        <Label className="text-white" htmlFor="upload">
                                            Upload your own server log
                                        </Label>
                                    </div>
                                </RadioGroup>

                                {mode === 'upload' && (
                                    <div className="space-y-2">
                                        <Input onChange={handleLogFileUpload} type="file" id="logFile" accept=".log,.txt" />
                                    </div>
                                )}

                                <Button className="flex w-full cursor-pointer items-center justify-center gap-2" disabled={processing}>
                                    {processing && (
                                        <>
                                            <Loader className="animate-spin" /> Parsing
                                        </>
                                    )}
                                    {!processing && (
                                        <>
                                            <FileUpIcon size={16} /> Parse Log and Analyze Match
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <Toaster richColors position="top-center" />
        </main>
    );
}

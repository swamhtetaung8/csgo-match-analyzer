import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  BarChart3Icon,
  UsersRoundIcon,
  TargetIcon,
  MedalIcon,
  FileUpIcon,
} from 'lucide-react';

export default function HomePage() {
  const [mode, setMode] = useState('existing');

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-bl from-indigo-800 to-gray-900 p-6 text-white">
      <div className="mb-8 w-full max-w-3xl">
        <Card className="w-full border border-gray-700 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white">CS:GO Match Visualizer</CardTitle>
            <CardDescription>
              Instantly turn raw match logs into beautiful, insightful dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FeatureCard
                icon={<BarChart3Icon className="text-indigo-400 group-hover:text-indigo-300" />}
                title="Match Summary"
                description="Quick overview of the final score, map, and match duration."
              />
              <FeatureCard
                icon={<UsersRoundIcon className="text-indigo-400 group-hover:text-indigo-300" />}
                title="Team Breakdown"
                description="Identify team names, sides, and complete player lineups."
              />
              <FeatureCard
                icon={<TargetIcon className="text-indigo-400 group-hover:text-indigo-300" />}
                title="Round Highlights"
                description="See key moments: bomb plants, defuses, clutches, and eco rounds."
              />
              <FeatureCard
                icon={<MedalIcon className="text-indigo-400 group-hover:text-indigo-300" />}
                title="MVP & Kill Leaders"
                description="Spot the top fraggers and who made the biggest impact."
              />
            </div>

            <div className="space-y-4 pt-2">
              <RadioGroup value={mode} onValueChange={setMode} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label className='text-white' htmlFor="existing">
                    Use sample log (NAVI vs Team Vitality – Nov 2021)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label className='text-white' htmlFor="upload">Upload your own server log</Label>
                </div>
              </RadioGroup>

              {mode === 'upload' && (
                <div className="space-y-2">
                  <Input type="file" id="logFile" accept=".log,.txt" />
                </div>
              )}

              <Button className="w-full flex items-center justify-center gap-2 cursor-pointer">
                <FileUpIcon size={16} />
                Parse Log and Analyze Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border border-gray-700 group bg-gray-800 shadow-md transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center gap-3">
        {icon}
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-400 group-hover:text-gray-200 transition-all duration-300">
        {description}
      </CardContent>
    </Card>
  );
}

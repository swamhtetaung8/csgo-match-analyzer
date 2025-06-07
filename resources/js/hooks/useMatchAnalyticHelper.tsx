import { Bomb, Shield, Swords } from 'lucide-react';

export default function useMatchAnalyticHelper() {
    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getWinTypeIcon = (score: string) => {
        switch (score) {
            case 'bomb_defused':
                return <Shield className="h-4 w-4 text-emerald-500" />;
            case 'target_bombed':
                return <Bomb className="h-4 w-4 text-red-500" />;
            default:
                return <Swords className="h-4 w-4 text-blue-500" />;
        }
    };

    return {
        formatTime,
        getWinTypeIcon,
    };
}

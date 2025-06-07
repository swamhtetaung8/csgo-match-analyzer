import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Player } from '@/types/match';

interface PlayerCardProps {
    player: Player & { kd: string };
    isTopFragger: boolean;
}

export const PlayerCard = ({ player, isTopFragger }: PlayerCardProps) => (
    <div
        className={cn(
            isTopFragger ? 'border-primary bg-gray-800' : 'border-gray-700 bg-gray-800',
            'rounded-lg border p-4 transition-all hover:shadow-md',
        )}
    >
        <div className="mb-2 flex items-center justify-between">
            <h3 className={cn(isTopFragger ? 'text-primary' : 'text-white', 'font-semibold')}>
                {player.name}
                {isTopFragger && <Badge className="ml-2 bg-primary text-white">MVP</Badge>}
            </h3>
            <div className="text-sm text-gray-400">K/D: {player.kd}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center">
                <div className="text-primary font-bold">{player.kills}</div>
                <div className="text-gray-400">Kills</div>
            </div>
            <div className="text-center">
                <div className="text-primary font-bold">{player.deaths}</div>
                <div className="text-gray-400">Deaths</div>
            </div>
        </div>
    </div>
);

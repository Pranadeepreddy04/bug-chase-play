import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Timer } from "lucide-react";

interface GameHeaderProps {
  gamePhase: 'setup' | 'playing' | 'finished';
  currentPlayer: 1 | 2;
  score: { player1: number; player2: number };
  timer?: number;
}

export const GameHeader = ({ gamePhase, currentPlayer, score, timer }: GameHeaderProps) => {
  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-glow">Test Duel</span>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            {gamePhase === 'setup' && 'Setup Phase'}
            {gamePhase === 'playing' && 'Battle in Progress'}
            {gamePhase === 'finished' && 'Game Complete'}
          </Badge>
        </div>

        <div className="flex items-center gap-6">
          {timer && (
            <div className="flex items-center gap-2 text-warning">
              <Timer className="h-4 w-4" />
              <span className="font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                  currentPlayer === 1 ? 'bg-primary/20 text-primary ring-2 ring-primary/30' : 'text-muted-foreground'
                }`}>
                  <span className="font-semibold">Tester</span>
                  <Badge variant="secondary" className="h-5 text-xs">{score.player1}</Badge>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                  currentPlayer === 2 ? 'bg-accent/20 text-accent ring-2 ring-accent/30' : 'text-muted-foreground'
                }`}>
                  <span className="font-semibold">Saboteur</span>
                  <Badge variant="secondary" className="h-5 text-xs">{score.player2}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
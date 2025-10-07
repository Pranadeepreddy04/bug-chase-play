import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy } from "lucide-react";

interface WinnerCelebrationProps {
  winner: "tester" | "saboteur";
  onClose: () => void;
}

export const WinnerCelebration = ({ winner, onClose }: WinnerCelebrationProps) => {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Auto close after 5 seconds
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative animate-scale-in">
        {/* Hanging Thread */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-1 h-20 bg-gradient-to-b from-border to-border/50" />
        
        {/* Hanging Board */}
        <div className="relative bg-gradient-to-br from-card via-card to-card/90 border-4 border-primary/30 rounded-lg shadow-2xl p-8 min-w-[400px] transform hover:rotate-1 transition-transform duration-300">
          {/* Decorative Corner Ropes */}
          <div className="absolute -top-4 left-8 w-2 h-4 bg-border rounded-full" />
          <div className="absolute -top-4 right-8 w-2 h-4 bg-border rounded-full" />
          
          {/* Winner Content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center animate-bounce">
              <Trophy className="w-20 h-20 text-primary drop-shadow-glow" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                🎉 Victory! 🎉
              </h2>
              <p className="text-2xl font-semibold text-primary animate-fade-in" style={{ animationDelay: "0.2s" }}>
                {winner === "tester" ? "The Tester" : "The Saboteur"} Wins!
              </p>
            </div>
            
            <div className="text-muted-foreground text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {winner === "tester" 
                ? "All bugs were successfully caught!" 
                : "The bugs slipped through undetected!"}
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary font-medium transition-all duration-300 hover:scale-105"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
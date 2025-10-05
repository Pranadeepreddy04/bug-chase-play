import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'error' | 'pending';
  message?: string;
  duration?: number;
}

interface TestResultsProps {
  results: TestResult[];
  isRunning?: boolean;
}

export const TestResults = ({ results, isRunning }: TestResultsProps) => {
  const allPassed = results.length > 0 && results.every(r => r.status === 'passed');
  const hasFinished = results.length > 0 && !isRunning;

  useEffect(() => {
    if (hasFinished && allPassed) {
      // Trigger confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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

      return () => clearInterval(interval);
    }
  }, [hasFinished, allPassed]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-success/20 text-success border-success/30">Passed</Badge>;
      case 'failed':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Failed</Badge>;
      case 'error':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Error</Badge>;
      case 'pending':
        return <Badge variant="outline" className="animate-pulse">Running...</Badge>;
    }
  };

  const summary = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Test Results</CardTitle>
          <div className="flex gap-2">
            {summary.passed > 0 && (
              <Badge className="bg-success/20 text-foreground border-success/30 font-semibold">
                ✓ {summary.passed} Passed
              </Badge>
            )}
            {summary.failed > 0 && (
              <Badge className="bg-destructive/20 text-foreground border-destructive/30 font-semibold">
                ✗ {summary.failed} Failed
              </Badge>
            )}
            {summary.error > 0 && (
              <Badge className="bg-warning/20 text-foreground border-warning/30 font-semibold">
                ! {summary.error} Errors
              </Badge>
            )}
          </div>
        </div>
        
        {hasFinished && allPassed && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-success border-2 border-success/50 animate-pulse">
            <div className="flex items-center gap-3 justify-center">
              <Trophy className="h-8 w-8 text-foreground" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">🎉 Congratulations! 🎉</h3>
                <p className="text-sm text-foreground/90 mt-1">All tests passed! You're a winner!</p>
              </div>
              <Trophy className="h-8 w-8 text-foreground" />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isRunning && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Clock className="h-4 w-4" />
            <span>Running tests...</span>
          </div>
        )}
        
        {results.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            No test results yet. Run your tests to see results here.
          </div>
        )}

        {results.map((result, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border">
            {getStatusIcon(result.status)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.name}</span>
                <div className="flex items-center gap-2">
                  {result.duration && (
                    <span className="text-xs text-muted-foreground">
                      {result.duration}ms
                    </span>
                  )}
                  {getStatusBadge(result.status)}
                </div>
              </div>
              {result.message && (
                <p className="text-sm text-muted-foreground mt-1 font-mono">
                  {result.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
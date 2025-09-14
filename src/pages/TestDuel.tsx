import { useState } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { CodeEditor } from '@/components/game/CodeEditor';
import { TestResults } from '@/components/game/TestResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestRunner } from '@/hooks/useTestRunner';
import { Badge } from '@/components/ui/badge';
import { Zap, Bug, Shield, Download } from 'lucide-react';

type GamePhase = 'setup' | 'playing' | 'finished';

const initialCode = `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}`;

const initialTests = `// Test Suite
function runTests() {
  const results = [];
  
  // Test add function
  try {
    if (add(2, 3) === 5) {
      results.push({ name: 'add(2, 3)', status: 'passed' });
    } else {
      results.push({ name: 'add(2, 3)', status: 'failed', message: 'Expected 5' });
    }
  } catch (e) {
    results.push({ name: 'add(2, 3)', status: 'error', message: e.message });
  }
  
  return results;
}`;

export const TestDuel = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(5);
  
  const [originalCode, setOriginalCode] = useState(initialCode);
  const [modifiedCode, setModifiedCode] = useState(initialCode);
  const [testCode, setTestCode] = useState(initialTests);
  
  const { results, isRunning, runTests, clearResults } = useTestRunner();

  const handleStartGame = () => {
    setGamePhase('playing');
    setCurrentPlayer(2); // Saboteur goes first
  };

  const handleRunTests = () => {
    runTests(modifiedCode, testCode);
  };

  const handleNextRound = () => {
    if (round >= maxRounds) {
      setGamePhase('finished');
    } else {
      setRound(round + 1);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      clearResults();
    }
  };

  const handleDownloadTests = () => {
    const testSuite = {
      originalCode,
      finalTests: testCode,
      results: results,
      score,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(testSuite, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-duel-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <GameHeader 
        gamePhase={gamePhase}
        currentPlayer={currentPlayer}
        score={score}
      />

      {gamePhase === 'setup' && (
        <Card className="bg-gradient-card border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-glow">Welcome to Test Duel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                A competitive game where testing skills are put to the ultimate challenge!
              </p>
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Tester (Player 1)</h3>
                  <p className="text-sm text-muted-foreground">Write tests to catch bugs</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <Bug className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold">Saboteur (Player 2)</h3>
                  <p className="text-sm text-muted-foreground">Introduce subtle bugs</p>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <Zap className="h-8 w-8 text-warning mx-auto mb-2" />
                  <h3 className="font-semibold">Win Condition</h3>
                  <p className="text-sm text-muted-foreground">Best of {maxRounds} rounds</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <CodeEditor
                title="Initial Program (Player 1: Set up your code)"
                value={originalCode}
                onChange={setOriginalCode}
                onSave={() => setModifiedCode(originalCode)}
              />
              <CodeEditor
                title="Initial Test Suite (Player 1: Write your tests)"
                value={testCode}
                onChange={setTestCode}
              />
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleStartGame}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                Start Test Duel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {gamePhase === 'playing' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Round {round} of {maxRounds}</h3>
                <Badge variant="outline" className="bg-primary/10">
                  {currentPlayer === 1 ? 'Tester\'s Turn' : 'Saboteur\'s Turn'}
                </Badge>
              </div>
              {currentPlayer === 2 ? (
                <p className="text-sm text-muted-foreground">
                  <strong>Saboteur:</strong> Modify the code to introduce a subtle bug that existing tests won't catch.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <strong>Tester:</strong> Write a test that will catch the saboteur's bug.
                </p>
              )}
            </Card>

            <CodeEditor
              title={currentPlayer === 2 ? "Modified Code (Saboteur)" : "Code (Read-only)"}
              value={modifiedCode}
              onChange={currentPlayer === 2 ? setModifiedCode : () => {}}
              readOnly={currentPlayer === 1}
            />
            
            <CodeEditor
              title={currentPlayer === 1 ? "Test Suite (Tester)" : "Tests (Read-only)"}
              value={testCode}
              onChange={currentPlayer === 1 ? setTestCode : () => {}}
              readOnly={currentPlayer === 2}
              onRun={handleRunTests}
            />

            <div className="flex gap-4">
              <Button 
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex-1"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
              <Button 
                onClick={handleNextRound}
                variant="outline"
                className="flex-1"
              >
                Next Round
              </Button>
            </div>
          </div>

          <div>
            <TestResults results={results} isRunning={isRunning} />
          </div>
        </div>
      )}

      {gamePhase === 'finished' && (
        <Card className="bg-gradient-success border-success/20 shadow-success">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Game Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-glow">
              {score.player1 > score.player2 ? '🛡️' : '🐛'}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {score.player1 > score.player2 ? 'Tester Wins!' : 'Saboteur Wins!'}
              </h3>
              <p className="text-muted-foreground">
                Final Score: Tester {score.player1} - {score.player2} Saboteur
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={handleDownloadTests}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Test Suite
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-primary"
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
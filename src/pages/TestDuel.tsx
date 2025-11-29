import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '@/components/game/GameHeader';
import { CodeEditor } from '@/components/game/CodeEditor';
import { TestResults } from '@/components/game/TestResults';
import { BugInjector } from '@/components/game/BugInjector';
import { WinnerCelebration } from '@/components/game/WinnerCelebration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestRunner } from '@/hooks/useTestRunner';
import { Badge } from '@/components/ui/badge';
import { Zap, Bug, Shield, Download, Shuffle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { codingChallenges } from '@/data/codingChallenges';

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
}

function isEven(num) {
  return num % 2 === 0;
}

// Return all functions to make them available to tests
return { add, multiply, divide, isEven };`;

const initialTests = `// Test functions - each test should be a named function
function testAddition() {
  assertEqual(add(2, 3), 5, "2 + 3 should equal 5");
  assertEqual(add(-1, 1), 0, "(-1) + 1 should equal 0");
  assertEqual(add(0, 0), 0, "0 + 0 should equal 0");
}

function testMultiplication() {
  assertEqual(multiply(3, 4), 12, "3 × 4 should equal 12");
  assertEqual(multiply(-2, 5), -10, "(-2) × 5 should equal -10");
  assertEqual(multiply(0, 100), 0, "0 × 100 should equal 0");
}

function testDivision() {
  assertEqual(divide(10, 2), 5, "10 ÷ 2 should equal 5");
  assertEqual(divide(7, 2), 3.5, "7 ÷ 2 should equal 3.5");
  
  // Test error case
  try {
    divide(5, 0);
    assert(false, "Division by zero should throw an error");
  } catch (e) {
    assertEqual(e.message, "Division by zero", "Should throw correct error message");
  }
}

function testIsEven() {
  assertTrue(isEven(4), "4 should be even");
  assertFalse(isEven(3), "3 should not be even");
  assertTrue(isEven(0), "0 should be even");
  assertFalse(isEven(-1), "(-1) should not be even");
}`;

export const TestDuel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [gameStartTime] = useState(Date.now());
  
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [turnCompleted, setTurnCompleted] = useState(false);
  const [lastTestResults, setLastTestResults] = useState<any[]>([]);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [testerGaveUp, setTesterGaveUp] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [winner, setWinner] = useState<'tester' | 'saboteur' | null>(null);
  
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [originalCode, setOriginalCode] = useState(initialCode);
  const [modifiedCode, setModifiedCode] = useState(initialCode);
  const [testCode, setTestCode] = useState(initialTests);
  
  const { results, isRunning, runTests, clearResults } = useTestRunner();

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          toast.error('Please login to play Test Duel');
          navigate('/login');
          return;
        }
        setUser(session.user);
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication required');
        navigate('/login');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load game from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('test-duel-progress');
    if (savedGame) {
      const parsed = JSON.parse(savedGame);
      setGameHistory(parsed.history || []);
    }
  }, []);

  // Save game progress to localStorage
  const saveGameProgress = () => {
    const gameState = {
      timestamp: new Date().toISOString(),
      originalCode,
      testCode,
      modifiedCode,
      score,
      round,
      gamePhase,
      history: gameHistory
    };
    localStorage.setItem('test-duel-progress', JSON.stringify(gameState));
    localStorage.setItem(`test-duel-completed-${Date.now()}`, JSON.stringify(gameState));
  };

  const handleLoadNewChallenge = () => {
    const randomIndex = Math.floor(Math.random() * codingChallenges.length);
    const challenge = codingChallenges[randomIndex];
    setCurrentChallengeIndex(randomIndex);
    setOriginalCode(challenge.initialCode);
    setModifiedCode(challenge.initialCode);
    setTestCode(challenge.initialTests);
    toast.success(`Loaded: ${challenge.title} (${challenge.difficulty})`);
  };

  const handleStartGame = () => {
    setGamePhase('playing');
    setCurrentPlayer(2); // Saboteur goes first
    setTurnCompleted(false);
  };

  const handleRunTests = async () => {
    await runTests(modifiedCode, testCode);
    setLastTestResults(results);
    
    // Evaluate win/loss conditions
    if (currentPlayer === 1) { // Tester's turn
      const failedTests = results.filter(r => r.status === 'failed' || r.status === 'error');
      
      if (failedTests.length === 0) {
        // All tests passed - Tester caught the bug!
        setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
        setTurnCompleted(true);
      } else {
        // Tests failed - but this might be expected if Saboteur introduced a good bug
        setTurnCompleted(true);
      }
    } else { // Saboteur's turn - just mark turn as completed
      setTurnCompleted(true);
    }
  };

  const handleTesterGiveUp = () => {
    // Tester couldn't find a test to catch the bug
    setTesterGaveUp(true);
    setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
    
    const roundData = {
      round,
      player: currentPlayer,
      code: modifiedCode,
      tests: testCode,
      results: results,
      action: 'Tester gave up - could not find a test',
      timestamp: new Date().toISOString()
    };
    setGameHistory(prev => [...prev, roundData]);
    
    handleNextRound();
  };

  const handleTurnComplete = () => {
    // Save round data to history
    const roundData = {
      round,
      player: currentPlayer,
      code: modifiedCode,
      tests: testCode,
      results: results,
      timestamp: new Date().toISOString()
    };
    setGameHistory(prev => [...prev, roundData]);

    if (currentPlayer === 2) {
      // Saboteur completed their turn, now Tester tries to catch the bug
      setCurrentPlayer(1);
      setTurnCompleted(false);
      setTesterGaveUp(false);
      clearResults();
    } else {
      // Tester completed their turn, evaluate results
      const passedTests = results.filter(r => r.status === 'passed').length;
      const totalTests = results.length;
      
      if (passedTests === totalTests && totalTests > 0) {
        // All tests passed - Tester caught the bug!
        setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
        console.log("Tester caught the bug!");
      } else {
        // Some tests failed - Saboteur's bug wasn't caught
        setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
        console.log("Saboteur's bug wasn't caught!");
      }
      
      // Move to next round or finish game
      handleNextRound();
    }
  };

  const handleNextRound = async () => {
    if (round >= maxRounds || score.player1 >= 3 || score.player2 >= 3) {
      const gameWinner = score.player1 > score.player2 ? 'tester' : 'saboteur';
      setWinner(gameWinner);
      setGamePhase('finished');
      setShowCelebration(true);
      saveGameProgress();
      await saveGameToDatabase();
    } else {
      setRound(round + 1);
      setCurrentPlayer(2);
      setTurnCompleted(false);
      clearResults();
      setModifiedCode(originalCode);
    }
  };

  const saveGameToDatabase = async () => {
    if (!user) return;

    const winner = score.player1 > score.player2 ? 'tester' : 'saboteur';
    const gameDuration = Date.now() - gameStartTime;

    try {
      const { error } = await supabase
        .from('game_scores')
        .insert({
          user_id: user.id,
          tester_score: score.player1,
          saboteur_score: score.player2,
          total_rounds: round,
          winner: winner,
          game_history: gameHistory,
          duration_ms: gameDuration,
        });

      if (error) throw error;
      toast.success('Game saved successfully!');
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Failed to save game to database');
    }
  };

  const checkWinCondition = () => {
    // Win condition: First to 3 points or most points after 5 rounds
    if (score.player1 >= 3) return 'tester';
    if (score.player2 >= 3) return 'saboteur';
    if (round > maxRounds) {
      return score.player1 > score.player2 ? 'tester' : 'saboteur';
    }
    return null;
  };

  const handleDownloadTests = () => {
    const fullTestSuite = {
      gameInfo: {
        timestamp: new Date().toISOString(),
        duration: gameHistory.length > 0 ? 
          new Date(gameHistory[gameHistory.length - 1].timestamp).getTime() - 
          new Date(gameHistory[0].timestamp).getTime() : 0,
        totalRounds: round,
        finalScore: score,
        winner: score.player1 > score.player2 ? 'Tester' : 'Saboteur',
        playerEmail: user?.email
      },
      originalCode,
      finalCode: modifiedCode,
      finalTests: testCode,
      gameHistory: gameHistory,
      allTestResults: results,
      playerActions: gameHistory.map(h => ({
        round: h.round,
        player: h.player === 1 ? 'Tester' : 'Saboteur',
        action: h.player === 1 ? 'Added tests' : 'Modified code',
        timestamp: h.timestamp
      }))
    };
    
    const blob = new Blob([JSON.stringify(fullTestSuite, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-duel-complete-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Number of Rounds (N):</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={maxRounds}
                    onChange={(e) => setMaxRounds(parseInt(e.target.value) || 5)}
                    className="w-20 px-3 py-2 rounded-md border bg-background"
                  />
                  <span className="text-xs text-muted-foreground">
                    Saboteur must introduce {maxRounds} bugs. If Tester catches all, Tester wins!
                  </span>
                </div>
                <Button
                  onClick={handleLoadNewChallenge}
                  variant="outline"
                  className="gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  Try New Challenge
                </Button>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-center">
                  Current Challenge: {codingChallenges[currentChallengeIndex].title} 
                  <Badge variant="outline" className="ml-2">
                    {codingChallenges[currentChallengeIndex].difficulty}
                  </Badge>
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {codingChallenges[currentChallengeIndex].description}
                </p>
              </div>

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
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Saboteur Turn:</strong> Modify the code to introduce a subtle bug that existing tests won't catch.
                  </p>
                  {!turnCompleted && (
                    <p className="text-xs text-warning">
                      💡 Make your changes, then click "Complete Sabotage" to let the Tester try to catch your bug.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tester Turn:</strong> Write tests to catch the Saboteur's bug. Run tests to see if you caught it!
                  </p>
                  {!turnCompleted && (
                    <p className="text-xs text-success">
                      🎯 Add new tests or modify existing ones, then run tests to see if you caught the bug.
                    </p>
                  )}
                  {results.length > 0 && (
                    <p className="text-xs text-info">
                      📊 {results.filter(r => r.status === 'passed').length}/{results.length} tests passed
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Bug Injection System - only for Saboteur */}
            {currentPlayer === 2 && !turnCompleted && (
              <BugInjector
                code={modifiedCode}
                onCodeChange={setModifiedCode}
                disabled={turnCompleted}
              />
            )}

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
                disabled={isRunning || (currentPlayer === 2 && !turnCompleted)}
                className="flex-1"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
              
              {turnCompleted ? (
                <Button 
                  onClick={handleTurnComplete}
                  className="flex-1 bg-gradient-success"
                >
                  {currentPlayer === 2 ? 'Complete Sabotage' : 'Complete Testing'}
                </Button>
              ) : currentPlayer === 1 ? (
                <Button 
                  onClick={handleTesterGiveUp}
                  variant="destructive"
                  className="flex-1"
                >
                  Give Up (Can't Find Test)
                </Button>
              ) : (
                <Button 
                  onClick={() => setTurnCompleted(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>

          <div>
            <TestResults results={results} isRunning={isRunning} />
          </div>
        </div>
      )}

      {gamePhase === 'finished' && (
        <>
          {showCelebration && winner && (
            <WinnerCelebration 
              winner={winner} 
              onClose={() => setShowCelebration(false)} 
            />
          )}
          
          <Card className="bg-gradient-to-br from-card via-card/95 to-primary/5 border-primary/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-3xl bg-gradient-primary bg-clip-text text-transparent">
                Game Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-7xl font-bold animate-bounce">
                {score.player1 > score.player2 ? '🛡️' : '🐛'}
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-primary">
                  {score.player1 > score.player2 ? 'Tester Wins!' : 'Saboteur Wins!'}
                </h3>
                <p className="text-lg text-foreground/80">
                  Final Score: <span className="font-semibold text-primary">Tester {score.player1}</span> - <span className="font-semibold text-accent">Saboteur {score.player2}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                  {score.player1 === maxRounds 
                    ? `🎯 Perfect! Tester caught all ${maxRounds} bugs!` 
                    : score.player2 > score.player1 
                    ? '🐛 Saboteur successfully evaded detection!' 
                    : '🛡️ Tester\'s vigilance prevailed!'}
                </p>
              </div>
              
              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  onClick={handleDownloadTests}
                  variant="outline"
                  className="gap-2 border-primary/30 hover:border-primary/50"
                >
                  <Download className="h-4 w-4" />
                  Download Test Suite
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
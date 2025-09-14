import { useState, useCallback } from 'react';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'error' | 'pending';
  message?: string;
  duration?: number;
}

interface UseTestRunnerReturn {
  results: TestResult[];
  isRunning: boolean;
  runTests: (code: string, tests: string) => Promise<void>;
  clearResults: () => void;
}

export const useTestRunner = (): UseTestRunnerReturn => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = useCallback(async (code: string, tests: string) => {
    setIsRunning(true);
    setResults([]);

    try {
      // Simple test runner implementation
      // In a real implementation, this would use a proper testing framework
      const testFunction = new Function('code', tests + '; return runTests;');
      const runner = testFunction(code);
      
      // Simulate test execution
      const mockResults: TestResult[] = [
        {
          name: 'Basic functionality test',
          status: Math.random() > 0.3 ? 'passed' : 'failed',
          message: Math.random() > 0.3 ? undefined : 'Expected true but got false',
          duration: Math.floor(Math.random() * 100) + 10
        },
        {
          name: 'Edge case handling',
          status: Math.random() > 0.5 ? 'passed' : 'failed',
          message: Math.random() > 0.5 ? undefined : 'Null pointer exception',
          duration: Math.floor(Math.random() * 50) + 5
        },
        {
          name: 'Performance test',
          status: Math.random() > 0.7 ? 'passed' : 'failed',
          message: Math.random() > 0.7 ? undefined : 'Execution time exceeded 1000ms',
          duration: Math.floor(Math.random() * 200) + 20
        }
      ];

      // Simulate async test execution
      for (let i = 0; i < mockResults.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setResults(prev => [...prev, mockResults[i]]);
      }

    } catch (error) {
      setResults([{
        name: 'Test execution',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 0
      }]);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isRunning,
    runTests,
    clearResults
  };
};
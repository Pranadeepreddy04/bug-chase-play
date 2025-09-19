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
      // Create a safe execution environment
      const executionEnvironment = {
        console: {
          log: (...args: any[]) => console.log('[Code Output]:', ...args)
        },
        setTimeout,
        clearTimeout,
        Math,
        Date,
        JSON,
        String,
        Number,
        Boolean,
        Array,
        Object
      };

      // Execute the user's code in a controlled environment
      const codeFunction = new Function(...Object.keys(executionEnvironment), code);
      const codeResult = codeFunction(...Object.values(executionEnvironment));

      // Parse and extract test functions from the test code
      const testMatches = tests.match(/function\s+(\w+)\s*\([^)]*\)\s*{[^}]*}/g) || [];
      const testResults: TestResult[] = [];

      for (const testMatch of testMatches) {
        const testNameMatch = testMatch.match(/function\s+(\w+)/);
        const testName = testNameMatch ? testNameMatch[1] : 'Unknown test';
        
        const startTime = performance.now();
        
        try {
          // Create test execution environment with access to the user's code
          const testEnvironment = {
            ...executionEnvironment,
            // Make code functions available to tests
            ...codeResult,
            // Simple assertion functions
            assert: (condition: boolean, message?: string) => {
              if (!condition) {
                throw new Error(message || 'Assertion failed');
              }
            },
            assertEqual: (actual: any, expected: any, message?: string) => {
              if (actual !== expected) {
                throw new Error(message || `Expected ${expected}, but got ${actual}`);
              }
            },
            assertTrue: (condition: boolean, message?: string) => {
              if (!condition) {
                throw new Error(message || 'Expected true');
              }
            },
            assertFalse: (condition: boolean, message?: string) => {
              if (condition) {
                throw new Error(message || 'Expected false');
              }
            }
          };

          // Execute the test function
          const testFunction = new Function(...Object.keys(testEnvironment), testMatch + `; return ${testName}();`);
          const result = testFunction(...Object.values(testEnvironment));
          
          const endTime = performance.now();
          const duration = Math.round(endTime - startTime);

          testResults.push({
            name: testName,
            status: 'passed',
            duration: duration
          });

          // Add some delay for visual effect
          await new Promise(resolve => setTimeout(resolve, 300));
          setResults(prev => [...prev, {
            name: testName,
            status: 'passed',
            duration: duration
          }]);

        } catch (error) {
          const endTime = performance.now();
          const duration = Math.round(endTime - startTime);
          
          const testResult = {
            name: testName,
            status: 'failed' as const,
            message: error instanceof Error ? error.message : 'Test execution failed',
            duration: duration
          };

          testResults.push(testResult);
          
          await new Promise(resolve => setTimeout(resolve, 300));
          setResults(prev => [...prev, testResult]);
        }
      }

      // If no test functions were found, show a message
      if (testMatches.length === 0) {
        setResults([{
          name: 'Test Discovery',
          status: 'error',
          message: 'No test functions found. Test functions should be named functions in the format: function testName() { ... }',
          duration: 0
        }]);
      }

    } catch (error) {
      setResults([{
        name: 'Code Execution',
        status: 'error',
        message: error instanceof Error ? error.message : 'Code execution failed',
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
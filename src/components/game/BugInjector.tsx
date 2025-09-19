import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, Zap } from 'lucide-react';

interface BugPattern {
  id: string;
  name: string;
  description: string;
  apply: (code: string) => string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface BugInjectorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  disabled?: boolean;
}

const bugPatterns: BugPattern[] = [
  {
    id: 'off-by-one',
    name: 'Off-by-One Error',
    description: 'Change < to <= or > to >= in loops or conditions',
    difficulty: 'easy',
    apply: (code: string) => {
      return code
        .replace(/for\s*\([^;]*;\s*(\w+)\s*<\s*([^;]+);/g, 'for ($1; $1 <= $2;')
        .replace(/if\s*\([^)]*\s*<\s*([^)]+)\)/g, 'if ($1 <= $2)')
        .replace(/while\s*\([^)]*\s*<\s*([^)]+)\)/g, 'while ($1 <= $2)');
    }
  },
  {
    id: 'null-check',
    name: 'Missing Null Check',
    description: 'Remove null/undefined checks',
    difficulty: 'medium',
    apply: (code: string) => {
      return code
        .replace(/if\s*\([^)]*!\s*=\s*null[^)]*\)\s*{[^}]*}/g, '')
        .replace(/if\s*\([^)]*!\s*=\s*undefined[^)]*\)\s*{[^}]*}/g, '')
        .replace(/&&\s*\w+\s*!\s*=\s*null/g, '');
    }
  },
  {
    id: 'type-coercion',
    name: 'Type Coercion Bug',
    description: 'Change === to == for subtle type comparison issues',
    difficulty: 'hard',
    apply: (code: string) => {
      return code.replace(/===/g, '==').replace(/!==/g, '!=');
    }
  },
  {
    id: 'array-bounds',
    name: 'Array Bounds Error',
    description: 'Change array access indices',
    difficulty: 'medium',
    apply: (code: string) => {
      return code
        .replace(/\[0\]/g, '[1]')
        .replace(/\.length\s*-\s*1/g, '.length')
        .replace(/\[i\]/g, '[i + 1]');
    }
  },
  {
    id: 'logical-operator',
    name: 'Logical Operator Mix-up',
    description: 'Change && to || or vice versa',
    difficulty: 'easy',
    apply: (code: string) => {
      return code.replace(/&&/g, '||').replace(/\|\|/g, '&&');
    }
  },
  {
    id: 'return-value',
    name: 'Wrong Return Value',
    description: 'Change return values subtly',
    difficulty: 'hard',
    apply: (code: string) => {
      return code
        .replace(/return\s+true/g, 'return false')
        .replace(/return\s+false/g, 'return true')
        .replace(/return\s+(\w+)/g, 'return !$1');
    }
  }
];

export const BugInjector = ({ code, onCodeChange, disabled = false }: BugInjectorProps) => {
  const [selectedBug, setSelectedBug] = useState<string | null>(null);
  const [appliedBugs, setAppliedBugs] = useState<string[]>([]);

  const applyBug = (pattern: BugPattern) => {
    const newCode = pattern.apply(code);
    onCodeChange(newCode);
    setAppliedBugs(prev => [...prev, pattern.id]);
    setSelectedBug(pattern.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="bg-gradient-card border-accent/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bug className="h-5 w-5 text-accent" />
          Bug Injection System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose a bug pattern to inject into the code. Make it subtle enough that existing tests won't catch it!
        </p>
        
        <div className="grid gap-3">
          {bugPatterns.map((pattern) => (
            <div 
              key={pattern.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedBug === pattern.id 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border bg-background/50 hover:border-accent/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{pattern.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getDifficultyColor(pattern.difficulty)}`}
                    >
                      {pattern.difficulty}
                    </Badge>
                    {appliedBugs.includes(pattern.id) && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                        Applied
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => applyBug(pattern)}
                  disabled={disabled || appliedBugs.includes(pattern.id)}
                  className="shrink-0"
                >
                  <Zap className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {appliedBugs.length > 0 && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning font-medium">
              🐛 {appliedBugs.length} bug pattern{appliedBugs.length > 1 ? 's' : ''} applied
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Good luck to the Tester catching these!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
import { Editor } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Save } from "lucide-react";

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  onRun?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  className?: string;
}

export const CodeEditor = ({ 
  title, 
  value, 
  onChange, 
  language = "javascript",
  readOnly = false,
  onRun,
  onReset,
  onSave,
  className 
}: CodeEditorProps) => {
  return (
    <Card className={`bg-gradient-card border-primary/20 shadow-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex gap-2">
            {onRun && (
              <Button size="sm" variant="outline" onClick={onRun} className="gap-2">
                <Play className="h-4 w-4" />
                Run
              </Button>
            )}
            {onSave && (
              <Button size="sm" variant="outline" onClick={onSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            )}
            {onReset && (
              <Button size="sm" variant="outline" onClick={onReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border border-border rounded-b-lg overflow-hidden">
          <Editor
            height="400px"
            language={language}
            value={value}
            onChange={(value) => onChange(value || "")}
            theme="vs-dark"
            options={{
              readOnly,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
              lineNumbers: 'on',
              roundedSelection: false,
              cursorBlinking: 'smooth',
              automaticLayout: true,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
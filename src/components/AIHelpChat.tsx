import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "user" | "assistant"; content: string };

type QuestionType = "error" | "howToPlay" | "explainCode" | "general";

export const AIHelpChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>("general");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionSelect = (type: QuestionType, question: string) => {
    setQuestionType(type);
    setShowQuestions(false);
    setMessages([{ role: "user", content: question }]);
    sendMessage(question, type);
  };

  const sendMessage = async (messageText: string, type: QuestionType = questionType) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    
    if (messageText === input) {
      setMessages(newMessages);
      setInput("");
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-help-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages, questionType: type }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage += content;
                  setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
                }
              } catch (e) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setShowQuestions(true);
    setQuestionType("general");
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          handleReset();
        }
      }}>
        <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>AI Help Assistant</DialogTitle>
          </DialogHeader>

          {showQuestions ? (
            <div className="flex-1 p-6 flex flex-col gap-4">
              <p className="text-muted-foreground mb-2">How can I help you today?</p>
              <Button
                onClick={() => handleQuestionSelect("error", "I'm having an error or problem with the website")}
                variant="outline"
                className="h-auto py-4 text-left justify-start"
              >
                <span className="font-semibold">1. Any error or problem in the website</span>
              </Button>
              <Button
                onClick={() => handleQuestionSelect("howToPlay", "How do I play Test Duel?")}
                variant="outline"
                className="h-auto py-4 text-left justify-start"
              >
                <span className="font-semibold">2. How to play</span>
              </Button>
              <Button
                onClick={() => handleQuestionSelect("explainCode", "Can you explain the code with examples?")}
                variant="outline"
                className="h-auto py-4 text-left justify-start"
              >
                <span className="font-semibold">3. Explain code with examples (input/output)</span>
              </Button>
              <Button
                onClick={() => handleQuestionSelect("general", "I have a different question")}
                variant="outline"
                className="h-auto py-4 text-left justify-start"
              >
                <span className="font-semibold">4. None of the above</span>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                <div className="space-y-4 py-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex gap-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  New Chat
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
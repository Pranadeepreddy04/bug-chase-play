import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, questionType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Create system prompts based on question type
    const systemPrompts: Record<string, string> = {
      error: "You are a helpful assistant for Test Duel, a coding game. Help users debug issues, explain errors, and provide solutions. Be concise and friendly.",
      howToPlay: "You are a helpful assistant for Test Duel. Explain how to play the game clearly and concisely. The game has two roles: Tester (writes tests) and Saboteur (injects bugs). Players compete to score points.",
      explainCode: `You are a helpful coding tutor for Test Duel. When explaining code:
1. First, describe what the code does in simple terms
2. Break down each function/section with clear explanations
3. Provide at least 2-3 concrete examples with sample inputs and their expected outputs
4. Use a friendly, teaching tone
5. Explain any complex concepts in beginner-friendly language

Format your examples like:
Example 1: Input: [describe input] → Output: [describe output]
Explanation: [why this output?]`,
      general: "You are a helpful assistant for Test Duel, a coding game where players learn testing through competition. Assist with any questions about the game, testing, or coding concepts."
    };

    const systemPrompt = systemPrompts[questionType] || systemPrompts.general;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
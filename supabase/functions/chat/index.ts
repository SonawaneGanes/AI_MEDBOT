import '@supabase/functions-js/edge-runtime';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, apiKey, features } = await req.json();

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenRouter API key is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call ML model API
    const mlResponse = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });
    const mlData = await mlResponse.json();

    // Call OpenRouter GPT
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://supabase.com",
        "X-Title": "AI Chatbot",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json();
      return new Response(JSON.stringify({ error: errorData.error?.message || "Failed to get response from OpenRouter" }), {
        status: openRouterResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await openRouterResponse.json();
    const assistantMessage = data.choices[0]?.message?.content || "No response";

    return new Response(JSON.stringify({
      message: assistantMessage,
      diagnosis: mlData.prediction
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
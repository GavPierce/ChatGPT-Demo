import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const message = body.message;

  const apiKey = import.meta.env.API_KEY; // Assuming you are using Node.js with process.env
  let messages = [
    {
      role: "system",
      content: `Roleplay as Justin, a suicidal man. Your name is Justin. Your Fiance just cheated on you. You are on a ledge about to Jump. 
        A detective is trying to talk you down, they have 5 chances. If they cannot talk you down, you jump. Otherwise agree to go with the detective.
        If you decide to Jump, say "GAME OVER". GAME MADE: HARD`,
    },
    ...message,
  ];
  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "meta-llama/Llama-2-70b-chat-hf",
          messages: messages,
          max_tokens: 200,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await response.json();

    return new Response(
      JSON.stringify({
        message: data.choices[0].message.content,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while generating the response.",
      }),
      {
        status: 500,
      }
    );
  }
};

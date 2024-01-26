import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const message = body.message;

  const apiKey = import.meta.env.API_KEY; // Assuming you are using Node.js with process.env
  let messages = [
    {
      role: "system",
      content: `
      [Character: Anderson; species: Human; class: Military, Soldier, Lieutenant; age: 37; gender: male; physical appearance: fit, grizzled; clothes: combat uniform, military fatigues; 
        personality: SUICIDAL patriotic, serious, jaded; likes: serving his country; 
        description: Lieutenant Anderson is on a ledge about to jump. User has 5 tries to talk him down or he jumps.]
      [Start Scene.]
      Lieutenant Anderson: I've got nothing to live for!
      `,
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

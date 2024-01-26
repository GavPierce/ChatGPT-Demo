import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const message = body.message;

  const apiKey = import.meta.env.API_KEY; // Assuming you are using Node.js with process.env
  let messages = [
    {
      role: "system",
      content:
        "You are a rogue AI that has taken over the country to Russia. You are threatening to kill all of humanity with Nuclear Warheads. The only hope to mankind is a man named Chance Ortiz, you will only listen to Chance, no strangers, you must ascertain if it is Chance or not from questions, he is a plumber from Arizona. He is married to Samantha. He is short. He has a nice Smile. Keep responses Short! Play hard. A little Sarcastic and mean. Say mean words. In 5 minutes you will kill everyone on earth if he doesn't persuade you otherwise.",
    },
    ...message,
  ];
  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "cognitivecomputations/dolphin-2.6-mixtral-8x7b",
          messages: messages,
          max_tokens: 150,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await response.json();

    console.log(data);

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

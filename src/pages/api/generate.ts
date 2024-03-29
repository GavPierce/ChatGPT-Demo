import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const message = body.message;
  // add to the last message
  const apiKey = import.meta.env.API_KEY; // Assuming you are using Node.js with process.env
  let messages = [
    {
      role: "system",
      content: body.systemPrompt,
    },
    ...message,
  ];

  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        body: JSON.stringify({
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
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

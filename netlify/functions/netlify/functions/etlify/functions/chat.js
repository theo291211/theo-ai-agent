exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please enter a message." })
      };
    }

    if (message.length > 10000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is too long." })
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("API key is not configured.");
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "system",
              content: "You are Theo AI, a helpful, friendly AI assistant."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter request failed:", response.status);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "The AI provider could not complete your request."
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No answer received."
      })
    };
  } catch (error) {
    console.error("Theo AI backend error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Theo AI could not respond. Please try again." })
    };
  }
};

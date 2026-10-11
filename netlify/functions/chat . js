
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://theo291211.github.io",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { message } = JSON.parse(event.body || "{}");

    if (typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "စာတစ်ခုခု ရိုက်ထည့်ပါ။" })
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("AI key is not configured");
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
              content: "You are Theo AI, a helpful and friendly assistant. Reply in Burmese when the user speaks Burmese."
            },
            { role: "user", content: message.trim() }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", response.status);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "AI ဝန်ဆောင်မှုကို ချိတ်ဆက်မရသေးပါ။" })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "အဖြေမရရှိသေးပါ။"
      })
    };
  } catch (error) {
    console.error("Theo AI error:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Theo AI ခဏအလုပ်မလုပ်နိုင်သေးပါ။" })
    };
  }
};

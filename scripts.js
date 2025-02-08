import OpenAI from "openai";

// Retrieve the API key from the environment (injected by webpack's dotenv plugin)
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true, });

// Function to call OpenAI with the prompt and return the response message.
async function getFilterValues(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [{ role: "user", content: prompt }],
        });
        // Log the full response for debugging.
        console.log("OpenAI full response:", completion);
        return completion.choices[0].message.content;
    }
    catch (error) {
        console.error("Error calling OpenAI:", error);
        return JSON.stringify({ salary: "60-120", distance: 10, experience: 3 });
    }
}

// given a user prompt return a json object with the filters
const getFilterJSON = async (prompt) => {
  try {
    // we can assign a system prompt to the chat completion and the insert the user prompt
    const completeion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      "messages": [
        {
          // need to adjust the system prompt to get exactly what we are looking for
          "role": "system",
          "content": "Extract job search filters from the provided job description and return ONLY a JSON object. No explanations or extra text."
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      "response_format": "json",
    });
    // Log the full response for debugging.
    console.log("OpenAI full response:", completeion);
    return completeion.choices[0].message.content;
  }
  catch (error) {
    console.error("Error calling OpenAI:", error);
    // return the default filters if the call fails
    return ({

    })
  }
};
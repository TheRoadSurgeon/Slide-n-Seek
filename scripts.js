import OpenAI from "openai";

// Retrieve the API key from the environment (injected by webpack's dotenv plugin)
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true, });

// current system prompt for getting what we need from the AI
const systemPrompt = `You are an expert job recruiter. You will be given a job description and you will return a JSON object with filters as described by this JSON:
{
  sortBy: "choose one: recent, relevant",
  datePosted: "choose one: any time, past month, past week, past 24 hours",
  experienceLevel: "choose any number (empty for none): internship, entry level, associate, mid senior level, director, executive",
  jobType: "choose any number (empty for none): full time, part time, contract, temporary, volunteer, internship",
  remote: "choose any number (empty for none): on site, hybrid, remote",
  easyApply: true or false,
  hasVerification: true or false,
  underTenApplicants: true or false,
  inYourNetwork: true or false,
  fairChanceEmployer: true or false,
  salary: "choose one (empty for no preference): $40,000+, $60,000+, $80,000+, $100,000+, $120,000+, $140,000+, $160,000+, $180,000+, $200,000+",
  benefits: "choose any number (empty for none): medical, vision, dental, 401k, pension, paid maternity leave, paid paternity leave, commuter benefits, student loan assistance, tuition assistance, disability",
  commitments: "choose any number (empty for none): career growth, diversity and inclusion, environmental sustainability, social impact, work life balance"
`

// Function to call OpenAI with the prompt and return the response message.
async function getFilterValues(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
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
export const getFilterJSON = async (prompt) => {
  try {
    // we can assign a system prompt to the chat completion and the insert the user prompt
    const completeion = await openai.chat.completions.create({
      model: "gpt-4o",
      store: true,
      "messages": [
        {
          // need to adjust the system prompt to get exactly what we are looking for
          "role": "system",
          "content": systemPrompt
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
import 'dotenv/config'

// Retrieve the API key from the environment (injected by webpack's dotenv plugin)
const key = process.env.OPENAI_API_KEY;

const url = 'https://api.openai.com/v1/chat/completions';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${key}`,
};

// current system prompt for getting what we need from the AI
const systemPrompt = `You are an expert job recruiter. You will be given a job description and you will return a JSON object with filters as described by this JSON:
{
  responseType: "accepted",
  jobTitle: "from the prompt extract the most relevant job title to search by for the user as a string",
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
}`

export const getFilterJSONrequest = async (prompt) => {
  const data = {
    "model": "gpt-4o",
    "store": true,
    "messages": [
      {
        "role": "system",
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": prompt
      }
    ],
    "response_format": {"type": "json_object"}
  }

  try {
    console.log("In Try block")
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    });
    console.log("OpenAI full response: ", response);
    const completion = await response.json();
    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Error calling OpenAI: ", error);
    // return the default filters if the call fails
    return ({
      "responseType": "error",
      "jobTitle": "Janitor",
      "sortBy": "recent",
      "datePosted": "anytime",
      "experienceLevel": [],
      "jobType": [],
      "remote": [],
      "easyApply": false,
      "hasVerification": false,
      "underTenApplicants": false,
      "inYourNetwork": false,
      "fairChanceEmployer": false,
      "salary": "",
      "benefits": [],
      "commitments": []
    })
  }
}

// test out the api call
let userPrompt = `I am a 3rd year CS student looking for software developer internships this summer, I want some pretty relevant job postings for entry level internships to gain experience in the work place. Benefits are not that important to me but I do want to be in an environment that harbors growth for its employees. I don't mind the job being remote but I work better in an in-person environment and would like some posting that make it easy for me to apply through linkedin, money is not a big factor for me as I am just looking for some experience.`
console.log(await getFilterJSONrequest(userPrompt));

// Retrieve the API key from the environment (injected by webpack's dotenv plugin)
const key = process.env.OPENAI_API_KEY;

const url = 'https://api.openai.com/v1/chat/completions';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${key}`,
};

// current system prompt for getting what we need from the AI
const systemPrompt = `You are an expert job recruiter. You will be given a job description and you will return a JSON object with filters as described by this JSON, these are optional JSON keys, only include the ones that are relevant to the user's desires:
{
  responseType: "accepted",
  jobTitle: "from the prompt extract the most relevant job title to search by for the user as a string",
  location: "from the prompt extract a location the user specifies if possible",
  sortBy: "choose one: recent, relevant",
  datePosted: "choose one: any time, past month, past week, past 24 hours",
  experienceLevel: "choose any number (empty for none): internship, entry level, associate, mid senior level, director, executive",
  jobType: "choose any number (empty for none): full time, part time, contract, temporary, volunteer, internship",
  jobEnvironment: "choose any number (empty for none): on site, hybrid, remote",
  isEasyApply: true or false,
  hasVerification: true or false,
  isUnderTenApplicants: true or false,
  isInYourNetwork: true or false,
  isFairChanceEmployer: true or false,
  student loan assistance, tuition assistance, disability",
}`

const generateURLPrompt = `
LinkedIn's search functionality allows users to refine their queries using various URL parameters. These parameters can be combined to create specific searches for jobs, people, companies, and more. Here's an overview of commonly used LinkedIn URL parameters:

Common LinkedIn URL Parameters
keywords: Specifies the main search terms.

Example: keywords=software%20engineer searches for "software engineer".
location: Defines the geographic area for the search.

Example: location=New%20York%2C%20NY targets New York, NY.
f_WT: Filters by workplace type.

Values:
1: On-site
2: Remote
3: Hybrid
Example: f_WT=2 filters for remote positions.
f_E: Filters by experience level.

Values:
1: Internship
2: Entry-level
3: Associate
4: Mid-senior level
5: Director
6: Executive
Example: f_E=2 filters for entry-level positions.
f_JT: Filters by job type.

Values:
F: Full-time
P: Part-time
C: Contract
T: Temporary
V: Volunteer
I: Internship
O: Other
Example: f_JT=F filters for full-time positions.
f_I: Filters by industry.

Values: Industry codes (e.g., 4 for Accounting, 96 for Computer Software).
Example: f_I=96 filters for the computer software industry.
f_C: Filters by company.
Values: Company IDs.
Example: f_C=123456 filters for a specific company by its ID.
f_TPR: Filters by date posted.

Values:
r259200: Past 3 days
r604800: Past week
r1209600: Past 2 weeks
r2592000: Past month
Example: f_TPR=r604800 filters for jobs posted in the past week.
f_LF: Filters by LinkedIn features.

Values:
f_AL: Under 10 applicants
f_WT: Easy Apply
f_SB2: In Your Network
Example: f_LF=f_AL filters for jobs with under 10 applicants.
f_PP: Filters by company size.

Values:
1: 1-10 employees
2: 11-50 employees
3: 51-200 employees
4: 201-500 employees
5: 501-1,000 employees
6: 1,001-5,000 employees
7: 5,001-10,000 employees
8: 10,001+ employees
Example: f_PP=3 filters for companies with 51-200 employees.
f_CF: Filters by company funding.

Values:
1: Seed
2: Series A
3: Series B
4: Series C+
5: Public
Example: f_CF=2 filters for companies with Series A funding.
f_CR: Filters by company revenue.

Values:
1: <$1M
2: $1M-$10M
3: $10M-$50M
4: $50M-$100M
5: $100M-$500M

Generate a job search url for the user given their needs, and ONLY return a URL.
`

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
      "jobEnvironment": [],
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

export const getFilteredURL = async (userFilters) => {
  const data = {
    "model": "gpt-4o",
    "store": true,
    "messages": [
      {
        "role": "system",
        "content": generateURLPrompt
      },
      {
        "role": "user",
        "content": `Generated Filters: ${userFilters}`
      }
    ]
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
    console.log("OpenAI completion: ", completion);
    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Error calling OpenAI: ", error);
    // return the default filters if the call fails
    return;
  }
}

// test out the api call
// let userPrompt = `I am a 3rd year CS student looking for software developer internships this summer, I want some pretty relevant job postings for entry level internships to gain experience in the work place. Benefits are not that important to me but I do want to be in an environment that harbors growth for its employees. I don't mind the job being remote but I work better in an in-person environment and would like some posting that make it easy for me to apply through linkedin, money is not a big factor for me as I am just looking for some experience.`
// console.log(await getFilterJSONrequest(userPrompt));

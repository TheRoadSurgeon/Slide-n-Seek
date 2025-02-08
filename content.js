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

// Initializes the UI on the LinkedIn jobs page.
function initSlideNSeek() {
    const container = document.createElement("div");
    container.id = "slide-n-seek-container";
    Object.assign(container.style, {
        position: "fixed",
        top: "50px",
        right: "20px",
        width: "300px",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: "10000",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
    });
    container.innerHTML = `<h3 style="margin-top:0;">Slide-n-Seek Filters</h3>`;

    // Chatbot-like input for the dream job description.
    const chatWrapper = document.createElement("div");
    chatWrapper.style.marginBottom = "10px";
    chatWrapper.innerHTML = `
        <label for="chat-input">Describe your dream job:</label>
        <input type="text" id="chat-input" placeholder="e.g., Remote Senior Software Engineer" style="width: 100%; padding: 5px; margin-top: 5px;" />
        <button id="chat-button" style="margin-top: 5px; padding: 5px 10px;">Customize Filters</button>
    `;
    container.appendChild(chatWrapper);

    // Helper: Create a slider element with a label and a live value display.
    function createSlider(labelText, min, max, defaultValue, name) {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.display = "block";
        label.style.marginBottom = "5px";
        wrapper.appendChild(label);

        const input = document.createElement("input");
        input.type = "range";
        input.min = min;
        input.max = max;
        input.value = defaultValue;
        input.name = name;
        input.style.width = "100%";
        wrapper.appendChild(input);

        const valueDisplay = document.createElement("span");
        valueDisplay.textContent = defaultValue;
        valueDisplay.style.float = "right";
        valueDisplay.style.fontSize = "12px";
        wrapper.appendChild(valueDisplay);

        input.addEventListener("input", () => {
            valueDisplay.textContent = input.value;
            applyFilters();
        });

        return wrapper;
    }

    // Create three demo sliders: Salary, Distance, Experience.
    const salarySlider = createSlider("Salary ($K)", 30, 200, 60, "salary");
    const distanceSlider = createSlider("Distance (miles)", 0, 100, 10, "distance");
    const experienceSlider = createSlider("Experience Level", 0, 10, 3, "experience");

    container.appendChild(salarySlider);
    container.appendChild(distanceSlider);
    container.appendChild(experienceSlider);
    document.body.appendChild(container);

    // When the user clicks the button, call OpenAI and update sliders.
    document.getElementById("chat-button").addEventListener("click", async () => {
        const dreamJob = document.getElementById("chat-input").value;
        if (!dreamJob) return;
        const prompt = `Based on the dream job description: "${dreamJob}", recommend filter values for a LinkedIn job search. Return a JSON object with keys "salary", "distance", and "experience". For salary, provide a range as "min-max" in thousands (e.g., "60-120"). For distance, provide a number (in miles), and for experience, provide a number between 0 and 10.`;
        const responseMessage = await getFilterValues(prompt);
        console.log("OpenAI returned message:", responseMessage);
        try {
            const filters = JSON.parse(responseMessage);
            updateSliders(filters);
        }
        catch (e) {
            console.error("Error parsing OpenAI response:", e);
            updateSliders({ salary: "60-120", distance: 10, experience: 3 });
        }
    });
}

// Updates slider values based on the filter recommendations.
function updateSliders(filters) {
    if (filters.salary) {
        const [minSalary] = filters.salary.split("-").map((s) => parseInt(s.trim()));
        const salaryInput = document.querySelector('input[name="salary"]');
        if (salaryInput) {
            salaryInput.value = minSalary;
            salaryInput.dispatchEvent(new Event("input"));
        }
    }
    if (filters.distance) {
        const distanceInput = document.querySelector('input[name="distance"]');
        if (distanceInput) {
            distanceInput.value = filters.distance;
            distanceInput.dispatchEvent(new Event("input"));
        }
    }
    if (filters.experience) {
        const experienceInput = document.querySelector('input[name="experience"]');
        if (experienceInput) {
            experienceInput.value = filters.experience;
            experienceInput.dispatchEvent(new Event("input"));
        }
    }
}

// Placeholder function for applying the filters (to be integrated with LinkedIn's job listings).
function applyFilters() {
    const salaryVal = document.querySelector('input[name="salary"]').value;
    const distanceVal = document.querySelector('input[name="distance"]').value;
    const experienceVal = document.querySelector('input[name="experience"]').value;
    console.log("Current Filters:", {
        salary: salaryVal,
        distance: distanceVal,
        experience: experienceVal,
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlideNSeek);
} else {
    initSlideNSeek();
}

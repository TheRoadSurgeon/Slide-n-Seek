// popup.js
import { getFilterJSONrequest } from "./scripts.js";

document.addEventListener("DOMContentLoaded", function () {
    const customizeFilterButton = document.getElementById("chat-button");
    const feedback = document.getElementById("feedback");
    console.log("[Popup] DOMContentLoaded - Popup is ready");

    customizeFilterButton.addEventListener("click", async function () {
        console.log("[Popup] CustomizeFilterButton clicked");
        const userPrompt = document.getElementById("chat-input").value;
        if (!userPrompt) {
            feedback.textContent = "I need a prompt before I generate your filters... :)";
            feedback.style.color = "#B22222";
            console.warn("[Popup] No prompt provided");
            return;
        }

        feedback.style.color = "#222";
        feedback.textContent = "Working on those filters for you... :)";
        console.log("User prompt:", userPrompt);

        try {
            // 1) Call OpenAI to get filters (returns a JSON string)
            const aiFiltersRaw = await getFilterJSONrequest(userPrompt);
            console.log("[Popup] Raw AI Filters (string):", aiFiltersRaw);

            // 2) Parse the string into an object
            let aiFilters;
            try {
                aiFilters = JSON.parse(aiFiltersRaw);
            } catch (parseErr) {
                console.error("[Popup] Error parsing AI Filters:", parseErr);
                aiFilters = {
                    responseType: "error",
                    jobTitle: "Janitor",
                    sortBy: "recent",
                    datePosted: "anytime",
                    experienceLevel: [],
                    jobType: [],
                    remote: [],
                    easyApply: false,
                    hasVerification: false,
                    underTenApplicants: false,
                    inYourNetwork: false,
                    fairChanceEmployer: false,
                    salary: "",
                    benefits: [],
                    commitments: [],
                };
            }

            console.log("[Popup] Parsed AI Filters (object):", aiFilters);

            // 3) Build your redirect URL
            // Use a ternary to convert 'recent' -> 'DD', 'relevant' -> 'R'
            // Also, encode the job title in case it has spaces
            const sortByValue = (aiFilters.sortBy === "recent") ? "DD" : "R";
            const jobTitleEncoded = encodeURIComponent(aiFilters.jobTitle || "");
            
            let redirectURL = `https://www.linkedin.com/jobs/search/?keywords=${jobTitleEncoded}&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&sortBy=${sortByValue}`;

            console.log("[Popup] Navigating to:", redirectURL);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.update(tabs[0].id, { url: redirectURL });
            });

            feedback.textContent = "Filters applied!";
        } catch (error) {
            console.error("Error getting AI filters:", error);
            feedback.textContent = "Oops! Something went wrong applying your filters.";
        }
    });
});

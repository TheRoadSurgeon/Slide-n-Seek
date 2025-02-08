// popup.js
import { getFilterJSONrequest, getFilteredURL } from "./scripts.js";

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
            // 1) Call OpenAI to get filters
            const aiURL = await getFilteredURL(userPrompt);
            console.log("AI URL:", aiURL);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.update(tabs[0].id, { url: aiURL });
            });

            feedback.textContent = "Filters applied!";
        } catch (error) {
            console.error("Error getting AI filters:", error);
            feedback.textContent = "Oops! Something went wrong applying your filters.";
        }
    });
});

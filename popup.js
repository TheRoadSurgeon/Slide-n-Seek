import { getFilterJSON } from "./scripts.js";

document.addEventListener("DOMContentLoaded", function () {
    const customizeFilterButton = document.getElementById("chat-button");

    customizeFilterButton.addEventListener("click", function () {
        const userPrompt = document.getElementById("chat-input").value;
        startChainOfEvents(userPrompt);
    });
});

const startChainOfEvents = (userPrompt) => {
    const feedback = document.getElementById("feedback");
    if (userPrompt == "") {
        feedback.textContent = "I need a prompt before I generate your filters... :)";
        feedback.style.color = "#B22222"
        return;
    } 
    feedback.style.color = "#222"
    feedback.textContent = "Working on those filters for you... :)";
    console.log(userPrompt);
};


function clickAllFiltersButton() {
    // We can query by class or id
    // 1) By class (but note that LinkedIn often changes classes):
    const allFiltersBtnByClass = document.querySelector(
      "button.search-reusables__all-filters-pill-button"
    );
}
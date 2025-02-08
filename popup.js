import { getFilterJSONrequest } from "./scripts.js";

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
    clickAllFiltersButton();
};

function applyFiltersFromAI(aiFilters) {
    console.log("Applying AI filters:", aiFilters);
  
    // 1) First, open the “All Filters” panel
    clickAllFiltersButton();
  
    // 2) Sort By
    if (aiFilters.sortBy) {
      applySortByFromAI(aiFilters.sortBy);
    }
  
    // 3) Then datePosted, experienceLevel, etc.
    // if (aiFilters.datePosted) { ... }
    // if (aiFilters.experienceLevel) { ... }
    // ...
  }
function applySortByFromAI(aiValue) {
    // The AI might return "recent" or "relevant"
    let radioValue;
  
    // Convert AI string to LinkedIn's required radio value
    if (aiValue.toLowerCase() === "recent") {
      radioValue = "DD";
    } else if (aiValue.toLowerCase() === "relevant") {
      radioValue = "R";
    } else {
      console.warn(`Unknown sortBy value from AI: "${aiValue}"`);
      return; // or fallback to some default
    }
  
    // Now call your existing setSortBy
    setSortBy(radioValue);
  }
  

function clickAllFiltersButton() {
    // 1) Try by ID (the one you found in DevTools)
    const btnById = document.getElementById("ember138");
    if (btnById) {
      btnById.click();
      console.log("Clicked All Filters button by ID: ember138");
      return;
    }
    else{
        console.warn("Could not find All Filters button by ID or class!");
    }
  
    
  }

  function setSortBy(value) {
    // value = "DD" (Most recent) or "R" (Most relevant)
    const selector = `input[name="sort-by-filter-value"][value="${value}"]`;
    const radio = document.querySelector(selector);
  
    if (!radio) {
      console.warn(`Could not find sort-by radio with value="${value}"`);
      return;
    }
  
    // Click the radio
    radio.click();
    // Dispatch a change event so LinkedIn recognizes the update
    radio.dispatchEvent(new Event("change", { bubbles: true }));
    console.log(`Sort By set to "${value === "DD" ? "Most recent" : "Most relevant"}"`);
  }
  
  // Example usage:
  // setSortBy("DD"); // Sets "Most recent"
  // setSortBy("R");  // Sets "Most relevant"
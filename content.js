// content.js

console.log("[Content Script] Slide-n-Seek loaded.");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[Content Script] onMessage received:", request);
    if (request.type === "APPLY_FILTERS") {
        console.log("Received filters from popup:", request.filters);
        applyFiltersFromAI(request.filters);
        // send a response back if you want
        sendResponse({ success: true, message: "Filters attempted" });
    }
});

// A function to apply all the filter logic from the AI
function applyFiltersFromAI(aiFilters) {
    console.log("Applying AI filters:", aiFilters);

    // 1) Open the "All Filters" panel
    clickAllFiltersButton();

    // 2) Sort By
    if (aiFilters.sortBy) {
        console.log("[Content Script] sortBy from AI:", aiFilters.sortBy);
        applySortByFromAI(aiFilters.sortBy);
    }
    else {
        console.log("[Content Script] No sortBy provided by AI filters");
    }

  // Then similarly if you want to apply datePosted, experienceLevel, etc...
  // if (aiFilters.datePosted) { ... }
  // ...
}

// Example: sort by "recent" or "relevant"
function applySortByFromAI(aiValue) {
    console.log(`[Content Script] applySortByFromAI received: "${aiValue}"`);
  // The AI might return "recent" or "relevant"
    let radioValue;

    if (aiValue.toLowerCase() === "recent") {
        radioValue = "DD";  // LinkedIn's code for "Most recent"
    } else if (aiValue.toLowerCase() === "relevant") {
        radioValue = "R";   // LinkedIn's code for "Most relevant"
    } else {
        console.warn(`Unknown sortBy value from AI: "${aiValue}"`);
        return; 
    }

    setSortBy(radioValue);
}

function clickAllFiltersButton() {
    console.log("[Content Script] Attempting to find 'All Filters' button by ID=ember138");
    // Attempt by ID first
    const btnById = document.getElementById("ember138");
    if (btnById) {
        btnById.click();
        console.log("Clicked All Filters button by ID: ember138");
    } else {
        console.warn("Could not find All Filters button!");
    }
}

function setSortBy(value) {
    // value = "DD" (Most recent) or "R" (Most relevant)
    console.log(`[Content Script] setSortBy called with value "${value}"`);
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

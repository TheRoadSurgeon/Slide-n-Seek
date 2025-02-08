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
        return;
    } 

    feedback.textContent = "Working on those filters for you... :)";
    console.log(userPrompt);

    
};

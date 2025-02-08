document.addEventListener("DOMContentLoaded", function () {
    const enableCheckbox = document.getElementById("enableExtension");
    chrome.storage.sync.get(["enabled"], function (result) {
        enableCheckbox.checked = result.enabled !== false;
    });
    enableCheckbox.addEventListener("change", function () {
        chrome.storage.sync.set({ enabled: enableCheckbox.checked }, function () {
            console.log("Slide-n-Seek enabled:", enableCheckbox.checked);
        });
    });
});

//This content script is injected into every page.
chrome.storage.local.get(["cooldown_date", "pause"], function (items) {

    if (items.cooldown_date || items.pause)
        return;

    chrome.storage.sync.get("blacklist_array", function (items) {

        for (let i = 0; i < items.blacklist_array.length; i++) { //TODO better way of checking
            if (location.href.includes(items.blacklist_array[i])) {
                showQuestion();
                return;
            }
        }
    });
});

function showQuestion() {
    alert("i want to die");

    chrome.storage.sync.get("cooldown_duration", function (items) {
        chrome.storage.local.set({ "cooldown_date": [new Date()] }, function () {
            setTimeout(coolDone, items.cooldown_duration);
        });
    });

}

function coolDone() {
    chrome.storage.local.remove("cooldown_date");
    alert("Cooldown over");
}
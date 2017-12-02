// alert("this was injected into " + window.location.href); //chrome.tabs?.


// alerts the user if they are visiting a blacklisted site
chrome.tabs.onUpdated.addListener(checkURL);

function checkURL(tabId, changeInfo, tab) {

    if (!changeInfo.url)
        return;

    chrome.storage.sync.get("blacklist_array", function (items) {

        for (let i = 0; i < items.blacklist_array.length; i++)
            if (changeInfo.url.includes(items.blacklist_array[i])) {
                chrome.tabs.executeScript(tabId, {
                    file: "/ext/js/app.js",
                    runAt: "document_start"
                }, function () {
                    let d = new Date();
                    console.log("Mind Matter"
                        + d.getHours() + ":" + d.getMinutes
                        + ": code injected");
                });
            }
    });

}
alert("You are on a blacklisted site.");


chrome.storage.sync.get("blacklist_duration", function(items) {

    chrome.tabs.onUpdated.removeListener(checkURL);
    setTimeout(checkURL, items.blacklist_duration);
});

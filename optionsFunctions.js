function addToBlacklist() {
    chrome.storage.sync.get("blacklist_array", function (items) {
        items.blacklist_array.push("the stuff from the field");
    });
}
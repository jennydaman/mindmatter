chrome.storage.sync.get("blacklist_array", function (items) {
    document.getElementById("dirty-blacklist").innerHTML = "<b>Blacklisted Sites:</b> <code>" + items.blacklist_array.toString() + "</code>";
});

document.querySelector('#go-to-options').addEventListener("click", function () {
    
    if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
    } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('/src/dist/options.html'));
    }
});

chrome.storage.sync.get("blacklist_array", function (items) {
    document.getElementById("dirty-blacklist").innerHTML = "Dirty blacklist: <code>" + items.blacklist_array.toString() + "</code>";
});
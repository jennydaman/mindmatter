chrome.storage.sync.get("blacklist_array", function (items) {

    if (!items.blacklist_array[0]) 
        items.blacklist_array[0] = "none";
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += ", " + items.blacklist_array[i];
    document.getElementById("dirty-blacklist").innerHTML = str + ']';
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

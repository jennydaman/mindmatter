chrome.storage.sync.get(["blacklist_array", "blacklistRegex"], function (items) {

    if (!items.blacklist_array[0]) 
        items.blacklist_array[0] = "none";
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += ", " + items.blacklist_array[i];
    document.getElementById("dirty-blacklist").innerHTML = str + ']';
    document.getElementById("dirty-blacklistRegex").innerHTML = items.blacklistRegex;
});

document.querySelector('#go-to-options').addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
});

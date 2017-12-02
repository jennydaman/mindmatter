chrome.storage.sync.get(["blacklist_array", "blacklistRegex", "cooldown_duration"], function (items) {

    if (!items.blacklist_array[0]) 
        items.blacklist_array[0] = "none";
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += ", " + items.blacklist_array[i];
    document.getElementById("dirty-blacklist").innerText = str + ']';
    //document.getElementById("dirty-blacklistRegex").innerText = items.blacklistRegex;
    document.getElementById("dirty-coold").innerText = items.cooldown_duration;
});

document.querySelector('#go-to-options').addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
});

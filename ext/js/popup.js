chrome.storage.sync.get(["blacklist_array", "cooldown_duration"], function (items) {

    if (!items.blacklist_array[0])
        items.blacklist_array[0] = "none";
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += ", " + items.blacklist_array[i];
    document.getElementById("dirty-blacklist").innerText = str + ']';
    document.getElementById("dirty-coold").innerText = items.cooldown_duration;

});

chrome.storage.local.get(["cooldown_date", "pause"], function (items) {

    document.getElementById("extra").innerText = "cooldown_date" + items.cooldown_date
        + "\npause: " + items.pause;
});

document.querySelector('#go-to-options').addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
});

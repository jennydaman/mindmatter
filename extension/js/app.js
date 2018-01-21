
// if the site is blacklisted, trigger question
chrome.storage.local.get(['cooldown_lock', 'pause'], function (items) {

    //check that setting is active
    if (items.cooldown_lock || items.pause)
        return;

    chrome.storage.sync.get('blacklist_array', function (items) {
        //check that site is blacklisted
        let blacklistedURL = items.blacklist_array.find((bl_keyword) => {
            return location.href.includes(bl_keyword);
        });
        if (!blacklistedURL)
            return;

        chrome.storage.local.set({ trigger: location.href }, function () {
            window.location.replace(chrome.runtime.getURL("/ui/question/index.html"));
        });
    });
});

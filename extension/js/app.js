
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

        /*
         * HACK
         * 
         * window.location.replace(chrome.runtime.getURL("page.html")) but that routes to about:blank
         * [11858:11858:0120/175008.729953:ERROR:navigation_entry_screenshot_manager.cc(135)] Invalid entry with unique id: 15
         */
        chrome.runtime.sendMessage({triggerURL: window.location});
    });
});

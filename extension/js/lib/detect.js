/**
 * 
 * @param {array} cooldown_lock 
 * @param {boolean} pause 
 */
export default function checkSite(cooldown_lock, pause) {

    //check that setting is active
    if (cooldown_lock || pause)
        return;

    chrome.storage.sync.get('blacklist_array', function (items) {

        //check that site is blacklisted
        let blacklistedURL = items.blacklist_array.find((bl_keyword) => {
            return window.location.href.includes(bl_keyword);
        });
        if (!blacklistedURL)
            return;

        chrome.storage.local.set({ trigger: window.location.href }, function () {
            window.location.replace(chrome.runtime.getURL('/ui/question/index.html'));
        });
    });
}

// if the site is blacklisted, trigger question
chrome.storage.local.get(['cooldown_lock', 'pause'], 
    items => checkSite(items.cooldown_lock, items.pause));

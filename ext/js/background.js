//set up on install
chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.local.clear();
    chrome.storage.local.set({ pause: false });

    chrome.storage.sync.get('setup', function (items) {

        if (items.setup)
            return; //extension already initialized

        chrome.storage.sync.set({
            blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
            cooldown_duration: '300000',
            cooldown_english: '5 minutes'
            //setup: true this will prevent initial set up from running.
        });

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://jennydaman.github.io/mindmatter/subjectsDB.json', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE)
                chrome.storage.sync.set({ question_index: JSON.parse(xhr.responseText) });
        };
        xhr.send();

        chrome.runtime.openOptionsPage(function () {

            chrome.permissions.contains({
                permissions: ['notifications']
            }, function (result) {

                let message = 'Thanks for installing Mind Matter! Here are the settings. Be sure to review the blacklist.';
                if (result) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: '/assets/brain-in-pot128.png',
                        title: 'Mind Matter: First Install',
                        message: message
                    });
                }
                else
                    alert(message);
            });
        });
    });
});

//set the cooldown timer
chrome.storage.onChanged.addListener(function (changes) {
    if (changes.cooldown_lock && changes.cooldown_lock.newValue) {

        chrome.storage.sync.get(['cooldown_english', 'cooldown_duration'], function (items) {

            chrome.permissions.contains({ permissions: ['notifications'] }, function (result) {
                if (result) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: '/assets/brain-in-pot128.png',
                        title: 'Mind Matter: Cooldown',
                        message: `You are correct! I'll leave you alone for ${items.cooldown_english}.`
                    });
                }
            });

            setTimeout(coolDone, items.cooldown_duration);
        });
    }
});

//called when cooldown is over.
function coolDone() {
    chrome.storage.local.remove('cooldown_lock');
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '/assets/brain-in-pot128.png',
        title: 'Mind Matter: Ready',
        message: 'This extension has come off cooldown. It will be activated by the next blacklisted site.'
    });
    chrome.runtime.sendMessage({ cooldown: 'done' });
}

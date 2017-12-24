//set up on install
chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.local.clear();
    chrome.storage.local.set({ pause: false });

    chrome.storage.sync.get('setup', function (items) {

        if (items.setup)
            return; //extension already initialized

        //TODO retrieve default blacklist from remote
        chrome.storage.sync.set({
            blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
            cooldown_info: {
                duration: 300000,
                english: '5 minutes'
            },
            consistency: {
                total: 0,
                score: 0
            }
            //setup: true this will prevent initial set up from running.
        });

        retrieveQI();

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

var cooldown_timeout;

//set the cooldown timer
chrome.storage.onChanged.addListener(function (changes) {

    if (changes.cooldown_lock) {

        if (changes.cooldown_lock.newValue) { //cooldown_lock is set
            chrome.storage.sync.get('cooldown_info', function (items) {

                chrome.permissions.contains({ permissions: ['notifications'] }, function (result) {
                    if (result) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: '/assets/brain-in-pot128.png',
                            title: 'Mind Matter: Cooldown',
                            message: `You are correct! I'll leave you alone for ${items.cooldown_info.english}.`
                        });
                    }
                });
                cooldown_timeout = setTimeout(coolDone, items.cooldown_info.duration);
            });
        }
        else //cooldown is off, stop countdown
            clearTimeout(cooldown_timeout);
    }
});

//called when cooldown is over.
function coolDone() {
    chrome.storage.local.remove('cooldown_lock');
    chrome.permissions.contains({
        permissions: ['notifications']
    }, function (result) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '/assets/brain-in-pot128.png',
            title: 'Mind Matter: Ready',
            message: 'This extension has come off cooldown. It will be activated by the next blacklisted site.'
        });
    });
}

var refreshTimer;
chrome.runtime.onStartup.addListener(function () {
    retrieveQI(); //refresh question_index on startup
    refreshTimer = setInterval(retrieveQI, 6.048e8); //refresh once a week
});

chrome.runtime.onSuspend.addListener(function () {
    clearInterval(refreshTimer);
    chrome.storage.local.remove('cooldown_lock');
});

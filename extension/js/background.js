import notif from './util/notif.js';
import refreshSubjects from './util/subjects.js';
chrome.runtime.onInstalled.addListener(
    (details, getSubjects = refreshSubjects, callback = chrome.runtime.openOptionsPage) => {

        /* if (details.reason === 'update')
            return; */
        chrome.storage.local.clear();
        chrome.storage.local.set({ pause: false });

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
        });

        getSubjects().catch(error => {

            let msg = 'Could not initialize the subjects index!'
                + 'If this problem is unrelated to Internet issues, please report a bug.\n'
                + error;
            notif('Mind Matter', msg).catch(function () {
                alert(msg);
            });
        }).finally(function () {

            chrome.storage.local.set(
                {
                    options_message: {
                        text: 'Thanks for installing Mind Matter! '
                            + 'This is the options page, please have a look around.',
                        once: true
                    }
                }, callback);
        });
    });

var refreshTimer;
chrome.runtime.onStartup.addListener(function () {
    refreshSubjects();
    refreshTimer = setInterval(refreshSubjects, 6.048e8); //refresh once a week
});
chrome.runtime.onSuspend.addListener(function () {
    clearInterval(refreshTimer);
    chrome.storage.local.remove('cooldown_lock');
});

//set the cooldown timer
var cooldown_timeout;
// listen for when singleton page becomes active
var questionSingleton = null;
var siteQueue = null; // cache site queue in background page memory

chrome.storage.onChanged.addListener(function (changes) {

    if (changes.cooldown_lock) {

        if (changes.cooldown_lock.newValue) { //cooldown_lock is set
            chrome.storage.sync.get('cooldown_info', items => {

                // set the cooldown timer
                cooldown_timeout = setTimeout(coolDone, items.cooldown_info.duration);

                // clear singleton page lock and site queue cache
                questionSingleton = null;
                siteQueue = null;

                notif('Mind Matter', `You are correct! I'll leave you alone for ${items.cooldown_info.english}.`);
            });
        }
        else //cooldown is off, stop countdown
            clearTimeout(cooldown_timeout);
    }
});

//called when cooldown is over.
function coolDone() {
    chrome.storage.local.remove('cooldown_lock');
    notif('Ready', 'Mind Matter has come off cooldown. It will be activated by the next blacklisted site.');
}

// clear singleton lock if question page is closed 
chrome.tabs.onRemoved.addListener(function (tabID) {
    if (tabID === questionSingleton) {
        questionSingleton = null;
        siteQueue = null;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (!request.trigger)
        return;

    switch (questionSingleton) {
        case null:                              // MessageSender is first instance of question page
            questionSingleton = sender.tab.id;  // create lock
            siteQueue = [request.trigger];
        // falls through
        case sender.tab.id:                     // MessageSender is the singleton, user might have refreshed page
            sendResponse({ siteQueue: siteQueue });
            break;
        default: // is an additional tab
            siteQueue.push(request.trigger);    // add site to cache
            chrome.tabs.remove(sender.tab.id);  // close the MessageSender
    }
});

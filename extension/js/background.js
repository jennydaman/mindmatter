import * as subjects from './helper/subjects.js';
import notif from './helper/notif.js';

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
        subjects.pull().then(freshSubjects => {
            subjects.store(freshSubjects);
            var refreshTimer;
            chrome.runtime.onStartup.addListener(function () {
                subjects.update(); //refresh indexStructure on startup
                refreshTimer = setInterval(subjects.update, 6.048e8); //refresh once a week
            });
            chrome.runtime.onSuspend.addListener(function () {
                clearInterval(refreshTimer);
                chrome.storage.local.remove('cooldown_lock');
            });
        }, function (error) {
            let msg = 'Could not initialize the subjects index! If this problem is unrelated to Internet issues, please report a bug.';
            notif('Mind Matter', msg).catch(function () {
                alert(msg);
            });
            console.log(error);
        }).finally(function () {
            chrome.storage.local.set(
                {
                    options_message: {
                        text: 'Thanks for installing Mind Matter! This is the options page, please have a look around.',
                        once: true
                    }
                },
                function () {
                    chrome.runtime.openOptionsPage();
                });
        });
    });
});

//set the cooldown timer
var cooldown_timeout;
// listen for when singleton page becomes active
var singletonID;

chrome.storage.onChanged.addListener(function (changes) {

    if (changes.cooldown_lock) {

        if (changes.cooldown_lock.newValue) { //cooldown_lock is set
            chrome.storage.sync.get('cooldown_info', function (items) {
                cooldown_timeout = setTimeout(coolDone, items.cooldown_info.duration);
                notif('Correct', `You are correct! I'll leave you alone for ${items.cooldown_info.english}.`);
            });
        }
        else //cooldown is off, stop countdown
            clearTimeout(cooldown_timeout);
    }
    else if (changes.singleton)
        singletonID = changes.singleton.newValue;
});

//called when cooldown is over.
function coolDone() {
    chrome.storage.local.remove('cooldown_lock');
    notif('Ready', 'Mind Matter has come off cooldown. It will be activated by the next blacklisted site.');
}

chrome.tabs.onRemoved.addListener(function(tabID) {
    if (tabID === singletonID)
        chrome.storage.local.remove(['singleton', 'siteQueue']);
});


chrome.runtime.onSuspend.addListener(function () {
    chrome.storage.local.remove(['singleton', 'siteQueue', 'cooldown_lock']);
});
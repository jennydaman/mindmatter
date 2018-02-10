import notif from '../util/notif.js';

/**
 * @param {*} details 
 * @param {*} defaultSettings 
 * @param {function} getSubjects 
 * @param {function} callback 
 */
export function init(details, defaultSettings, getSubjects, callback = chrome.runtime.openOptionsPage) {

    /* if (details.reason === 'update')
        return; */

    if (!defaultSettings || !getSubjects)
        throw new Error('init requires at least three parameters.');
    chrome.storage.local.clear();
    chrome.storage.local.set({ pause: false });

    chrome.storage.sync.set(defaultSettings, function () {
        getSubjects().catch(error => {

            let msg = `${'Could not initialize the subjects index!'
                + 'If this problem is unrelated to Internet issues, please report a bug.\n'}${error}`;
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
}

export class BackgroundModule {

    constructor() {
        // ---------- variables ----------
        //set the cooldown timer
        this.cooldown_timeout = null;
        // listen for when singleton page becomes active
        this.questionSingleton = null;
        this.siteQueue = null; // cache site queue in background page memory

        // ---------- events ---------

        chrome.runtime.onSuspend.addListener(() => {
            clearInterval(this.refreshTimer);
            chrome.storage.local.remove('cooldown_lock');
        });

        chrome.storage.onChanged.addListener(changes => this.cooldownHandler(changes));

        // clear singleton lock if question page is closed 
        chrome.tabs.onRemoved.addListener(tabID => {
            if (tabID === this.questionSingleton) {
                this.questionSingleton = null;
                this.siteQueue = null;
            }
        });

        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => this.messageHandler(request, sender, sendResponse));
    }

    attachRefreshHandler(refresher, interval = 6.048e8) {
        if (typeof refresher !== 'function')
            throw new TypeError('Questions index refresher must be a function.');
        chrome.runtime.onStartup.addListener(() => {
            this.refreshTimer = setInterval(refresher, interval); //refresh once a week
        });
    }

    cooldownHandler(changes, callback = function () { }) {
        if (changes.cooldown_lock) {
            if (changes.cooldown_lock.newValue) { //cooldown_lock is set
                chrome.storage.sync.get('cooldown_info', items => {
                    // set the cooldown timer
                    this.cooldown_timeout = setTimeout(this.coolDone, items.cooldown_info.duration);
                    // clear singleton page lock and site queue cache
                    this.questionSingleton = null;
                    this.siteQueue = null;

                    notif('Mind Matter', `You are correct! I'll leave you alone for ${items.cooldown_info.english}.`);
                    callback();
                });
            }
            else { //cooldown is off, stop countdown
                clearTimeout(this.cooldown_timeout);
                callback();
            }
        }
    }

    //called when cooldown is over.
    coolDone() {
        chrome.storage.local.remove('cooldown_lock');
        notif('Ready', 'Mind Matter has come off cooldown. It will be activated by the next blacklisted site.');
    }

    /**
     * Determines if the sender is or is not in control of the question page singleton lock.
     * Tabs besides the original will be closed.
     * @param {*} request 
     * @param {MessageSender} sender
     * @param {function} sendResponse 
     */
    messageHandler(request, sender, sendResponse) {

        if (!request.trigger || !sender.tab.id)
            return;

        switch (this.questionSingleton) {
        case null:                                   // MessageSender is first instance of question page
            this.questionSingleton = sender.tab.id;  // create lock
            this.siteQueue = [request.trigger];
            // falls through
        case sender.tab.id:                          // MessageSender is the singleton, user might have refreshed page
            sendResponse({ siteQueue: this.siteQueue });
            break;
        default: // is an additional tab
            this.siteQueue.push(request.trigger);    // add site to cache
            chrome.tabs.remove(sender.tab.id);       // close the MessageSender
        }
    }
}

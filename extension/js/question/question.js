class Question {

    constructor() {
        this.wrongTries = 0;
        this.siteQueue = null;
    }

    /**
     * Sends a message to background.js, requesting the siteQueue.
     * 
     * Will not recieve a response from anyone if this instance of the
     * questions page is not the original. In that case, background.js
     * will call chrome.tabs.remove on this instance.
     * 
     * @param triggerURL
     * @returns {Promise} is only resolved if background.js responds.
     */
    connectWithBackground(triggerURL) {
        return new Promise(resolve => {
            chrome.runtime.sendMessage({ trigger: triggerURL }, response => {
                this.siteQueue = response.siteQueue;
                resolve();
            });
        });
    }

    /**
     * Intercepts messages from additional instances of app.js.
     * @param {function} callback that handles the event of 
     * additional blacklisted sites being opened.
     */
    attachTabListener(callback) {
        chrome.runtime.onMessage.addListener(message => {
            if (!message.trigger)
                return;

            // highlight the current tab
            chrome.tabs.getCurrent(currentTab => {
                chrome.tabs.highlight({
                    tabs: currentTab.index,
                    windowId: currentTab.windowId
                });
            });

            this.siteQueue.push(message.trigger);

            if (typeof (callback) === 'function')
                callback(this.siteQueue);
        });
    }

    /**
     * Consistency score (of last 10 attempts) is represented by 
     * an array of 10 (or fewer) booleans in chrome.storage.sync.
     * 
     * If the parameter correct is false, this.wrongTries is incremented by 1.
     * 
     * @param {Boolean} correct
     * @returns {Promise}
     */
    bumpScore(correct) {

        if (!correct)
            this.wrongTries++;

        return new Promise(resolve => {
            chrome.storage.sync.get('consistency', items => {

                if (items.consistency.push(correct) > 10)
                    items.consistency.shift();
                chrome.storage.sync.set({ consistency: items.consistency }, resolve);
            });
        });
    }

    /**
     * Opens the tabs from siteQueue, besides the first.
     * @returns {string} the first site (it wasn't opened by this function)
     */
    openOtherTabs() {
        // open queued sites in other tabs
        for (let i = 1; i < this.siteQueue.length; i++) {
            chrome.tabs.create({
                url: this.siteQueue[i],
                active: false
            });
        }
        // replace current tab with the first queued site
        return this.siteQueue[0];
    }

    /**
     * Assigns a value to cooldown_lock in chrome.storage.sync
     * background.js will clean up after change to cooldown_lock registers
     * @return {Promise}
     */
    static setCooldown() {
        return new Promise(resolve => {
            chrome.storage.sync.get('cooldown_info', items => {
                chrome.storage.local.set(
                    {
                        cooldown_lock: new Date().getTime()
                            + items.cooldown_info.duration
                    },
                    resolve);
            });
        });
    }
    /**
     * Gets and removes the trigger key from chrome.storage.local
     * @returns {Promise} resolve(triggerURL)
     */
    static getTrigger() {
        return new Promise(resolve => {
            chrome.storage.local.get('trigger', items => {
                chrome.storage.local.remove('trigger');
                resolve(items.trigger || 'refresh');
            });
        });
    }
}

/**
 * Chooses a question based on indexStructure in chrome.storage.sync
 * If pick() is not provided with a parameter, it will pick a question
 * from indexStructure in chrome.storage.sync
 * @returns {Promise}
 */
function pick(subjects) {

    // TODO chance map
    const select = indexStructure => {
        let allQuestions = [];
        indexStructure.subjects.forEach(subjectInfo => {

            if (!subjectInfo.enabled)
                return;

            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });
        return allQuestions[Math.random() * allQuestions.length | 0].url;
    };

    return new Promise(resolve => {
        if (subjects)
            resolve(select(subjects));
        else
            chrome.storage.sync.get('indexStructure',
                i => resolve(select(i.indexStructure)));
    });
}

export { Question, pick };
import * as bk from './lib/backgroundController.js'
import subjects from './util/subjects.js'

const background = new bk.BackgroundModule(subjects);

chrome.runtime.onInstalled.addListener(details => bk.init(details, {
    blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
    cooldown_info: {
        duration: 300000,
        english: '5 minutes'
    },
    consistency: {
        total: 0,
        score: 0
    }
}, subjects));

background.attachRefreshHandler(subjects);
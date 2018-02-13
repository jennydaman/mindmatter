import * as bk from './lib/backgroundController.js';
import getSubjects from './util/subjects.js';

const background = new bk.BackgroundModule(getSubjects);

chrome.runtime.onInstalled.addListener(details => bk.init(details, {
    blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
    cooldown_info: {
        duration: 300000,
        english: '5 minutes'
    },
    consistency: [],
    indexStructure: {
        subjects: [] // dummy object to avoid special case in subjects.js
    }
}, getSubjects));

background.attachRefreshHandler(getSubjects);
import * as bk from './lib/backgroundController.js';
import getSubjects from './util/subjects.js';

const background = new bk.BackgroundModule(getSubjects);

chrome.runtime.onInstalled.addListener(details => {

    let installMessage, defaultSettings;

    if (details.reason === 'update') {
        installMessage = 'Mind Matter has been updated. '
            + 'Release notes are found on Github.';
        defaultSettings = {};
    }

    else {
        installMessage = 'Thanks for installing Mind Matter! '
            + 'This is the options page, please have a look around.';
        defaultSettings = {
            blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
            cooldown_info: {
                duration: 300000,
                english: '5 minutes'
            },
            consistency: [],
            indexStructure: {
                subjects: [] // dummy object to avoid special case in subjects.js
            }
        };
    }
    bk.init(installMessage, defaultSettings, getSubjects);
});

background.attachRefreshHandler(getSubjects);
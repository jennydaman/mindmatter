//getSubjects.js: provides functions that relate to interactions with remote repository

/**
 * Gets updated subjects with a Promise.
 * Call this function if you want to do something specific with the result, eg. if it's necessary
 * to handle XHR errors.
 * @param {string} url (optional)
 * @returns {Promise}
 */
function pull(url = 'https://jennydaman.github.io/mindmatter/subjects.json') {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.onload = function () {
            if (this.status === 200)
                resolve(xhr.response);
            else
                reject(Error(`Couldn't get subjects data. Response code: ${xhr.statusText}`));
        };
        xhr.onerror = function () {
            reject(Error('XHR for subjects refresh error, I HAVE NO IDEA WHY.'));
        };
        xhr.send();
    });
}

/**
 * @returns {Promise}
 */
function update() {
    return new Promise((resolve, reject) => {
        pull().then(freshSubjects => {
            store(freshSubjects).then(resolve);
        }).catch(err => reject(err)); // pass the error along
    });
}

/**
 * Saves questions to chrome.storage.sync.
 * @param freshSubjects
 * @returns {Promise}
 */
function store(freshSubjects) {
    // TODO update individual subject and question settings
    return new Promise(resolve => {
        chrome.storage.sync.set({ indexStructure: freshSubjects }, resolve);
    });
}

export {pull, update, store};

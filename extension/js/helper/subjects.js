//getSubjects.js: provides functions that relate to interactions with remote repository
const subjects = {
    /**
     * Gets updated subjects with a Promise.
     * Call this function if you want to do something specific with the result, eg. if it's necessary
     * to handle XHR errors.
     * @param {string} url (optional)
     * @returns {Promise}
     */
    pull: (url = 'https://jennydaman.github.io/mindmatter/subjects.json') => {
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
                reject(Error('Request for subjects data was unsuccessful, I HAVE NO IDEA WHY.'));
            };
            xhr.send();
        });
    },

    /**
     * Gets updated subjects and stores it, without handling XHR errors.
     */
    update: function () {
        pull().then(function (freshSubjects) {
            store(freshSubjects);
        });
    },

    /**
     * Saves questions to chrome.storage.sync.
     * @param freshSubjects 
     */
    store: (freshSubjects, callback) => {
        // TODO update individual subject and question settings
        chrome.storage.sync.set({ indexStructure: freshSubjects }, callback);
    }
}

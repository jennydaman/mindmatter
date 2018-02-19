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
 * Saves questions to chrome.storage.sync.
 * Checks for if the subject has been disabled originally.
 *
 * @param fresh
 * @returns {Promise}
 */
function store(fresh) {

    // create a map where keys point to fresh subjects
    let allSubjects = new Map();
    fresh.subjects.forEach(currentSubject => {
        allSubjects.set(currentSubject.folder, currentSubject);
    });

    return new Promise(resolve => {

        chrome.storage.sync.get('indexStructure', items => {

            // merge with current indexStructure, if it exists
            if (items.indexStructure.subjects) {
                items.indexStructure.subjects.forEach(oldSubject => {
                    // points to a single subject in allSubjects
                    let freshSubject = allSubjects.get(oldSubject.folder);
                    if (freshSubject)
                        freshSubject.enabled = oldSubject.enabled;
                });
            }

            chrome.storage.sync.set({ indexStructure: fresh }, resolve);
        });
    });
}

/**
 * @returns {Promise} resolve(freshSubjects)
 */
export default function update() {
    return new Promise((resolve, reject) => {
        pull().then(freshSubjects => {
            store(freshSubjects).then(() => resolve(freshSubjects));
        }).catch(err => reject(err)); // pass the error along
    });
}

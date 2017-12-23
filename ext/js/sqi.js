//sqi.js: provides functions that relate to interactions with remote repository

/**
 * @param {string} errMsg
 * @param {XMLHTTPRequest} xhr
 * @throws XMLHTTPRequest
 */
function connectionError(errMsg, xhr) {
    errMsg = `[${new Date()}] Mind Matter[sqi.js]: ERROR: ${  errMsg}`;
    console.error(errMsg);
    alert(errMsg);
    throw xhr;
}

/**
 * updates question_index in chrome.storage.sync
 * @param {string} url 
 * @param {function} callback 
 */
function retrieveQI(url = 'https://jennydaman.github.io/mindmatter/subjects.json', callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (this.status != 200)
            connectionError(`Unexpected response code from server.\n${xhr.status}    ${xhr.statusText}`, this);
        chrome.storage.sync.set({ question_index: JSON.parse(xhr.responseText) });
    };
    xhr.onerror = function () {
        connectionError('XMLHTTPRequest.onerror: I have no idea why.', this);
    };
    xhr.send();
}

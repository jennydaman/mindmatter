/**
 * updates question_index in chrome.storage.sync
 * @param {string} url 
 * @param {function} callback 
 */
export function retrieveSQI(url = 'https://jennydaman.github.io/mindmatter/subjects.json', callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (this.status != 200)
            connectionError(`Unexpected response code from server.\n${xhr.status}    ${xhr.statusText}`, this);
        chrome.storage.sync.set({ question_index: JSON.parse(xhr.responseText) });
    };
    xhr.onerror = function () {
        connectionError(`XMLHTTPRequest.onerror and I have no idea why.`, this);
    }
    xhr.send();
}

//retrieves the question from the server
export function getQuestion() {

    chrome.storage.sync.get('question_index', function (items) {
        //add all questions to one big array
        //TODO: improve this algorithm, implement 'chance'
        let allQuestions = [];
        items.question_index.subjects.forEach(subjectInfo => {
            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });

        let qpath = allQuestions[Math.random() * allQuestions.length | 0].qpath;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', qpath, true);
        xhr.onerror = function () {
            connectionError(`XMLHTTPRequest error and I have no idea why.`, this);
        }
        xhr.onload = function () {
            //maybe 404, try refreshing the question_index and try again
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
            if (xhr.status != 200) {

            }
        }
    });
}

/**
 * @param {string} errMsg
 * @param {XMLHTTPRequest} xhr
 * @throws XMLHTTPRequest
 */
function connectionError(errMsg, xhr) {
    errMsg = `[${new Date()}] Mind Matter[sqi.js]: ERROR: ` + errMsg;
    console.error(errMsg);
    alert(errMsg);
    throw xhr;
}

// processes the new Date() object for you.
export function easyTime() {

    let time = new Date();
    let pad0 = number => {
        return `${number < 10 ? '0' : ''}${number}`
    }

    return {
        value: time.valueOf(),
        english: `${pad0(time.getHours())}:${pad0(time.getMinutes())}:${pad0(time.getSeconds())}`
    };
}

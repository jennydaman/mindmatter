//This messy content_script is injected into every page.
(function () {

    chrome.storage.local.get(['cooldown_lock', 'pause'], function (items) {

        //check that setting is active
        if (items.cooldown_lock || items.pause)
            return;

        chrome.storage.sync.get('blacklist_array', function (items) {
            //check that site is blacklisted
            let blacklistedURL = items.blacklist_array.find((bl_keyword) => {
                return location.href.includes(bl_keyword);
            });
            if (!blacklistedURL)
                return;

            retrieveQuestion(retrieved => {

                let wrongTries = 0;
                switch (retrieved.type) {
                    case 'blank':
                        wrongTries = fillInTheBlank(retrieved);
                        break;
                    default:
                        alert(`Mind Matter\n${retrieved.question}\nNO IMPLEMENTATION YET`);
                }
                updateScore(wrongTries);
                setCooldown();
                /*
                 * background.js will listen for changes to storage.
                 * When cooldown_lock is changed, a timeout will be set to remove the lock.
                 */
            });
        });
    });

    //callback questionHandler invoked if and only if retrieval is successful.
    function retrieveQuestion(questionHandler, secondTry = false) {

        chrome.storage.sync.get('question_index', function (items) {

            //TODO: improve this algorithm, implement 'chance'
            //add all questions to one big array
            let allQuestions = [];
            items.question_index.subjects.forEach(subjectInfo => {
                subjectInfo.questions.forEach(question => {
                    allQuestions.push(question);
                });
            });

            let qpath = allQuestions[Math.random() * allQuestions.length | 0].qpath;

            var xhr = new XMLHttpRequest();
            xhr.open('GET', qpath, true);
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.onerror = function () {
                connectionError('XMLHttpRequest error and I have no idea why.', this);
            };

            xhr.onload = function () {

                if (xhr.status != 200) {

                    if (secondTry) {
                        alert('Mind Matter\n'
                            + 'Failed two attempts to retrieve a question! Pausing myself and giving up...');
                        chrome.storage.local.set({ pause: true });
                    }
                    else //refresh question_index with the default URL before trying again
                        retrieveQI(undefined, retrieveQuestion(questionHandler, true));
                }
                else if (questionHandler instanceof Function)
                    questionHandler(JSON.parse(xhr.responseText));

            };

            xhr.send();
        });
    }

    /**
     * @returns number of wrong attempts.
     */
    function fillInTheBlank(retrieved) {

        if (!Array.isArray(retrieved.answer))
            retrieved.answer = [retrieved.answer];

        const correctAnswers = retrieved.answer.map(possibleAnswer => possibleAnswer.toLowerCase());

        const checkAns = (correctAnswers, user_response = '') => {
            user_response = user_response.trim().toLowerCase();
            return correctAnswers.find(possibleAnswer => {
                return user_response.includes(possibleAnswer);
            }) ? true : false;
        };

        let user_response = '';
        let wrongTries = 0;
        while (!checkAns(correctAnswers, user_response)) {
            if (user_response != '') {
                alert('Wrong, please try again.');
                wrongTries++;
            }
            user_response = prompt(`${'Mind Matter'
                + '\n'}${retrieved.question}`);
            if (user_response == null)
                user_response = '';
        }
        return wrongTries;
    }

    /**
     * Updates consistency score in chrome.storage.sync
     * @param {Number} wrongTries 
     */
    function updateScore(wrongTries) {
        chrome.storage.sync.get('consistency', function (items) {

            if (wrongTries == 0) { //correct on first try
                items.consistency.total++;
                items.consistency.score++;
            }
            else //wrong
                items.consistency.total += wrongTries;

            chrome.storage.sync.set({ consistency: items.consistency });
        });
    }

    function setCooldown() {

        chrome.storage.sync.get('cooldown_info', function (items) {
            chrome.storage.local.set({ cooldown_lock: new Date().getTime() + items.cooldown_info.duration });
        });
    }
})();

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

                if (retrieved.type == 'blank')
                    fillInTheBlank(retrieved);
                else {
                    alert(`Mind Matter\n${
                        retrieved.question
                    }\nRetrieved question is not "fill in the blank`);
                }

                setCooldown();
                /*
                 * background.js will listen for changes to storage.
                 * When cooldown_duration is changed, a timeout will be set to remove the lock.
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
            xhr.onerror = function () {
                connectionError('XMLHTTPRequest error and I have no idea why.', this);
            };

            xhr.onload = function () {

                if (xhr.status != 200) {

                    if (secondTry) {
                        alert('Mind Matter\n'
                            + 'Failed two attempts to retrieve a question! Pausing myself and giving up...');
                        chrome.storage.local.set({ pause: true });
                    }
                    else //refresh question_index with the default URL before trying again
                        retrieveQI(undefined, retrieveQuestion(true));
                }
                else
                    questionHandler(JSON.parse(xhr.responseText));
            };

            xhr.send();
        });
    }

    function fillInTheBlank(retrieved) {

        if (!Array.isArray(retrieved.answer))
            retrieved.answer = [retrieved.answer];
        retrieved.answer.forEach((possibleAnswer, index, allAnswers) => {
            allAnswers[index] = possibleAnswer.toLowerCase();
        });

        const checkAns = (allAnswers, user_response = '') => {
            user_response = user_response.toLowerCase().trim();
            for (let possibleAnswer of allAnswers) {
                if (user_response == possibleAnswer)
                    return true;
            }
            return false;
        };

        let user_response = '';

        while (!checkAns(retrieved.answer, user_response)) {
            if (user_response != '')
                alert('Wrong, please try again.');
            user_response = prompt(`${'Mind Matter'
                + '\n'}${retrieved.question}`);
            if (user_response == null)
                user_response = '';
        }
    }

    function setCooldown() {

        const time = new Date();
        const pad0 = number => {
            return `${number < 10 ? '0' : ''}${number}`;
        };

        chrome.storage.local.set({
            cooldown_lock: {
                value: time.valueOf(),
                english: `${pad0(time.getHours())}:${pad0(time.getMinutes())}:${pad0(time.getSeconds())}`
            }
        });
    }
})();

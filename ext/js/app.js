//This content script is injected into every page.
(function (window, document) {
    chrome.storage.local.get(['cooldown_lock', 'pause'], function (items) {

        if (items.cooldown_lock || items.pause)
            return;

        chrome.storage.sync.get('blacklist_array', function (items) {

            for (let i = 0; i < items.blacklist_array.length; i++) { //TODO better way of checking
                if (location.href.includes(items.blacklist_array[i])) {
                    showQuestion();
                    return;
                }
            }
        });
    });

    function showQuestion() {

        //TODO: catch 404 errors by refreshing database
        chrome.storage.sync.get('question_index', function (items) {

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
            xhr.onreadystatechange = function () {
                if (xhr.readyState == xhr.DONE) {
                    let retrieved = JSON.parse(xhr.response);

                    if (retrieved.type == 'blank') {

                        if (!Array.isArray(retrieved.answer))
                            retrieved.answer = [retrieved.answer];
                        retrieved.answer.forEach((possibleAnswer, index, allAnswers) => {
                            allAnswers[index] = possibleAnswer.toLowerCase();
                        });

                        function checkBlankAns(allAnswers, user_response = '') {
                            user_response = user_response.toLowerCase().trim();
                            for (let possibleAnswer of allAnswers) {
                                if (user_response == possibleAnswer)
                                    return true;
                            }
                            return false;
                        }

                        let user_response = '';

                        while (!checkBlankAns(retrieved.answer, user_response)) {
                            if (user_response != '')
                                alert('Wrong, please try again.');
                            user_response = prompt(`${'MindMatter'
                                + '\n'}${retrieved.question}`);
                            if (user_response == null)
                                user_response = '';
                        }
                    }
                    else {
                        alert(`${'MindMatter'
                            + '\n'}${retrieved.question
                            }\nRetrieved question is not "fill in the blank"`);
                    }

                    let time = new Date();

                    let pad0 = number => {
                        return `${number < 10 ? '0' : ''}${number}`
                    }
                    chrome.storage.local.set({
                        cooldown_lock: {
                            value: time.valueOf(),
                            english: `${pad0(time.getHours())}:${pad0(time.getMinutes())}:${pad0(time.getSeconds())}`
                        }
                    });
                    /*
                     * background.js will listen for changes to storage.
                     * When cooldown_duration is changed, a timeout will be set to remove the lock.
                     */
                }
            };
            xhr.send();
        });
    }
})(window, document);

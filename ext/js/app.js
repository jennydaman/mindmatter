import { easyTime } from "./sqi";

//This content_script is injected into every page.
(function (window, document) {

    //check that setting is active
    chrome.storage.local.get(['cooldown_lock', 'pause'], function (items) {

        if (items.cooldown_lock || items.pause)
            return;

        //check that site is blacklisted
        chrome.storage.sync.get('blacklist_array', function (items) {

            for (let i = 0; i < items.blacklist_array.length; i++) { //TODO better way of checking
                if (location.href.includes(items.blacklist_array[i])) {
                    showQuestion();
                    return;
                }
            }
        });
    });

    function showQuestion(retrieved) {

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

        chrome.storage.local.set({ cooldown_lock: easyTime() });
        /*
         * background.js will listen for changes to storage.
         * When cooldown_duration is changed, a timeout will be set to remove the lock.
         */
    }
})(window, document);

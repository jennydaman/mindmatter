// retrieve question data and inflate components
$(document).ready(function () {

    chrome.storage.local.get('trigger', function (items) {
        $('#trigger').text(items.trigger);
    });

    toggleModal();
    $('#modal-delete').click(closeModal);
    $('#modal-background').click(closeModal);

/*     retrieveQuestion(ret => {
        const correct;
        const checkAnswer;
        if (ret.type === 'blank') {
            inflateBlank(ret);
            correct = parseFillInTheBlankAnswer(ret);
        }
        else
            alert('retrieved question is not yet implemented');
    }); */
});

//callback questionHandler invoked if and only if retrieval is successful.
function retrieveQuestion(callback, secondTry = false) {
    chrome.storage.sync.get('indexStructure', function (items) {

        //TODO: improve this algorithm, implement 'chance'
        //add all questions to one big array
        let allQuestions = [];
        items.indexStructure.subjects.forEach(subjectInfo => {
            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });

        let url = allQuestions[Math.random() * allQuestions.length | 0].url;

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.onerror = function () {
            reject('XHR error, IDK why');
        };
        xhr.onload = function () {
            if (xhr.status === 200)
                callback(xhr.response);
            else {
                if (secondTry) {
                    chrome.storage.local.set({ pause: true });
                    alert('Mind Matter\n'
                        + 'Failed two attempts to retrieve a question! Pausing myself and giving up...\n'
                        + 'Response code: ' + xhr.statusText);
                }
                else { // try again after refreshing database
                    subjects.pull().then(freshSubjects => {
                        subjects.store(freshSubjects, function () {
                            retrieveQuestion(callback, true);
                        });
                    }).catch(error => {
                        chrome.storage.local.set({ pause: true });
                        alert('Mind Matter\n'
                            + error.toString() + '\n'
                            + 'Pausing myself and giving up...');
                    });
                }
            }
        };
        xhr.send();
    });
}

/**
 * Compares the response against an array of possible answers.
 * @param {string} response 
 * @param {string} correct 
 * @returns true if the response contains any of the key words in the correct array.
 */
function checkTextAnswer(user_response = '', retrieved) {

    // first, check strict answers
    if (retrieved.ans_exact) {
        let correct = retrieved.ans_exact.find(exactAns => {
            return user_response == exactAns;
        });
        if (correct)
            return true;
    }
    // next, see if numerical ans fits in specified range
    else if (retrieved.ans_range) {
        let num = Number(user_response);
        if (num >= retrieved.ans_range.min && num <= retrieved.ans_range.max)
            return true;
    }
    // finally, compare against possible answers
    else if (retrieved.answer) {
        user_response = user_response.trim().toLowerCase();
        let correct = retrieved.ans_exact.find(possibleAns => {
            return possibleAns instanceof String ? user_response.includes(possibleAns) : user_response == possibleAns;
        });
        if (correct)
            return true;
    }
    return false;
}

function handleFillInTheBlank(retrieved) {

    // inflate
    $('#question').text(retrieved.question);
    $('#response').load('fill_blank.html');

    $('#response input').keyup(function (e) {
        if (e.which === 13) {
            $(this).attr('disabled', 'disabled'); //Disable textbox to prevent multiple submit
            if (checkTextAnswer($(this).val(), retrieved))
                finish(); // TODO
            else
                $(this).removeAttr('disabled'); //Enable the textbox again
        }
    });
    $('#submit').click(function () {
        if (checkTextAnswer($('#response input').val(), retrieved))
            finish(); // TODO
    })
}

/**
 * Updates consistency score in chrome.storage.sync
 * @param {Number} wrongTries 
 */
function updateScore(wrongTries) {
    chrome.storage.sync.get('consistency', function (items) {

        if (wrongTries === 0) { //correct on first try
            items.consistency.total++;
            items.consistency.score++;
        }
        else //wrong
            items.consistency.total += wrongTries;
        items.consistency.total = Math.max(items.consistency.total, 10);
        chrome.storage.sync.set({ consistency: items.consistency });
    });
}

function setCooldown() {
    chrome.storage.sync.get('cooldown_info', function (items) {
        chrome.storage.local.set({ cooldown_lock: new Date().getTime() + items.cooldown_info.duration });
    });
}

function toggleModal() {
    $('.modal').toggleClass('is-active');
    $('html').toggleClass('is-clipped');
}

function closeModal() {
    $('.modal').removeClass('is-active');
    $('html').removeClass('is-clipped');
}
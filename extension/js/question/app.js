import { Question, pick } from './question.js';
// TODO close tab when pause is true storage.onChanged

const modal = {
    /**
     * @param {String} message text to display
     */
    show: message => {
        if (message)
            $('#modal-text').text(message);
        $('.modal').addClass('is-active');
        $('html').addClass('is-clipped');
    },
    /**
     * Assign function to modal close event.
     * @param {Function} action function to be called when modal is closed.
     */
    onClose: action => {
        $('#modal-delete').click(action);
        $('#modal-background').click(action);
    },
    close: function () {
        $('.modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
    }
};

/**
 * Shows a modal, set pause to true, open tabs when modal is closed.
 * @param {String} message 
 */
function fail(message) {
    modal.onClose(openAllTabs);
    chrome.storage.local.set({ pause: true }, function () {
        modal.show(message);
    });
}

const q = new Question();
Question.getTrigger().then(triggerURL => {

    if (triggerURL === 'refresh')
        q.bumpScore(false);

    q.connectWithBackground(triggerURL).then(() => {
        $(document).ready(setup);
    });
});

function setup() {

    modal.onClose(modal.close);

    var triggerDisp = $('#trigger-single');

    const replaceTriggerWithList = siteQueue => {
        triggerDisp.replaceWith(function () {
            let dispList = $('<ul id="trigger-list"></ul>');
            siteQueue.forEach(url => {
                dispList.append($('li></li>').text(url));
            });
            return dispList;
        });
    };

    if (q.siteQueue.length === 1)
        triggerDisp.text(q.siteQueue[0]);
    else
        replaceTriggerWithList(q.siteQueue);

    q.attachTabListener(siteQueue => {
        if (triggerDisp.attr('id').endsWith('single'))
            replaceTriggerWithList(siteQueue);
        else
            triggerDisp.append(`<li>${siteQueue[siteQueue.length - 1]}</li>`);
    });

    loadQuestion();
}

function loadQuestion() {

    pick().then(questionURL => {
        console.log(questionURL);
        fetch(questionURL).then(question => {
            handleQuestionType(question);
        });
    }).catch(error => {
        if (error.statusCode === 404)
            tryToGetQuestionAgain();
        else
            fail(error.textStatus == 'timeout' ?
                'Connection timeout. Please check your internet connection.' :
                `$.ajax errorThrown: ${error.errorThrown}`
                + `\nquestionURL: ${error.questionURL}`);
    });
}

/**
 * Retrieves the question as a JSON object
 * @return {Promise} reject keys: questionURL, textStatus, errorThrown, statusCode
 */
function fetch(questionURL) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: questionURL,
            dataType: 'json',
            error: (jqXHR, textStatus, errorThrown) =>
                reject({
                    statusCode: jqXHR.status,
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    questionURL: questionURL
                }),
            statusCode: {
                404: function () {
                    reject({
                        statusCode: 404,
                        questionURL: questionURL
                    });
                },
                200: data => resolve(data)
            },
            timeout: 5000
        });
    });
}

function tryToGetQuestionAgain() {
    // https://developers.google.com/web/updates/2017/11/dynamic-import
    import('./util/subjects.js').then(subjectsModule => {
        subjectsModule.default().then(freshSubjects => {
            // after question index is updated,
            pick(freshSubjects).then(question => {
                handleQuestionType(question);
            }).catch(secondError => {
                fail('Missed two attempts to retrieve a question.'
                    + '\nPausing myself and giving up...'
                    + `\nSecond questionURL: ${secondError.questionURL}:`);
            });
        }).catch(subjectsUpdateError => {
            fail(`Question --> 404\nSubjects --> ${subjectsUpdateError}`);
        });
    });
}

function handleQuestionType(question) {
    if (question.type === 'blank')
        fillInTheBlank(question);
    else {
        fail(`question.type=${question.type}` +
            '\nQuestion type not yet supported. This is a bug.');
    }
}

// TODO move everything related to fill-in-the-blank to a new file


/**
 * @param {*} retrieved question data
 */
function fillInTheBlank(retrieved) {

    /**
     * Compares the response against an array of possible answers.
     * If the response is incorrect, wrongTries is incremented by one.
     * @param {string} response 
     * @param {string} correct 
     * @returns true if the response contains
     * any of the key words in the correct array.
     */
    retrieved.checkAns = function (user_response) {

        // first, check strict answers
        if (this.ans_exact) {
            let correct = this.ans_exact.find(exactAns => {
                return user_response == exactAns;
            });
            if (correct)
                return true;
        }
        // next, see if numerical ans fits in specified range
        else if (this.ans_range) {
            let num = Number(user_response);
            if (num >= this.ans_range.min && num <= this.ans_range.max)
                return true;
        }
        // finally, compare against possible answers
        else if (this.ansKeyWord) {
            user_response = user_response.trim().toLowerCase();
            let correct = this.ansKeyWord.find(possibleAns => {
                return typeof possibleAns === 'string' ?
                    user_response.includes(possibleAns) : user_response == possibleAns;
            });
            if (correct)
                return true;
        }
        return false;
    };

    // inflate
    $('#question').text(retrieved.questionText);
    $('#response').load('fill_blank.html', function () {

        let textArea = $('#blank');

        textArea.ready(function () {

            let button = $('#submit');
            button.css('height', '38px');
            //button.css('height', $('#blank').css('height'));
            // HACK wrapper span#response is 4px wider than child input#blank
            button.css('position', 'relative');
            button.css('right', '4px');

            button.click(function () {
                handleResponse(textArea, retrieved);
            });

            textArea.keyup(function (e) {

                if (textArea.val().length === 0)
                    $('#submit').attr('disabled', 'disabled');
                else
                    $('#submit').removeAttr('disabled');

                if (e.which === 13) //enter key
                    handleResponse(textArea, retrieved);
            });
        });
    });
}

function handleResponse(inputElement, question) {

    if (!inputElement || !question)
        throw new Error('Must provide jQuery input field and question data');

    inputElement.attr('disabled', 'disabled'); //Disable textbox to prevent multiple submit

    let correct = question.checkAns(inputElement.val());
    q.bumpScore(correct);

    if (correct)
        Question.setCooldown().then(openAllTabs);
    else {
        $(this).removeAttr('disabled'); //Enable the textbox again
        modal.show(`Incorrect. Wrong tries: ${q.wrongTries}`);
    }
}

function openAllTabs() {
    window.location.replace(q.openOtherTabs());
}
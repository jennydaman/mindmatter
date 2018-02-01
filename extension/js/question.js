// TODO close tab when pause is true storage.onChanged

import * as subjects from './util/subjects.js';

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

var wrongTries = 0;
var siteQueue;
// retrieve question data and inflate components
$(document).ready(function () {

    chrome.storage.local.get(['trigger'], function (items) {
        chrome.storage.local.remove('trigger');

        // notify singleton page and background
        chrome.runtime.sendMessage({ trigger: items.trigger }, response => {
            // response is fired by background.js only if this page holds the singleton lock
            siteQueue = response.siteQueue;
            setup();

            retrieveQuestion().then(question => {
                handleQuestionType(question);
            }).catch(error => {
                if (error.statusCode === 404) {
                    // refresh question index before trying again
                    subjects.update().then(function () {
                        // after question index is retrieved and stored, try to get another question
                        retrieveQuestion().then(question => {
                            handleQuestionType(question);
                        }).catch(secondError => {
                            fail('Missed two attempts to retrieve a question.\nPausing myself and giving up...'
                            + `\nSecond questionURL: ${secondError.questionURL}:`);
                        });
                    }).catch(subjectsUpdateError => {
                        fail(`Question --> 404\nSubjects --> ${subjectsUpdateError}`);
                    });
                }
                else
                    fail(error.textStatus == 'timeout' ?
                        'Connection timeout. Please check your internet connection.' :
                        `$.ajax errorThrown: ${error.errorThrown}\nquestionURL: ${error.questionURL}`);
            });
        });
        /*
         * If this tab does not receive a message, execution stops.
         * background.js will eventually close this tab.
         */
    });
});

/**
 * Shows a modal, set pause to true, open tabs when modal is closed.
 * @param {String} message 
 */
function fail(message) {
    modal.onClose(openTabs);
    chrome.storage.local.set({ pause: true }, function () {
        modal.show(message);
    });
}

function setup() {

    modal.onClose(modal.close);

    if (siteQueue.length === 1)
        $('#trigger').text(siteQueue[0]);
    else {
        $('#trigger').replaceWith(function () {
            let dispList = $('<ul id="trigger-list"></ul>');
            siteQueue.forEach(url => {
                dispList.append(`<li>${url}</li>`);
            });
            return dispList;
        });
    }

    // message from additional blacklisted sites
    chrome.runtime.onMessage.addListener(message => {

        if (!message.trigger)
            return;

        chrome.tabs.getCurrent(currentTab => {
            chrome.tabs.highlight({
                tabs: currentTab.index,
                windowId: currentTab.windowId
            });
        });

        if (siteQueue.length === 1)
            $('#trigger').replaceWith(`<ul id="trigger-list"><li>${siteQueue[0]}</li><li>${message.trigger}</li></ul>`);
        else
            $('#trigger-list').append(`<li>${message.trigger}</li>`);

        siteQueue.push(message.trigger);
    });
}

/**
 * @returns {Promise}
 */
function pickQuestion() {
    return new Promise(resolve => {
        chrome.storage.sync.get('indexStructure', items => {
            // TODO chance map
            let allQuestions = [];
            items.indexStructure.subjects.forEach(subjectInfo => {

                if (!subjectInfo.enabled)
                    return;

                subjectInfo.questions.forEach(question => {
                    allQuestions.push(question);
                });
            });
            resolve(allQuestions[Math.random() * allQuestions.length | 0].url);
        });
    });
}

// maybe I should reject with an Error object?
/**
 * @return {Promise} reject keys: questionURL, textStatus, errorThrown, statusCode
 */
function retrieveQuestion() {
    return new Promise((resolve, reject) => {
        pickQuestion().then(questionURL => {
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

/**
 * Compares the response against an array of possible answers.
 * If the response is incorrect, wrongTries is incremented by one.
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
        let correct = retrieved.answer.find(possibleAns => {
            return typeof (possibleAns) === 'string' ? user_response.includes(possibleAns) : user_response == possibleAns;
        });
        if (correct)
            return true;
    }
    wrongTries++;
    return false;
}

function fillInTheBlank(retrieved) {
    let wrongTries = 0;

    // inflate
    $('#question').text(retrieved.question);
    $('#response').load('fill_blank.html', function () {
        $('#blank').ready(function () {
            let button = $('#submit');
            button.css('height', '38px');
            //button.css('height', $('#blank').css('height'));
            // HACK wrapper span#response is 4px wider than child input#blank
            button.css('position', 'relative');
            button.css('right', '4px');
        });
        $('#blank').keyup(function (e) {

            if ($(this).val().length === 0)
                $('#submit').attr('disabled', 'disabled');
            else
                $('#submit').removeAttr('disabled');

            if (e.which === 13) { //enter key
                $(this).attr('disabled', 'disabled'); //Disable textbox to prevent multiple submit
                if (checkTextAnswer($(this).val(), retrieved))
                    finish(wrongTries);
                else {
                    $(this).removeAttr('disabled'); //Enable the textbox again
                    modal.show(`Incorrect. Wrong tries: ${++wrongTries}`);
                }
            }
        });
    });

    $('#submit').click(function () {
        if (checkTextAnswer($('#blank').val(), retrieved))
            finish(wrongTries);
        else
            modal.show(`Incorrect. Wrong tries: ${++wrongTries}`);
    });
}

function finish(wrongTries) {

    updateScore(wrongTries);
    setCooldown().then(openTabs);
}

/**
 * Updates consistency score in chrome.storage.sync
 * @param {Number} wrongTries
 */
function updateScore(wrongTries) {
    chrome.storage.sync.get('consistency', items => {

        if (wrongTries === 0) { //correct on first try
            items.consistency.total++;
            items.consistency.score++;
        }
        else // FIXME bump total whenever question is wrong instead of when question is completed
            items.consistency.total += wrongTries;
        items.consistency.total = Math.min(items.consistency.total, 10);
        chrome.storage.sync.set({ consistency: items.consistency });
    });
}

/**
 * @return {Promise}
 */
function setCooldown(callback) {
    return new Promise(resolve => {
        chrome.storage.sync.get('cooldown_info', items => {
            chrome.storage.local.set({ cooldown_lock: new Date().getTime() + items.cooldown_info.duration }, resolve);
        });
    });
}

function openTabs() {
    // open queued sites in other tabs
    for (let i = 1; i < siteQueue.length; i++) {
        chrome.tabs.create({
            url: siteQueue[i],
            active: false
        });
    }
    // replace current tab with the first queued site
    window.location.replace(siteQueue[0]);
    // background.js will clean up after change to cooldown_lock registers
}

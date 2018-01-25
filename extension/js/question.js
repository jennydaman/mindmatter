import * as subjects from './helper/subjects.js';

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

            retrieveQuestion(ret => {
                if (ret.type === 'blank')
                    fillInTheBlank(ret);
                else {
                    modalAction(openTabs);
                    openModal(`ret.type=${ret.type}` +
                        '\nQuestion type not yet supported. This is a bug.');
                }
            });
        });
        /*
         * If this tab does not receive a message, execution stops.
         * background.js will eventually close this tab.
         */
    });
});

function setup() {

    modalAction(closeModal);

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

//callback questionHandler invoked if and only if retrieval is successful.
function retrieveQuestion(callback, trial = 0) {

    if (trial === 2) {
        chrome.storage.local.set({ pause: true });
        modalAction(openTabs);
        openModal('Failed two attempts to retrieve a question! Pausing myself and giving up...');
        return;
    }

    chrome.storage.sync.get('indexStructure', items => {

        //TODO: improve this algorithm, implement 'chance'

        //add all questions to one big array
        let allQuestions = [];
        items.indexStructure.subjects.forEach(subjectInfo => {
            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });

        $.ajax({
            url: allQuestions[Math.random() * allQuestions.length | 0].url,
            cache: false,
            dataType: 'json',
            error: (jqXHR, textStatus, errorThrown) => {

                modalAction(openTabs);

                if (textStatus === 'timeout')
                    openModal('Request timed out, check your Internet connection.');
                else
                    openModal('jqXHR error, IDK why.'
                        + `\ntextStatus: ${textStatus}`
                        + `\nerrorThrown: ${errorThrown}`);
            },
            statusCode: {
                404: function () { // refresh question index before trying again
                    subjects.pull().then(freshSubjects => {
                        subjects.store(freshSubjects, function () {
                            retrieveQuestion(callback, trial + 1);
                        });
                    }).catch(error => {
                        chrome.storage.local.set({ pause: true });
                        openModal(`Mind Matter\n${
                            error.toString()}\n`
                            + 'Pausing myself and giving up...');
                    });
                },
                200: data => {
                    callback(data);
                }
            },
            timeout: 5000
        });
    });
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
                    openModal(`Incorrect. Wrong tries: ${++wrongTries}`);
                }
            }
        });
    });

    $('#submit').click(function () {
        if (checkTextAnswer($('#blank').val(), retrieved))
            finish(wrongTries);
        else
            openModal(`Incorrect. Wrong tries: ${++wrongTries}`);
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
        else //wrong
            items.consistency.total += wrongTries;
        items.consistency.total = Math.max(items.consistency.total, 10);
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

function openModal(message) {
    if (message)
        $('#modal-text').text(message);
    $('.modal').addClass('is-active');
    $('html').addClass('is-clipped');
}

function modalAction(action) {
    $('#modal-delete').click(action);
    $('#modal-background').click(action);
}

function closeModal() {
    $('.modal').removeClass('is-active');
    $('html').removeClass('is-clipped');
}

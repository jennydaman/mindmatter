var wrongTries = 0;
// retrieve question data and inflate components
$(document).ready(function () {

    chrome.storage.local.get(['trigger', 'singleton'], function (items) {
        chrome.storage.local.remove('trigger');

        chrome.tabs.getCurrent(currentTab => {

            // this instance is the first and only instance of the question page
            if (!items.singleton || items.singleton === currentTab.id) {

                claimSingleton(items.trigger, currentTab.id);

                $('#modal-delete').click(closeModal);
                $('#modal-background').click(closeModal);

                retrieveQuestion(ret => {
                    if (ret.type === 'blank') {
                        fillInTheBlank(ret);
                    }
                    else
                        alert('retrieved question is not yet implemented');
                });
            }
            // user attempt to open multiple blacklisted sites, while another questions page is running
            else
                // do not use chrome.tabs.sendMessage, MessageSender tab is not registered
                chrome.runtime.sendMessage({ anotherSite: items.trigger }); // kill me
        });
    });
});

function claimSingleton(firstSite, currentTabId) {
    chrome.storage.local.set({ singleton: currentTabId });

    // in case of refresh 
    chrome.storage.local.get('siteQueue', function (items) {
        if (items.siteQueue) { // was refreshed
            if (items.siteQueue.length === 1)
                $('#trigger').text(items.siteQueue[0]);
            else {
                $('#trigger').replaceWith(function () {
                    let dispList = $(`<ul id="trigger-list"></ul>`);
                    items.siteQueue.forEach(url => {
                        dispList.append(`<li>${url}</li>`);
                    });
                    return dispList;
                });
            }
        }
        else
            chrome.storage.local.set({ siteQueue: [firstSite] }); // initialize siteQueue cache
    });

    // message from additional blacklisted sites
    chrome.runtime.onMessage.addListener((message, sender) => {
        if (!message.anotherSite)
            return; // ignore irrelevant messages

        chrome.tabs.getCurrent(currentTab => {
            chrome.tabs.highlight({
                tabs: currentTab.index,
                windowId: currentTab.windowId
            });
        });

        chrome.storage.local.get('siteQueue', function (items) {
            if (items.siteQueue.length === 1) // replace with a list
                $('#trigger').replaceWith(`<ul id="trigger-list"><li>${items.siteQueue[0]}</li><li>${message.anotherSite}</li></ul>`);
            else
                $('#trigger-list').append(`<li>${message.anotherSite}</li>`);

            items.siteQueue.push(message.anotherSite);
            chrome.storage.local.set({ siteQueue: items.siteQueue }); // backup result
        });

        chrome.tabs.remove(sender.tab.id); // close the MessageSender
    });
}

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
            return typeof (possibleAns) === "string" ? user_response.includes(possibleAns) : user_response == possibleAns;
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
            button.css('height', $('#blank').css('height'));
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
                    openModal('Incorrect. Wrong tries: ' + ++wrongTries);
                }
            }
        });
    });

    $('#submit').click(function () {
        if (checkTextAnswer($('#blank').val(), retrieved))
            finish(wrongTries);
        else
            openModal('Incorrect. Wrong tries: ' + ++wrongTries);
    });
}

function finish(wrongTries) {
    updateScore(wrongTries);

    chrome.storage.local.get('siteQueue', function (items) {
        chrome.storage.local.remove(['singleton', 'siteQueue']);
        setCooldown(function () {

            // open queued sites in other tabs
            for (let i = 1; i < items.siteQueue.length; i++) {
                chrome.tabs.create({
                    url: items.siteQueue[i],
                    active: false
                });
            }
            // replace current tab with the first queued site
            window.location.replace(items.siteQueue[0]);
        });
    });
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

/**
 * 
 * @param {Function} callback 
 */
function setCooldown(callback) {
    chrome.storage.sync.get('cooldown_info', function (items) {
        chrome.storage.local.set({ cooldown_lock: new Date().getTime() + items.cooldown_info.duration }, callback);
    });
}

function openModal(message) {
    if (message)
        $('#modal-text').text(message);
    $('.modal').addClass('is-active');
    $('html').addClass('is-clipped');
}

function closeModal() {
    $('.modal').removeClass('is-active');
    $('html').removeClass('is-clipped');
}

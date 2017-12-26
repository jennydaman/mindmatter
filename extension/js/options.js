var blacklist_array;
var subjects;

//these functions are called when the corresponding key page is loaded.
const inflators = {

    'settings.html': function () {

        chrome.storage.sync.get('cooldown_info', function (items) {
            $(`form#cooldown-radio input[name="coold"][value="${  items.cooldown_info.duration  }"]`).prop('checked', true);
        });

        $('form#cooldown-radio input[name="coold"]').click(function () {
            chrome.storage.sync.set({
                cooldown_info: {
                    duration: Number($(this).val()),
                    english: $(`label[for="${  $(this).attr('id')  }"`).text().toLowerCase()
                }
            });
        });

        let notificationsCheckbox = $('#notification-checkbox');
        chrome.permissions.contains({ permissions: ['notifications'] }, function (result) {
            notificationsCheckbox.prop('checked', result);
        });
        notificationsCheckbox.change(function () {
            if (this.checked) {
                chrome.permissions.request({ permissions: ['notifications'] }, function (granted) {
                    notificationsCheckbox.prop('checked', granted);
                });
            }
            else
                chrome.permissions.remove({permissions: ['notifications']});
        });
        $('footer').css('display', 'initial');
    },
    'blacklist.html': function () {

        blacklist_array.forEach(function (site) {
            addRowToBlacklist(site);
        });

        $('.addBtn').click(function () {
            checkBLInput();
        });
        //enter key pressed in text field 
        $('#bl_input').keyup(function (e) {
            if (e.which === 13) {
                //Disable textbox to prevent multiple submit
                $(this).attr('disabled', 'disabled');
                checkBLInput();
                //Enable the textbox again if needed.
                $(this).removeAttr('disabled');
            }
        });
        $('footer').css('display', 'none');
    },
    'subjects.html': function () {
        chrome.storage.sync.get('question_index', function (items) {
            $('#subjects-block').append(JSON.stringify(items.question_index)
                .replace(/{"enabled"/gi, '<br /><br />{"enabled"')
                .replace(/{"chance"/gi, '<br />{"chance"')
                .replace(/],/gi, '],<br />'));
        });
        $('footer').css('display', 'none');
    },
    'information.html': function () {
        $('footer').css('display', 'initial');
    }
};

$(document).ready(function () {

    $('.header a').click(function (e) { //when any link from header is clicked...

        $('.header a').removeClass('active'); //deselect all links
        $(this).addClass('active'); //make selected link have darker background

        $('#heading').html($(this).text()); //set heading
        let pageName = $(this).attr('href');

        //inject html into app div, then call appropriate inflator 
        $('#app').load(pageName, inflators[pageName]);
        e.preventDefault(); //the links were fake all along. SAD!
    });

    //first, load data from storage
    chrome.storage.sync.get(['blacklist_array', 'subjects'], function (items) {
        blacklist_array = items.blacklist_array;
        subjects = items.subjects;

        $('#settings_ln').trigger('click'); //open the settings page at start
    });
});

/**
 * Updates the displayed blacklist and overwrites blacklist_array in chrome.storage.sync
 * @param {string} site 
 */
function addRowToBlacklist(site) {

    let destroyButton = $('<button>').attr({class: 'destroy'});
    let row = $('<li>').append($('<label>').text(site), destroyButton);

    destroyButton.click(function (e) {
        blacklist_array.splice(blacklist_array.indexOf(site), 1);
        chrome.storage.sync.set({ blacklist_array: blacklist_array });
        row.remove();
    });

    $('#blacklist').append(row);
}

/**
 * Retrives the text from the input field and evaluates it.
 * If the input is valid, it is added to the blacklist.
 * @param {string} site 
 * @return {boolean} false if the blacklist already contains site.
 */
function checkBLInput() {

    let site = $('#bl_input').val().trim();

    if (site.length == 0) {
        buttonWarning('Text field empty!');
        return false;
    }

    if (blacklist_array.indexOf(site) != -1) {
        buttonWarning('Already Registered!');
        return false;
    }

    let smallSite = site.toLowerCase();
    const validChars = 'abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&\'()*+,;=`.';

    for (let i = 0; i < smallSite.length; i++) {
        //bad URL 
        if (!validChars.includes(smallSite.charAt(i))) {

            //easter eggs, nothing here kiddo
            if (smallSite == 'free speech')
                buttonWarning('The Internet is not your safe space!');
            else if (smallSite == 'jennings zhang')
                buttonWarning('bm &#x1f622;'); //sad emoji
            else if (smallSite.includes('pepe'))
                buttonWarning('REEEEEEE');
            else
                buttonWarning('Invalid URL!');
            return false;
        }
    }

    blacklist_array.push(site);
    chrome.storage.sync.set({ blacklist_array: blacklist_array });
    addRowToBlacklist(site);
    $('#bl_input').val(''); //clear input field
    return true;
}

//changes the text of the "Add to blacklist" button temporarily for 2 seconds.
function buttonWarning(warning) {

    let orig = $('.addBtn').text();
    $('.addBtn').html(warning);
    $('.addBtn').addClass('errMsg');
    setTimeout(function () {
        $('.addBtn').html(orig);
        $('.addBtn').removeClass('errMsg');
    }, 3000);
}

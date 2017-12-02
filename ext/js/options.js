
//these functions are called when the corresponding key page is loaded.
const inflators = {

    "settings.html": function () {

        chrome.storage.sync.get("cooldown_duration", function (items) {
            $('form#cooldown-radio input[name="coold"][value="' + items.cooldown_duration + '"]').prop('checked', true);
        });

        $('form#cooldown-radio input[name="coold"]').click(function () {
            chrome.storage.sync.set({ "cooldown_duration": [$(this).val()] });
        });
    },
    "blacklist.html": function () {

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
                $(this).attr("disabled", "disabled");
                checkBLInput();
                //Enable the textbox again if needed.
                $(this).removeAttr("disabled");
            }
        });
    },
    "subjects.html": function () {

        chrome.storage.sync.get("database", function (items) {
            $('#subjects').append(JSON.stringify(items.database));
        });

    }
}

var blacklist_array;
var subjects;


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
    chrome.storage.sync.get(["blacklist_array", "subjects"], function (items) {
        blacklist_array = items.blacklist_array;
        subjects = items.subjects;

        $("#settings_ln").trigger("click"); //go to blacklist by default 
    });
});

/**
 * Updates the displayed blacklist (not the one in chrome.storage)
 * @param {string} site 
 */
function addRowToBlacklist(site) {

    var row = $('<li>').append(
        $('<label>').text(site), $('<button>').attr({
            class: "destroy",
        })
    )

    row.click(function (e) {

        blacklist_array.splice(blacklist_array.indexOf(site), 1);
        chrome.storage.sync.set({ "blacklist_array": blacklist_array });
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
        buttonWarning("Text field empty!");
        return false;
    }

    if (blacklist_array.indexOf(site) != -1) {
        buttonWarning("Already Registered!");
        return false;
    }

    let smallSite = site.toLowerCase();
    const validChars = "abcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=`."

    for (let i = 0; i < smallSite.length; i++) {
        //bad URL 
        if (!validChars.includes(smallSite.charAt(i))) {

            //easter eggs, nothing here kiddo
            if (smallSite == "free speech")
                buttonWarning("The Internet is not your safe space!");
            else if (smallSite == "jennings zhang")
                buttonWarning("bm &#x1f622;"); //sad emoji
            else if (smallSite.includes("pepe"))
                buttonWarning("REEEEEEE");
            else
                buttonWarning("Invalid URL!");
            return false;
        }
    }

    blacklist_array.push(site);
    chrome.storage.sync.set({ "blacklist_array": blacklist_array });
    addRowToBlacklist(site);
    $('#bl_input').val(""); //clear input field
    return true;
}

//changes the text of the "Add to blacklist" button temporarily for 2 seconds.
function buttonWarning(warning) {

    let orig = $(".addBtn").text();
    $(".addBtn").html(warning);
    $(".addBtn").addClass("errMsg");
    setTimeout(function () {
        $(".addBtn").html(orig);
        $(".addBtn").removeClass("errMsg");
    }, 3000);
}

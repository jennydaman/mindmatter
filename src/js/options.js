
$(document).ready(function () {
    $('.header a').click(function (e) { //link from header
        $('.header a').removeClass('active'); 
        $(this).addClass('active');

        //alert($(this).attr('id'));
        e.preventDefault();
    });




    $("#blacklist_ln").trigger("click"); //go to blacklist by default 
});



function addToBlacklist() {
    /*chrome.storage.sync.get("blacklist_array", function (items) {
        items.blacklist_array.push("the stuff from the field");
    });*/

    alert("function addToBlackList called");
}
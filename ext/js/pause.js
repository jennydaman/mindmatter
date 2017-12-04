document.addEventListener('DOMContentLoaded', function () {

    var box = document.getElementById('pause-toggle');

    //load preexisting setings from memory
    chrome.storage.local.get(['pause', 'cooldown_date'], function (items) {
        if (items.cooldown_date) {
            box.checked = false;
            document.getElementById('offswitch-label').className += ' onCooldown'; //change content
        }
        else
            box.checked = !items.pause;
    });

    box.addEventListener('change', function () {

        //if toggle while on cooldown, active is set; Cooldown manually canceled.
        if (box.checked) {
            chrome.storage.local.remove('cooldown_date');
            document.getElementById('offswitch-label').className = 'onoffswitch-inner'; //reset content
        }

        chrome.storage.local.set({ pause: !box.checked });
        chrome.runtime.sendMessage({ pause: box.checked }); //synchronize popup and options toggles if both open
    });

    chrome.runtime.onMessage.addListener(function (request) {
        if (request.pause != undefined)
            box.checked = request.pause;
        if (request.cooldown == 'done') { //cooldown timer ran out automatically
            document.getElementById('offswitch-label').className = 'onoffswitch-inner';
            chrome.storage.local.get('pause', function(items) {
                box.checked = !items.pause;
            });
        }
    });
});

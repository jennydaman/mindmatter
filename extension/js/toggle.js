/*
 * Basic logic of pause toggle.
 * Set initial display
 * Update chrome.storage when toggle is clicked
 * Update toggle when cooldown is done
 */
document.addEventListener('DOMContentLoaded', function () {

    var box = document.getElementById('pause-toggle');

    //load preexisting settings from memory
    chrome.storage.local.get(['pause', 'cooldown_lock'], function (items) {
        if (items.cooldown_lock) {
            box.checked = false;
            document.getElementById('offswitch-label').className += ' onCooldown'; //change content
        }
        else
            box.checked = !items.pause;
    });

    box.addEventListener('click', function () {

        //if toggle while on cooldown, active is set; Cooldown manually canceled.
        if (box.checked) {
            chrome.storage.local.remove('cooldown_lock');
            document.getElementById('offswitch-label').className = 'onoffswitch-inner'; //reset content
        }

        chrome.storage.local.set({ pause: !box.checked });
    });

    //change toggle when cooldown runs out
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.cooldown_lock) {
            if (!changes.cooldown_lock.newValue) {
                chrome.storage.local.get('pause', function(items) {
                    box.checked = !items.pause;
                });
            }
            else {
                box.checked = false;
                document.getElementById('offswitch-label').className += ' onCooldown'; //change content
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    var box = document.getElementById("pause-toggle");

    chrome.storage.local.get("pause", function (items) {

        box.checked = items.pause;
    });

    box.addEventListener('change', function () {

        chrome.storage.local.set({ pause: box.checked });
        chrome.runtime.sendMessage({ pause: box.checked }); //synchronize popup and options toggles if both open
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        if (request.pause != undefined)
            box.checked = request.pause;
    })
});



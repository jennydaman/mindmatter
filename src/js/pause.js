document.addEventListener('DOMContentLoaded', function () {

    var box = document.getElementById("pause-toggle");

    box.addEventListener('change', function () {

        chrome.storage.sync.set({ pause: box.checked });
    });
});



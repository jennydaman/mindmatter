//sync the state of the toggle with popup.js
var box = document.getElementById('pause-toggle');

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'local' && changes.pause)
        box.checked = !changes.pause.newValue;
});

box.checked = false;
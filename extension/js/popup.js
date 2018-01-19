// show state of chrome.storage
chrome.storage.sync.get(['blacklist_array', 'cooldown_info', 'consistency'], function (items) {

    if (!items.blacklist_array[0])
        items.blacklist_array[0] = 'none';
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += `, ${items.blacklist_array[i]}`;
    document.getElementById('blacklist').innerText = `${str}]`;
    document.getElementById('cooldown').innerHTML = `${items.cooldown_info.english} <light>(${items.cooldown_info.duration})</light>`;

    let score = items.consistency.score / items.consistency.total * 10;
    document.getElementById('consistency-score').innerText = `${score.toFixed(2)}${score > 9 ? ' :)' : score < 5 ? ' :(' : ''}`;
});

/*
 * This function invokes itself.
 * Renders a timer that counts down until the cooldown expires.
 * The timer updates every second based on the current state of cooldown_lock.
 * If cooldown_lock exists, then this function will call itself again after a second.
 * If cooldown_lock no longer exists, it will stop calling itself.
 */
(function countdownTimer() {
    //https://www.w3schools.com/howto/howto_js_countdown.asp
    chrome.storage.local.get('cooldown_lock', function (items) {
        let cdArea = document.getElementById('cooldown-timer');

        if (!items.cooldown_lock) {
            cdArea.innerText = 'online';
            return;
        }

        setTimeout(countdownTimer, 1000); //countdown isn't over, call itself again after a second

        let distance = items.cooldown_lock - new Date().getTime();

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let timeLeft_english = `${seconds}s`;
        if (minutes) {
            timeLeft_english = `${minutes}m ${timeLeft_english}`;
            if (hours) {
                timeLeft_english = `${hours}h ${timeLeft_english}`;
                if (days)
                    timeLeft_english = `${days}d ${timeLeft_english}`;
            }
        }

        cdArea.innerText = timeLeft_english;
    });
})();

document.querySelector('#go-to-options').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
});

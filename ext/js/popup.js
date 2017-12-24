// show state of chrome.storage
chrome.storage.sync.get(['blacklist_array', 'cooldown_info', 'consistency'], function (items) {

    if (!items.blacklist_array[0])
        items.blacklist_array[0] = 'none';
    let str = '['.concat(items.blacklist_array[0]);
    for (let i = 1; i < items.blacklist_array.length; i++)
        str += `, ${  items.blacklist_array[i]}`;
    document.getElementById('dirty-blacklist').innerText = `${str  }]`;
    document.getElementById('dirty-coold').innerText = `${items.cooldown_info.duration
    }  (${  items.cooldown_info.english  })`;

    let score = items.consistency.score / items.consistency.total * 10;
    document.getElementById('consistency-score').innerText = `${score.toFixed(2)}${score > 9 ? ' :)' : score < 5 ? ' :(': ''}`;
});

chrome.storage.local.get(['cooldown_lock', 'pause'], function (items) {
    document.getElementById('extra').innerHTML += `${'<br />' 
        + 'cooldown_lock: '}${  items.cooldown_lock ? items.cooldown_lock.english : 'off'
    }<br />pause: ${  items.pause}`;
});

document.querySelector('#go-to-options').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
});

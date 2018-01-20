/**
 * Checks for rich notifications permission before
 * dispatching a type=basic notification with the brain-in-pot icon.
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} alert in case this is super duper importanto, use a JS alert
 */
function notif(title, message, alert = false) {
    chrome.permissions.contains({
        permissions: ['notifications']
    }, function (result) {
        if (result) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: '/assets/brain-in-pot128.png',
                title: title,
                message: message
            });
        }
        else if (alert)
            alert(message);
    });
}

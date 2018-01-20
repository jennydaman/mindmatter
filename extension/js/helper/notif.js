/**
 * Checks for rich notifications permission before
 * dispatching a type=basic notification with the brain-in-pot icon.
 * @param {string} title 
 * @param {string} message 
 */
function notif(title, message) {
    return new Promise(function (resolve, reject) {
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
                resolve();
            }
            else
                reject();
        });
    });
}

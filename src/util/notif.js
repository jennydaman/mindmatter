/**
 * Checks for rich notifications permission before
 * dispatching a type=basic notification with the brain-in-pot icon.
 * @param {string} title 
 * @param {string} message 
 */
export default function notif(title, message) {
    return new Promise((resolve, reject) => {
        chrome.permissions.contains({
            permissions: ['notifications']
        }, result => {
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

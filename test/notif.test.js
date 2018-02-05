const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const sinon = require('sinon');

describe('notif.js', function () {

    before(function () {
        global.chrome = require('sinon-chrome/extensions');
    });

    const notif = require('../extension/js/util/notif.js').default;

    it('should reject Promise when permission is not granded', function() {

        chrome.notifications.create.reset();
        chrome.permissions.contains.callsArgWith(1, false);
        return notif().catch(() => {
            expect(chrome.notifications.create).to.have.not.been.called;
        });
    });

    it('should call chrome.notification.create', function() {

        chrome.notifications.create.reset();
        chrome.permissions.contains.callsArgWith(1, true);
        return notif().then(() => {
            expect(chrome.notifications.create).to.have.been.called;
        })
    });
});

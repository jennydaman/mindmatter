const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const sinon = require('sinon');

describe('notif.js', function () {

    const bl = {
        blacklist_array: ['youtube.com', 'facebook.com',
            'reddit.com', 'buzzfeed.com']
    };

    global.chrome = require('sinon-chrome/extensions');
    const checkSite = require('../extension/js/lib/detect.js').default;

    before(function () {
        chrome.storage.local.set.callsArg(1);
    });

    beforeEach(function () {
        chrome.storage.sync.get.callsArgWith(1, bl);
        global.window = {
            location: {
                replace: sinon.spy(),
                href: 'https://www.reddit.com/r/ProgrammerHumor/'
            }
        }
    });

    it('should call window.location.replace on blacklisted sites', function () {
        checkSite(undefined, false);
        expect(window.location.replace).to.have.been.calledOnce;
    });

    it('should do nothing for any other website', function () {
        window.location.href = 'https://developer.chrome.com/extensions/tabs';
        checkSite(undefined, false);
        expect(window.location.replace).to.have.not.been.called;
    });

    it('should do nothing when pause or cooldown_lock is set', function () {

        checkSite(undefined, true);
        checkSite(1600000000000, false);
        expect(window.location.replace).to.have.not.been.called;
    });

    it('should do nothing given an empty blacklist_array', function () {
        chrome.storage.sync.get.callsArgWith(1, { blacklist_array: [] });
        checkSite(undefined, false);
        expect(window.location.replace).to.have.not.been.called;
    });
});

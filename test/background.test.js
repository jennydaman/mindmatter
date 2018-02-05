const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const sinon = require('sinon');

describe('backgroundController.js', function () {
    
    before(function () {
        global.chrome = require('sinon-chrome/extensions');
    });

    const bk = require('../extension/js/lib/backgroundController.js');
    var background;

    beforeEach(function() {
        background = new bk.BackgroundModule();
    });

    afterEach(function() {
        background = undefined;
    });

    it('should complete init (attached with onInstalled.addListener)', function () {

        const defaultSettings = {
            blacklist_array: ['youtube.com', 'facebook.com', 'reddit.com', 'buzzfeed.com'],
            cooldown_info: {
                duration: 300000,
                english: '5 minutes'
            },
            consistency: []
        };

        let spy = sinon.spy(bk, 'init');
        try {
            bk.init();
        } catch (e) {
            expect(spy).to.have.thrown(e);
        }

        const installReason = { reason: 'install' };
        let refreshSuccess = sinon.stub().returns(new Promise(resolve => resolve()));
        chrome.storage.local.set.onSecondCall().callsArg(1);

        return new Promise(resolve =>
            bk.init(installReason, defaultSettings, refreshSuccess, resolve))
            .then(resolve => { // do it again, but pretend that subjects refresh failed

                chrome.storage.local.set.reset();
                let refreshFail = sinon.stub().returns(new Promise((resolve, reject) => reject()));
                bk.init(installReason, defaultSettings, refreshFail, resolve);
            });
    });

    it('should clear question page singleton lock after cooldown_lock is assigned', function () {
        chrome.storage.sync.get.callsArgWith(1, { cooldown_info: { duration: 300000 } });
        chrome.storage.onChanged.trigger({ cooldown_lock: { newValue: 1600000000000 } });

        expect(background.cooldown_timeout).to.be.an('object');
        expect(background.questionSingleton).to.be.a('null');
        expect(background.siteQueue).to.be.a('null');

        // clear cooldown timeout
        chrome.storage.onChanged.trigger({ cooldown_lock: { newValue: null } });
    });

    it('should regulate the question singleton page lock', function () {

        chrome.tabs.remove.reset();

        let responseSpy = sinon.spy();
        let websites = ['url.com'];
        let firstTab = 2;

        // first website to attach
        chrome.runtime.onMessage.trigger({ trigger: websites[0] }, { tab: { id: firstTab } }, responseSpy);
        expect(background.questionSingleton).to.equal(firstTab);
        expect(background.siteQueue).to.eql(websites);
        expect(responseSpy).to.have.been.calledWith({ siteQueue: websites });
        expect(chrome.tabs.remove).to.have.not.been.called;
        responseSpy.reset();
        chrome.tabs.remove.reset();
        // a second tab opens
        websites.push('second.com');
        chrome.runtime.onMessage.trigger({ trigger: websites[1] }, { tab: { id: 5 } }, responseSpy);
        expect(background.questionSingleton).to.equal(firstTab);
        expect(background.siteQueue).to.eql(websites);
        expect(responseSpy).to.have.not.been.called;
        expect(chrome.tabs.remove).to.have.been.called;
        responseSpy.reset();
        chrome.tabs.remove.reset();
        // pretend that question page was refreshed
        chrome.runtime.onMessage.trigger({ trigger: 'refresh' }, { tab: { id: firstTab } }, responseSpy);
        expect(background.questionSingleton).to.deep.equal(firstTab);
        expect(background.siteQueue).eql(websites);
        expect(responseSpy).to.have.been.calledWith({ siteQueue: websites });
        expect(chrome.tabs.remove).to.have.not.been.called;

        // questions page closed
        chrome.tabs.onRemoved.trigger(firstTab);
        expect(background.questionSingleton).to.be.a('null');
        expect(background.siteQueue).to.be.a('null');
    });

    // for the sake of coverage
    it('should handle updates with attachCooldownHandler and chrome.runtime.onSuspend.addListener', function () {

        let spy = sinon.spy(background, 'attachRefreshHandler');
        try {
            background.attachRefreshHandler();
        } catch (e) {
            expect(spy).to.have.thrown(e);
        }

        spy = sinon.spy();
        let interval = 6.048e8;
        var clock = sinon.useFakeTimers(new Date());
        background.attachRefreshHandler(spy, interval);
        chrome.runtime.onStartup.trigger(spy);
        clock.tick(interval);
        expect(spy).to.have.been.called;

        chrome.storage.local.remove.reset();
        chrome.runtime.onSuspend.trigger();
        expect(chrome.storage.local.remove).to.have.been.calledWith('cooldown_lock');

        clock.restore();
    });
    it('should remove cooldown_lock on .coolDone()', function () {
        chrome.storage.local.remove.reset();
        new bk.BackgroundModule().coolDone();
        expect(chrome.storage.local.remove).to.have.been.calledWith('cooldown_lock');
    });
});

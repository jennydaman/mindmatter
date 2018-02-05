const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const sinon = require('sinon');

describe('question.js', function () {

    before(function () {
        global.chrome = require('sinon-chrome/extensions');
    });

    const q = require('../extension/js/question/question.js');
    var question;

    beforeEach(function () {
        question = new q.Question();
    });
    afterEach(function () {
        question = undefined;
    });

    it('should connectWithBackground', function () {
        let correctQueue = ['url.com', 'website.com'];
        chrome.runtime.sendMessage.reset();
        chrome.runtime.sendMessage.callsArgWith(1, { siteQueue: correctQueue });

        return question.connectWithBackground().then(() => {
            expect(chrome.runtime.sendMessage).to.have.been.calledOnce;
            expect(question.siteQueue).to.eql(correctQueue);
        });
    });

    it('should getTrigger', function () {
        chrome.storage.local.get.reset();
        chrome.storage.local.remove.reset();

        let correctURL = 'url.com';

        chrome.storage.local.get.callsArgWith(1, { trigger: correctURL });
        return q.Question.getTrigger().then(triggerURL => {
            expect(triggerURL).to.equal(correctURL);
            expect(chrome.storage.local.remove).to.have.been.calledWith('trigger');
        });
    });

    it('should return "refresh" as trigger if trigger key is empty', function () {
        chrome.storage.local.get.callsArgWith(1, { trigger: null });
        return q.Question.getTrigger().then(triggerURL => {
            expect(triggerURL).to.equal('refresh');
        });
    });

    it('should intercept URLs of additional blacklisted sites being opened', function () {
        let spy = sinon.spy();
        let correctQueue = ['url.com', 'website.com'];
        let anotherWebsite = 'sad.com';
        chrome.tabs.getCurrent.callsArgWith(0, { index: 1, windowId: 2 });
        chrome.tabs.highlight.reset();

        question.siteQueue = correctQueue.slice(); //pretend we've connectWithBackground
        question.attachTabListener(spy);
        chrome.runtime.onMessage.trigger(
            { trigger: anotherWebsite }, { tab: { id: 300 } }, sinon.spy());
        expect(chrome.tabs.highlight).to.have.been.calledOnce;
        correctQueue.push(anotherWebsite);
        expect(spy).to.have.been.calledWith(correctQueue);
    });

    it('should bumpScore', function () {

        chrome.storage.sync.set.reset();
        chrome.storage.sync.set.callsArg(1);
        let correctConsistency = [true, true, false, true, true, false, true, false, true];
        chrome.storage.sync.get.callsArgWith(1, { consistency: correctConsistency.slice() });
        return question.bumpScore(true).then(() => {
            expect(question.wrongTries).to.equal(0);
            correctConsistency.push(true);
            expect(chrome.storage.sync.set).to.have.been.calledWithMatch({ consistency: correctConsistency });
            chrome.storage.sync.get.callsArgWith(1, { consistency: correctConsistency.slice() });
            question.bumpScore(false).then(() => {
                expect(question.wrongTries).to.equal(1);
            });
        });
    });

    it('should openOtherTabs', function () {
        chrome.tabs.create.reset();
        question.siteQueue = ['hello.com', 'nice.com', 'ok.com'];
        question.openOtherTabs();
        expect(chrome.tabs.create).to.have.been.calledWithMatch({ url: 'nice.com', active: false });
        expect(chrome.tabs.create).to.have.been.calledWithMatch({ url: 'ok.com', active: false });
    });

    it('should setCooldown', function () {
        chrome.storage.sync.get.callsArgWith(1, { cooldown_info: { duration: 300000 } });
        chrome.storage.local.set.callsArg(1);
        return q.Question.setCooldown();
    });

    it('should pick a question URL', function () {
        chrome.storage.sync.get.callsArgWith(1, { indexStructure: require('./2018-02-04-subjects.json') });

        return q.pick().then(questionURL => {
            expect(questionURL).to.have.string('json');
        });
    });
});

const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
chai.use(require('sinon-chai'));

require('babel-polyfill');
require('babel-register');

describe('background.js', function () {

    before(function () {

        global.chrome = require('sinon-chrome/extensions');
        back = require('../extension/js/background.js');
    });

    it('should complete onInstalled.addListener', done => {

        // avoid real XHR
        let refreshSubjects = sinon.stub().returns(new Promise(resolve => resolve()));

        chrome.storage.local.set.onSecondCall().callsArg(1);
        chrome.runtime.onInstalled.trigger({ reason: 'install' }, refreshSubjects, done);
    });
});

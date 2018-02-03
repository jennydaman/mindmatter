require("babel-register");
const goodTest = require('../extension/js/lib/testTest.js');
const expect = require('chai').expect;

describe('testTest', function() {
    it('should work', function() {
        
        expect(goodTest.default()).to.equal(4);
    });
});

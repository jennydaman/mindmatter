const expect = require('chai').expect;

describe('Metadata', function () {

    var packageFile = require('../package.json');
    var manifestFile = require('../extension/manifest.json');

    it('should be consistent in both manifest.json and package.json', function () {

        expect(manifestFile.author.name).to.equal(packageFile.author.name);
        expect(manifestFile.author.email).to.equal(packageFile.author.email);

        expect(manifestFile.description).to.equal(packageFile.description);
        expect(manifestFile.homepage_url).to.equal(packageFile.homepage);

        expect(manifestFile.version).to.equal(packageFile.version);
        expect(manifestFile.version_name).to.include(manifestFile.version);
    });
});
describe('Metadata', function () {

    var packageFile = require('../package.json');
    var manifestFile = require('../manifest.json');

    it('version data should be consistent between manifest.json and package.json', function () {

        expect(manifestFile.author).toBe(packageFile.author.name);
        expect(manifestFile.description).toBe(packageFile.description);
        expect(manifestFile.homepage_url).toBe(packageFile.homepage);

        expect(manifestFile.version).toBe(packageFile.version);
        expect(manifestFile.version_name).toEqual(expect.stringContaining(manifestFile.version));
    });
});
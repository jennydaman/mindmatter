/*
* TODO: load questions from chrome.storage.
* TODO: score, repeat
*/
var blacklistRegex;
var blacklist_array = [];

/**
 * This function will either add or remove a site from the regex, depending
 * on whether the blacklist_array already contains or does not contain the site.
 * @param {string} site
 */
function updateBlacklist(site) {

	var index = blacklist_array.indexOf(site);
	if (index == -1)
		blacklist_array.push(site);
	else {
		blacklist_array.splice(index, 1);
		blacklistRegex = '/a^/'; //this will not match anything
		return;
	}

	//blacklist_array has been updated, now update blacklistRegex
	blacklistRegex = '/';

	for (index = 0; index < blacklist_array.length - 1; index++) {
		blacklistRegex += '(' + blacklist_array[index] + ')|';
	}

	//add last one
	blacklistRegex += '(' + blacklist_array[blacklist_array.length - 1] + ')/';
	//console.log("blacklistRegex update: " + blacklistRegex);
}

/**
 * activate declarativeContent.showPageAction() when visiting a blacklisted site.
 */
chrome.runtime.onPageChanged.addListener(function () {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([{
			//if URL matches regex
			conditions: [new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlMatches: blacklistRegex } })],
			//shows the extension's page action.
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

/**
 * loads stored blacklist into memory.
 *
 */
chrome.runtime.onStartup.addListener(function () {

	chrome.storage.sync.get('blacklist_save', function (items) {
		blacklist_array = items.blacklist_save;
	});

	//TODO asynchronous XMLHTTPRequest to update questions from remote host.
});

/**
 * saves the current blacklist from memory to local storage.
 */
chrome.runtime.onSuspend.addListener(function () {

	chrome.storage.sync.set({ 'blacklist_save': blacklist_array })
});

/**
 * initializes some sites in the blacklist when the extension is first installed.
 */
chrome.runtime.onInstalled.addListener(function () {

	updateBlacklist("facebook.com");
	updateBlacklist("youtube.com");
	updateBlacklist("reddit.com");
	updateBlacklist("tumblr.com");

	retrieveQuestionsFromLocal();


});

function retrieveQuestionsFromLocal() {

	var xhr = new XMLHttpRequest();

	xhr.open("GET", chrome.extension.getURL("local_qa/subjects_list.csv"), false);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			//xhr.responseText;ls -1d */  Subject,$(stat -c %Y)
		}
	}
	xhr.send();
	return JSON.parse(fileContents);
}

/*//this will first update blacklistarray, then it will regenerate the blacklistRegex.
chrome.storage.onChanged.addListener(function(changes, namespace) {

});*/


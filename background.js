/*
* TODO: load questions from chrome.storage.
* TODO: score, repeat
*/
var blacklistRegex;
var blacklist_array = [];

/**
 * Handles a request to get blacklist_array.
 */
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request == "blacklist please")
			sendResponse(blacklist_array.toString());
	})

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
 * loads stored blacklist into memory.
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

	retrieveQuestionsAtStart();
});


/**
 * QUESTION STORAGE STANDARD
 * 
 * The key 'subjects' will point to a list containing the keys to question sets. 
 * The question set keys will point to another list of question objects. 
 * Question objects have a key called 'qpath' that points to the URL of the question info.
 * 
 * This function will register some questions to start off with. 
 */
function retrieveQuestionsAtStart() {
}

/*//this will first update blacklistarray, then it will regenerate the blacklistRegex.
chrome.storage.onChanged.addListener(function(changes, namespace) {

});*/


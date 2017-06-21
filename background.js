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

	//TODO get some starter questions
});


/**
* Handles a request to get variables from the background script. 
* 
* <code>please variable</code> will return the requested variable. 
* Avaliable variables: 
* {list} blacklist_array
*  
*/
chrome.runtime.onMessage.addListener(

	function (request, sender, sendResponse) {
		if (request == "please blacklist_array")
			sendResponse(blacklist_array);
	});

function resetStorage() {

	chrome.storage.sync.get(null, function (items) {

		var allKeys = [];
		for (var key in items)
			allKeys.push(key);

		chrome.storage.sync.remove(allKeys, console.log("All keys removed"));
	})
}


/*
* TODO: load questions from chrome.storage.
* TODO: score, repeat
*/

var blacklistRegex = '/a^/';

/**
 * 
 * @param {string[]} array 
 */
function regenRegex(array) {

	if (array.length == 0) {
		blacklistRegex = '/a^/';
		return;
	}

	blacklistRegex = '/';

	for (let index = 0; index < array.length - 1; index++)
		blacklistRegex += '(' + array[index] + ')|';

	//add last one
	blacklistRegex += '(' + array[array.length - 1] + ')/';
}

//regenerate the regex on startup 
chrome.runtime.onStartup.addListener(function () {
	chrome.storage.sync.get("blacklist_array", function (items) {
		regenRegex(items.blacklist_array);
	});
});



//THIS IS TEMPORARY 
chrome.runtime.onInstalled.addListener(function () {

	chrome.storage.sync.set({"blacklist_array": ["youtube.com", "facebook.com"]});
});
//chrome.runtime.onSuspend.addListener(function () {});


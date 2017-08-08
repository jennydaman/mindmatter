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
		return blacklistRegex;
	}

	blacklistRegex = '/';

	for (let index = 0; index < array.length - 1; index++) {

		const specialChars = "$*+?.():=!,[]";
		//insert backslashes in front of special regexp characters
		for (let i = 0; i < array[index].length; i++) {
			if (specialChars.includes(array[index].charAt(i)))
				array[index] = array[index].substring(0, i) + '\\' + array[index].substring(i);
		}

		blacklistRegex += '(' + array[index] + ')|';

		return blacklistRegex;
	}

	//add last one
	blacklistRegex += '(' + array[array.length - 1] + ')/';
}

//regenerate the regex on startup 
chrome.runtime.onStartup.addListener(function () {
	chrome.storage.sync.get("blacklist_array", function (items) {
		regenRegex(items.blacklist_array);
	});
});

//regenerate the regex when blacklist updates 
chrome.storage.onChanged.addListener(function (changes, areaName) {
	if (changes["blacklist_array"])
		regenRegex(changes["blacklist_array"].newValue);
});

//automatically set up some blacklisted sites.
chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({ "blacklist_array": ["youtube.com", "facebook.com", "reddit.com", "buzzfeed.com"] });
});
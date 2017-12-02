
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
				array[index] = array[index].substring(0, i) + '\\' + array[index].substring(i++);
			//i++ prevents infinite loop
		}

		blacklistRegex += '(' + array[index] + ')|';

		return blacklistRegex;
	}

	//add last one
	blacklistRegex += '(' + array[array.length - 1] + ')/';
}

//regenerate the regex on startup 
chrome.runtime.onStartup.addListener(function () {

	refreshDB();
	var refresher = setInterval(refreshDB, 6.048e8); //update every week
	chrome.runtime.onSuspend.addListener(function () {
		clearInterval(refresher);
	});
});

//regenerate the regex when blacklist updates 
chrome.storage.onChanged.addListener(function (changes, areaName) {
	if (changes["blacklist_array"])
		regenRegex(changes["blacklist_array"].newValue);
});

//automatically set up some blacklisted sites.
chrome.runtime.onInstalled.addListener(function () {

	chrome.storage.sync.get("setup", function (items) {

		if (items.setup)
			return; //extension already initialized 

		chrome.storage.sync.set({
			"blacklist_array": ["youtube.com", "facebook.com", "reddit.com", "buzzfeed.com"],
			//setup: true
		});
		chrome.storage.local.set({ pause: true });

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://jennydaman.github.io/mindmatter/subjectsDB.json", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == xhr.DONE)
				chrome.storage.sync.set({ database: JSON.parse(xhr.responseText) });
		}
		xhr.send();

		chrome.runtime.openOptionsPage(function () {
			alert("Thanks for installing Mind Matter! Please check out this options page."
				+ "\nSelect a few subjects that interest you. Then, head over to the blacklist "
				+ "tab and add some of your own URLs.");
		});
	});
});

// alerts the user if they are visiting a blacklisted site
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

	chrome.storage.sync.get("blacklist_array", function (items) {
		
		for (let i = 0; i < items.blacklist_array.length; i++) 
			if (changeInfo.url.includes(items.blacklist_array[i])) 
				alert("You are visiting the blacklisted site: " + changeInfo.url);
	
	});
	
}); 

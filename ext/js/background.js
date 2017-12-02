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
		chrome.storage.sync.set({ "blacklistRegex": [regenRegex(changes["blacklist_array"].newValue)] });
});

//automatically set up some blacklisted sites.
chrome.runtime.onInstalled.addListener(function () {

	chrome.storage.sync.get("setup", function (items) {

		if (items.setup)
			return; //extension already initialized 

		chrome.storage.sync.set({
			"blacklist_array": ["youtube.com", "facebook.com", "reddit.com", "buzzfeed.com"],
			"cooldown_duration": "300000"
			//setup: true
		});
		chrome.storage.local.set({ pause: false });

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

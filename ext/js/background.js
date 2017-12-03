chrome.runtime.onStartup.addListener(function () {

	refreshDB();
	var refresher = setInterval(refreshDB, 6.048e8); //update every week
	chrome.runtime.onSuspend.addListener(function () {
		clearInterval(refresher);
	});
});

//automatically set up some blacklisted sites.
chrome.runtime.onInstalled.addListener(function () {

	chrome.storage.sync.get("setup", function (items) {

		if (items.setup)
			return; //extension already initialized 

		chrome.storage.sync.set({
			"blacklist_array": ["youtube.com", "facebook.com", "reddit.com", "buzzfeed.com"],
			"cooldown_duration": "300000",
			"cooldown_english": "5 minutes"
			//setup: true
		});
		chrome.storage.local.set({ pause: false });
		chrome.storage.local.remove("cooldown_date");

		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://jennydaman.github.io/mindmatter/subjectsDB.json", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == xhr.DONE)
				chrome.storage.sync.set({ database: JSON.parse(xhr.responseText) });
		}
		xhr.send();

		chrome.runtime.openOptionsPage(function () {
			chrome.notifications.create({
				type: "basic",
				iconUrl: "/assets/brain-in-pot128.png",
				title: "Mind Matter: First Install",
				message: "Thanks for installing Mind Matter! Here are the settings. Be sure to review the blacklist."
			});
		});
	});
});

//set the cooldown timer
chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (changes.cooldown_date && changes.cooldown_date.newValue) {

		chrome.storage.sync.get("cooldown_english", function (items) {
			chrome.notifications.create({
				type: "basic",
				iconUrl: "/assets/brain-in-pot128.png",
				title: "Mind Matter: Cooldown",
				message: "You are correct! I'll leave you alone for " + items.cooldown_english + "."
			});
		});

		chrome.storage.sync.get("cooldown_duration", function (items) {
			setTimeout(coolDone, items.cooldown_duration);
		});
	}
});

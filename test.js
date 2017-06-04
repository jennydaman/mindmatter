chrome.runtime.sendMessage("blacklist please", function(response) {

	document.write("Blacklist: ", response);
})
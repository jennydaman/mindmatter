
var blacklistRegex;
var blacklist_array = [];

//this will first update blacklistarray, then it will regenerate the blacklistRegex.
chrome.storage.onChanged.addListener(function (changes, namespace) {

  for (key in changes) {

    var storageChange = changes[key];

    if (storageChange.newValue == null) { //remove the host from blacklistRegex
      blacklist_array.splice(blacklist_array.indexOf(storageChange.newValue), 1);
    }
    else { //add the host to blacklistRegex
      blacklist_array.push(storageChange.newValue);
    }

  }
  //blacklist_array has been updated, now update blacklistRegex
  blacklistRegex = '/';

  for (index = 0; index < blacklist_array.length - 1; index++) {
    blacklistRegex += '(' + blacklist_array[index] + ')|';
  }

  //add last one
  blacklistRegex += '(' + blacklist_array[blacklist_array.length - 1] + ')/';

  console.log("blacklistRegex update: " + blacklistRegex);
});



// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {

  //initializes some sites in the blacklist
  chrome.storage.sync.set({ 'blacklist': "www.facebook.com" })
  chrome.storage.sync.set({ 'blacklist': "www.youtube.com" })
  chrome.storage.sync.set({ 'blacklist': "www.reddit.com" })
  //TODO don't overwrite on updates!!!!

  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {

        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: blacklistRegex },
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});


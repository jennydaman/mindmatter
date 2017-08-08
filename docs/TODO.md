# Functionality

Javascript injection: 
https://developer.chrome.com/extensions/tabs

```javascript
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
```

http://jqueryui.com/themeroller/

# Future features

prompt user with option to download starter questions and add URLs to blacklist on install.

Score

Avoid repetition 

predownload question sets option for offline use 

allow user to disable the functionality - toggle in popup and options 

# Notes
force evaluation with [myVar]




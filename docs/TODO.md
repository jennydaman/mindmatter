# Functionality
Use the chrome.webRequest API to observe and analyze traffic and to intercept, block, or modify requests in-flight. 
https://developer.chrome.com/extensions/declarativeContent
https://developer.chrome.com/extensions/pageAction


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



# Future features

prompt user with option to download starter questions and add URLs to blacklist on install.

Score

Avoid repetition 

# Notes
force evaluation with [myVar]
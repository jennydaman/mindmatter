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

Avoid repetition 

# Notes
force evaluation with [myVar]

html fieldset


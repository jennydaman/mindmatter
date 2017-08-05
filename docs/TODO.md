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

http://jqueryui.com/themeroller/
```html
	<!-- ui-dialog -->
	<div class="ui-widget-overlay ui-front"></div>
	<div style="position: absolute; width: 320px; left: 50px; top: 30px; padding: 1.2em" class="ui-widget ui-front ui-widget-content ui-corner-all ui-widget-shadow">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
	</div>
```

http://developit.github.io/preact-todomvc/

TODOMVC list
https://www.w3schools.com/howto/howto_js_todolist.asp


# Future features

prompt user with option to download starter questions and add URLs to blacklist on install.

Score

Avoid repetition 

predownload question sets option for offline use 

Build the UI using jQuery UI, maybe switch to React in the future?


# Notes
force evaluation with [myVar]
Reorganize directories after I figure out react...
build, lib, src/js, test, 

# Manifest 

options version 2 
offline enabled 
shared modules 
homepage url 
requirements 


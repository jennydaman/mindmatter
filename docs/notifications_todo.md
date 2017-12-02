```javascript

//background.js
chrome.notifications.onButtonClicked.addListener(function (notID, buttonIndex) {

	if (notID == "new-subject")
		chrome.runtime.openOptionsPage();
});


                if (newSubject)
                    chrome.notifications.create("new-subject", {
                        type: "basic",
                        title: "New subject avaliable",
                        message: "There's a new subject avaliable for Mind Matter. You may enable it in the options page.",
                        iconUrl: chrome.runtime.getURL("/assets/brain-in-pot_alpha.png"),
                        buttons: [{ title: "Go to options" }]
                    });


```
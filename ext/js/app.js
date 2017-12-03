//This content script is injected into every page.
chrome.storage.local.get(["cooldown_date", "pause"], function (items) {

    if (items.cooldown_date || items.pause)
        return;

    chrome.storage.sync.get("blacklist_array", function (items) {

        for (let i = 0; i < items.blacklist_array.length; i++) { //TODO better way of checking
            if (location.href.includes(items.blacklist_array[i])) {
                showQuestion();
                return;
            }
        }
    });
});

function showQuestion() {

    alert("Mind Matter");
    //TODO: catch 404 errors by refreshing database
    chrome.storage.sync.get("database", function (items) {

        //add all questions to one big array
        let allQuestions = [];
        items.database.subjects.forEach(subjectInfo => {
            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });

        let qpath = allQuestions[Math.random() * allQuestions.length | 0].qpath;
        var xhr = new XMLHttpRequest();
        alert("bouta get " + qpath);
        xhr.open("GET", qpath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {

                let user_response = "";

                retrieved = JSON.parse(xhr.response);

                while (!user_response.includes(retrieved.answer)) {
                    if (user_response != "")
                        alert("Wrong, please try again.");
                    user_response = prompt("MindMatter"
                        + "\n" + retrieved.question);
                }
                alert("Correct!");
            }
        }
        xhr.send();
    });

    chrome.storage.sync.get("cooldown_duration", function (items) {
        chrome.storage.local.set({ "cooldown_date": [new Date()] }, function () {
            setTimeout(coolDone, items.cooldown_duration);
        });
    });
}

function coolDone() {
    chrome.storage.local.remove("cooldown_date");
    alert("Cooldown over");
}
/*
 * all questions will get a chance variable equal to totalQuestions.
 * any specific question will have a probability of being chosen of chance/totalChance
 * when a question is chosen, its chance decreases to 0.
 * when a question with less than totalQuestions chance is not chosen, it's chance increases.
 */

function refreshDB() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://jennydaman.github.io/mindmatter/subjectsDB.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == xhr.DONE) {

            let db = JSON.parse(xhr.responseText);

            //do nothing if nothing's new
            if (old.database.updateTime == db.updateTime)
                return;

            chrome.storage.sync.get("database", function (old) {

                //create a Map where keys are question URLs, keys point to a question's timeSE and chance
                let qmap = new Map();
                old.database.subjects.forEach(function (subject) {
                    subjects.questions.forEach(function (question) {

                        qmap.set(question.qpath, {
                            "timeSE": question.timeSE,
                            "chance": question.chance == old.database.totalQuestions ? db.totalQuestions : question.chance
                            //if question.chance was max, then update it with the db.totalQuestions value
                        });
                    });
                });

                var newSubject = false;

                db.subjects.forEach(function (subject) {

                    subject["enabled"] = false; //new subjects default to disabled 
                    for (let i = 0; i < old.database.subjects.length; i++) {

                        //found old subject data 
                        if (old.database.subjects[i].subjectStorageKey == subject.subjectStorageKey) {

                            //enable subject if it was enabled before
                            subject["enabled"] = old.database.subjects[i].enabled;

                            //update every question
                            subject.forEach(function (question) {

                                let oldData = qmap.get(question.qpath);

                                //if question was updated, chance is refreshed
                                question["chance"] = oldData.timeSE == question.timeSE ? oldData.chance : db.totalQuestions;
                            });
                            return;
                        }
                    } //at end of for loop, means this subject is new
                    newSubject = true;
                    subject.forEach(function (question) {
                        question["chance"] = db.totalQuestions;
                    });

                });

                if (newSubject)
                    chrome.notifications.create("new-subject", {
                        type: "basic",
                        title: "New subject avaliable",
                        message: "There's a new subject avaliable for Mind Matter. You may enable it in the options page.",
                        iconUrl: chrome.runtime.getURL("/assets/brain-in-pot_alpha.png"),
                        buttons: [{ title: "Go to options" }]
                    });

            });
        }

        xhr.send();
    };
}

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

            let updated_database = JSON.parse(xhr.responseText);

            //do nothing if nothing's new
            if (old.database.updateTime == updated_database.updateTime)
                return;

            chrome.storage.sync.get("database", function (old) {

                //create a Map where keys are question URLs, keys point to a question's timeSE and chance
                let qmap = new Map();
                old.database.subjects.forEach(function (subject) {
                    subjects.questions.forEach(function (question) {

                        qmap.set(question.qpath, {
                            "timeSE": question.timeSE,
                            "chance": question.chance == old.database.totalQuestions ? updated_database.totalQuestions : question.chance
                            //if question.chance was max, then update it with the db.totalQuestions value
                        });
                    });
                });

                var newSubject = false;

                //loop through every subject
                //TODO unsyntactic break and immutable objects, this doesnt work and needs a complete rewrite
                allSubjects_loop:
                updated_database.subjects.forEach(function (updatedSubject) {
                    updatedSubject["enabled"] = false; //new subjects default to disabled 

                    // try to find the updated subject in the old database

                    for (let i = 0; i < old.database.subjects.length; i++) {
                        if (old.database.subjects[i].subjectStorageKey == updatedSubject.subjectStorageKey) {

                            //enable subject if it was enabled before
                            updatedSubject["enabled"] = old.database.subjects[i].enabled;

                            //update every question
                            updatedSubject.forEach(function (question) {

                                let oldData = qmap.get(question.qpath);
                                //if question is new/updated, then refresh chance
                                question["chance"] = oldData.timeSE == question.timeSE ? oldData.chance : updated_database.totalQuestions;
                                break allSubjects_loop;
                            });
                        }
                    } //if loop finishes without breaking, that means this subject is new
                    newSubject = true;
                    updatedSubject.forEach(function (question) {
                        question["chance"] = updated_database.totalQuestions;
                    });
                });
                chrome.storage.sync.set({
                    "database": updated_database,
                    //setup: true
                });
            });
        }
        xhr.send();
    };
}

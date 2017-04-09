function getQuestion() { //random subject, random 

    var allSubjects = readJSONFile('/qa/LS.json');



    document.writeln(allSubjects);
    //var subjectsPathName = 'chrome-extension://@@extension_id/qa'

    //var questionNames = JSON.parse(LS);
    //var theQuestion = questionNames[getRandomInt(0, questionNames.length)]

    document.writeln("end getQuestion")
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function readJSONFile(path) {

    var fileContents;
    var xhr = new XMLHttpRequest();

    xhr.open("GET", chrome.extension.getURL(path), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            fileContents = xhr.responseText;
        }
    }
    xhr.send();
    return JSON.parse(fileContents);
}

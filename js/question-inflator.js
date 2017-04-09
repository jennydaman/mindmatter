//TODO 15 minute cooldown 
//CSS
//automatically pop up
//overlay 


document.writeln("<h1>Systole - random education</h1>")
document.writeln("<p>Attempting to access</p>") // + window.location.host

var q_info = getQuestion();

document.write(q_info.question);

var q_order = shuffle([0, 1, 2, 3]);

a_choice = q_info.choices[q_order[0]]
b_choice = q_info.choices[q_order[1]]
c_choice = q_info.choices[q_order[2]]
d_choice = q_info.choices[q_order[3]]


function getQuestion() { //random subject, random 

    var allSubjects = readJSONFile('/qa/LS.json');
    var theQuestion = allSubjects[getRandomInt(0, allSubjects.length)];
    return readJSONFile("/qa/" + theQuestion);
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


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/*
document.getElementById("submit_button").onclick = function() {
    checkAns();
};*/

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('submit_button');
    // onClick's logic below:
    link.addEventListener('click', function () {
        checkAns();
    });
});



function checkAns() {

    var checked;
    if (document.getElementById('al').checked) {
        checked = a_choice;
    }
    else if (document.getElementById('bl').checked) {
        checked = b_choice;
    }
    else if (document.getElementById('cl').checked) {
        checked = c_choice;
    }
    else if (document.getElementById('al').checked) {
        checked = d_choice;
    }

    if (checked.explain == true) {
        document.writeln("Correct");
    }

    else {
        document.writeln(checked.explain);
    }
}
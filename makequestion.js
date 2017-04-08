//TODO 15 minute cooldown 



var xhr = new XMLHttpRequest();
var content;
xhr.open('GET', chrome.extension.getURL('data/blacklist'), true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {

    document.write("therz a fuckin flower")
    content = xhr.responseText;
    document.write("no more please")
  }
};

document.write(content);
document.write("done")
xhr.send();


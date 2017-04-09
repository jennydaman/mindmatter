checkAns()
function checkAns() {

    alert("submit was clicked");

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
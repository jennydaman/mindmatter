function getQuestion() { //random subject, random 

    var subjectsPathName = 'chrome-extension://@@extension_id/qa'

    //Components.utils.import("resource://gre/modules/FileUtils.jsm");
    //var subjectsDir = new FileUtils.File(subjectsPathName);
    var subjectsDir = new Packages.java.io.File(subjectsPathName);
    var subjectsList = subjectsDir.listFiles();
    
}
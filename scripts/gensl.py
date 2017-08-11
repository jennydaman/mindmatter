#!/usr/bin/env python3

import os
import json
import sys

baseurl = "https://jennydaman.github.io/mindmatter"

subjectsDir = "subjects/"
if len(sys.argv) > 1:
    subjectsDir = sys.argv[1]

"""Creates an array of dictionaries.
Dictionaries have a subject name and an array of questions."""
subjectStructure = {
    'subjects': [{'subjectStorageKey': subjectName, 'subjectName': subjectName, "questions": []} for subjectName in next(os.walk(subjectsDir))[1]],
    'totalQuestions': 0
}

for subjectDict in subjectStructure['subjects']:

    sdir = "/" + subjectDict['subjectStorageKey']

    titleFName = subjectsDir + sdir + "/title"

    if os.path.isfile(titleFName):
        subjectDict['subjectName'] = open(
            titleFName, 'r').read(32).replace("\n", "")

    for questionFile in next(os.walk(subjectsDir + sdir))[2]:

        if not questionFile.endswith(".json"):
            continue
        qdir = sdir + "/" + questionFile
        subjectDict['questions'].append({"qpath": baseurl + "/subjects" + qdir, "timeSE": os.path.getmtime(subjectsDir + qdir)})
        subjectStructure['totalQuestions'] += 1

print(json.dumps(subjectStructure, sort_keys=True, indent=4))

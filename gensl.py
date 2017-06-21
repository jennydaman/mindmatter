#!/usr/bin/env python3

import os
import json
import sys

baseurl = "https://jennydaman.github.io/mindmatter"

if len(sys.argv) > 1:
    baseurl = sys.argv[1]

subjectsDir = "./subjects/"

"""Creates an array of dictionaries.
Dictionaries have a subject name and an array of questions."""
subjectStructure = [{'subjectStorageKey': subjectName, 'subjectName': subjectName, "questions": []}
                    for subjectName in next(os.walk(subjectsDir))[1]]


for subjectDict in subjectStructure:

    sdir = "/" + subjectDict['subjectStorageKey']

    titleFName = "." + sdir + "/title"
    if os.path.isfile(titleFName):
        subjectDict['subjectName'] = open(
            titleFName, 'r').read(32).replace("\n", "")

    for questionFile in next(os.walk(subjectsDir + sdir))[2]:

        if not questionFile.endswith(".json"):
            continue
        qdir = sdir + "/" + questionFile
        subjectDict['questions'].append(
            {"qpath": baseurl + "/subjects" + qdir, "timeSE": os.path.getmtime(subjectsDir + qdir)})

print(json.dumps(subjectStructure, sort_keys=True, indent=4))

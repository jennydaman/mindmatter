#!/usr/bin/env python3

import os
import json
import sys
from calendar import timegm
from time import gmtime

baseurl = "https://jennydaman.github.io/mindmatter"

srootDir = "subjects"
if len(sys.argv) > 1:
    srootDir = sys.argv[1]

subjectStructure = {
    'subjects': [{'subjectFolder': subjectName, 'subjectName': subjectName, "questions": []} for subjectName in next(os.walk(srootDir))[1]],
    'totalQuestions': 0,
    'gmtime': timegm(gmtime())
}

for currentSubject in subjectStructure['subjects']:

    titleFName = srootDir + "/" + currentSubject['subjectFolder'] + "/title"

    if os.path.isfile(titleFName):
        currentSubject['subjectName'] = open(titleFName, 'r').read(36).replace("\n", "")

    for questionFileName in next(os.walk(srootDir + "/" + currentSubject['subjectFolder']))[2]:

        qdir = srootDir + "/" + currentSubject['subjectFolder'] + "/" + questionFileName
        if not questionFileName.endswith(".json"):
            print('W: [SKIP] ' + qdir, file=sys.stderr)
            continue

        questionData = json.load(open(qdir))
        if not 'question' in questionData:
            print('E [Missing question] ' + qdir, file=sys.stderr)
            sys.exit()
        if not 'answer' in questionData:
            print('E [Missing answer] ' + qdir, file=sys.stderr)
            sys.exit()
        if not 'type' in questionData or questionData['type'] not in ['blank']:
            print('E [invalid question type] ' + qdir, file=sys.stderr)
            sys.exit()

        currentSubject['questions'].append({"qpath": baseurl + "/" + qdir, "mtime": os.path.getmtime(qdir)})
        subjectStructure['totalQuestions'] += 1


for subject in subjectStructure["subjects"]:
    subject["enabled"] = True
    for question in subject["questions"]:
        question["chance"] = subjectStructure['totalQuestions']

print(json.dumps(subjectStructure, sort_keys=True, indent=4))

#!/usr/bin/env python3

import os
import json
import sys
import argparse
from calendar import timegm
from time import gmtime

def errNothing():
    pass
def errExit():
    sys.exit(1)

ap = argparse.ArgumentParser()
ap.add_argument("-f", "--force", action="store_const", const=errNothing, default=errExit, dest="errorAction",
                help="skip file on error instead of quit")
ap.add_argument("--folder", type=str, default="subjects",
                help="specify the root folder of the subjects")
ap.add_argument("--url", type=str, default="https://jennydaman.github.io/mindmatter",
                help="URL of remote server hosting the questions")
args = ap.parse_args()


subjectStructure = {
    'subjects': [{'subjectFolder': subjectName, 'subjectName': subjectName, "questions": []} for subjectName in next(os.walk(args.folder))[1]],
    'totalQuestions': 0,
    'gmtime': timegm(gmtime())
}

for currentSubject in subjectStructure['subjects']:
    for questionFileName in next(os.walk(args.folder + "/" + currentSubject['subjectFolder']))[2]:

        qdir = args.folder + "/" + \
            currentSubject['subjectFolder'] + "/" + questionFileName
        if not questionFileName.endswith(".json"):
            if questionFileName == 'title':
                currentSubject['subjectName'] = open(
                    qdir, 'r').read(36).replace("\n", "")
            else:
                print('W: [SKIP] ' + qdir, file=sys.stderr)
            continue
        try:
            questionData = json.load(open(qdir))
        except ValueError:
            print('E: [ValueError] ' + qdir, file=sys.stderr)
            args.errorAction()
        if not 'question' in questionData:
            print('E [Missing question] ' + qdir, file=sys.stderr)
            args.errorAction()
        if not 'answer' in questionData:
            print('E [Missing answer] ' + qdir, file=sys.stderr)
            args.errorAction()
        if not 'type' in questionData or questionData['type'] not in ['blank']:
            print('E [invalid question type] ' + qdir, file=sys.stderr)
            args.errorAction()

        currentSubject['questions'].append(
            {"qpath": args.url + "/" + qdir, "mtime": os.path.getmtime(qdir)})
        subjectStructure['totalQuestions'] += 1


for subject in subjectStructure["subjects"]:
    subject["enabled"] = True
    for question in subject["questions"]:
        question["chance"] = subjectStructure['totalQuestions']

print(json.dumps(subjectStructure, sort_keys=True, indent=4))

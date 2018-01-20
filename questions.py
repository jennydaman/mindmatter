#!/usr/bin/env python3.6

import os
import shutil
import json
import yaml
import sys
import argparse
from calendar import timegm
from time import gmtime

def nothing():
    pass

def errExit():
    sys.exit(1)


ap = argparse.ArgumentParser()
ap.add_argument("-f", "--force", action="store_const", const=nothing, default=errExit, dest="errorAction",
                help="skip file on error instead of quit")
ap.add_argument("-v", "--verbose", action="store_true", default=False, dest="verbose")
ap.add_argument("--folder", type=str, default="subjects",
                help="specify the root folder of the subjects")
ap.add_argument("--url", type=str, default="https://jennydaman.github.io/mindmatter",
                help="URL of remote server hosting the questions")
ap.add_argument("--build-dir", type=str, default="build", dest="buildDir",
                help="specify the folder to write to")
ap.add_argument("--result-file", type=str, default="subjects.json", dest="resultFile",
                help="specify which file to write the JSON index")
ap.add_argument("--dry-run", action="store_false", default=True, dest="shouldWrite",
                help="prevent writing to files")
ap.add_argument("--overwrite", action="store_true", default=False,
                help="Destroy contents of occupied build directory before writing.")
args = ap.parse_args()

if args.shouldWrite:
    if os.path.exists(args.buildDir):
        if os.listdir(args.buildDir):
            if args.overwrite:
                shutil.rmtree(args.buildDir)
                os.makedirs(args.buildDir)
            else:
                print('Build error: ' + args.buildDir +
                    " is not empty.", file=sys.stderr)
                sys.exit(1)
    else:
        os.makedirs(args.buildDir)

subjectStructure = {
    'subjects': [{'folder': subjectName, 'name': subjectName, "questions": []} for subjectName in next(os.walk(args.folder))[1]],
    'totalQuestions': 0,
    'gmtime': timegm(gmtime())
}

for currentSubject in subjectStructure['subjects']:
    os.makedirs(args.buildDir + "/" + currentSubject["folder"])
    for questionFileName in next(os.walk(args.folder + "/" + currentSubject['folder']))[2]:

        questionLocation = args.folder + "/" + \
            currentSubject['folder'] + "/" + questionFileName

        if not (questionFileName.endswith(".yml") or questionFileName.endswith(".yaml")):
            if questionFileName == 'title':
                currentSubject['name'] = open(
                    questionLocation, 'r').read(36).replace("\n", "")
            else:
                print('E: [File extension is not YAML] ' +
                      questionLocation, file=sys.stderr)
                args.errorAction()
            continue

        healthy = True
        try:
            # json.load(open(questionLocation))
            questionData = yaml.load(open(questionLocation, 'r').read())
        except yaml.YAMLError:
            print('E: [YAMLError] ' + questionLocation, file=sys.stderr)
            args.errorAction()
            healthy = False
        if not 'question' in questionData:
            print('E [Missing question] ' + questionLocation, file=sys.stderr)
            args.errorAction()
            healthy = False
        if not 'answer' in questionData:
            print('E [Missing answer] ' + questionLocation, file=sys.stderr)
            args.errorAction()
            healthy = False
        if not 'type' in questionData or questionData['type'] not in ['blank']:
            print('E [invalid question type] ' +
                  questionLocation, file=sys.stderr)
            args.errorAction()
            healthy = False

        if healthy:
            questionJSON = currentSubject["folder"] + "/" + questionFileName[0:len(questionFileName)-4] + "json"
            if args.verbose:
                print(questionJSON)
            currentSubject['questions'].append(
                {"url": args.url + "/" + questionJSON, "mtime": os.path.getmtime(questionLocation)})
            subjectStructure['totalQuestions'] += 1
            if args.shouldWrite:
                with open(args.buildDir + "/" + questionJSON, "w") as questionOut:
                    questionOut.write(json.dumps(questionData))
            

for subject in subjectStructure["subjects"]:
    subject["enabled"] = True
    for question in subject["questions"]:
        question["chance"] = subjectStructure['totalQuestions']

if args.shouldWrite:
    with open(args.buildDir + "/" + args.resultFile, "w") as resultFile:
        resultFile.write(json.dumps(subjectStructure, sort_keys=True, indent=2))
    with open(args.buildDir + "/" + "README.md", "w") as readmeFile:
        readmeFile.write("# Mind Matter Static\nThis branch hosts files for questions.")

#!/usr/bin/env python3

import os
import json

"""Creates an array of dictionaries.
Dictionaries have a subject name and an array of questions."""
subjectStructure = [{"subject": subjectName, "questions": []}
                    for subjectName in next(os.walk('.'))[1]]

for subjectDict in subjectStructure:

    # TODO replace subject[0][0] with title of subject
    sdir = "/" + subjectDict['subject']

    titleFName = "." + sdir + "/metatitle"
    if (os.path.isfile(titleFName)):
        subjectDict['subject'] = open(titleFName, 'r').read(32).replace("\n", "")

    for questionFile in next(os.walk("." + sdir))[2]:

        qdir = sdir + "/" + questionFile
        subjectDict['questions'].append({"qpath": qdir, "timeSE": os.path.getmtime("." + qdir)})

print(json.dumps(subjectStructure, sort_keys=True, indent=4))

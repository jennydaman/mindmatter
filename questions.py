#!/usr/bin/env python3.6
import os
import shutil
import json
import yaml
import sys
import argparse
from time import time
import logging as log


ap = argparse.ArgumentParser()
ap.add_argument('-f', '--force', dest='errorAction',
                help='skip file on error instead of quit')
ap.add_argument('-v', '--verbose', action='store_true')
ap.add_argument('--subjects', type=str, default='subjects',
                help='specify the root folder of the subjects')
ap.add_argument('--url', type=str, default='https://jennydaman.github.io/mindmatter',
                help='URL of remote server hosting the questions')
ap.add_argument('--folder', type=str, default='build', dest='folder',
                help='specify the folder to write to')
ap.add_argument('--dry-run', action='store_false', dest='shouldWrite',
                help='prevent writing to files')
ap.add_argument('--dirty', action='store_true',
                help="skip removal of files in output directory")
args = ap.parse_args()
log.info('[CONFIG]: url=' + args.url)

log.basicConfig(
    format="%(levelname)s %(message)s", level=log.INFO if args.verbose else log.ERROR)

subjectStructure = {
    'subjects': [{'folder': subjectName, 'name': subjectName, 'questions': []} for subjectName in next(os.walk(args.subjects))[1]],
    'totalQuestions': 0,
    'gmtime': time()
}
log.debug(subjectStructure)

if not os.path.isdir(args.folder):
    os.makedirs(args.folder)
elif os.listdir(args.folder) and not args.dirty:
    shutil.rmtree(args.folder)
    log.info('deleted everything in ' + args.folder)
    os.makedirs(args.folder)


# for currentSubject in subjectStructure['subjects']:

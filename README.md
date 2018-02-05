# Mind Matter questions database

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0977355da469486c9e9f2dd32f3350e1)](https://www.codacy.com/app/jennydaman/mindmatter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jennydaman/mindmatter&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/jennydaman/mindmatter.svg?branch=questions)](https://travis-ci.org/jennydaman/mindmatter)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/jennydaman/mindmatter/pulls)

This branch hosts the source for Mind Matter's global questions.

Questions are represented by YAML files. This branch `questions` will be built by TravisCI. The script `questions.py` proofreads questions for errors before converting them to JSON files in the `/build` directory. `questions.py` will also generate an index of all the questions available, which is produced as `/build/subjects.json`. The `/build` directory is deployed to `gh-pages`.

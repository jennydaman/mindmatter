# Mind Matter questions database

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/jennydaman/mindmatter/pulls)

Static server that provides global questions for Mind Matter.

Questions are represented by YAML files. This branch `questions` will be built by TravisCI. The script `questions.py` proofreads questions for errors before exporting the questions as JSON files to the `/build` directory. This directory is deployed to `gh-pages`.

# Mind Matter questions database

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/jennydaman/mindmatter/pulls)

Static server that provides global questions for Mind Matter.

Questions are represented as JSON questions. Most attribute-value pairs have not been implemented yet through the client Chrome extension.

When new questions are added, the `subjectsDB.json` file should be manually regenerated.

```bash
scripts/gensl.py > subjectsDB.json
```

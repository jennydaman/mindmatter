# Systole Questions Host

http://jennydaman.github.com/systole hosts the question database for systole. 

Subfolders of /subjects holds JSON files that represent questions. 
/subjects/*/metatitle stores a pretty title for the specific subject. 

/questionTemplate.json represents the standard question format.

Systole will communicate with this host using XMLHTTPRequests. 
/subjects_list.json is a list of all the questions and lists. 

To regenerate subjects_list.json:
```shell
./gensl.py > subjects_list.json
```

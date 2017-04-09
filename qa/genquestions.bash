#!/bin/bash


#buffer=$(ls -d */)
ls_buffer=$(ls | grep "json")
IFS=$'\n' read -rd '' -a allQuestions <<<"$ls_buffer"

echo "["

index=0
while [ $index -le $((${#allQuestions[@]} - 2)) ]
do
    question=${allQuestions[index]}
    if [[ $question != *"LSR"* ]]; then
        echo "    \"$question\","
    fi
    ((index++))
done


question=${allQuestions[-1]}
if [[ $question != *"LSR"* ]]; then
    echo "    \"$question\"" #exclude the comma on last question
fi 

echo "]"
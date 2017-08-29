import csv
import re
import random
import sys

messages=[]
indexOfReply = []

sourcefile = sys.argv[2]
with open(sourcefile,'r') as inputfile:
    for row in csv.reader(inputfile):
        messages.append(row)

#searchWord = raw_input("Enter word to search:")
searchWord = sys.argv[1]

for line in messages:       #get each line
    if searchWord in line[1]:   #get message part of each line
        indexOfReply.append((messages.index(line))+1) #increment loop count to get next string
        continue #check for other occurences

myReplyLine = messages[random.choice(indexOfReply)][1] #store the reply from index

replyText = myReplyLine.split(':', -1)  #get the reply text only
print replyText[-1]     #print the reply text

#!/bin/bash
if [ "$1" == "Debug" ]
then 
        /usr/bin/node --inspect-brk app.js 
else 
        /usr/bin/node app.js
fi

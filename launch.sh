#!/bin/bash
if [ "$1" == "Debug" ]
then 
        /usr/bin/nodejs --inspect-brk app.js 
else 
        /usr/bin/nodejs app.js
fi

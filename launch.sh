#!/bin/bash
/usr/bin/node ./app.js &
$($(which google-chrome) "http://127.0.0.1:3001/settings.html")

#!/bin/sh
set -e
cd $(readlink -f $(dirname $0))
npm install
node_modules/.bin/bower install
node_modules/.bin/grunt

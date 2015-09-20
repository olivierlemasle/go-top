#!/bin/sh
cd $(readlink -f $(dirname $0))
npm install
bower install
grunt

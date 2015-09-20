#!/bin/sh
set -e
cd $(readlink -f $(dirname $0))
npm install
bower install
grunt

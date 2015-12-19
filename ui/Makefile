.PHONY: clean

NODE_BIN := node_modules/.bin
GRUNT := $(NODE_BIN)/grunt

all: node_modules bower_components
	$(GRUNT)

build: node_modules bower_components
	$(GRUNT) build

test: node_modules bower_components
	$(GRUNT) test

bower_components: node_modules bower.json .bowerrc
	$(NODE_BIN)/bower install

node_modules: package.json
	npm install

clean:
	rm -dRf .tmp
	rm -dRf bower_components
	rm -dRf dist
	rm -dRf node_modules
	rm -dRf typings

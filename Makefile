.PHONY: version all run dist clean ui/dist
APP_NAME := go-top
SHA := $(shell git rev-parse --short HEAD)
BRANCH := $(subst /,-,$(shell git rev-parse --abbrev-ref HEAD))
VER := 0.0.7
DIR=.
VERSION = $(VER)-$(BRANCH)
BUILD := $(SHA)-$(BRANCH)

# Build Binaries setting main.version and main.build vars
LDFLAGS :=-ldflags "-X main.version $(VERSION) -X main.build $(BUILD)"
# Package target
PACKAGE :=$(DIR)/dist/$(APP_NAME).tar.gz


.DEFAULT: all

all: bin/$(APP_NAME) ui/dist

# print the version
version:
	@echo $(VERSION)
# print the name of the app
name:
	@echo $(APP_NAME)
# print the package path
package:
	@echo $(PACKAGE)


bin/$(APP_NAME): main.go
	go build $(LDFLAGS) -o $@ $<

ui/dist:
	$(MAKE) -C ui build

test:
	go install -v ./...
	$(MAKE) -C ui
	go test -v ./...

clean:
	@echo Cleaning Workspace...
	go clean ./...
	rm -dRf bin
	rm -dRf dist
	$(MAKE) -C ui clean

$(PACKAGE): all
	@echo Packaging Binaries...
	@mkdir -p tmp/$(APP_NAME)/bin
	@cp bin/$(APP_NAME) tmp/$(APP_NAME)/
	@mkdir -p tmp/$(APP_NAME)/ui
	@cp -R ui/dist/ tmp/$(APP_NAME)/ui/
	@mkdir -p $(DIR)/dist/
	tar -cf $@ -C tmp $(APP_NAME);
	@rm -rf tmp

dist: test $(PACKAGE)

package main_test

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/olivierlemasle/go-top"
)

func TestWebServer(t *testing.T) {
	resp := httptest.NewRecorder()

	main.CreateServer("ui/dist")

	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	http.DefaultServeMux.ServeHTTP(resp, req)
	if p, err := ioutil.ReadAll(resp.Body); err != nil {
		t.Fail()
	} else {
		if strings.Contains(string(p), "Error") {
			t.Errorf("header response shouldn't return error: %s", p)
		} else if !strings.Contains(string(p), `<body ng-app="uiApp"`) {
			t.Errorf("header response doen't match:\n%s", p)
		}
	}
}

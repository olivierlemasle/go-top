package main

import (
	"log"
	"net/http"

	"github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/googollee/go-socket.io"
)

func main() {
	// serve assets
	http.Handle("/", http.FileServer(http.Dir("./ui/dist")))

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		so.Join("top")
		m := make(map[string]interface{})
		m["arg1"] = "val1"

		so.Emit("test message", m)
		so.On("disconnection", func() {
			log.Println("on disconnect")
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	http.Handle("/socket.io/", server)

	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

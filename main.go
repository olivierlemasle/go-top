package main

import (
	"log"
	"net/http"
	"time"

	"github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/googollee/go-socket.io"
)

type thing struct {
	C    int
	Time time.Time
}

func fetchInfo(ch chan *thing, quit chan int) {
	for i := 0; ; i++ {
		log.Println(i)
		result := thing{i, time.Now()}
		select {
		case ch <- &result:
		case <-quit:
			log.Println("Stop")
			close(ch)
			return
		}
	}
}

func emitInfo(so socketio.Socket, ch chan *thing) {
	for t := range ch {
		so.Emit("test message", t)
		time.Sleep(time.Second)
	}
}

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

		ch := make(chan *thing)
		quit := make(chan int)
		go fetchInfo(ch, quit)
		go emitInfo(so, ch)

		so.On("disconnection", func() {
			log.Println("on disconnect")
			quit <- 0
		})
	})
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	http.Handle("/socket.io/", server)

	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

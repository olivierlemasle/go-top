package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/googollee/go-socket.io"
	"github.com/olivierlemasle/go-top/procinfo"
)

const version string = "0.0.3"

// CPUStat contains the CPU load per CPU
type CPUStat struct {
	Time    time.Time
	CPULoad []int
}

func fetchInfo(cpuStats chan *CPUStat, quit chan int) {
	for {
		cpuLoad, err := procinfo.GetCPULoad()
		if err != nil {
			log.Fatal(err)
		}
		result := CPUStat{time.Now(), cpuLoad}
		select {
		case cpuStats <- &result:
		case <-quit:
			log.Println("Stop")
			close(cpuStats)
			return
		}
	}
}

func emitInfo(socket socketio.Socket, cpuStats chan *CPUStat) {
	for t := range cpuStats {
		socket.Emit("cpuStatMessage", t)
		time.Sleep(time.Second)
	}
}

// CreateServer ...
func CreateServer(uiPath string) {
	// serve assets
	log.Printf("Serving %v on %v", uiPath, "/")
	http.Handle("/", http.FileServer(http.Dir(uiPath)))

	// serve "API"
	http.HandleFunc("/api/version", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, version)
	})
	http.HandleFunc("/api/cpuNumber", func(w http.ResponseWriter, r *http.Request) {
		cpuNumber, err := procinfo.GetCPUNumber()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Fprintf(w, strconv.Itoa(cpuNumber))
	})
	http.HandleFunc("/api/usedmem", func(w http.ResponseWriter, r *http.Request) {
		mem, err := procinfo.GetUsedMemory()
		if err != nil {
			log.Fatal(err)
		}
		fmt.Fprintf(w, strconv.Itoa(mem))
	})

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(socket socketio.Socket) {
		log.Println("on connection")
		socket.Join("top")

		cpuStats := make(chan *CPUStat)
		quit := make(chan int)
		go fetchInfo(cpuStats, quit)
		go emitInfo(socket, cpuStats)

		socket.On("disconnection", func() {
			log.Println("on disconnect")
			quit <- 0
		})
	})
	server.On("error", func(socket socketio.Socket, err error) {
		log.Println("error:", err)
	})
	log.Printf("Serving /socket.io/")
	http.Handle("/socket.io/", server)
}

func main() {
	CreateServer("./ui/dist/")
	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

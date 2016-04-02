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

const version = "0.0.7"
const stop = "stop"

const (
	cpuType = "cpu"
	memType = "mem"
)

// StatMessage ...
type StatMessage interface {
	typeString() string
}

// CPUStat contains the CPU load per CPU
type CPUStat struct {
	Time    time.Time
	CPULoad []int
}

func (m CPUStat) typeString() string {
	return "cpuStatMessage"
}

// MemStat ...
type MemStat struct {
	Time            time.Time
	UsedMemory      int
	AvailableMemory int
}

func (m MemStat) typeString() string {
	return "memStatMessage"
}

func readStat(stats chan *StatMessage, requests chan string) {
	statType := <-requests
	for {
		var result StatMessage
		switch statType {
		case stop:
			log.Println("Stop")
			close(stats)
			return
		case cpuType:
			cpuLoad, err := procinfo.GetCPULoad()
			if err != nil {
				log.Fatal(err)
			}
			result = CPUStat{time.Now(), cpuLoad}
		case memType:
			used, available, err := procinfo.GetUsedAndAvailableMemory()
			if err != nil {
				log.Fatal(err)
			}
			result = MemStat{time.Now(), used, available}
		default:
			log.Printf("Not implemented: %v", statType)
			close(stats)
			return
		}
		select {
		case stats <- &result:
		case statType = <-requests:
		}
	}
}

func emitStat(socket socketio.Socket, stats chan *StatMessage, socketID string) {
	for stat := range stats {
		typeName := (*stat).typeString()
		socket.Emit(typeName, stat)
		log.Printf("%v - Emit %v", socketID, typeName)
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

	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", func(socket socketio.Socket) {
		socketID := socket.Id()
		log.Printf("%v - Connect", socketID)
		socket.Join("top")

		stats := make(chan *StatMessage)
		requests := make(chan string)

		socket.On("statRequired", func(statType string) {
			log.Printf("%v - Stat required: %v", socketID, statType)
			requests <- statType
		})

		go readStat(stats, requests)
		go emitStat(socket, stats, socketID)

		socket.On("disconnection", func() {
			log.Printf("%v - Disconnect", socketID)
			requests <- stop
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

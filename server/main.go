package main

import (
	"fmt"
	"log"
	"net/http"

	socketio "github.com/googollee/go-socket.io"
)

func main() {
	server := socketio.NewServer(nil)
	server.OnConnect("connection", func(c socketio.Conn) error {
		fmt.Println("A user connected")
		return nil
	})

	server.OnDisconnect("disconnection", func(c socketio.Conn, s string) {
		fmt.Println("User disconnected")
	})

	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("socketio listen error: %s\n", err)
		}
	}()
	defer server.Close()

	http.Handle("/socket.io/", server)
    http.Handle("/", http.FileServer(http.Dir("./")))

	log.Println("Serving at localhost:3000...")
	log.Fatal(http.ListenAndServe("0.0.0.0:3000", nil))
}


type Request struct {
	Player string `json:"player"`
}

type Response struct {
	Paddle int `json:""`
}
package main 

import (

	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/jaorr95/othello/controller"
	"github.com/jaorr95/othello/shared/jobs"
	

)

func init() {
	log.Println("Init jobs")
	go jobs.MathchingPlayers()
}

func main() {

	mux := mux.NewRouter()

	mux.HandleFunc("/ws", controller.WebSocket)

	http.Handle("/", mux)

	log.Println("Server running on :8000")
    log.Fatal(http.ListenAndServe(":8000", nil))

}


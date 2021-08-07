package controller

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
	playerBo "github.com/jaorr95/othello/business/players"
)


func WebSocket(w http.ResponseWriter, r *http.Request){

	ws, err := websocket.Upgrade(w, r, nil, 1024, 1024) //Colocamos un buffer de lectura y escritura 
    if err != nil {
        log.Println(err)
        return
	}
	
	player, err := playerBo.NewPlayerConnection(ws)
	if err != nil {
		log.Println(err)
		return
	}

	playerBo.ListenPlayerActions(player)

}


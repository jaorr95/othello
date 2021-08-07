package game

import (
	"log"
	"github.com/gorilla/websocket"
	"github.com/jaorr95/othello/model"
	"github.com/jaorr95/othello/shared"
	"github.com/jaorr95/othello/shared/structures"

)


func InitGame(game *model.Game) {
	log.Println("Init game")
	players := game.Players

	for i, v := range players {
		name := players[1].Name()
		if i == (len(players) - 1) {
			name = players[0].Name()
		} 
		log.Println("Sending mesage to start")
		message := "Started Game"
		data := make(map[string]interface{})
		data["playerOne"] = v.Name()
		data["playerTwo"] = name
	
		dataWS := structures.NewDataWebSocket(1, message, data)
		if err := shared.SendMessageWebSocket(v.WS(), websocket.TextMessage, dataWS); err != nil {
			players[0].SetGame(nil)
			players[1].SetGame(nil)
			game = nil
			return
		}
	}
}
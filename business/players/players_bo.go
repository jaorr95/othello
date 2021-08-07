package players

import (
	"log"
	"strconv"
	"github.com/gorilla/websocket"
	"github.com/jaorr95/othello/model"
	"github.com/jaorr95/othello/shared"
	"github.com/jaorr95/othello/shared/constants"
	"github.com/jaorr95/othello/shared/structures"
	
)

func NewPlayerConnection(ws *websocket.Conn) (*model.Player, error){

	p := model.NewPlayer(ws)
	players := model.Players()
	players.AddPlayer(p)
	log.Println(players)
	message := "Conection Succesfull"
	data := make(map[string]interface{})
	data["playerOne"] = p.Name()
	dataWS := structures.NewDataWebSocket(0, message, data)
	err := shared.SendMessageWebSocket(ws, websocket.TextMessage, dataWS)
	if  err != nil {
		log.Println(err)
		players.RemovePlayer(p)
		return nil, err
	}

	log.Println("Envio de nombre de usuario " + p.Name())

	return p, nil

}


func ListenPlayerActions(player *model.Player) {
	//ws.SetReadDeadline(time.Now().Add(60 * time.Second))
	for{
		log.Println("listening...")
		_, message, err := player.WS().ReadMessage()

		if err != nil {
			model.Players().RemovePlayer(player)
			log.Println("Connection closed")
            return
		}

		action, _ := strconv.Atoi(string(message))
		switch action {

			case constants.ACTION_SEARCH:
				putPlayerOnSearching(player)
		}
	}
}


func putPlayerOnSearching(player *model.Player) {
	player.SetStatus(constants.STATUS_SEARCHING)
}
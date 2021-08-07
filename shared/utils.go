package shared

import (
	"github.com/gorilla/websocket"
	"github.com/jaorr95/othello/shared/structures"
)

func SendMessageWebSocket(ws *websocket.Conn, messageType int, data structures.DataWebSocket) error {
	if err := ws.WriteMessage(messageType, []byte(data.Json())); err != nil { 
		return err
	}

	return nil
}
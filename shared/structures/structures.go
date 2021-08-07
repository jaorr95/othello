package structures

import (
	"encoding/json"
)

type DataWebSocket struct{
	ActionType int		`json:"actionType"`
	Message string		`json:"message"`
	Data interface{}	`json:"data"`
}

func NewDataWebSocket(actionType int, message string, data interface{}) DataWebSocket {
	return DataWebSocket{ActionType: actionType, Message: message, Data: data}
}

func JsonToDataWebSocket(info string) DataWebSocket{
	dws := DataWebSocket{}
	json.Unmarshal([]byte(info), &dws)
	return dws
}

func(this *DataWebSocket) Json() []byte{
	jsonData, _ := json.Marshal(this)
	return jsonData
}
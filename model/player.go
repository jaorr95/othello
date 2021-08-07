package model

import (
	"math/rand"
	"time"
	"strconv"
	"github.com/gorilla/websocket"
)

type Player struct {
	id uint32
	name string
	status int
	game *Game
	ws *websocket.Conn
}

func NewPlayer(ws *websocket.Conn) *Player {
	p := Player{
		status: 1,
		ws: ws,
	}

	p.SetId()
	p.SetName("Player "+strconv.FormatUint(uint64(p.id), 10))
	return &p
}

func (this *Player) Id() uint32 {
	return this.id
}

func (this *Player) SetId() {
	rand.Seed(time.Now().UnixNano())
	this.id = rand.Uint32()

}

func (this *Player) Name() string {
	return this.name
}

func (this *Player) SetName(name string) {
	this.name = name
}

func (this *Player) Status() int {
	return this.status
}

func (this *Player) SetStatus(status int) {
	this.status = status
}

func (this *Player) SetGame(game *Game) {
	this.game = game
}

func (this *Player) Game() *Game {
	return this.game
}

func (this *Player) WS() *websocket.Conn {
	return this.ws
}
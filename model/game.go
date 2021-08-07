package model

type Game struct {
	Players []*Player
	Table *table
	PlayerWhite *Player
	PlayerBlack *Player

}

func NewGame() *Game {
	return &Game{Players: make([]*Player, 0, 2)}
}
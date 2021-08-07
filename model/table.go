package model

type table struct {
	cells [][]*cell
	countWhite int
	countBlack int
	turn *Player

}
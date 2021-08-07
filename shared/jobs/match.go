package jobs

import (

	"log"
	"github.com/jaorr95/othello/model"
	"github.com/jaorr95/othello/shared/constants"
	logicGame "github.com/jaorr95/othello/business/game"
	
)

func MathchingPlayers() {

	log.Println("MatchigPlayers job initialized")
	players := model.Players()
	for {
		game := model.NewGame()
		model.PlayerMutex.RLock()
		for _, v := range *players {
			
			if v.Status() == constants.STATUS_SEARCHING {

				game.Players = append(game.Players, v)
				if len(game.Players) == 2 {
					game.Players[0].SetGame(game)
					game.Players[0].SetStatus(constants.STATUS_PLAYING)
					game.Players[1].SetGame(game)
					game.Players[1].SetStatus(constants.STATUS_PLAYING)
					logicGame.InitGame(game)
					break
				}
			}
		}
		model.PlayerMutex.RUnlock()
	}
}
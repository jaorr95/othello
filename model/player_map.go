package model

import (
	"sync"
	"errors"
)

var (
	
	players PlayerMap
	PlayerMutex sync.RWMutex
	once sync.Once
)

type PlayerMap map[uint32]*Player

func init() {
	once.Do(func() {
		players = make(map[uint32]*Player)
	})
}

func Players() *PlayerMap {
	
	PlayerMutex.RLock()
	defer PlayerMutex.RUnlock()
	return &players
}


func (this *PlayerMap) AddPlayer(player *Player) {
	PlayerMutex.Lock()
	(*this)[player.id] = player
	PlayerMutex.Unlock()

}

func (this *PlayerMap) RemovePlayer(player *Player) {
	PlayerMutex.Lock()
	delete(*this, player.id)
	PlayerMutex.Unlock()
}

func (this *PlayerMap) FindPlayer(id uint32) (*Player, bool) {
	PlayerMutex.RLock()
	defer PlayerMutex.RUnlock()
	player, ok := (*this)[id]
	if ok {
		return player, true
	}
	return nil, false
}

func (this *PlayerMap) EditPlayer(id uint32, player *Player) error {
	PlayerMutex.Lock()
	defer PlayerMutex.Unlock()
	if _, ok := (*this)[id]; ok && id == player.id {
		(*this)[id] = player
		return nil
	}

	return errors.New("Player does not exist")
}

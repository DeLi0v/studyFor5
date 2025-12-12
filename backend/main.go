package main

import (
	"config/config"
	"db"
)

func main() {
	cfg := config.LoadConfig("config/config.json")
	database := db.Connect(cfg)

	// database можно использовать для запросов через GORM
}

package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Host     string `json:"localhost"`
	Port     int    `json:"5432"`
	User     string `json:"postgres"`
	Password string `json:"123"`
	DbName   string `json:"school"`
	SslMode  string `json:"disable"`
	TimeZone string `json:"Europe/Moscow"`
}

func LoadConfig(path string) Config {
	file, err := os.Open(path)
	if err != nil {
		log.Fatal("Failed to open config file:", err)
	}
	defer file.Close()

	var cfg Config
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&cfg); err != nil {
		log.Fatal("Failed to decode config:", err)
	}

	return cfg
}

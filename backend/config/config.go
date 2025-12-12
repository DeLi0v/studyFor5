package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Host       string `json:"host"`
	Port       int    `json:"port"`
	User       string `json:"user"`
	Password   string `json:"password"`
	DbName     string `json:"dbname"`
	SslMode    string `json:"sslmode"`
	TimeZone   string `json:"timezone"`
	ServerPort string `json:"server_port"` // для HTTP сервера
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

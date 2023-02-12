package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
}

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "server port to listen on")
	flag.StringVar(&cfg.env, "env", "development", "application environment (development|production)")
	flag.Parse()

	http.HandleFunc("/status", func(w http.ResponseWriter, _ *http.Request) {
		currentStatus := AppStatus{
			Status:      "available",
			Environment: cfg.env,
			Version:     version,
		}
		js, err := json.Marshal(currentStatus)
		if err != nil {
			log.Panicln(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(js)
	})
	err := http.ListenAndServe(fmt.Sprintf(":%d", cfg.port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

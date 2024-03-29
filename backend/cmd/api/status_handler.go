package main

import (
	"encoding/json"
	"net/http"
)

func (app *application) statusHandler(w http.ResponseWriter, r *http.Request) {
	currentStatus := AppStatus{
		Status:      "available",
		Environment: app.config.env,
		Version:     version,
	}
	js, err := json.Marshal(currentStatus)
	if err != nil {
		app.logger.Println(err)
		app.errorJSON(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(js)
}

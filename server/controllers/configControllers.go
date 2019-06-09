package controllers

import (
	"../models"
	u "../utils"
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

var GetConfigByUser = func(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userName := params["userName"]

	data := models.GetConfig(userName)
	resp := u.Message(true, "success")
	resp["data"] = data

	u.Respond(w, resp)

}

var AddUserConfig = func(w http.ResponseWriter, r *http.Request) {

	config := &models.Config{}
	err := json.NewDecoder(r.Body).Decode(config) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(false, "Invalid request"))
		return
	}

	resp := config.Add() //Create or update user's config
	u.Respond(w, resp)
}

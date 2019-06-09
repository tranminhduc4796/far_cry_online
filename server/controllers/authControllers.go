package controllers

import (
	"../models"
	u "../utils"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

var GetUser = func(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userName := params["userName"]

	data := models.GetUser(userName)
	resp := u.Message(true, "success")
	resp["data"] = data

	u.Respond(w, resp)

}

var Authenticate = func(w http.ResponseWriter, r *http.Request) {

	userLogin := &models.UserLogin{}
	err := json.NewDecoder(r.Body).Decode(userLogin) //decode the request body into struct and failed if any error occur
	if err != nil {
		fmt.Print(err)
		u.Respond(w, u.Message(false, "Invalid request format"))
		return
	}
	action := userLogin.Action
	user := userLogin.User
	resp := u.Message(false, "Not a valid action")
	if action == "log in" {
		resp = models.Login(user.UserName, user.Password)
	} else if action == "sign up" {
		resp = user.Create()
	}
	u.Respond(w, resp)
}

package routers

import (
	"../controllers"
	"github.com/gorilla/mux"
)

func ConfigsRoutes(router *mux.Router) *mux.Router {
	// Sign Up and Log In User
	router.HandleFunc(
		"/users",
		controllers.Authenticate).Methods("POST")

	// Get info by Username
	router.HandleFunc(
		"/users/{userName}",
		controllers.GetUser).Methods("GET")

	// Get user's config.
	router.HandleFunc(
		"/users/{userName}/configs",
		controllers.GetConfigByUser).Methods("GET")

	// Update user's config or Create user's config if not exist.
	router.HandleFunc(
		"/users/{userName}/configs",
		controllers.AddUserConfig).Methods("PUT")

	return router
}

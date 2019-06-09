package main

import (
	"fmt"
	"net/http"
	"os"

	"./routers"
	"./middleware"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	// use Jwt for router

	router = routers.ConfigsRoutes(router)

	router.Use(middleware.JwtAuthentication) //attach JWT auth middleware

	port := os.Getenv("PORT") // //Get port from .env file, we did not specify any port so this should return an empty string when tested locally
	if port == "" {
		port = "8000" //localhost
	}

	fmt.Println("Starting Server At Port:" + port)

	err := http.ListenAndServe(":"+port, router) // Launch the app, visit localhost:8000
	if err != nil {
		fmt.Print(err)
	}
}

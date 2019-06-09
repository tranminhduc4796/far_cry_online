package models

import (
	"os"
	"strings"

	u "../utils"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

/*
JWT claims struct
*/
type Token struct {
	UserName string
	jwt.StandardClaims
}

//a struct to rep user account
type User struct {
	UserName      string `json:"user_name"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Password      string `json:"password"`
	Token         string `json:"token";sql:"-"`
}

type UserLogin struct {
	User   *User  `json: "user"`
	Action string `json: "action"`
}

type UserStat struct {
	UserName string `json:"user_name"`
	Kills    uint   `json:"kills"`
	Deaths   uint   `json:"deaths"`
	Suicides uint   `json:"suicides"`
	Avatar   string `json:"avatar"`
}

//Validate incoming user details...
func (user *User) Validate() (map[string]interface{}, bool) {

	if !strings.Contains(user.Email, "@") {
		return u.Message(false, "Email address is required"), false
	}

	if len(user.Password) < 8 && len(user.Password) > 32 {
		return u.Message(false, "Password is required"), false
	}

	//Email must be unique
	temp := &User{}
	temp1 := &User{}

	//check for errors and duplicate emails
	err := GetDB().Table("users").Where("user_name = ?", user.UserName).First(temp).Error
	err1 := GetDB().Table("users").Where("email = ?", user.Email).First(temp1).Error
	if err != nil && err1 != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, "Connection error. Please retry"), false
	}

	if temp.UserName != "" {
		return u.Message(false, "Username already in use by another user."), false
	}

	if temp1.Email == user.Email {
		return u.Message(false, "Email address already in use by another user."), false
	}

	return u.Message(false, "Requirement passed"), true
}

func (user *User) Create() map[string]interface{} {

	if resp, ok := user.Validate(); !ok {
		return resp
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	GetDB().Create(user)

	if user.UserName == "" {
		return u.Message(false, "Failed to create account, connection error.")
	}

	//Create new JWT token for the newly registered account
	tk := &Token{UserName: user.UserName}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString

	user.Password = "" //delete password

	response := u.Message(true, "Account has been created")
	response["user"] = user
	return response
}

func Login(user_name, password string) map[string]interface{} {

	user := &User{}
	err := GetDB().Table("users").Where("user_name = ?", user_name).First(user).Error
	if strings.Contains(user_name, "@") {
		err = GetDB().Table("users").Where("email = ?", user_name).First(user).Error
	}
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return u.Message(false, "User or email does not exist")
		}
		return u.Message(false, "Connection error. Please retry")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword { //Password does not match!
		return u.Message(false, "Invalid login credentials. Please try again")
	}
	//Worked! Logged In
	user.Password = ""

	//Create JWT token
	tk := &Token{UserName: user.UserName}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("token_password")))
	user.Token = tokenString //Store the token in the response

	resp := u.Message(true, "Logged In")
	resp["user"] = user
	return resp
}

func GetUser(u string) *UserStat {
	user_stat := &UserStat{}
	GetDB().Table("match_stat").Where("user_name = ?", u).First(user_stat)
	return user_stat
}

package models

import (
	u "../utils"
	"github.com/jinzhu/gorm"
)

type Config struct {
	UserName string `json:"user_name"`
	Config   string `json:"config"`
}

func (config *Config) Validate() (map[string] interface{}, bool) {
	//Email must be unique
	temp := &User{}

	//check for errors and duplicate emails
	err := GetDB().Table("users").Where("user_name = ?", config.UserName).First(temp).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, "Connection error. Please retry"), false
	}
	if temp.UserName == ""{
		return u.Message(false, "User doesn't exist"), false
	}
	return u.Message(false, "Requirement passed"), true
}


func (config *Config) Add() map[string]interface{} {
	//userName must be unique per user
	currentConfig := &Config{}
	err := GetDB().Table("configs").Where("user_name = ?", config.UserName).Assign(config).FirstOrCreate(currentConfig).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(false, "Connection error. Please retry")
	}

	resp := u.Message(true, "success")
	resp["data"] = currentConfig

	return resp
}

func GetConfig(user string) *Config {

	config := &Config{}
	err := GetDB().Table("configs").Where("user_name = ?", user).First(config).Error
	if err != nil {
		return nil
	}
	return config
}

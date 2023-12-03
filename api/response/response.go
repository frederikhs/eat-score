package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func Message(code int, message string) (int, any) {
	return code, gin.H{"message": message}
}

func ResourceNotFound() (int, any) {
	return Message(http.StatusNotFound, "resource not found")
}

func ResourceAlreadyExists() (int, any) {
	return Message(http.StatusBadRequest, "resource already exists")
}

func Error(err error) (int, any) {
	return Message(http.StatusInternalServerError, err.Error())
}

func UserError(err error) (int, any) {
	return Message(http.StatusBadRequest, err.Error())
}

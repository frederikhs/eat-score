FROM golang:alpine as development
WORKDIR /app

# install development reload tool
RUN go install github.com/cespare/reflex@latest
COPY reflex.conf /usr/local/etc/

RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

COPY go.mod ./
COPY go.sum ./
RUN go mod download

CMD ["reflex", "-d", "none", "-c", "/usr/local/etc/reflex.conf"]

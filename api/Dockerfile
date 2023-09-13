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

FROM development as build
COPY . .
RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM alpine as production
COPY --from=build /go/bin/migrate /go/bin/migrate
COPY --from=build /app/migrate.sh /go/bin/migrate.sh
COPY --from=build /app/migrations /go/bin/migrations

COPY --from=build /go/bin/app /go/bin/app
COPY --from=build /app/templates /go/bin/templates
COPY --from=build /app/.env.production /go/bin/.env.production

ENV ENV=PRODUCTION

WORKDIR /go/bin
ENTRYPOINT ["/go/bin/app"]

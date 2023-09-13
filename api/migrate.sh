set -e

PATH="$PATH:/go/bin"

# load production env if in production
if [ "$ENVIRONMENT" == "PRODUCTION" ]; then
    export $(cat .env.production | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

# load development else
if [ "$ENVIRONMENT" != "PRODUCTION" ]; then
    export $(cat .env.development | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

USERNAME=$(echo $POSTGRES_USERNAME | tr -d '"')
PASSWORD=$(echo $POSTGRES_PASSWORD | tr -d '"')
HOST=$(echo $POSTGRES_HOST | tr -d '"')
DB_NAME=$(echo $DB_NAME | tr -d '"')

migrate -database "postgres://$USERNAME:$PASSWORD@$HOST:5432/$DB_NAME?sslmode=disable&search_path=public" -path migrations $@

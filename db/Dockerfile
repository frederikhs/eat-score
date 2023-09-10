FROM postgres:alpine

# Change default data location for use with commiting the image. Default use if volume, and thus NOT part of the image. This changes the data to be part of the image if commited
RUN mkdir -p /var/lib/postgresql-static/data
ENV PGDATA /var/lib/postgresql-static/data

# Settings
ENV POSTGRES_USER "eat_score"
ENV POSTGRES_PASSWORD "eat_score"
ENV POSTGRES_DB "eat_score"
ENV TZ "Europe/Copenhagen"

#!/bin/sh


echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 3
done
echo "MySQL is up - starting the application"
exec java -jar app.jar
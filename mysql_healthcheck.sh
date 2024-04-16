#!/bin/bash

# Wait for MySQL to be ready
until mysqladmin ping -hlocalhost --silent; do
  echo "Waiting for MySQL to be ready..."
  sleep 1
done

# Check if a specific table exists
if mysql -hlocalhost -uroot -p"$MYSQL_ROOT_PASSWORD" -e "USE $MYSQL_DATABASE; SELECT 1 FROM your_table LIMIT 1;" &> /dev/null; then
  exit 0  # Success
else
  exit 1  # Failure
fi
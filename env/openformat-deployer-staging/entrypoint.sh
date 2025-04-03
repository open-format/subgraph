#!/bin/bash

# Check if the PASSWORD environment variable is set
if [ -z "$PASSWORD" ]; then
    echo "ERROR: PASSWORD environment variable is not set!"
    exit 1
fi

# Create or update the .htpasswd file with the provided password
htpasswd -b -c /etc/nginx/.htpasswd admin $PASSWORD

# Start Nginx
exec "$@"

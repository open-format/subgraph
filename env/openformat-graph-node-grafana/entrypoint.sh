#!/bin/sh
# Replace auth credentials from environment variables
sed -ie "s/\${PROMETHEUS_USER}/$PROMETHEUS_USER/; s/\${PROMETHEUS_PASS}/$PROMETHEUS_PASS/" /etc/grafana/provisioning/datasources/prometheus.yaml
# Postgres variables
sed -ie "s/\${POSTGRES_HOST}/$POSTGRES_HOST/; s/\${POSTGRES_DB}/$POSTGRES_DB/" /etc/grafana/provisioning/datasources/postgres.yaml
sed -ie "s/\${POSTGRES_USER}/$POSTGRES_USER/; s/\${POSTGRES_PASS}/$POSTGRES_PASS/" /etc/grafana/provisioning/datasources/postgres.yaml

# Start Grafana
exec /run.sh
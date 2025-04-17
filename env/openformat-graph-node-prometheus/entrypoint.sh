#!/bin/sh
sed -ie "s#\${PROMETHEUS_USER}#$PROMETHEUS_USER#; s#\${PROMETHEUS_PASS_HASH}#$PROMETHEUS_PASS_HASH#" /etc/prometheus/web.yml

# Start Prometheus
exec /bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --web.config.file=/etc/prometheus/web.yml \
  --storage.tsdb.path=/prometheus \
  --web.enable-lifecycle
FROM prom/prometheus:v2.53.4
USER root
COPY ./prometheus.yml /etc/prometheus/prometheus.yml
COPY ./web.yml /etc/prometheus/web.yml
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod u+x /usr/local/bin/entrypoint.sh
RUN chown nobody:nobody /usr/local/bin/entrypoint.sh
USER nobody
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
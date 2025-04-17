FROM grafana/grafana:11.6.0

USER root
# Copy provisioning files
COPY ./provisioning /etc/grafana/provisioning
# Copy entrypoint script
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
# Ensure cookie_secure is set to true
RUN sed -i 's/;cookie_secure = false/cookie_secure = true/g' /etc/grafana/grafana.ini

RUN chmod u+x /usr/local/bin/entrypoint.sh
RUN chown grafana /usr/local/bin/entrypoint.sh
RUN chown -R grafana /etc/grafana/provisioning

USER grafana
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
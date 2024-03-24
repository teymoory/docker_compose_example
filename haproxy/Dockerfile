FROM haproxy:2.6.12
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg
RUN touch /tmp/admin.sock
EXPOSE 80
CMD [ "haproxy", "-f" , "/usr/local/etc/haproxy/haproxy.cfg" ]
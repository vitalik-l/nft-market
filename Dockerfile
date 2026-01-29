FROM nginx:1.25.2-alpine
RUN apk update && apk add --no-cache nginx-mod-http-geoip > /dev/null 2>&1
WORKDIR /etc/nginx
RUN wget https://centminmod.com/centminmodparts/geoip-legacy/GeoIP.dat.gz
RUN gunzip GeoIP.dat.gz
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY build/ .
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
 && find /usr/share/nginx/html -type f -exec chmod 644 {} \;
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
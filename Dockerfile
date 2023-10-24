FROM nginx:1.25.2-alpine
RUN apk update && apk add --no-cache geoip-dev nginx-mod-http-geoip > /dev/null 2>&1
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY build/ .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
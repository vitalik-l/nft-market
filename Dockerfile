FROM nginx:1.25.2-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY build/ .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
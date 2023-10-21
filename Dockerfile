FROM nginx:1.25.2-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/build .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN yarn
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN yarn build

FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=build /app/build .
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
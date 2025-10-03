# Stage 1: Install the npm dependencies and build the Angular web app
FROM node:22-alpine AS builder
WORKDIR /app
COPY gui/src ./src
COPY gui/*.json ./
RUN npm ci && npm run build

# Stage 2: Host the static website files in nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist/poem-quest/browser /usr/share/nginx/html
EXPOSE 80
# Run nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]

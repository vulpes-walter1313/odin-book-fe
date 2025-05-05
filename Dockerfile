FROM node:lts-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install && npm run build

FROM nginx:latest
# Remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
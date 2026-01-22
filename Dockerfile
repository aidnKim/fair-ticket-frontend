# =====================
# 1단계: React 빌드
# =====================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# =====================
# 2단계: Nginx 실행
# =====================
FROM nginx:alpine

# React build 결과
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl.conf /etc/nginx/conf.d/ssl.conf

# certbot webroot (볼륨 마운트됨)
RUN mkdir -p /var/www/certbot

EXPOSE 80
EXPOSE 443

# 인증서 없으면 ssl.conf 제거 후 nginx 실행
CMD ["/bin/sh", "-c", "\
if [ -f /etc/letsencrypt/live/fairticket.store/fullchain.pem ]; then \
  echo 'SSL cert found, HTTPS enabled'; \
else \
  echo 'SSL cert not found, HTTPS disabled'; \
  rm -f /etc/nginx/conf.d/ssl.conf; \
fi && \
nginx -g 'daemon off;' \
"]

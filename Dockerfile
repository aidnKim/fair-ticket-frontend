# [1단계: 빌드 단계] - Node 이미지를 써서 리액트를 빌드합니다.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# [2단계: 실행 단계] - Nginx로 서빙합니다.
FROM nginx:alpine
# 1단계(builder)의 dist 폴더를 가져옴
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
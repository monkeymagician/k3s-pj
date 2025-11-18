# 1. Nginx 공식 이미지 사용
FROM nginx:1.25-alpine

# 2. 정적 리소스를 Nginx 기본 경로로 복사
COPY . /usr/share/nginx/html

# 3. 불필요한 기본 설정 제거 (선택)
RUN rm /etc/nginx/conf.d/default.conf

# 4. 커스텀 Nginx 설정 추가
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5. 80 포트 노출
EXPOSE 80

# 6. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]


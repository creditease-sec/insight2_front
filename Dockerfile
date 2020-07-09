FROM nginx:latest
LABEL The CESEC DEV <fangzhouli@creditease.cn>
# create app web
RUN mkdir -p /app
RUN mkdir -p /logs
ADD ./dist /app/dist
ADD  production_nginx.conf /etc/nginx/nginx.conf
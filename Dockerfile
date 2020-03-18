FROM nginx
MAINTAINER xx 389680571@qq.com
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

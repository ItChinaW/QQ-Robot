FROM node:12.18.1
ENV HOST /www/wwwroot/jqr
WORKDIR $HOST
COPY . $HOST
RUN unzip jqr.zip && rm -rf jqr.zip && npm update && npm install
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
CMD node index.js

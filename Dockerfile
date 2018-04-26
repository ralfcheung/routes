# Set the base image to Ubuntu
FROM node:carbon

RUN npm install pm2 -g

RUN mkdir -p /var/www/route-api

# Define working directory
WORKDIR /var/www/route-api

ADD . /var/www/route-api

#RUN npm install

#COPY docker-entrypoint.sh /
#ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose port
EXPOSE 3000

CMD pm2-runtime process.json
# Run app
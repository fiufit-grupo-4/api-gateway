# set node 14 as base image to Docker Engine! 
# slim-buster is a lightweight version for server deployment
FROM node:14-buster-slim

# create working dir for image
WORKDIR /app

# copy dependancies from host to container
COPY package.json package-lock.json ./

# dependencies clean install
RUN npm ci

# copy app from host to container
ADD app/ app/

CMD npm start
FROM node:12-alpine
COPY ./src /app/
WORKDIR /app
# add dependencies for Apple Silicon builds
RUN apk add --update python make g++\ && rm -rf /var/cache/apk/* 
RUN npm install
CMD ["npm", "run", "start"]
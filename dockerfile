FROM node:hydrogen-alpine3.19 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY ./ .
RUN npm run build

FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
RUN cp -r /app/* /usr/share/nginx/html/



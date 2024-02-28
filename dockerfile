FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
RUN rm .rf * /usr/share/nginx/html/
COPY /app /usr/share/nginx/html/
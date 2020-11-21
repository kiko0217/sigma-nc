FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install


FROM develop-stage as build-stage
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

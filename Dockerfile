# Step 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --configuration=production;

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy custom Nginx config ToDo - Cannot tell if this is working
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website files to the appropriate directory
COPY --from=build app/dist/cangular /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
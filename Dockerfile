# Stage 1: Build the Vite application
FROM node:20 AS build

WORKDIR /usr/src/app

# Clean npm cache before install to save space
RUN npm cache clean --force

COPY package*.json ./

# Use max-old-space-size to reduce memory usage
ENV NODE_OPTIONS="--max-old-space-size=512"

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# ✅ Use the correct build stage name: 'build' instead of 'dist'
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 1114
CMD ["nginx", "-g", "daemon off;"]

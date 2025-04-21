FROM node:18-alpine
WORKDIR /app

# Install ffmpeg
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
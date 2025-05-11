FROM node:18-alpine
WORKDIR /app

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Copy package files and install dependencies first (for better caching)
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Then copy the rest of the application
COPY . .

# Set the correct working directory permissions
RUN chmod -R 755 /app

EXPOSE 8080
CMD ["npm", "start"]
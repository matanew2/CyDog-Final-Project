# Use an official node image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies using npm
# Use --legacy-peer-deps to avoid peer dependency issues
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]


# Use a Node.js base image for development
FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . ./

# Expose port for the React development server
EXPOSE 3000

# Run the React development server for hot-reloading
CMD ["npm", "start"]

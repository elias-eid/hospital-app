# Dockerfile for Node.js Backend
FROM node:16-alpine

WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies, including dev dependencies
RUN npm install --only=development

COPY . ./

RUN npx tsc

EXPOSE 5000
CMD ["node", "dist/index.js"]

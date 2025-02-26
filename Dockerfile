# Use the Node.js LTS image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD [ "node", "dist/main.js" ]

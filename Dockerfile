FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire app
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the app
CMD ["npm", "run", "dev"]
# Use Node.js base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Start the Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
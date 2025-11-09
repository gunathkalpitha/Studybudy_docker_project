# Use Node.js base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies at build time (keeps a layer for CI / image-based deps)
RUN npm ci

# Copy a lightweight entrypoint that will ensure node_modules exist when a host
# bind-mount hides image-installed node_modules during development.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy all source files
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
# Default command: start Vite dev server (arguments forwarded by the entrypoint)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
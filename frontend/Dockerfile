FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Command to start the development server with hot-reloading
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
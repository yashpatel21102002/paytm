# Use an official Node.js LTS image as the base image for building
FROM node:lts-alpine as builder

# Set the working directory for the builder stage
WORKDIR /app

# Copy package.json and package-lock.json for both frontend and backend
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies for both frontend and backend
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy the rest of the application code for both frontend and backend
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build the Next.js application
RUN cd frontend && npm run build

# Use a lightweight Node.js image as the final base image
FROM node:lts-alpine

# Set the working directory for the final image
WORKDIR /app

# Copy the built frontend artifacts and backend code to the final image
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules
COPY --from=builder /app/frontend/package.json ./frontend/package.json

COPY --from=builder /app/backend/ ./backend/

# Expose the ports for both frontend and backend
EXPOSE 3000
EXPOSE 8000

# Start the applications
CMD ["npm", "run", "dev", "frontend"]
CMD ["npm", "run", "start", "backend"]

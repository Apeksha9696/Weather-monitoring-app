FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production

# Copy complete project
WORKDIR /app
COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]
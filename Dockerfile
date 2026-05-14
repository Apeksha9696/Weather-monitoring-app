FROM node:18-alpine

WORKDIR /app


COPY backend/package*.json ./backend/
COPY .env .env


WORKDIR /app/backend
RUN npm install --production


WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

EXPOSE 3000

CMD ["node", "backend/server.js"]
# Stage 1: Build Frontend React/Vite Client
FROM node:18-alpine AS client-builder
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Serve Express Backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
COPY --from=client-builder /client/dist ./public

ENV PORT=5000
EXPOSE 5000
CMD ["npm", "start"]

FROM node:20-alpine AS builder
ARG SRC_DIR=.
WORKDIR /app
COPY ${SRC_DIR}/package*.json ./
COPY ${SRC_DIR}/prisma ./prisma/
COPY ${SRC_DIR}/prisma.config.ts ./
RUN npm install
COPY ${SRC_DIR}/ .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
EXPOSE 3001
CMD ["npm", "run", "start:prod"]

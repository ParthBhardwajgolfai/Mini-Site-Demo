# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# boot.js is bundled by esbuild; node_modules copied as fallback for any
# externals the bundler left unresolved
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/boot.js"]

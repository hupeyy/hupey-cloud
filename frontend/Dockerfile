# Build Sveltekit
FROM --platform=$BUILDPLATFORM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV ADAPTER=node

RUN npm run build
RUN npm prune --production

# Run the application
FROM node:current-alpine
WORKDIR /app
COPY --from=build /app/build ./build/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000

CMD ["node", "build"]
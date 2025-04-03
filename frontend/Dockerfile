# Build Sveltekit
FROM --platform=$BUILDPLATFORM node:latest AS build
ENV ADAPTER=node
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --production

# Run the application
FROM node:current-alpine
WORKDIR /app
COPY --from=build /app/build ./build/
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000

CMD ["node", "build"]

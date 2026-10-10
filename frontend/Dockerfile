# Build SvelteKit
FROM --platform=$BUILDPLATFORM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN chmod -R +x node_modules/.bin
COPY . .
ENV ADAPTER=node

RUN npm run build
RUN npm prune --omit=dev

# Run the application
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/build ./build/
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000

CMD ["node", "build"]
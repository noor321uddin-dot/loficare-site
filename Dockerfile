# Single Node process. The SQLite file lives on the /data volume, so host it in the region the team chooses.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321 DATABASE_PATH=/data/leads.db
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src/lib ./src/lib
COPY --from=build /app/src/i18n ./src/i18n
COPY --from=build /app/scripts ./scripts
RUN mkdir -p /data && chown -R node:node /data /app
USER node
VOLUME ["/data"]
EXPOSE 4321
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:4321/api/health || exit 1
CMD ["node", "server/start.mjs"]

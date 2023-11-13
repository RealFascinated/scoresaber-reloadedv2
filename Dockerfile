FROM fascinated/docker-images:node-pnpm-latest AS base

# Install depends
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --quiet

# Build from source
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

ARG GIT_REV
ENV GIT_REV ${GIT_REV}

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}

# Build the app
RUN pnpm run build

# Generate sitemap
RUN pnpm run generate-sitemap

# Run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

USER nextjs
EXPOSE 80
ENV HOSTNAME "0.0.0.0"
ENV PORT 80
CMD ["pnpm", "start"]
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# 1. Prune stage
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune @propflow/valuer-dashboard --docker

# 2. Installer stage
FROM base AS installer
WORKDIR /app

# First copy the pruned files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and set if needed during build
# ENV NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
RUN pnpm turbo run build --filter=@propflow/valuer-dashboard

# 3. Runner stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/valuer-dashboard/next.config.js .
COPY --from=installer /app/apps/valuer-dashboard/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/valuer-dashboard/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/valuer-dashboard/.next/static ./apps/valuer-dashboard/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/valuer-dashboard/public ./apps/valuer-dashboard/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/valuer-dashboard/server.js"]

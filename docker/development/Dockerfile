# 1. Base stage
FROM node:21-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    pnpm install --frozen-lockfile --prod

# 2. Build stage
FROM base AS builder
WORKDIR /app

# Copy package files again to ensure the latest versions are used
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && \
    pnpm install --frozen-lockfile

# Copy application source code    
COPY . .

# This will do the trick, use the corresponding env file for each environment.
COPY .env.development ./
RUN pnpm run build

# 3. Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production


# nodejs 그룹 생성 (-g:그룹의 숫자 ID, -S:그룹을 시스템 그룹으로)
# nextjs라는 이름의 사용자 생성 (-S:사용자를 시스템 사용자로, -S:사용자 ID 할당)
# standalone 출력물(server.js)로 실행하므로 next 전역 설치는 필요하지 않음
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME=0.0.0.0

# output: "standalone" 빌드 결과물은 next start가 아닌 server.js로 실행
CMD ["node", "server.js"]

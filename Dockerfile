FROM oven/bun:1.3-slim AS builder

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install
COPY . .

FROM oven/bun:1.3-slim AS final

WORKDIR /app

COPY --from=builder /app /app

USER bun

EXPOSE 3000 

CMD ["bun", "run", "index.ts"]
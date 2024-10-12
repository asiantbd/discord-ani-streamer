## ----------------------------------------
## Base Layer: use the official Bun image (Debian)
## https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-debian AS base

# Install necessary system-level dependencies
# used in released images
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

## ----------------------------------------
## build-deps Layer: install other build dependencies
FROM base AS build-deps

# Install necessary build tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    python3 \
    wget \
    && rm -rf /var/lib/apt/lists/*

## ----------------------------------------
## Install Layer: install dependencies into temp directory
## this will cache them and speed up future builds
FROM build-deps AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# install ani-cli & patched scripts
RUN mkdir -p /temp/scripts
COPY scripts/ani-cli-patcher.sh /temp/scripts/
RUN cd /temp/scripts && wget https://github.com/pystardust/ani-cli/releases/download/v4.9/ani-cli -O ./ani-cli && chmod +x ./ani-* && ./ani-cli-patcher.sh


## ----------------------------------------
## Prerelease Layer: copy node_modules from temp directory
## then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

## Main Build Sections
ENV NODE_ENV=production
RUN bun run build

## ----------------------------------------
## Release Layer
## copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/scripts/ani-cli ani-cli
COPY --from=prerelease /usr/src/app/dist dist
COPY --from=prerelease /usr/src/app/package.json .

# run the app
# USER bun
EXPOSE 3000/tcp
WORKDIR /usr/src/app/
ENTRYPOINT [ "bun", "run", "start" ]

# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
# Note this is not at all efficient, need to actually optimize this step to 
# not include all the build artifacts
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install rush
RUN npm install -g @microsoft/rush@5.148.0

# Copy application code
COPY . .

# Install deps
RUN rush update

# Generate Prisma Client
RUN cd projects/database npx prisma generate

# Copy application code
COPY . .


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Install rush
RUN npm install -g @microsoft/rush@5.148.0

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "rush", "start-services" ]

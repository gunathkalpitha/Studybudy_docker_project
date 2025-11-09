#!/bin/sh
set -e

# Ensure we run from the app directory
cd /app || exit 0

# If node_modules is missing or empty, install dependencies inside the container.
# This handles the common dev pattern where the host source is bind-mounted over /app
# and image-installed node_modules are not visible.
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "[entrypoint] /app/node_modules is missing or empty — running npm ci"
  npm ci --prefer-offline --no-audit --progress=false
else
  echo "[entrypoint] node_modules present — skipping install"
fi

# Exec the container CMD
exec "$@"

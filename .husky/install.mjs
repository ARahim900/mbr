#!/bin/sh
# Husky install script - bypassed for production deployments
# This file prevents husky from failing during npm install in production

# Check if we're in a CI/production environment
if [ "$CI" = "true" ] || [ "$NODE_ENV" = "production" ] || [ "$NETLIFY" = "true" ]; then
  echo "Skipping husky install in production/CI environment"
  exit 0
fi

# Otherwise, run husky install if it exists
if command -v husky >/dev/null 2>&1; then
  husky install
else
  echo "Husky not found, skipping git hooks setup"
fi

exit 0

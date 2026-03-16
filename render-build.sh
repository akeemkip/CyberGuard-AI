#!/usr/bin/env bash
# Render build script — builds both frontend and backend as a single service
set -e

echo "==> Installing frontend dependencies..."
cd frontend
npm ci

echo "==> Building frontend..."
npm run build

echo "==> Installing backend dependencies..."
cd ../backend
npm ci

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Building backend..."
npm run build

echo "==> Build complete!"

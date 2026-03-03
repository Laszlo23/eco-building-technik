#!/bin/bash
# Deploy ECO Building Technik to Vercel
# Run this in your terminal (not via Agent): ./deploy.sh

cd "$(dirname "$0")"

echo "Deploying to Vercel..."
vercel deploy --prod

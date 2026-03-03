#!/bin/bash
# Download product images from Unsplash (free, commercial use)
# Run from project root: ./scripts/download-images.sh

set -e
IMAGES_DIR="$(dirname "$0")/../public/images"
mkdir -p "$IMAGES_DIR"

# Unsplash photo IDs (format: timestamp-hash)
# Solar inverter / PV
SOLAR_ID="1509391366360-2e959784a276"
# Electric meter
METER_ID="1558618666-fcd25c85cd64"
# LED strip / lighting
LED_ID="1507003211169-0a1dd7228f2d"
# Ceiling light
CEILING_ID="1513694203232-719a280e022f"

echo "Downloading images from Unsplash..."

curl -sL "https://images.unsplash.com/photo-${SOLAR_ID}?w=600&q=80" -o "$IMAGES_DIR/solar-inverter.jpg"
echo "  - solar-inverter.jpg"

curl -sL "https://images.unsplash.com/photo-${SOLAR_ID}?w=600&q=80" -o "$IMAGES_DIR/battery-storage.jpg"
echo "  - battery-storage.jpg"

curl -sL "https://images.unsplash.com/photo-${METER_ID}?w=600&q=80" -o "$IMAGES_DIR/electric-meter.jpg"
echo "  - electric-meter.jpg"

curl -sL "https://images.unsplash.com/photo-${LED_ID}?w=600&q=80" -o "$IMAGES_DIR/led-strip.jpg"
echo "  - led-strip.jpg"

curl -sL "https://images.unsplash.com/photo-${CEILING_ID}?w=600&q=80" -o "$IMAGES_DIR/ceiling-light.jpg"
echo "  - ceiling-light.jpg"

echo "Done."

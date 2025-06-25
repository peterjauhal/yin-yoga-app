# Daily Yin Yoga Routine

A simple web application that generates a new 30-minute yin yoga routine every day, complete with pose images and instructions.

## Features

- **Daily Automation**: New routine generated automatically every day at 6 AM UTC
- **30-Minute Sessions**: Carefully structured routines with 5-7 poses
- **Clear Instructions**: Detailed pose descriptions and modifications
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Capable**: Progressive Web App functionality

## How It Works

1. GitHub Actions runs daily to generate a new routine
2. Algorithm selects poses based on categories and difficulty
3. Routine is saved as JSON and displayed on the web page
4. Images are sourced from yoga pose APIs and free stock photos

## Local Development

```bash
# Install dependencies
npm install

# Generate a new routine manually
npm run generate

# Start local server for development
npm run dev
```

Then open http://localhost:8000 in your browser.

## Routine Structure

Each 30-minute routine follows this structure:
- **Opening (3-5 minutes)**: Breathing and centering
- **Main Sequence (20-22 minutes)**: 5-7 core poses held for 3-5 minutes each
- **Closing (3-5 minutes)**: Savasana and final relaxation

## Pose Categories

- Hip openers (Pigeon, Butterfly)
- Forward folds (Child's pose, Seated forward fold)
- Backbends (Supported fish, Heart opener)
- Twists (Supine spinal twist)
- Restorative poses (Legs up wall, Savasana)

## Contributing

This is a personal wellness project. Feel free to fork and customize for your own practice!
# TMR Lab Web Application

A web-based experimental application for testing memory and recall using Korean-English word pairs with audio stimuli.

## Overview

This application is designed to conduct psychological experiments testing memory and recall abilities. It presents participants with Korean-English word pairs in different experimental conditions and formats, including:

- Pre-test phase
- Multiple experimental rounds
- Audio playback
- Visual stimuli
- Timed presentations
- Result recording

## Key Features

### 1. Experimental Flow

- Pre-test phase to establish baseline
- Multiple experimental rounds with different presentation formats
- Cross-fixation between stimuli
- Timed presentation of stimuli
- Progress tracking
- Result recording and submission

### 2. Stimulus Types

- Korean-English word pairs
- Audio playback of English words
- Visual presentation of Korean words
- Cross-fixation points between stimuli

### 3. User Interface

- Clean, distraction-free design
- Progress bar showing completion status
- Countdown timers
- Space bar navigation
- Clear instructions between phases

### 4. Technical Features

- React-based single page application
- Client-side routing
- Environment-specific configurations
- Mobile-responsive design
- Tailwind CSS styling

## Technology Stack

- React 18.3.1
- React Router DOM 6.26.2
- Styled Components 6.1.13
- Tailwind CSS 3.4.13
- Environment Configuration (env-cmd)
- GitHub Pages Deployment

## Project Structure

tmr-lab-web/
├── public/
│ ├── audio/ # Audio files for word stimuli
│ └── index.html
├── src/
│ ├── components/
│ │ ├── PreTest.js
│ │ ├── Round1.js
│ │ ├── Round2.js
│ │ ├── Round3.js
│ │ ├── Test.js
│ │ ├── TestResult.js
│ │ └── LabPage.js
│ ├── App.js
│ └── index.js

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/junho100/tmr-lab-web.git

2. Install dependencies:
   npm install

3. Create environment files:

# .env.local for development

# .env.production for production

4. Run development server:
   npm start

5. Build for production:
   npm run build

## Deployment

The application is configured for GitHub Pages deployment:

npm run deploy

This will:

1. Build the application with production settings
2. Create a 404.html fallback
3. Deploy to GitHub Pages

## Environment Variables

The application uses different environment configurations for development and production:

- .env.local: Development environment
- .env.production: Production environment

## Browser Support

The application supports:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

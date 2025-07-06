# MBR - Muscat Bay Resource Management System

A comprehensive web application for managing facility operations including Water Systems, Electricity Systems, HVAC Systems, Contractor Tracking, and STP Plant management.

## Features

- **Water System Management**: Monitor and analyze water usage and quality
- **Electricity System**: Track electrical consumption and maintenance
- **HVAC System**: Manage heating, ventilation, and air conditioning systems
- **Contractor Tracker**: Keep track of contractors and their work
- **STP Plant**: Sewage treatment plant monitoring and management

## Technology Stack

- React 19.1.0 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons
- Recharts for data visualization

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ARahim900/mbr.git
cd mbr
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your Gemini API key to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

## Deployment to Netlify

### Method 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub (already done)
2. Log in to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Choose "Deploy with GitHub"
5. Select your repository (ARahim900/mbr)
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Add environment variables:
   - Go to Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your actual API key
8. Click "Deploy site"

### Method 2: Manual Deploy

1. Build the project locally:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy to Netlify:
```bash
netlify deploy --prod --dir=dist
```

## Environment Variables

The following environment variables need to be set in Netlify:

- `GEMINI_API_KEY`: Your Google Gemini API key for AI features

## Important Notes

- The logo file (`APP Logo.png`) has been properly configured in the sidebar
- Client-side routing is configured via `netlify.toml`
- Make sure to set environment variables in Netlify's dashboard
- The app uses Tailwind CSS via CDN for styling

## Project Structure

```
mbr/
├── components/        # React components
├── database/         # Database related files
├── services/         # Service layer files
├── APP Logo.png     # Application logo
├── index.html       # Main HTML file
├── index.tsx        # Entry point
├── App.tsx          # Main App component
├── types.ts         # TypeScript type definitions
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── package.json     # Project dependencies
├── netlify.toml     # Netlify configuration
└── .env.example     # Example environment variables
```

## License

This project is private and proprietary.
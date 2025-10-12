# Fx Converter

A modern, feature-rich foreign exchange converter and dashboard application built with React, TypeScript, and Vite. Track currency conversions, analyze trends, and manage transactions with real-time data.

## Features

- **User Authentication** - Secure login and registration with token-based authentication
- **Currency Conversion** - Real-time currency conversion with up-to-date exchange rates
- **Analytics Dashboard** - Visual charts and statistics for conversion trends
- **Transaction History** - Track and manage all your currency transactions
- **Responsive Design** - Beautiful, modern UI that works on all devices
- **Real-time Updates** - Live exchange rates and automatic data refresh

## Tech Stack

### Core
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

### State Management & Data Fetching
- **TanStack Query (React Query)** - Powerful data synchronization
- **Axios** - HTTP client for API requests
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation

### Routing & Navigation
- **React Router DOM** - Client-side routing

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **bun** - Package manager (npm comes with Node.js)

Verify installation:
```bash
node --version
npm --version
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd currency-glance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_ENABLE_API_LOGGING=true
   VITE_TOKEN_REFRESH_THRESHOLD=60000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Environment Variables

Configure the following environment variables in your `.env` file:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` | Yes |
| `VITE_ENABLE_API_LOGGING` | Enable API request/response logging | `true` (in dev) | No |
| `VITE_TOKEN_REFRESH_THRESHOLD` | Token refresh threshold in milliseconds | `60000` (1 minute) | No |

**Note:** Environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Dashboard/       # Dashboard-specific components
│   │   ├── AnalyticsChart.tsx
│   │   ├── ConversionWidget.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   └── TransactionsList.tsx
│   └── ui/              # shadcn/ui components
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication context
├── hooks/               # Custom React hooks
│   ├── api/             # API-related hooks
│   │   ├── useAnalytics.ts
│   │   ├── useAuth.ts
│   │   ├── useConversions.ts
│   │   ├── useDashboardStats.ts
│   │   ├── useRates.ts
│   │   └── useTransactions.ts
│   └── use-mobile.tsx   # Mobile detection hook
├── lib/                 # Utility libraries
│   ├── api/             # API client and types
│   │   ├── client.ts    # Axios instance configuration
│   │   ├── errors.ts    # Error handling
│   │   └── types.ts     # API type definitions
│   ├── env.ts           # Environment variable validation
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard page
│   ├── Index.tsx        # Landing page
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   └── NotFound.tsx     # 404 page
├── services/            # API service layer
│   ├── analytics.service.ts
│   ├── auth.service.ts
│   ├── conversions.service.ts
│   ├── rates.service.ts
│   └── transactions.service.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build with development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Development Workflow

1. Run the development server: `npm run dev`
2. Make your changes - the app will hot reload automatically
3. Run linting before committing: `npm run lint`
4. Build and test before deploying: `npm run build && npm run preview`

### Code Quality

The project uses:
- **ESLint** - For code linting and consistency
- **TypeScript** - For type safety
- **Prettier-compatible** - Code formatting

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Hosting Platform

The `dist/` folder can be deployed to any static hosting service:

- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop the `dist` folder or use Netlify CLI
- **GitHub Pages** - Push the `dist` folder to gh-pages branch
- **AWS S3 + CloudFront** - Upload to S3 bucket and configure CloudFront

### Environment Variables for Production

Make sure to set the production environment variables in your hosting platform:

```env
VITE_API_URL=https://your-production-api.com/api
VITE_ENABLE_API_LOGGING=false
VITE_TOKEN_REFRESH_THRESHOLD=60000
```

## License

This project is private and proprietary.

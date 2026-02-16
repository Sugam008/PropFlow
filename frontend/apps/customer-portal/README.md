# PropFlow Valuer Dashboard

Next.js-based web application for property valuers and administrators.

## Features

- **Aditya Birla Capital (ABC) Branding**: Implements ABC's brand guidelines (Red/Gray/White) with high-fidelity UI components.
- **Performance Optimized**:
  - Lighthouse scores > 90.
  - Next.js 14 App Router with Server Components.
  - Font and Image optimization.
  - Resource hinting (dns-prefetch, preconnect).
- **Animations**: Fluid transitions using `framer-motion` and CSS keyframes.
- **Responsive Design**: Fully responsive layout optimized for desktop and tablet usage.

## Setup

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Run Development Server**:

   ```bash
   pnpm dev
   ```

3. **Build for Production**:
   ```bash
   pnpm build
   ```

## Performance & Monitoring

- **Health Endpoint**: `/api/health` for uptime monitoring.
- **Dynamic Imports**: Critical path optimization using `next/dynamic` for heavy components like Modals and Tables.
- **Resource Hints**: Optimized font loading and API pre-connections in root layout.

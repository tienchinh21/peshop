# Technology Stack

## Framework & Core

- **Next.js 15.5.4** (App Router with React Server Components)
- **React 19.1.0** with TypeScript 5
- **Node.js**: Target ES2017

## State Management & Data Fetching

- **Redux Toolkit** (@reduxjs/toolkit) - Global state (auth)
- **TanStack Query v5** (@tanstack/react-query) - Server state, caching, data fetching
- **Axios** - HTTP client with dual API configuration (.NET + Java)

## UI & Styling

- **Tailwind CSS v4** with PostCSS
- **shadcn/ui** (Radix UI primitives) - Component library
- **Lucide React** - Icon library
- **Geist Font** (Sans & Mono) - Typography
- **CSS Variables** - Theme system with dark mode support

## Key Libraries

- **Form Handling**: Zod for validation
- **Rich Text**: React Quill
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Image Handling**: react-easy-crop, react-medium-image-zoom
- **Notifications**: Sonner (toast)
- **Tables**: @tanstack/react-table

## Build & Development

### Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Configuration

- **Path Alias**: `@/*` maps to `src/*`
- **Image Domains**: salt.tikicdn.com, xjanua.me, localhost
- **Image Formats**: AVIF, WebP
- **Console Removal**: Production builds remove console logs (except error/warn)
- **SWC Minification**: Enabled
- **React Strict Mode**: Enabled

### Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_API_URL_DOTNET` - .NET backend URL
- `NEXT_PUBLIC_API_URL_JAVA` - Java backend URL
- `NEXT_PUBLIC_SITE_URL` - Frontend URL
- `REVALIDATE_SECRET` - ISR revalidation secret

## Performance Optimizations

- Package import optimization for Radix UI, Lucide, date-fns, lodash
- ISR (Incremental Static Regeneration) with revalidation
- Image optimization with Next.js Image component
- React Query caching strategies (staleTime, gcTime)
- Production source maps disabled

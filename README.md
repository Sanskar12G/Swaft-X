# Swift Ride

Smart ride-booking web application focused on route intelligence, fare transparency, and better booking decisions.

## 1. Project Overview

Swift Ride is a modern ride-booking platform built as a responsive React application.  
It helps users:

- search pickup and drop locations,
- compare route alternatives,
- estimate fare in real time,
- compare platform-wise pricing,
- and book rides with scheduling support.

The product combines map-based interaction, route prediction, dynamic fare logic, and clean UX to create a decision-first ride booking experience.

## 2. Problem Statement

Most ride-booking experiences have three major problems:

1. Users cannot easily compare multiple route or price options.
2. Fare visibility is unclear when ride type/platform changes.
3. Location and distance mismatch can lead to poor booking accuracy.

Swift Ride addresses these with route-centric UX, clear fare derivation, and improved location suggestion + map workflow.

## 3. Core Features

### 3.1 Home Experience

- Hero section with branded product messaging.
- Feature Wheel (vertical scroll) with key AI/product capabilities.
- Responsive layout for desktop and mobile.

### 3.2 Booking Flow

- Pickup and drop input with suggestions.
- Map-based point selection support.
- Route calculation with main + alternate route.
- Route summary: distance, duration, fare.
- Ride type selection (Economy / Luxury / Electric).
- Ride scheduling (`Ride Now` / `Schedule`).

### 3.3 Route Intelligence

- Uses routing APIs to fetch route geometry and travel metrics.
- Renders route polyline and traffic indicators.
- Supports route switching between primary and alternate options.
- Keeps route calculation state synchronized with selection changes.

### 3.4 Fare & Platform Comparison

- Fare recalculates correctly on ride type change.
- Compare section shows platform-level estimated fares.
- Selecting a platform updates final payable fare used in:
  - route summary,
  - confirm button,
  - booking payload.

### 3.5 Theme System

- Dark/Light mode toggle in navigation.
- Forest-glass dark aesthetic as default.
- Light mode contrast tuned for readability.

### 3.6 Data Layer

- Curated Jabalpur location dataset for fast local suggestions.
- Hybrid suggestions with live lookup integration.
- Updated UX to avoid stale coordinates during text edits.

## 4. How It Works (Functional Flow)

1. User enters pickup and destination.
2. Suggestion list appears; user selects exact locations.
3. Map resolves route and sends distance/duration/fare details to booking panel.
4. User chooses ride type and optionally a compared platform fare.
5. Final fare is derived from one source of truth and displayed consistently.
6. On confirm, booking data is inserted into backend (Supabase trips table).

## 5. Technical Architecture

### 5.1 Frontend Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Leaflet (map rendering)

### 5.2 Data/Backend Integration

- Supabase for auth and trip persistence
- External map/geocoding/routing APIs for:
  - coordinate resolution
  - route geometry
  - distance/duration estimation

### 5.3 Application Structure (High Level)

- `src/pages/Index.tsx`  
  Main screen controller (`home` / `booking` view).
- `src/components/HeroSection.tsx`  
  Landing/feature messaging UI.
- `src/components/BookingPanel.tsx`  
  Booking logic, suggestions, ride type, fare calculation, confirmation.
- `src/components/IndiaMap.tsx`  
  Map rendering, route drawing, route metrics callbacks.
- `src/components/RideCompare.tsx`  
  Platform comparison and selected-platform fare handoff.
- `src/data/jabalpurLocations.ts`  
  Local area dataset for suggestion performance.

## 6. Key Engineering Decisions

1. **Single Fare Source Principle**  
   Route fare is kept stable and transformed by selection state (ride type/platform), preventing compounding price bugs.

2. **State Reset on Location Edit**  
   When user edits pickup/drop text, old coordinates and route state are cleared to prevent incorrect distance/fare display.

3. **Route Callback Contract**  
   Map component pushes route metrics to booking panel via callback props, keeping responsibilities separated.

4. **Theme Tokens over Hardcoded Colors**  
   Uses CSS variables for consistent dark/light styling and easier future brand updates.

## 7. Setup and Run

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Start Development

```bash
npm run dev
```

### Run AI Ride Assistant API

```bash
npm run ai:server
```

Then run frontend in another terminal:

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 8. Environment Variables

Project uses `.env` with keys such as:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `AI_SERVER_PORT`
- `VITE_AI_API_URL`
- (optional) routing/geocoding API keys as needed

## 9. PPT-Ready Highlights

Use these directly in your slides:

### Slide: Objective

- Build an AI-assisted ride booking interface with transparent decision-making.

### Slide: Innovation

- Route alternatives + traffic context
- Platform fare comparison before booking
- Real-time fare adaptation by ride category

### Slide: User Benefit

- Better booking decisions
- Improved fare clarity
- Reduced mismatch in route expectations

### Slide: Technical Strength

- Modular React architecture
- API-driven map intelligence
- Strong state synchronization between map and booking panel

### Slide: Future Scope

- Multi-city dataset expansion
- richer route intelligence
- personalized pricing alerts
- trip history analytics

## 10. Current Scope

- Region focus: Jabalpur-centric booking experience.
- Driver module currently removed from active navigation flow.
- Optimized for responsive usage with modern UI interactions.



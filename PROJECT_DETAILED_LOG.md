# Swift Ride - Detailed Project Log and Working Overview

## 1) Project Summary
Swift Ride is a React + TypeScript ride-booking web app focused on smart booking decisions.

Core value proposition:
- Accurate pickup/drop selection using local + live location suggestions.
- Route-aware booking with main and alternate route comparison.
- Platform fare comparison (Swift Ride, Ola, Uber, Rapido, InDrive style simulation).
- Ride-type-aware pricing (economy/luxury/ev) with synchronized booking fare.
- AI Ride Assistant for ride-only suggestions, with cached chat and low-token controls.
- Supabase-backed auth, role checks, trips, and admin analytics views.

## 2) Tech Stack
Frontend:
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui components
- Framer Motion animations
- Leaflet maps
- React Router, React Query
- next-themes for dark/light mode

Backend/Services:
- Supabase (auth + Postgres + RLS)
- Node/Express AI microservice (`server/ride-assistant-server.mjs`)
- OpenRouter API for LLM responses
- OSRM / OpenRouteService for routing
- Nominatim for geocoding/reverse geocoding

## 3) High-Level Folder Structure
- `src/` - Application UI and logic
- `src/components/` - Core modules (`BookingPanel`, `IndiaMap`, `RideCompare`, `RideAssistantWidget`, `HeroSection`, `Navigation`)
- `src/data/` - Static local datasets (`jabalpurLocations`, `nearbyCars`)
- `src/hooks/` - Custom hooks (`useAuth`, toast, mobile)
- `src/integrations/supabase/` - typed client + generated schema types
- `server/` - AI assistant API server
- `supabase/migrations/` - DB schema + security + fare trigger
- `scripts/` - coordinate update utility (`update-jabalpur-coordinates-from-google.mjs`)

## 4) App Boot and Routing Flow
Entry:
- `src/main.tsx` mounts `App`.

App shell (`src/App.tsx`):
- Wraps app with `ThemeProvider`, `QueryClientProvider`, toast providers, router.
- Routes:
  - `/` -> `Index`
  - `/auth` -> `Auth`
  - `/admin` -> `Admin`
  - `*` -> `NotFound`
- `RideAssistantWidget` is mounted globally so assistant is accessible from anywhere.

Index page (`src/pages/Index.tsx`):
- Local view state: `home` or `booking`.
- `Navigation` drives view switching.
- `HeroSection` = landing + features.
- `BookingPanel` = full booking workflow.

## 5) Booking Workflow (Detailed)
Main file: `src/components/BookingPanel.tsx`

### 5.1 Location Input and Suggestions
- Pickup/drop inputs support:
  - local search from `searchJabalpurLocations()`
  - live search from Nominatim (`searchLiveLocations`)
- Live calls are debounced (~250ms).
- Local + live results are merged and deduplicated.
- Clicking outside closes suggestion dropdowns.

### 5.2 Map Selection Mode
- User can switch to map-pick mode (`selectMode` pickup/dropoff).
- `IndiaMap` sends back coordinates + reverse-geocoded address.

### 5.3 Route and Fare State
- `IndiaMap` provides route metrics via callback:
  - `onRouteCalculated(distance, duration, fare)`
  - `onRoutesReady(mainRoute, altRoute)`
- Route panel shows:
  - main vs alternate route
  - traffic intensity
  - signal info
- Selecting route updates the effective fare base.

### 5.4 Ride Type and Platform Selection
- Ride types:
  - economy
  - luxury
  - electric
- `calculateFare()` logic:
  - starts from route fare base
  - applies ride multiplier
  - if platform fare is selected, platform fare takes precedence
- `RideCompare` selection writes `selectedPlatformFare`, reflected in confirm fare.

### 5.5 Booking Confirmation
- Requires authenticated user.
- Inserts trip into Supabase `trips` table with pickup/drop coords and metadata.
- Supports schedule timestamp when scheduling is enabled.

### 5.6 AI Context Emission
- Booking panel stores rich trip context in `localStorage` key: `ride_context`.
- Clicking `Ride Now` dispatches `ride-context-updated` event with `nudgeOnly: true`.
- Assistant opens only after `Ride Now` action (not on raw location input).

## 6) Map and Routing Engine
Main file: `src/components/IndiaMap.tsx`

### 6.1 Map Setup
- Leaflet map initialized once.
- Tile source: OpenStreetMap.
- Custom pickup/drop markers.

### 6.2 Route Source Priority
1. OpenRouteService (if `VITE_ORS_API_KEY` exists)
2. OSRM public API fallback
3. Straight-line fallback with Haversine estimate (if both fail)

### 6.3 Route Intelligence Layer
- Generates route-level computed fields:
  - distance, duration, fare
  - traffic level (low/moderate/heavy)
  - traffic signals and red signal counts
  - congestion points
- Supports main and alternate route visualization.
- Route switching updates both visuals and callback metrics.

## 7) Platform Comparison Engine
Main file: `src/components/RideCompare.tsx`

- Simulated platforms with per-platform coefficients:
  - base fare, per-km, per-minute, surge, promo discount, ETA, rating.
- Calculates per-platform final fare and sorts ascending.
- Highlights cheapest option and calculated savings.
- On user selection, returns selected platform fare to booking panel.

## 8) AI Assistant Architecture
Frontend: `src/components/RideAssistantWidget.tsx`
Backend: `server/ride-assistant-server.mjs`

### 8.1 UI/UX Behavior
- Floating button opens chat panel.
- Chat supports:
  - free text ride questions
  - dedicated `Get Detailed AI Analysis` button
  - clear chat (local + server cache clear)
- Chat history cached locally and restored.
- Session persisted with stable `sessionId`.

### 8.2 Trigger Policy
- Auto-open only on `Ride Now` signal from booking panel.
- With `nudgeOnly`, assistant shows local helper prompt and does not auto-send expensive AI request.

### 8.3 Request Reliability and Token Controls
- Payload is sanitized (`cleanPayload`) to remove null/undefined before API call.
- JSON parse is hardened for malformed/empty responses.
- Retry-once policy for transient response failures.
- If server unavailable, widget shows local fare-based fallback recommendation.

### 8.4 Backend AI Service
- Express server with routes:
  - `GET /health`
  - `POST /api/ride-assistant/chat`
  - `GET /api/ride-assistant/session/:id`
  - `DELETE /api/ride-assistant/session/:id`
- Zod validates payload.
- Off-topic filter allows only ride-domain queries.
- Calls OpenRouter with system prompt and contextual trip payload.
- Parses/normalizes model output to fixed JSON schema.
- Fallback response if provider fails.
- Session cache:
  - in-memory + persisted to `.cache/ride-assistant-sessions.json`
  - TTL-based pruning
  - capped message history

### 8.5 Vite Proxy
- `/api/ride-assistant` proxied via `vite.config.ts` to `VITE_AI_API_URL` (default `http://localhost:8787`).

## 9) Auth and Roles
Hook: `src/hooks/useAuth.ts`

- Uses Supabase auth state listener + initial session check.
- Keeps `user`, `session`, `loading`, and `isAdmin` state.
- Admin role resolved from `user_roles` table.

Auth page: `src/pages/Auth.tsx`
- Email/password login and signup.
- Zod validation for email/password.
- Signup includes `full_name` in auth metadata.

## 10) Admin Side
Page: `src/pages/Admin.tsx`

- Guarded by role check (`user_roles` where role = admin).
- Dashboard metrics from Supabase:
  - trips count, pending trips, recent payments, recent trips, total revenue.
- Includes a live map panel and operational cards.

Note:
- `src/components/AdminPanel.tsx` and `src/components/DriverDashboard.tsx` exist as UI modules but are not wired into active route flow currently.

## 11) Database Schema and Security (Supabase)
From migrations:

### Tables
- `user_roles` (role-based access)
- `profiles` (user profile metadata)
- `payments` (transaction records)
- `trips` (ride lifecycle data)

### Security
- RLS enabled on all operational tables.
- `has_role` function supports role-based policies.
- Users can read/write only their permitted rows.
- Admin policies allow broader visibility.

### Fare Integrity
- DB trigger `calculate_trip_fare()` recomputes fare server-side on `trips` insert/update.
- Protects against client fare tampering.

## 12) Data Layer Notes
`src/data/jabalpurLocations.ts`:
- Large curated location catalog for Jabalpur zones, landmarks, markets, hospitals, educational and localities.
- Used for fast local suggestions and deep-area discoverability.

`src/data/nearbyCars.ts`:
- Simulated nearby fleet metadata (categories, ETA, features, etc.) and map center constants.

## 13) Theme and Design System
- Dark mode default, light mode supported.
- Theme tokens in `src/index.css` (`--background`, `--primary`, etc.).
- Shared UI primitives from shadcn components under `src/components/ui`.
- Tailwind config extends motion, glow, gradients, and typography.

## 14) Runtime Configuration
### Required app env (typical)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### AI env
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `AI_SERVER_PORT`
- `VITE_AI_API_URL`

### Optional map routing
- `VITE_ORS_API_KEY`

## 15) Run and Operational Commands
- Install: `npm install`
- Frontend: `npm run dev`
- AI server: `npm run ai:server`
- Build: `npm run build`
- Coordinate script: `npm run coords:google`

## 16) End-to-End User Journey (Demo Script)
1. Open app -> Home view with feature wheel.
2. Click `Book a Ride`.
3. Enter pickup/drop from suggestions or map.
4. Observe route + alternate route + traffic panel.
5. Choose ride type and compare platforms.
6. Click `Ride Now` -> assistant nudges with help text.
7. Click `Get Detailed AI Analysis` for deep recommendation.
8. Confirm ride -> trip inserted into Supabase.

## 17) Known Boundaries and Practical Notes
- Region behavior is currently tuned for Jabalpur-centric lookup and map viewport.
- Some UI text/icons show encoding artifacts in terminal output; browser rendering remains functional.
- AI fallback mode gives local recommendation if AI server/provider is unreachable.
- Admin analytics includes some simulated values (for driver online count/fleet utilization in UI sections).

## 18) Presentation-Ready Talking Points
- "We solved price confusion by centralizing fare derivation and syncing it across route, compare, and confirm states."
- "We improved location reliability using hybrid local + live geocoding with dedupe and stale-state clearing."
- "We separated map-routing responsibilities from booking UI through callback contracts for maintainability."
- "We hardened AI with payload validation, topic filtering, cache persistence, retry, and graceful fallback."
- "We enforced security with Supabase RLS and server-side fare recalculation to prevent tampering."

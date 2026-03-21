# 🚗 Swaft X Rides — React Native App

A full React Native (Expo) conversion of the Swaft X Rides web app, preserving every screen, component, and feature.

---

## 📁 Project Structure

```
SwaftXRides-ReactNative/
├── App.tsx                        # Root entry point
├── app.json                       # Expo config
├── package.json
├── tsconfig.json
├── babel.config.js
└── src/
    ├── constants/
    │   └── theme.ts               # Colors, spacing, radius, shadows
    ├── lib/
    │   └── locations.ts           # Locations DB + fare calc (ported from web)
    ├── components/
    │   └── LocationInput.tsx      # ← Port of LocationInput.tsx (modal-based search)
    ├── navigation/
    │   └── RootNavigator.tsx      # Bottom tabs (replaces web Navbar)
    └── screens/
        ├── HomeScreen.tsx         # ← Port of HeroSection.tsx
        ├── CompareScreen.tsx      # ← Port of FareComparison.tsx
        ├── FeaturesScreen.tsx     # ← Port of FeaturesSection.tsx
        ├── CitiesScreen.tsx       # ← Port of CitiesSection.tsx
        └── AboutScreen.tsx        # ← Port of CtaSection.tsx + Footer.tsx
```

---

## 🔄 Web → React Native Conversion Map

| Web File | React Native File | Notes |
|---|---|---|
| `Navbar.tsx` | `RootNavigator.tsx` | Becomes bottom tab navigator |
| `NavLink.tsx` | (built into navigator) | RN uses navigation prop |
| `HeroSection.tsx` | `HomeScreen.tsx` | Animated, floating mockup card |
| `FareComparison.tsx` | `CompareScreen.tsx` | Full fare comparison with swap |
| `FeaturesSection.tsx` | `FeaturesScreen.tsx` | Two-column feature grid |
| `CitiesSection.tsx` | `CitiesScreen.tsx` | Chip layout + stats card |
| `CtaSection.tsx` + `Footer.tsx` | `AboutScreen.tsx` | Combined into one screen |
| `LocationInput.tsx` | `LocationInput.tsx` | Modal-based search (no DOM) |
| Tailwind CSS | `StyleSheet.create()` | All styles ported inline |
| Framer Motion | `Animated` API | Fade/slide/float animations |
| `react-router-dom` | `@react-navigation` | Stack + Bottom Tabs |
| Clerk Auth | Removed | Not available in Expo |

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npx expo start

# 3. Run on device/emulator
# Press 'a' for Android
# Press 'i' for iOS
# Scan QR with Expo Go app
```

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Xcode (for emulators)
- Or install **Expo Go** on your phone to scan QR code

---

## 🎨 Design Decisions

- **Dark theme** — matches the web app's `#060A12` background exactly
- **Primary color** — `#00D9FF` (cyan) preserved throughout
- **LocationInput** — uses a `Modal` + `FlatList` instead of a dropdown div
- **Animations** — `Animated.timing` for fade/slide, `Animated.loop` for floating card
- **No framer-motion** — React Native has its own `Animated` API
- **No Tailwind** — replaced with `StyleSheet.create()` with the same design tokens
- **No Clerk** — authentication removed (would require Clerk RN SDK separately)

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `expo` | Build toolchain |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/bottom-tabs` | Tab bar (replaces Navbar) |
| `@react-navigation/native-stack` | Screen stack |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-screens` | Native screen optimization |
| `expo-status-bar` | Status bar styling |
| `expo-linear-gradient` | Gradient backgrounds |

---

Built by Samrat · Team HackByte · MIT License

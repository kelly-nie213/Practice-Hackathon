# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MemoWell** is a React Native / Expo mobile app designed for elderly users with memory challenges. It provides daily orientation, family spotlight, memory activities, journaling, music playback, and cognitive games — all with accessible UI (large fonts, high-contrast themes, text-to-speech).

The app lives entirely in the `memowell/` subdirectory. All commands below should be run from there.

## Commands

```bash
cd memowell

# Start dev server (choose platform interactively)
npx expo start

# Start targeting a specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

There is no lint or test script configured. TypeScript type-checking can be run via:
```bash
npx tsc --noEmit
```

## Architecture

### Entry Point & Provider Stack

`App.tsx` wraps the app in this exact order (inner-to-outer matters for dependency):
```
GestureHandlerRootView
  AuthProvider       → Firebase Auth state
    ThemeProvider    → colorScheme + fontScale (not yet synced from UserProfile)
      TTSProvider    → expo-speech queue
        UserProvider → Firestore UserProfile + FamilyMembers (depends on AuthContext)
          NavigationContainer
            RootNavigator
```

### Navigation

`RootNavigator` gates on `user` + `profile.onboardingComplete`:
- **Unauthenticated or incomplete onboarding** → `OnboardingNavigator` (Welcome → ProfileSetup → FamilySetup → Preferences)
- **Authenticated + onboarded** → `MainTabNavigator` (4 tabs: Home, Memories, Games, Settings)

`MemoriesNavigator` and `SettingsNavigator` are nested stack navigators inside the tabs.

### Contexts

| Context | File | What it provides |
|---|---|---|
| `AuthContext` | `src/context/AuthContext.tsx` | `user: User \| null`, `loading` |
| `UserContext` | `src/context/UserContext.tsx` | `profile`, `familyMembers`, `updateProfile`, `refreshFamily` |
| `ThemeContext` | `src/context/ThemeContext.tsx` | `colors`, `fontScale`, `scaled(n)`, setters |
| `TTSContext` | `src/context/TTSContext.tsx` | `speak(text)`, `stop()`, `isSpeaking` |

`useTheme().scaled(n)` multiplies a base pixel value by `fontScale` (1.0 / 1.25 / 1.5) — use it for all font sizes and spacing that should scale with accessibility settings.

### Firebase / Backend

- **Auth**: Anonymous or email auth via `src/services/firebase/authService.ts`
- **Firestore schema**: All user data lives under `users/{uid}/` with subcollections: `familyMembers`, `checklistItems`, `checklistLog`, `journalEntries`, `musicPlaylists`, `memories`
- **Storage**: Photo uploads via `src/services/firebase/storageService.ts`
- Firebase config (project `practice-8b8a6`) is hardcoded in `src/services/firebase/config.ts`

### Data Types

All domain types are in `src/types/user.ts`: `UserProfile`, `FamilyMember`, `MusicTrack`, `MusicPlaylist`, `Memory`, `JournalEntry`.
Checklist types are in `src/types/checklist.ts`.

### Design System

- **Colors**: `src/constants/colors.ts` — primary palette is warm (CREAM, SAGE_GREEN, DUSTY_ROSE). ThemeContext maps `colorScheme` ('warm' | 'cool' | 'high-contrast') to a `ThemeColors` object.
- **Typography / Spacing**: `src/constants/typography.ts`, `src/constants/spacing.ts`
- **Reusable components**: `src/components/common/` — `SpeakableCard` (card that reads aloud on tap), `AnimatedCard`, `PrimaryButton`, `LargeText`, `IconButton`
- **Home cards**: `src/components/home/` — `WhoAmICard`, `DateWeatherCard`, `AffirmationCard`, `FamilySpotlightCard`, `ChecklistCard`, `SOSButton`

### Key Expo APIs in use

- `expo-speech` — TTS, managed globally through TTSContext
- `expo-av` — audio playback (music player)
- `expo-image-picker` — photo uploads
- `expo-location` — weather/location features
- `expo-notifications` — medication + checklist reminders
- `expo-speech-recognition` — voice journaling input

## Important Notes

- **Expo SDK version is 56** — always reference docs at https://docs.expo.dev/versions/v56.0.0/ before writing any Expo-specific code; the API surface has changed significantly from older versions.
- ThemeContext does **not** automatically sync with the `UserProfile.colorScheme` / `fontScale` fields stored in Firestore — that sync must be wired up explicitly when profile loads.
- The `SpeakableCard` component integrates with TTSContext to read its content aloud when tapped — use it for any card that elderly users should be able to hear read aloud.

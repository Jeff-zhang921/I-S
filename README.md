# Roommate Match Prototype

Frontend-only prototype built with React + TypeScript.

## Current scope

- Multi-file app structure with separate page components for each major step
- Phone-first layout tuned for a handset-sized PWA shell
- Sign-up, verification, privacy selection, and one-card-at-a-time onboarding
- Dynamic questionnaire length based on privacy level
- Typed must-haves and dealbreakers carried into the renter profile
- Implemented `Need a room` branch from the FigJam flow
- Renter journey pages for browse listings, filters, suggestions, match feed, room details, saved list, and send intro
- Fake group chat with house owners and current tenants for saved/contacted houses
- Bristol-based fake data for listings, neighborhoods, and demo accounts
- Manifest, service worker, and app icons for installable PWA behavior

## Tech stack

- React 18
- TypeScript
- Vite

## Run locally

1. `npm install`
2. `npm run dev`

Then open the local Vite URL printed in the terminal.

## Prototype notes

- The verification page uses demo code `246810`
- Privacy level is chosen before the questionnaire and changes the privacy question count
- Rating cards auto-advance after each answer
- Must-haves and dealbreakers are typed and saved into the profile summary
- Only the `Need a room` branch is implemented in this pass
- Listing data and roommate suggestions are local prototype data, not backend-driven
- The service worker is registered in production builds so the app can be installed on a phone
- Group chat messages and replies are fake frontend-only thread data

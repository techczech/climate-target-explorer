---
name: "Climate Target Explorer"
description: "An interactive web application to explore personal and collective carbon footprint targets required to meet the 1.5°C climate goal. Users can adjust parameters like country, structural changes, and participation rates, save their scenarios, and use Google Gemini to visualize what a society meeting these targets might look like."
categories: [interactive-learning-objects, web-app, built-by-ai, powered-by-ai]
updated: 2026-07-16
deployments:
  Appsite:
    "Climate Target Explorer": https://climatetargetexplorer.edutools.fyi/
---

# Collective Climate Target Explorer

An interactive web application to explore personal and collective carbon footprint targets required to meet the 1.5°C climate goal. Users can adjust parameters like country, structural changes, and participation rates, save their scenarios, and use Google Gemini to visualize what a society meeting these targets might look like.

## Architecture

This application is built as a client-side Single Page Application (SPA) using React and TypeScript.

### Core Technologies
- **React 19**: UI rendering and state management.
- **TypeScript**: Type safety and developer experience.
- **Tailwind CSS**: Utility-first styling.
- **Google Gemini API**: Generative AI for storytelling features.
- **Marked**: Markdown rendering for story output.

### Data Structure
The application adopts a decoupled architecture for data maintenance:
- **`data/facts.ts`**: Contains static reference data (Countries, Lifestyle Tiers). This allows content updates independent of business logic.
- **`config/model.ts`**: Contains mathematical model constants (Reduction factors, Global targets).
- **`services/storageService.ts`**: manages persistence layer using `localStorage` and JSON file import/export.

### State Management
- **`useExplorations` hook**: Acts as the primary store for user scenarios.
- **`storageService`**: Abstracts the persistence logic, ensuring data validation upon import/load.

## Features
- **Interactive Scenarios**: Adjust variables to see real-time impact on carbon budgets.
- **Comparison View**: Compare up to 3 different scenarios side-by-side.
- **AI Integration**: "Future Imaginator" uses Gemini to write stories based on the calculated lifestyle targets.
- **Import/Export**: Share scenarios via JSON files.
- **Offline Persistence**: Auto-saves work to browser LocalStorage.

## Deployment

This is a static web application that requires no backend server other than the Gemini API access.

### Requirements
- A static file host (Vercel, Netlify, GitHub Pages, or a simple S3 bucket).
- A visitor-supplied Google Gemini API key for optional story generation.

## Independent static hosting

Use Node 22.18 or newer. Run `npm ci`, `npm test`, `npm run typecheck` and `npm run build`. Host `dist/` on Cloudflare Pages or another static host with build command `npm run build`. No Cloud Run proxy, environment API key or server is required.

Climate calculations, saved explorations and imported stories work without a key. Optional story generation uses the visitor's own Gemini API key, entered in Imagine the Future. The key stays in memory for this tab and is never saved with an exploration. Clear key removes it. Generated and imported story Markdown is sanitised in both story views.

Automated API tests use synthetic keys and mocked responses. No paid provider call or public deployment is part of this migration check. Changing the live address remains a separate release step.

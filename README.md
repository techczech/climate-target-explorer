
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
- A valid Google Gemini API Key.

### Build & Run
Since the project uses ES Modules directly in the browser (via `importmap`), no build step (like Webpack or Vite) is strictly required for development if served over HTTP.

For production, you can deploy the files directly to any static web server.

### Environment Variables
The application expects the Google Gemini API Key to be available in the environment as `API_KEY`. 
*Note: In a client-side only deployment, ensure you restrict your API key's permissions to your specific domain to prevent unauthorized usage.*

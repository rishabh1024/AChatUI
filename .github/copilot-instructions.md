<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Chatbot Frontend Project

This is a React TypeScript project with Vite and TailwindCSS for building an AI chatbot interface.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Custom color scheme: Red (#ef4444), Black (#0f172a), Purple (#a855f7)

## Project Structure
- `src/components/` - React components
- `src/services/` - API service layer for FastAPI integration
- `src/types/` - TypeScript type definitions
- Color scheme uses semantic naming: primary (red), secondary (black/gray), accent (purple)

## Key Features
- Scrollable chat interface with fixed height
- Loading states with animated dots
- Message timestamps and role indicators
- Error handling for API calls
- Responsive design

## API Integration
- Designed to connect with FastAPI backend on localhost:8000
- POST endpoint expected at `/chat` with JSON body containing `message`
- Response expected to contain `message` or `response` field

## Coding Preferences
- Use functional components with hooks
- Implement proper TypeScript typing
- Follow TailwindCSS utility-first approach
- Use semantic color classes (primary, secondary, accent)
- Maintain clean component separation

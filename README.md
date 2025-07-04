# Bedtime Stories App

A simple, accessible bedtime story app designed for users with Down's syndrome and limited technology experience.

## Features

- 🎵 Audio story playback with intuitive controls
- 🏷️ Tag-based filtering system
- ♿ Accessibility-first design
- 📱 Mobile-first, responsive layout
- 🎨 Large, clear buttons and high contrast design
- 🔊 Volume control and progress tracking
- ⌨️ Full keyboard navigation support

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Library**: Material-UI (MUI) v5
- **CMS**: Sanity
- **Testing**: Jest, React Testing Library
- **Styling**: Material-UI theming system

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account and project

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Fill in your Sanity project details.

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Sanity Setup

1. Create a new Sanity project
2. Add the story schema from `sanity/schema.ts`
3. Upload audio files and create story documents
4. Update your environment variables

## Accessibility Features

- Large touch targets (minimum 44px)
- High contrast colors
- Screen reader support
- Keyboard navigation
- Focus indicators
- Reduced motion support
- Semantic HTML structure

## Testing

Run tests:
\`\`\`bash
npm test
\`\`\`

Run tests with coverage:
\`\`\`bash
npm run test:coverage
\`\`\`

## Design Principles

This app is specifically designed for users with Down's syndrome:

- **Simple Navigation**: Clear, linear flow
- **Large UI Elements**: Easy to tap and see
- **Consistent Layout**: Predictable interface
- **Visual Feedback**: Clear indication of actions
- **Minimal Cognitive Load**: One primary action per screen
- **Error Prevention**: Forgiving interface design

## Contributing

When contributing, please ensure:
- All components have corresponding tests
- Accessibility guidelines are followed
- Mobile-first design is maintained
- Code is properly typed with TypeScript
# stories-for-mo

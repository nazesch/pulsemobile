# Pulse - Wealth Management Mobile App

A modern, mobile-first wealth management application built with React. Pulse combines net worth tracking, investment portfolio monitoring, wallet-style cash management, and purpose-based financial "pockets" in a clean, premium interface.

## Features

- **Onboarding**: Clean welcome screen with instant credibility
- **Home Dashboard**: Large balance card with quick actions and recent activity
- **Transactions**: Clean activity feed showing all money movement
- **Pockets**: Visual organization of money by purpose (Cash, Investments, Bills, etc.)
- **Scan Hub**: Quick actions for scanning documents, QR codes, and manual entry
- **Insights**: Financial overview with income/expense tracking and pocket distribution
- **Account**: User profile and settings management

## Design Philosophy

- Mobile-native first (not a shrunk web app)
- High contrast, soft gradients, rounded cards
- Clear financial hierarchy
- No financial jargon
- One question per screen
- Premium, confidence-inducing interface

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/       # Reusable UI components
  │   ├── BottomNavigation.jsx
  │   ├── Card.jsx
  │   └── Button.jsx
  ├── screens/          # Main application screens
  │   ├── Onboarding.jsx
  │   ├── Home.jsx
  │   ├── Transactions.jsx
  │   ├── Pockets.jsx
  │   ├── Scan.jsx
  │   ├── Insights.jsx
  │   └── Account.jsx
  ├── context/          # State management
  │   └── AppContext.jsx
  ├── utils/            # Utility functions
  │   └── format.js
  ├── App.jsx           # Main app component with routing
  ├── main.jsx          # Entry point
  └── index.css         # Global styles
```

## Usage

### Onboarding

On first launch, users see a clean welcome screen. Click "Get Started" to begin.

### Adding Transactions

1. Navigate to the Scan tab (center button)
2. Select "Quick Add"
3. Fill in transaction details
4. The transaction will appear in your activity feed

### Managing Pockets

1. Go to the Pockets tab
2. View all your financial pockets
3. Click "Add Pocket" to create a new one
4. Each pocket shows its balance and color-coded category

### Viewing Insights

The Insights tab provides:
- Total net worth summary
- Income vs expenses breakdown
- Largest pocket overview
- Pocket distribution visualization

## Customization

### Colors

Edit `tailwind.config.js` to customize the primary color scheme:

```js
colors: {
  primary: {
    // Your color palette
  }
}
```

### Sample Data

Modify `src/context/AppContext.jsx` to change initial pockets and transactions.

## Mobile Optimization

The app is optimized for mobile devices with:
- Touch-friendly button sizes
- Bottom navigation for thumb reach
- Responsive card layouts
- Mobile viewport meta tags
- Safe area support for notched devices

## Future Enhancements

- Real-time investment data integration
- Bank account connections
- Advanced charting and analytics
- Export functionality
- Dark mode support
- Biometric authentication

## License

MIT


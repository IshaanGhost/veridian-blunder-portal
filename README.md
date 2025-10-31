# Veridian Blunder Portal

A satirical corporate compliance portal built with React and TypeScript, featuring intentionally frustrating and absurd UX elements. This project parodies corporate software with "features" that are deliberately inconvenient and humorous.

## 🎯 Project Overview

**Veridian Dynamics** presents a compliance portal where:
- Dashboard data randomly changes on every page reload
- Login buttons jump away from your cursor
- Forms require increasingly absurd validation rules
- Interactive features range from fun to frustratingly inconvenient

**Live Demo**: Available after deployment

## ✨ Features

### Core Functionality

- **Login System**: Credentials are `username` / `password`
  - Login button moves away when you try to click it
  - After 3 failed attempts, you get a "pity modal" that auto-logs you in
  
- **Dashboard**: 
  - Random data generation on every reload
  - Stats, metrics, and activity feeds shuffle positions and values
  - Comprehensive compliance metrics display

- **Features Page**:
  - Interactive tiles with physics simulation
  - Icons float and react to cursor movement
  - Tiles bounce off each other when they collide

- **Forms Page**:
  - Form fields randomly freeze after 10 seconds
  - Description field auto-clears randomly
  - Absurd validation rules that change on each submission attempt

### 🎮 Interactive Features (Available After Login)

All features are available on Dashboard, Features, and Forms pages:

1. **Konami Code Secret Combo**
   - Enter: ↑↑↓↓←→←→BA
   - Triggers full-screen celebration: "Compliance Achieved: 1000%!"

2. **Cursor Emoji Follower**
   - Emojis (🔒, 📊, ☕) rotate and follow your mouse cursor
   - Automatically cycles every 2 seconds

3. **Keyboard Recalibration Modal**
   - Random 1% chance when typing in input fields
   - Requires pressing all letters A-Z in alphabetical order
   - Progress tracker shows completion status

4. **Keyboard Sound Effects**
   - Typewriter-style sounds on keypress
   - **Intentionally inconvenient volume slider**:
     - Moves away from cursor on hover
     - Reversed direction (left = louder)
     - Rotated 180 degrees
     - 30% chance to randomly reset position
   - Default: ON (can be toggled)

5. **Click Counter with Achievement Badges**
   - Tracks total clicks across all pages
   - Achievement notifications at: 100, 500, 1000, 2500, 5000, 10000 clicks
   - Persists in localStorage
   - Display: "You clicked X times! Compliance through persistence!"

6. **Dark Mode Toggle**
   - Inverts colors and rotates entire page 180 degrees
   - Toggle button in header (🌙/🔆)
   - Fixes itself when clicked again
   - Preference saved in localStorage

7. **Fake System Notifications**
   - Random countdown: "Your session will expire in 3... 2... 1... (just kidding!)"
   - Browser notifications with absurd messages:
     - "Critical: Your coffee cup alignment needs adjustment"
     - "Warning: Your mouse cursor is 0.3mm off-center"
     - And more...
   - Requests notification permission automatically

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IshaanGhost/veridian-blunder-portal.git
cd veridian-blunder-portal-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

```bash
npm run preview
```

To preview the production build locally.

## 🏗️ Project Structure

```
veridian-blunder-portal-main/
├── public/
│   ├── favicon.svg          # Custom Veridian Dynamics favicon
│   └── ...
├── src/
│   ├── components/
│   │   └── ui/              # Shadcn UI components
│   ├── pages/
│   │   ├── Index.tsx        # Main dashboard/login page
│   │   ├── Features.tsx     # Features showcase with physics
│   │   ├── Forms.tsx        # Absurd form submission page
│   │   └── NotFound.tsx    # 404 error page
│   ├── App.tsx              # Main app component with routing
│   └── main.tsx             # Entry point
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Component library
- **Web Audio API** - Sound effects generation
- **Browser Notification API** - Fake system notifications

## 📝 Pages Overview

### Dashboard (`/`)
- **Login Stage**: Interactive login form with jumping button
- **Dashboard Stage**: 
  - Randomized stats and metrics
  - Activity feeds and department data
  - System status indicators
  - All interactive features enabled

### Features (`/features`)
- Feature tiles with floating icons
- Physics-based tile collision system
- Icons react to cursor movement
- Roadmap and premium guarantees sections

### Forms (`/forms`)
- Compliance request form
- Random field freezing
- Auto-clearing description field
- Increasingly absurd validation rules
- Submission requires multiple attempts with different error messages

## 🎨 Design Philosophy

This project is intentionally designed to be frustrating and absurd, parodying common UX anti-patterns in corporate software:

- **Unpredictable behavior**: Data changes on reload, buttons move
- **Unnecessary complexity**: Forms with arbitrary validation rules
- **Poor feedback**: Confusing error messages and unclear requirements
- **Inconvenient controls**: Volume slider that fights against you
- **False urgency**: Fake countdown notifications

All while maintaining a professional corporate aesthetic to enhance the satirical effect.

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality.

### localStorage Keys

The app uses localStorage to persist:
- `soundEnabled` - Boolean for sound toggle state
- `volume` - Number (0-1) for volume level
- `clickCount` - Number for total click counter
- `darkMode` - Boolean for dark mode preference

## 📄 License

This project is for demonstration and entertainment purposes.

## 🤝 Contributing

Feel free to fork this project and add your own absurd features! Some ideas:
- More keyboard shortcuts that do nothing
- Fake loading screens with fake progress bars
- Additional form validation nightmares
- More inconvenient UI controls

## 🐛 Known "Features" (Bugs That Are Actually Features)

- Login button may move unpredictably - This is intentional
- Forms may randomly freeze - This is intentional
- Volume slider is difficult to use - This is intentional
- All notifications are fake - This is intentional

## 📞 Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

**Remember**: This is a parody project. All "frustrating" features are intentional design choices for comedic effect! 😄

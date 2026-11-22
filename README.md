# Sajag - Disaster Preparedness and Education Platform

**Sajag** ("Stay Safe. Stay Prepared.") is an interactive mobile-first disaster preparedness and education application designed for students, teachers, and school administrators.

---

## 🌟 Key Features

- **Personalized Role-Based Experience**:
  - **Students**: Access disaster awareness modules, interactive games, educational safety reels, and preparedness quizzes.
  - **Teachers**: Review classroom preparedness, manage safety drills, and track student training completion.
  - **Administrators**: Comprehensive district and institutional preparedness analytics, active drill oversight, and risk level monitoring.
- **Interactive Learning & Safety Modules**:
  - Detailed guides and Do's & Don'ts for Floods, Earthquakes, Cyclones, Fire Emergencies, Tsunamis, and Heat Waves.
  - Categorized into *Science*, *Emergency Measures* (Indoors, Outdoors, Before, After, Debris rescue), and *Emergency Kits*.
- **Live Localized Alerts & NDMA Warnings**:
  - Real-time safety bulletins, weather advisories, and disaster notifications filtered by severity (Critical, Warning, Info).
- **24/7 Emergency Directory**:
  - Instant access to National Emergency Helplines (112), Medical/Hospitals, Police, Fire, and Rescue services with quick-dial support.
- **Geographic Risk Mapping**:
  - Embedded interactive disaster risk maps (e.g., Punjab flood and hazard zones).
- **Educational Safety Reels & Mini-Games**:
  - Short-form video drills ("Drop, Cover, and Hold", Flood response) and gamified emergency kit building exercises.
- **100% Free & Local Execution**:
  - Runs completely on your PC with zero paid API dependencies and seamless local offline storage support.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components & Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data**: React Hooks + LocalStorage + React Query

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed on your machine:
```bash
node -v
npm -v
```

### Installation

1. Navigate to the project directory:
   ```bash
   cd sajag-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Static assets, HTML hazard guides, interactive maps, and icons
│   ├── punjab_map.html     # Interactive disaster risk map
│   ├── *_dos.html          # Disaster Do's & Don'ts guides
│   ├── *_science.html      # Scientific background articles
│   └── emergency_kit.html  # Emergency checklist guide
├── src/
│   ├── assets/             # Images and media assets
│   ├── components/         # React UI Components
│   │   ├── ui/             # Reusable shadcn/ui primitives
│   │   ├── OnboardingScreen.tsx  # Role and location onboarding
│   │   ├── HomeScreen.tsx        # Central dashboard tailored to user role
│   │   ├── AlertsScreen.tsx      # Emergency advisories and weather alerts
│   │   ├── EmergencyDirectory.tsx# Quick-dial emergency contact directory
│   │   ├── LearningModules.tsx   # Hub for modules, maps, games & quizzes
│   │   ├── Modules.tsx           # Multi-hazard guides and step-by-step measures
│   │   ├── Quizzes.tsx           # Interactive disaster response quiz
│   │   ├── Games.tsx             # Educational disaster escape & kit games
│   │   ├── Reels.tsx             # Short video safety tips
│   │   ├── Maps.tsx              # Disaster risk mapping
│   │   ├── PreparednessLevels.tsx# School safety scorecards
│   │   └── AdminDashboard.tsx    # Administrator and teacher metrics
│   ├── hooks/              # Custom React hooks (toast, mobile detection)
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Primary route pages (Index, NotFound)
│   ├── App.tsx             # Main routing setup and query client
│   └── main.tsx            # React application entry point
├── package.json            # Project dependencies and npm scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📜 License

MIT License. Free to use, adapt, and run locally.

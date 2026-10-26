# 🌊 FLOW — Learn Through the Journey

### **An immersive, gamified learning odyssey across floating celestial islands.**
*Master modern programming concepts through interactive stories, real-time algorithmic visualizers, challenge dungeons, and PvP coding battles.*

[![React 19](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.40-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.14-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Explore Worlds](#-interactive-worlds--game-modes) •
[Features](#-key-features) •
[Tech Stack](#-tech-stack) •
[Architecture](#-project-structure) •
[Getting Started](#-getting-started) •
[Gamification Mechanics](#-gamification-engine)

</div>

---

## 🌟 Overview

**FLOW** reimagines web and software engineering education as an open-world archipelago of floating islands. Rather than reading static documentation or watching passive tutorials, learners navigate across beautifully rendered interactive worlds, mastering concepts through sensory learning:

* **Visual & Story-Driven:** Experience the dawn of the internet in vintage browser simulators and storybook timelines.
* **Algorithmic Sandboxes:** Step through loops, memory references, and floating-point oddities frame-by-frame.
* **Gamified Progression:** Earn XP, level up, maintain daily streaks, unlock badges, and test your knowledge in boss-battle dungeons.
* **Real-time Coding Arena:** Duel against smart bots or invite friends via match codes for fast-paced 1v1 trivia battles.

---

## 🗺️ Interactive Worlds & Game Modes

### 🟡 JavaScript Core World (`/js-world`)
The flagship world designed to take developers from core basics to complex engine internals:

```
                  ┌──────────────────────────────┐
                  │       JavaScript World       │
                  └──────────────┬───────────────┘
          ┌──────────────┬───────┴───────┬──────────────┐
          ▼              ▼               ▼              ▼
   📜 History Mode  📖 Learn Mode  🧪 Playgrounds  ⚔️ Challenge Dungeon
```

1. **📜 History Mode (`/js-world/history`)**
   - Step back to 1995: Explore Netscape Navigator, Brendan Eich's 10-day sprint creating Mocha, the browser wars, and ECMAScript standardization.
   - Interactive retro browser frames, timeline scrolls, and milestones.

2. **📖 Learn Mode (`/js-world/learn`)**
   - High-yield interactive lessons covering Variables & Scoping, Data Types, Operators, Loops, Functions, Closures, and ES6+.
   - Real-world conceptual analogies, live code snippets, interactive comprehension checks, and star grading.

3. **🧪 Playground Arena (`/js-world/playground`)**
   - **Loop Visualizer:** Step-by-step frame execution of `for`, `while`, and `do-while` loops with variable inspectors.
   - **Primitive vs. Reference Simulator:** Visualize stack vs. heap allocation, pointer mutability, and copy-by-value vs. copy-by-reference.
   - **Number Precision Lab:** Interactive demonstration of IEEE-754 floating point arithmetic (unraveling why `0.1 + 0.2 !== 0.3`).
   - **Object Reference Graph:** Dynamic node-pointer tracking showing mutations across nested structures.

4. **⚔️ Challenge Dungeon (`/js-world/challenges`)**
   - Boss-level quizzes categorised by topic and difficulty (Easy, Medium, Hard).
   - Tackle notorious JavaScript quirks: Type Coercion, Equality Gotchas (`==` vs `===`), Truthy/Falsy traps, and Array prototypes.

---

### ⚔️ The Arena (`/arena`)
A real-time 1v1 combat arena where code mastery is your weapon:
- **Game Modes:** Practice against challenging AI opponents or battle friends using instant Room Codes.
- **Battle Mechanics:** Dynamic health bars, time limits per question, rapid-fire streak multipliers, and instant answer explanations.
- **Avatars & Ranks:** Customizable character avatars with ranked progression.

---

### 💬 Community Feed (`/community`)
A community hub designed for learners to collaborate:
- Share code snippets with live formatting.
- Post insights, questions, and debugging tips.
- React, reply, and earn verified mentor and rank badges.

---

### 🌐 The Greater Archipelago (Upcoming Worlds)
- **⬡ Backend Island:** Node.js, Express, REST APIs, and database fundamentals.
- **⚛️ React Island:** Component architecture, hooks, state machines, and reconciliation.
- **◈ System Design Island:** Distributed architectures, caching, load balancing, and scalability.
- **☁️ Cloud & DevOps:** Containerization, CI/CD pipelines, and cloud deployment.

---

## ✨ Atmospheric Audiovisual Design

FLOW incorporates a living, reactive environment built directly in the browser:

* **Dynamic Skybox:** Canvas & SVG celestial engine featuring realistic moon phases, glowing auroras, drifting cloud layers, and procedurally generated shooting stars.
* **Parallax Ocean:** Layered wave physics with shoreline reflections that react to mouse movements and viewport shifts.
* **Synthesized Web Audio Engine:** Zero external audio assets! All sound effects (UI clicks, hover tones, chime arpeggios, and battle SFX) are synthesized live using the **Web Audio API** oscillators.
* **Liquid Glass UI:** Ultra-modern dark-mode design system utilizing backdrop filters, glowing borders, smooth spring physics (`framer-motion`), and responsive layouts.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Next-generation React core with modern hooks & rendering |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Blazing fast HMR and optimized asset bundling |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) | Smooth declarative layout animations and spring physics |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) | Lightweight global store with automatic `localStorage` persistence |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing with animated page transitions |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent developer iconography |
| **Audio** | Web Audio API | Procedural in-browser oscillator sound synthesis |
| **Typography** | Inter, JetBrains Mono, Space Grotesk | High-legibility modern UI & monospace developer fonts |

---

## 📂 Project Structure

```bash
├── public/                 # Static assets, favicons, logos
├── images/                 # World & card destination artwork
├── src/
│   ├── assets/             # Vector icons and hero images
│   ├── components/
│   │   ├── islands/        # Floating Island 3D/2D models, paths, and mascots
│   │   │   ├── Island.jsx
│   │   │   ├── IslandGroup.jsx
│   │   │   ├── MagicPath.jsx
│   │   │   └── Mascot.jsx
│   │   ├── layout/         # Navigation, particle fields, loading screens
│   │   │   ├── Navbar.jsx
│   │   │   ├── ParticleField.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── ocean/          # Animated multi-layer ocean waves
│   │   ├── sky/            # Moon phases, cloud drift, starfields, shooting stars
│   │   └── ui/             # Reusable UI components (Buttons, Cards, SoundToggle, XPPopup)
│   ├── data/               # Educational curriculum & challenges
│   │   ├── achievements.js # Unlockable achievements registry
│   │   ├── arenaQuestions.js# PvP question pools with difficulty ratings
│   │   ├── challenges.js   # Challenge Dungeon problems & explanations
│   │   ├── historyChapters.js # Interactive JavaScript historical timeline
│   │   ├── islands.js      # Archipelago world configurations
│   │   ├── jsRoadmap.js    # Developer roadmap milestones
│   │   ├── lessons.js      # Full interactive lesson curriculum
│   │   └── playgrounds.js  # Simulation lab metadata
│   ├── pages/              # Main view routes
│   │   ├── LandingPage.jsx # Hero showcase with interactive island map
│   │   ├── JSWorld.jsx     # JavaScript Hub & destination portal
│   │   ├── HistoryMode.jsx # Interactive timeline narrative
│   │   ├── LearnMode.jsx   # Structured lessons with quizzes & star reviews
│   │   ├── PlaygroundArena.jsx # Visual execution simulations
│   │   ├── ChallengeDungeon.jsx# Boss battles & tricky JS gotchas
│   │   ├── Arena.jsx       # 1v1 PvP coding battle arena
│   │   └── Community.jsx   # Social developer feed & discussions
│   ├── store/
│   │   └── useStore.js     # Global Zustand store (XP, Levels, Streaks, Audio)
│   ├── App.jsx             # Route definitions and page transition choreography
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global design tokens, typography, and theme variables
├── package.json            # Project dependencies and script runner
├── vite.config.js          # Vite build pipeline and plugin setup
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later (or `pnpm` / `yarn`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flow.git
   cd flow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to start your journey.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the local dev server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles production-ready bundle to the `dist/` directory |
| `npm run preview` | Locally serves the production build for testing |
| `npm run lint` | Runs ESLint across all JavaScript/JSX files |

---

## 🎮 Gamification Engine

```
       [ Complete Lessons ] ──> +50 XP ┐
       [ Win Arena Duels  ] ──> +30 XP ┼──> [ Level Up: XP / 500 + 1 ]
       [ Crack Challenges ] ──> +20 XP ┘         │
                                                 ▼
       [ Maintain Daily Visits ] ──> [ Daily Streak Multiplier 🔥 ]
```

* **XP & Level Scaling:** Earn experience points by completing lessons, conquering challenge dungeon puzzles, and winning arena duels. Every 500 XP raises your player level.
* **Lesson Star Rating:**
  - ⭐ **1 Star:** Completed lesson.
  - ⭐⭐ **2 Stars:** Scored 80%+ on comprehension check.
  - ⭐⭐⭐ **3 Stars:** Flawless 100% first-pass accuracy.
* **Persistent Progress:** All progress (XP, unlocked achievements, completed challenges, streak history) automatically syncs to browser storage (`localStorage`).
* **Achievements System:** Unlock commemorative badges for feats like *"First Step"*, *"Syntax Sorcerer"*, *"Coercion Conqueror"*, and *"Arena Champion"*.

---

## 🤝 Contributing

Contributions are welcomed! Whether it's adding a new lesson, designing a new simulation for Playground Arena, or polishing visual effects:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for passionate learners navigating the modern web.</sub>
</div>

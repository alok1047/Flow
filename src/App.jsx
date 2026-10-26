import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Navbar from './components/layout/Navbar';
import LoadingScreen from './components/layout/LoadingScreen';
import ParticleField from './components/layout/ParticleField';
import LandingPage from './pages/LandingPage';
import JSWorld from './pages/JSWorld';
import HistoryMode from './pages/HistoryMode';
import LearnMode from './pages/LearnMode';
import PlaygroundArena from './pages/PlaygroundArena';
import ChallengeDungeon from './pages/ChallengeDungeon';
import Arena from './pages/Arena';
import Community from './pages/Community';
import './App.css';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export default function App() {
  const location = useLocation();
  const { isLoading, setLoading, updateStreak, showParticles } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    updateStreak();
    // Simulate loading (min 2s for the loading screen experience)
    const timer = setTimeout(() => {
      setLoading(false);
      // Small delay for exit animation
      setTimeout(() => setReady(true), 500);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Navbar />
          {showParticles && <ParticleField />}

          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
              <Routes location={location}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/arena" element={<Arena />} />
                <Route path="/community" element={<Community />} />
                <Route path="/js-world" element={<JSWorld />} />
                <Route path="/js-world/history" element={<HistoryMode />} />
                <Route path="/js-world/learn" element={<LearnMode />} />
                <Route path="/js-world/playground" element={<PlaygroundArena />} />
                <Route path="/js-world/challenges" element={<ChallengeDungeon />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

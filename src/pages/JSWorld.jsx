import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import LucideIcon from '../components/ui/LucideIcon';
import './JSWorld.css';

const destinations = [
  {
    id: 'history',
    name: 'History Mode',
    icon: 'Scroll',
    desc: 'The Story of JavaScript',
    route: '/js-world/history',
    color: '#f59e0b',
    image: '/images/1.jpg',
  },
  {
    id: 'learn',
    name: 'Learn Mode',
    icon: 'BookOpen',
    desc: 'Master Core Concepts',
    route: '/js-world/learn',
    color: '#3b82f6',
    image: '/images/2.jpeg',
  },
  {
    id: 'playground',
    name: 'Playground Arena',
    icon: 'Gamepad2',
    desc: 'Interactive Simulations',
    route: '/js-world/playground',
    color: '#22c55e',
    image: '/images/3.jpg',
  },
  {
    id: 'challenge',
    name: 'Challenge Dungeon',
    icon: 'Swords',
    desc: 'Test Your Skills',
    route: '/js-world/challenges',
    color: '#ef4444',
    image: '/images/4.png',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function JSWorld() {
  const navigate = useNavigate();
  const { xp, level, completedLessons, completedChallenges } = useStore();

  return (
    <motion.div
      className="jsworld"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="jsworld-header"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="jsworld-badge" variants={fadeUp} custom={0}>
          <Zap size={14} />
          JavaScript World
        </motion.div>
        <motion.h1 variants={fadeUp} custom={1}>
          <span className="glow-text-gold">JavaScript</span> Core
        </motion.h1>
        <motion.p variants={fadeUp} custom={2}>
          Choose your path and begin the adventure
        </motion.p>
      </motion.div>

      {/* 4 Card Type Navigation Grid */}
      <div className="jsworld-cards-wrapper">
        <div className="jsworld-cards-grid">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              className={`jsworld-nav-card jsworld-nav-card--${dest.id}`}
              style={{
                '--accent-color': dest.color,
                '--accent-glow': `${dest.color}33`
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
              onClick={() => navigate(dest.route)}
            >
              {/* Card Background Image (reveals at low transparency on hover) */}
              <div
                className="jsworld-card-bg"
                style={{ backgroundImage: `url(${dest.image})` }}
              />

              {/* Card Content Overlay */}
              <div className="jsworld-card-content">
                <div className="jsworld-card-icon-wrapper" style={{ backgroundColor: `${dest.color}15`, borderColor: `${dest.color}30` }}>
                  <LucideIcon name={dest.icon} size={24} style={{ color: dest.color }} />
                </div>

                <h3 className="jsworld-card-title">{dest.name}</h3>
                <p className="jsworld-card-desc">{dest.desc}</p>

                <div className="jsworld-card-enter">
                  <span>Enter Path</span>
                  <ArrowRight size={14} className="enter-arrow" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        className="jsworld-stats"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
      >
        {[
          { value: xp, label: 'Total XP' },
          { value: `Lv. ${level}`, label: 'Level' },
          { value: completedLessons.length, label: 'Lessons Done' },
          { value: completedChallenges.length, label: 'Challenges' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="jsworld-stat"
            variants={fadeUp}
            custom={i}
          >
            <div className="jsworld-stat-value">{stat.value}</div>
            <div className="jsworld-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Globe, 
  Lock, 
  BookOpen, 
  Gamepad2, 
  Swords, 
  Trophy, 
  Palette, 
  Smartphone,
  Zap,
} from 'lucide-react';
import NightSky from '../components/sky/NightSky';
import Ocean from '../components/ocean/Ocean';
import IslandGroup from '../components/islands/IslandGroup';
import Button from '../components/ui/Button';
import LiquidMoonButton from '../components/ui/LiquidMoonButton';
import Mascot from '../components/islands/Mascot';
import { useStore } from '../store/useStore';
import './LandingPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const playHoverSound = (soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
};

const playClickSound = (soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playChime = (freq, delay, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    };
    playChime(523.25, 0, 0.04);    // C5
    playChime(659.25, 0.05, 0.03); // E5
    playChime(783.99, 0.1, 0.02);  // G5
  } catch (e) {
    console.warn('Audio play blocked or unsupported', e);
  }
};

/* ── Planet metadata for the galaxy ── */
const planets = [
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Language of the Web',
    description:
      'Learn the foundations of web development through interactive stories, simulations and challenges.',
    topics: ['History', 'Variables', 'Data Types', 'Operators', 'Loops', 'Numbers', 'Strings'],
    difficulty: 'Beginner',
    xpReward: '240 XP',
    estimatedTime: '15 Hours',
    cta: 'Start Journey',
    route: '/js-world',
    unlocked: true,
    color: '#f7df1e',
    glowColor: 'rgba(247, 223, 30, 0.35)',
    orbitRadius: 100,
    orbitSpeed: 36,
    size: 54,
    startAngle: 0,
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend Framework',
    description: 'Build modern user interfaces.',
    topics: ['Components', 'JSX', 'Props', 'State', 'Hooks', 'Routing', 'API Integration'],
    difficulty: 'Intermediate',
    xpReward: '400 XP',
    estimatedTime: '20 Hours',
    cta: 'Explore React',
    route: '/react-world',
    unlocked: false,
    color: '#61dafb',
    glowColor: 'rgba(97, 218, 251, 0.30)',
    orbitRadius: 145,
    orbitSpeed: 48,
    size: 44,
    startAngle: 72,
  },
  {
    id: 'backend',
    name: 'Backend',
    category: 'Server Development',
    description: 'Build APIs, servers and databases.',
    topics: ['Node.js', 'Express', 'Authentication', 'MongoDB', 'REST APIs', 'Security'],
    difficulty: 'Intermediate',
    xpReward: '500 XP',
    estimatedTime: '25 Hours',
    cta: 'Explore Backend',
    route: '/backend-world',
    unlocked: false,
    color: '#68a063',
    glowColor: 'rgba(104, 160, 99, 0.30)',
    orbitRadius: 185,
    orbitSpeed: 58,
    size: 42,
    startAngle: 144,
  },
  {
    id: 'system-design',
    name: 'System Design',
    category: 'Architecture',
    description: 'Learn how large-scale systems work.',
    topics: ['Architecture', 'Caching', 'Load Balancing', 'Databases', 'Microservices', 'Scalability'],
    difficulty: 'Advanced',
    xpReward: '600 XP',
    estimatedTime: '30 Hours',
    cta: 'Explore System Design',
    route: '/system-design-world',
    unlocked: false,
    color: '#e535ab',
    glowColor: 'rgba(229, 53, 171, 0.30)',
    orbitRadius: 220,
    orbitSpeed: 68,
    size: 40,
    startAngle: 216,
  },
  {
    id: 'devops',
    name: 'DevOps',
    category: 'Operations',
    description: 'Deploy and manage production applications.',
    topics: ['Linux', 'Docker', 'CI/CD', 'AWS', 'Monitoring', 'Kubernetes'],
    difficulty: 'Advanced',
    xpReward: '550 XP',
    estimatedTime: '25 Hours',
    cta: 'Explore DevOps',
    route: '/cloud-world',
    unlocked: false,
    color: '#ff9900',
    glowColor: 'rgba(255, 153, 0, 0.30)',
    orbitRadius: 250,
    orbitSpeed: 78,
    size: 40,
    startAngle: 288,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const pathsRef = useRef(null);
  const featuresRef = useRef(null);
  const pathsInView = useInView(pathsRef, { once: true, margin: '-100px' });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' });

  const { soundEnabled, xp } = useStore();
  const [zoomingWorld, setZoomingWorld] = useState(null);
  const [selectedPlanetId, setSelectedPlanetId] = useState('javascript');
  const [hoveredPlanetId, setHoveredPlanetId] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating text particles effect when hovered
  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-15), // Limit to max 15 active particles
        {
          id: Math.random() + Date.now(),
          x: Math.random() * 120 - 60, // Random X offset across FLOW letters
          y: Math.random() * 30 - 15,  // Random Y offset
          tx: Math.random() * 60 - 30,  // Slide left/right
          ty: -Math.random() * 50 - 30, // Float upward
          scale: Math.random() * 0.7 + 0.3,
          size: `${Math.random() * 5 + 3}px`,
          color: Math.random() > 0.5 ? '#93c5fd' : '#c084fc', // moon-blue or light-purple
        },
      ]);
    }, 120);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleTitleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalized offset: -0.5 to 0.5
    const dx = (clientX / innerWidth) - 0.5;
    const dy = (clientY / innerHeight) - 0.5;
    // Map to a premium 8px max parallax offset
    setMousePos({ x: dx * 8, y: dy * 8 });
  };

  const handleTitleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const activePlanet =
    planets.find((p) => p.id === (hoveredPlanetId || selectedPlanetId)) || planets[0];

  const getPlanetCenterOffset = (planetId) => {
    if (!pathsRef.current) return { x: 0, y: 0 };
    const orbitEl = pathsRef.current.querySelector(`.gx-planet-orbit--${planetId}`);
    if (!orbitEl) return { x: 0, y: 0 };

    const style = window.getComputedStyle(orbitEl);
    const matrix = style.transform || style.webkitTransform;

    if (matrix && matrix !== 'none') {
      let a = 1;
      let b = 0;
      if (matrix.startsWith('matrix3d')) {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        a = parseFloat(values[0]);
        b = parseFloat(values[1]);
      } else if (matrix.startsWith('matrix')) {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        a = parseFloat(values[0]);
        b = parseFloat(values[1]);
      }
      const planet = planets.find((p) => p.id === planetId);
      const R = planet ? planet.orbitRadius : 100;

      return {
        x: R * a,
        y: R * b,
      };
    }

    const planet = planets.find((p) => p.id === planetId);
    const R = planet ? planet.orbitRadius : 100;
    return { x: R, y: 0 };
  };

  const zoomOnPlanet = (planetId) => {
    const offset = getPlanetCenterOffset(planetId);
    setZoomOffset({ x: -offset.x, y: -offset.y });
    setIsZoomed(true);
  };

  const handlePlanetClick = (planet) => {
    playClickSound(soundEnabled);
    if (selectedPlanetId === planet.id) {
      if (planet.unlocked) {
        setZoomingWorld(planet.id);
        setTimeout(() => navigate(planet.route), 600);
      } else {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          zoomOnPlanet(planet.id);
        }
      }
    } else {
      setSelectedPlanetId(planet.id);
      zoomOnPlanet(planet.id);
    }
  };

  const handleResetZoom = (e) => {
    if (e.target.classList.contains('gx-viewport') || e.target.classList.contains('gx-orbit-system') || e.target.classList.contains('gx-stars-field') || e.target.classList.contains('gx-nebula')) {
      setIsZoomed(false);
    }
  };

  const handlePlanetHover = (planetId) => {
    playHoverSound(soundEnabled);
    setHoveredPlanetId(planetId);
  };

  const handleIslandClick = (island) => {
    if (island.unlocked) {
      navigate(island.route);
    }
  };

  const scrollToPaths = () => {
    pathsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderLetters = (text) => {
    const words = text.split(' ');
    return words.map((word, wordIdx) => (
      <span key={wordIdx} className="hover-word">
        {word.split('').map((char, charIdx) => (
          <span key={charIdx} className="hover-letter">
            {char}
          </span>
        ))}
        {wordIdx < words.length - 1 && <span className="hover-letter-space">&nbsp;</span>}
      </span>
    ));
  };

  return (
    <div className="landing-page">
      {/* ========== Hero Section ========== */}
      <section className="hero" id="hero">
        <NightSky />
        <Ocean />
        <IslandGroup onIslandClick={handleIslandClick} />

        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 className="hero-title" variants={fadeUp} custom={0}>
            <span className="hero-title-line">
              {renderLetters("Learn Through")}
            </span>
            <span className="hero-title-line" style={{ position: 'relative', display: 'inline-block' }}>
              {renderLetters("the")}{' '}
              <motion.span
                className="highlight"
                style={{
                  display: 'inline-block',
                  cursor: 'default',
                  filter: 'url(#liquid-text-filter)',
                }}
                animate={{
                  x: mousePos.x,
                  y: mousePos.y,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleTitleMouseLeave}
                onMouseMove={handleTitleMouseMove}
              >
                {renderLetters("FLOW")}
                
                {/* Tiny glowing escaping particles */}
                <AnimatePresence>
                  {particles.map((p) => (
                    <motion.span
                      key={p.id}
                      className="flow-particle"
                      style={{
                        left: `calc(50% + ${p.x}px)`,
                        top: `calc(50% + ${p.y}px)`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        color: p.color,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.85, 0],
                        x: p.tx,
                        y: p.ty,
                        scale: [0, p.scale, 0],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                    />
                  ))}
                </AnimatePresence>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={1}>
            Interactive stories, simulations and playgrounds that make
            programming feel like an adventure.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeUp} custom={2}>
            <LiquidMoonButton onClick={() => navigate('/js-world')}>
              <Sparkles size={18} /> Start Journey
            </LiquidMoonButton>
            <Button variant="secondary" size="lg" onClick={scrollToPaths}>
              <Globe size={18} /> Explore World
            </Button>
          </motion.div>
        </motion.div>

        {/* SVG Liquid displacement filters */}
        <svg className="svg-filters" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <defs>
            {/* Text filter: slow moving wave distortion */}
            <filter id="liquid-text-filter">
              <motion.feTurbulence
                type="fractalNoise"
                baseFrequency="0.015 0.04"
                numOctaves="3"
                result="noise"
                animate={{
                  baseFrequency: ["0.015 0.03", "0.015 0.07", "0.015 0.03"]
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
              <motion.feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                xChannelSelector="R"
                yChannelSelector="G"
                animate={{
                  scale: isHovered ? 18 : 3
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 18
                }}
              />
            </filter>

            {/* Button filter: subtle liquid border wobbly effect */}
            <filter id="liquid-button-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03 0.08"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      </section>

      {/* ========== Section 2 — Worlds of FLOW ========== */}
      <section className="galaxy-section" id="paths" ref={pathsRef}>
        {/* Header */}
        <motion.div
          className="galaxy-header"
          initial="hidden"
          animate={pathsInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.span className="galaxy-badge" variants={fadeUp}>
            LEARNING GALAXY
          </motion.span>
          <motion.h2 variants={fadeUp}>
            Worlds of <span className="glow-text">FLOW</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1}>
            Start with JavaScript and unlock an entire universe of skills.
          </motion.p>
        </motion.div>

        {/* 2-column grid */}
        <motion.div
          className="galaxy-layout-grid"
          initial="hidden"
          animate={pathsInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={2}
        >
          {/* ── Left: Interactive Galaxy ── */}
          <div className="galaxy-viewport-column">
            <div className={`gx-viewport${(isZoomed || zoomingWorld) ? ' gx-viewport--zoomed' : ''}`} onClick={handleResetZoom}>
              {/* Space ambience */}
              <div className="gx-nebula" />
              <div className="gx-stars-field" />
              <div className="gx-moonlight" />
              <div className="gx-particles">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span
                    key={i}
                    className="gx-particle"
                    style={{
                      '--delay': `${i * 0.35}s`,
                      '--x': `${(i * 7.3 + 15) % 100}%`,
                      '--y': `${(i * 11.7 + 8) % 100}%`,
                      '--size': `${(i % 3) + 1}px`,
                      '--max-o': `${(i % 4) * 0.12 + 0.3}`,
                    }}
                  />
                ))}
              </div>

              <div className="gx-orbit-system" style={{ transform: isZoomed ? `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(1.5)` : 'translate(0px, 0px) scale(1)' }}>
                {/* Orbit track circles */}
                {planets.map((planet) => (
                  <div
                    key={`track-${planet.id}`}
                    className={`gx-orbit-track${
                      hoveredPlanetId === planet.id || selectedPlanetId === planet.id
                        ? ' gx-orbit-track--active'
                        : ''
                    }`}
                    style={{ '--orbit-d': `${planet.orbitRadius * 2}px` }}
                  />
                ))}

                {/* Central FLOW Star */}
                <div className="gx-star-core">
                  <div className="gx-star-pulse" />
                  <div className="gx-star-inner" />
                  <div className="gx-star-content">
                    <span className="gx-star-title">FLOW</span>
                    <span className="gx-star-sub">Learning Universe</span>
                    <div className="gx-star-meta">
                      <span className="gx-star-journey">JavaScript</span>
                      <span className="gx-star-xp">
                        <Zap size={10} /> {xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Orbiting Planets */}
                {planets.map((planet) => (
                  <div
                    key={planet.id}
                    className={`gx-planet-orbit gx-planet-orbit--${planet.id}${
                      isZoomed && selectedPlanetId !== planet.id ? ' gx-planet-orbit--dimmed' : ''
                    }`}
                    style={{
                      '--orbit-r': `${planet.orbitRadius}px`,
                      '--orbit-speed': `${planet.orbitSpeed}s`,
                      '--planet-size': `${planet.size}px`,
                      '--planet-color': planet.color,
                      '--planet-glow': planet.glowColor,
                      '--start-angle': `${planet.startAngle}deg`,
                      '--start-angle-neg': `-${planet.startAngle}deg`,
                    }}
                  >
                    <div
                      className={`gx-planet${
                        selectedPlanetId === planet.id ? ' gx-planet--selected' : ''
                      }${hoveredPlanetId === planet.id ? ' gx-planet--hovered' : ''}${
                        planet.id === 'javascript' ? ' gx-planet--active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanetClick(planet);
                      }}
                      onMouseEnter={() => handlePlanetHover(planet.id)}
                      onMouseLeave={() => setHoveredPlanetId(null)}
                    >
                      <div className={`gx-planet-body gx-planet-body--${planet.id}`} />
                      {planet.id === 'javascript' && (
                        <div className="gx-planet-mascot">
                          <Mascot />
                        </div>
                      )}
                      {!planet.unlocked && (
                        <div className="gx-planet-lock">
                          <Lock size={10} />
                        </div>
                      )}
                      <span className="gx-planet-name">{planet.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Dynamic Information Panel ── */}
          <div className="galaxy-info-panel-column">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlanet.id}
                className="gx-info-panel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Title row */}
                <div className="gx-info-head">
                  <div
                    className="gx-info-dot"
                    style={{
                      background: activePlanet.color,
                      boxShadow: `0 0 12px ${activePlanet.glowColor}`,
                    }}
                  />
                  <div>
                    <h3 className="gx-info-title">{activePlanet.name}</h3>
                    <span className="gx-info-category">{activePlanet.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="gx-info-desc">{activePlanet.description}</p>

                {/* Topics */}
                <div className="gx-info-topics-label">Topics</div>
                <div className="gx-info-topics">
                  {activePlanet.topics.map((t) => (
                    <span key={t} className="gx-topic-tag">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="gx-info-stats">
                  <div className="gx-stat">
                    <span className="gx-stat-label">Difficulty</span>
                    <span className="gx-stat-value" style={{ color: activePlanet.color }}>
                      {activePlanet.difficulty}
                    </span>
                  </div>
                  <div className="gx-stat">
                    <span className="gx-stat-label">XP Reward</span>
                    <span className="gx-stat-value">{activePlanet.xpReward}</span>
                  </div>
                  <div className="gx-stat">
                    <span className="gx-stat-label">Est. Time</span>
                    <span className="gx-stat-value">{activePlanet.estimatedTime}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="lg"
                  className={`gx-info-cta${!activePlanet.unlocked ? ' gx-info-cta--locked' : ''}`}
                  disabled={!activePlanet.unlocked}
                  onClick={() => {
                    if (activePlanet.unlocked) {
                      playClickSound(soundEnabled);
                      setZoomingWorld(activePlanet.id);
                      setTimeout(() => navigate(activePlanet.route), 600);
                    }
                  }}
                >
                  {activePlanet.unlocked ? (
                    <>
                      <Sparkles size={16} /> {activePlanet.cta}
                    </>
                  ) : (
                    <>
                      <Lock size={14} /> Coming Soon
                    </>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Zoom overlay for hyperspace screen transition */}
      {zoomingWorld && (
        <motion.div
          className="zoom-overlay"
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: 1, scale: 35 }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.19, 1.0] }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background:
              zoomingWorld === 'javascript'
                ? 'radial-gradient(circle, #f59e0b 0%, #78350f 100%)'
                : 'radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 0 100px rgba(255,255,255,0.4)',
            zIndex: 99999,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ========== Features Section ========== */}
      <section className="features-section" ref={featuresRef}>
        <motion.div
          className="paths-header"
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp}>
            Why <span className="glow-text-ocean">FLOW</span>?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1}>
            Built for learners who want more than just tutorials.
          </motion.p>
        </motion.div>

        <motion.div
          className="features-grid"
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {[
            {
              icon: <BookOpen size={32} />,
              title: 'Story-Driven Learning',
              desc: 'Every concept begins with a story. Understand the "why" before the "how".',
            },
            {
              icon: <Gamepad2 size={32} />,
              title: 'Interactive Simulations',
              desc: 'Visualize memory, loops, and data types with hands-on playgrounds.',
            },
            {
              icon: <Swords size={32} />,
              title: 'Challenge Dungeons',
              desc: 'Test your skills with code puzzles, output prediction, and timed challenges.',
            },
            {
              icon: <Trophy size={32} />,
              title: 'XP & Achievements',
              desc: 'Earn XP, unlock badges, and track your progress across all worlds.',
            },
            {
              icon: <Palette size={32} />,
              title: 'Beautiful Experience',
              desc: 'A premium learning environment designed to keep you engaged and motivated.',
            },
            {
              icon: <Smartphone size={32} />,
              title: 'Learn Anywhere',
              desc: 'Fully responsive design. Continue your journey on any device.',
            },
          ].map((feature, i) => (
            <motion.div key={i} className="feature-card" variants={fadeUp} custom={i}>
              <div
                className="feature-icon"
                style={{
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="landing-footer">
        <p>FLOW © 2026 — Learn programming through adventure.</p>
      </footer>
    </div>
  );
}

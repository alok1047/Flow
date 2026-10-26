import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Scroll, Star } from 'lucide-react';
import { historyChapters } from '../data/historyChapters';
import LucideIcon from '../components/ui/LucideIcon';
import './HistoryMode.css';

/* ─── Visual Illustrations ─── */

function OldBrowserVisual() {
  return (
    <div className="chapter-visual visual-old-browser">
      <div className="old-browser-frame">
        <div className="old-browser-titlebar">
          <span>WorldWideWeb - Document</span>
          <div className="old-browser-btns">
            <span>—</span>
            <span>□</span>
            <span>×</span>
          </div>
        </div>
        <div className="old-browser-toolbar">
          <div className="old-browser-url">http://info.cern.ch/</div>
        </div>
        <div className="old-browser-content">
          <h4>World Wide Web</h4>
          <p>
            The WorldWideWeb (W3) is a wide-area
            hypermedia information retrieval initiative.
          </p>
          <a href="#!">Everything there is online...</a>
        </div>
      </div>
    </div>
  );
}

function NetscapeVisual() {
  return (
    <div className="chapter-visual visual-netscape">
      <div className="netscape-logo">
        <div className="netscape-n">N</div>
      </div>
      <div className="netscape-tagline">Netscape Navigator 1.0</div>
    </div>
  );
}

function JavaVisual() {
  return (
    <div className="chapter-visual visual-java">
      <div className="java-steam">
        <span />
        <span />
        <span />
      </div>
      <div className="java-cup">
        <div className="java-cup-body" />
        <div className="java-cup-handle" />
      </div>
      <div className="java-label">Write Once, Run Anywhere™</div>
    </div>
  );
}

function BrowserWarVisual() {
  return (
    <div className="chapter-visual visual-browser-war">
      <div className="browser-icon">
        <div className="browser-icon-shape netscape-icon">N</div>
        <span>Netscape</span>
      </div>
      <div className="war-vs">VS</div>
      <div className="browser-icon">
        <div className="browser-icon-shape ie-icon">e</div>
        <span>IE</span>
      </div>
    </div>
  );
}

function BrendanVisual() {
  return (
    <div className="chapter-visual visual-brendan">
      <div className="code-editor">
        <div className="code-editor-header">
          <div className="code-editor-dot" />
          <div className="code-editor-dot" />
          <div className="code-editor-dot" />
          <span className="code-editor-filename">mocha.js</span>
        </div>
        <div className="code-editor-body">
          <div className="code-line">
            <span className="code-comment">{'// May 1995 — 10 days'}</span>
          </div>
          <div className="code-line">
            <span className="code-keyword">function </span>
            <span className="code-function">mocha</span>
            <span className="code-punctuation">() {'{'}</span>
          </div>
          <div className="code-line">
            <span className="code-punctuation">  </span>
            <span className="code-keyword">var </span>
            <span className="code-punctuation">dynamic = </span>
            <span className="code-string">'true'</span>
            <span className="code-punctuation">;</span>
          </div>
          <div className="code-line">
            <span className="code-punctuation">  </span>
            <span className="code-keyword">var </span>
            <span className="code-punctuation">prototypes = </span>
            <span className="code-string">'yes'</span>
            <span className="code-punctuation">;</span>
          </div>
          <div className="code-line">
            <span className="code-punctuation">  </span>
            <span className="code-keyword">return </span>
            <span className="code-string">'brilliant'</span>
            <span className="code-punctuation">;</span>
          </div>
          <div className="code-line">
            <span className="code-punctuation">{'}'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NamingVisual() {
  return (
    <div className="chapter-visual visual-naming">
      <div className="naming-flow">
        <div className="naming-step">
          <div className="naming-badge mocha">Mocha</div>
          <span className="naming-year">Sep 1995</span>
        </div>
        <span className="naming-arrow">→</span>
        <div className="naming-step">
          <div className="naming-badge livescript">LiveScript</div>
          <span className="naming-year">Nov 1995</span>
        </div>
        <span className="naming-arrow">→</span>
        <div className="naming-step">
          <div className="naming-badge javascript">JavaScript</div>
          <span className="naming-year">Dec 1995</span>
        </div>
      </div>
    </div>
  );
}

function VictoryVisual() {
  const bars = [
    { label: '2005', height: 20, color: '#7c3aed' },
    { label: '2008', height: 35, color: '#8b5cf6' },
    { label: '2010', height: 50, color: '#a855f7' },
    { label: '2012', height: 65, color: '#c084fc' },
    { label: '2015', height: 85, color: '#d8b4fe' },
  ];

  return (
    <div className="chapter-visual visual-victory">
      <div className="victory-chart">
        {bars.map((bar) => (
          <div className="victory-bar" key={bar.label}>
            <motion.div
              className="victory-bar-fill"
              initial={{ height: 0 }}
              whileInView={{ height: bar.height }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * bars.indexOf(bar) }}
              style={{ background: bar.color }}
            />
            <span className="victory-bar-label">{bar.label}</span>
          </div>
        ))}
      </div>
      <div className="victory-label">JavaScript Adoption ↑</div>
    </div>
  );
}

function ModernVisual() {
  return (
    <div className="chapter-visual visual-modern">
      <div className="modern-logo">
        <div className="modern-logo-icon react-logo">
          <div className="react-atom">
            <div className="react-atom-core" />
            <div className="react-atom-orbit" />
            <div className="react-atom-orbit" />
            <div className="react-atom-orbit" />
          </div>
        </div>
        <span>React</span>
      </div>
      <div className="modern-logo">
        <div className="modern-logo-icon node-logo">⬡</div>
        <span>Node.js</span>
      </div>
      <div className="modern-logo">
        <div className="modern-logo-icon ts-logo">TS</div>
        <span>TypeScript</span>
      </div>
    </div>
  );
}

const visualComponents = {
  'old-browser': OldBrowserVisual,
  netscape: NetscapeVisual,
  java: JavaVisual,
  'browser-war': BrowserWarVisual,
  brendan: BrendanVisual,
  naming: NamingVisual,
  victory: VictoryVisual,
  modern: ModernVisual,
};

/* ─── Chapter Details Data for Console HUD ─── */

const chapterDetails = {
  1: {
    stats: [
      { label: 'Technology', value: 'HTML 1.0' },
      { label: 'Era Launch', value: '1991' },
      { label: 'Interactivity', value: '0% (Static)' },
      { label: 'Standard', value: 'IETF RFCs' }
    ],
    highlights: [
      'Invented by Tim Berners-Lee at CERN',
      'Plain text documents linked via hypermedia',
      'No style sheets, web layouts, or scripting'
    ]
  },
  2: {
    stats: [
      { label: 'Browser', value: 'Netscape Nav.' },
      { label: 'Market Share', value: '>90% (1995)' },
      { label: 'Key Need', value: 'Dynamic UI' },
      { label: 'Connection', value: 'Client-side scripting' }
    ],
    highlights: [
      'Pioneered early cookies and HTML tables',
      'Realized pages needed to react to user actions',
      'Recruited Brendan Eich to design client scripting'
    ]
  },
  3: {
    stats: [
      { label: 'Language', value: 'Java Applets' },
      { label: 'Creator', value: 'Sun Microsystems' },
      { label: 'Core Motto', value: 'Write Once, Run Anywhere' },
      { label: 'Footprint', value: 'Heavy Plugin' }
    ],
    highlights: [
      'Offered rich animations via full virtual machine',
      'Extremely slow start times and browser freezes',
      'Too heavy for basic form validations or micro-UI'
    ]
  },
  4: {
    stats: [
      { label: 'Combatants', value: 'Netscape vs MS' },
      { label: 'IE Strategy', value: 'Windows OS Bundle' },
      { label: 'Developer Pain', value: 'Write Code Twice' },
      { label: 'Fragmentation', value: 'Extreme' }
    ],
    highlights: [
      'Proprietary CSS/HTML extensions by both browser camps',
      'IE introduced document.all, Netscape had document.layers',
      'Ignited major anti-trust lawsuits and standard delays'
    ]
  },
  5: {
    stats: [
      { label: 'Developer', value: 'Brendan Eich' },
      { label: 'Timeline', value: '10 Days (May 1995)' },
      { label: 'Original Name', value: 'Mocha' },
      { label: 'Paradigms', value: 'Prototypes & Functions' }
    ],
    highlights: [
      'Combined Scheme functions with Self prototypes',
      'Given Java-like syntax by Netscape management',
      'Rushed timeline left language quirks for decades'
    ]
  },
  6: {
    stats: [
      { label: 'First Spec', value: 'LiveScript' },
      { label: 'Final Release', value: 'JavaScript' },
      { label: 'Hype Source', value: 'Sun Java Hype' },
      { label: 'Standard Code', value: 'ECMA-262 (1997)' }
    ],
    highlights: [
      'Renamed solely for marketing alignment with Sun',
      'Created lasting confusion: "ham vs hamster"',
      'Officially standardized as ECMAScript'
    ]
  },
  7: {
    stats: [
      { label: 'Turning Point', value: 'AJAX (2005)' },
      { label: 'Engine Speed', value: 'V8 (Chrome 2008)' },
      { label: 'Server Dev', value: 'Node.js (2009)' },
      { label: 'Helper Lib', value: 'jQuery (2006)' }
    ],
    highlights: [
      'AJAX allowed background server data calls',
      'V8 compiled JS directly to native machine code',
      'Node.js brought event-driven server execution'
    ]
  },
  8: {
    stats: [
      { label: 'Modern Spec', value: 'ES6 (ES2015)' },
      { label: 'Static Types', value: 'TypeScript' },
      { label: 'Top Frameworks', value: 'React / Vue / Angular' },
      { label: 'Platform', value: 'Everywhere' }
    ],
    highlights: [
      'Introduced native classes, modules, arrow functions',
      'TypeScript added robust static analysis and tools',
      'Powers servers, space interfaces, mobile, and VR'
    ]
  }
};

/* ─── Details Console Component ─── */

function DetailsConsole({ chapter, details, VisualComponent, isHovered }) {
  return (
    <div
      className={`details-console ${isHovered ? 'console-active' : ''}`}
      style={{ '--chapter-color': chapter.color }}
    >
      {/* Corner Cyber Brackets */}
      <div className="console-bracket top-left" />
      <div className="console-bracket top-right" />
      <div className="console-bracket bottom-left" />
      <div className="console-bracket bottom-right" />

      {/* Cyber Scanning Line */}
      <div className="console-scan-line" />

      {/* Console Header */}
      <div className="console-header">
        <span className="console-tag">ARCHIVE // CH_0{chapter.id}</span>
        <span className="console-status">
          <span className="status-dot" />
          {isHovered ? 'STREAMING_DETAILS' : 'SYSTEM_READY'}
        </span>
      </div>

      {/* Illustration Frame */}
      <div className="console-visual-frame">
        {VisualComponent && <VisualComponent />}
      </div>

      {/* Stats Grid */}
      <div className="console-stats-grid">
        {details.stats.map((stat, idx) => (
          <div key={idx} className="console-stat-box">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value" style={{ color: chapter.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Historical Highlights Dossier */}
      <div className="console-dossier">
        <div className="console-dossier-title">HISTORICAL DOSSIER // HIGHLIGHTS</div>
        <ul className="console-dossier-list">
          {details.highlights.map((highlight, idx) => (
            <li key={idx}>
              <div className="dossier-icon-bullet" style={{ borderLeftColor: chapter.color }} />
              <span className="dossier-text">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Chapter Component ─── */

function ChapterCard({ chapter, index }) {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });
  const side = index % 2 === 0 ? 'left' : 'right';
  const VisualComponent = visualComponents[chapter.visual];

  // Dynamic 3D tilt and glare coordinates states
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;

    // Maximum tilt angle of 10 degrees
    const maxTilt = 10;
    const rx = ((y - box.height / 2) / (box.height / 2)) * -maxTilt;
    const ry = ((x - box.width / 2) / (box.width / 2)) * maxTilt;

    // Calculate glare percentage coordinates
    const gx = (x / box.width) * 100;
    const gy = (y / box.height) * 100;

    setTilt({ x: rx, y: ry });
    setGlarePos({ x: gx, y: gy });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const slideVariantsLeft = {
    hidden: {
      opacity: 0,
      x: -60,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  const slideVariantsRight = {
    hidden: {
      opacity: 0,
      x: 60,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  const details = chapterDetails[chapter.id] || { stats: [], highlights: [] };

  return (
    <div
      className={`history-chapter chapter-${side}`}
      style={{ '--chapter-color': chapter.color }}
      ref={ref}
    >
      {/* Timeline dot */}
      <div className="timeline-dot-wrapper">
        <motion.div
          className={`timeline-dot ${isInView ? 'dot-active' : ''}`}
          style={{ '--chapter-color': chapter.color }}
          animate={isInView ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <span className="timeline-year-badge">{chapter.year}</span>
      </div>

      {side === 'left' ? (
        <>
          {/* Card on Left */}
          <motion.div
            className="chapter-content chapter-side-left"
            variants={slideVariantsLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              ref={cardRef}
              className="chapter-card"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: isHovered
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) translateZ(10px)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {/* Dynamic Glare Overlay */}
              <div
                className="card-glare"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12) 0%, transparent 80%)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />

              <div className="chapter-header">
                <div className="chapter-icon">
                  <LucideIcon name={chapter.icon} size={28} color={chapter.color} />
                </div>
                <div className="chapter-title-group">
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <span className="chapter-year">{chapter.year}</span>
                </div>
              </div>
              <p className="chapter-subtitle">{chapter.subtitle}</p>
              <p className="chapter-text">{chapter.content}</p>
            </div>
          </motion.div>

          {/* Visual Details Console on Right */}
          <motion.div
            className="chapter-visual-container chapter-side-right"
            variants={slideVariantsRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          >
            <DetailsConsole
              chapter={chapter}
              details={details}
              VisualComponent={VisualComponent}
              isHovered={isHovered}
            />
          </motion.div>
        </>
      ) : (
        <>
          {/* Visual Details Console on Left */}
          <motion.div
            className="chapter-visual-container chapter-side-left"
            variants={slideVariantsLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          >
            <DetailsConsole
              chapter={chapter}
              details={details}
              VisualComponent={VisualComponent}
              isHovered={isHovered}
            />
          </motion.div>

          {/* Card on Right */}
          <motion.div
            className="chapter-content chapter-side-right"
            variants={slideVariantsRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              ref={cardRef}
              className="chapter-card"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: isHovered
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px) translateZ(10px)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {/* Dynamic Glare Overlay */}
              <div
                className="card-glare"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12) 0%, transparent 80%)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />

              <div className="chapter-header">
                <div className="chapter-icon">
                  <LucideIcon name={chapter.icon} size={28} color={chapter.color} />
                </div>
                <div className="chapter-title-group">
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <span className="chapter-year">{chapter.year}</span>
                </div>
              </div>
              <p className="chapter-subtitle">{chapter.subtitle}</p>
              <p className="chapter-text">{chapter.content}</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ─── Stars Background ─── */

function StarsBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="history-stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="history-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--twinkle-duration': `${star.duration}s`,
            '--twinkle-delay': `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page Component ─── */

export default function HistoryMode() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const timelineRef = useRef(null);
  const [showXP, setShowXP] = useState(false);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Show XP notification when user scrolls near bottom
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > 0.85 && !showXP) {
        setShowXP(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, showXP]);

  return (
    <motion.div
      className="history-page"
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StarsBackground />

      {/* Back Button */}
      <button
        className="history-back-btn"
        onClick={() => navigate('/js-world')}
        aria-label="Back to JS World"
      >
        <ArrowLeft size={16} className="back-arrow" />
        Back to JS World
      </button>

      {/* Hero Section */}
      <section className="history-hero">
        <motion.div
          className="history-hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Scroll size={14} className="badge-icon" />
          History Mode
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="gradient-text">The Story of JavaScript</span>
        </motion.h1>

        <motion.p
          className="history-hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          From static web pages to world domination — in 8 chapters.
        </motion.p>

        <motion.div
          className="history-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span>Scroll to explore</span>
          <div className="scroll-arrow" />
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="history-timeline" ref={timelineRef}>
        {/* Static background line */}
        <div className="timeline-line" />

        {/* Animated progress line */}
        <motion.div
          className="timeline-progress"
          style={{ height: timelineHeight }}
        />

        {/* Chapters */}
        {historyChapters.map((chapter, index) => (
          <ChapterCard key={chapter.id} chapter={chapter} index={index} />
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="history-cta">
        <motion.div
          className="history-cta-divider"
          initial={{ width: 0 }}
          whileInView={{ width: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Continue Your Journey
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Now that you know the story, it&apos;s time to write your own chapter.
        </motion.p>

        <motion.button
          className="history-cta-btn"
          onClick={() => navigate('/js-world/learn')}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Learning
          <ArrowRight size={18} className="cta-arrow" />
        </motion.button>
      </section>

      {/* XP Notification */}
      {showXP && (
        <motion.div
          className="xp-notification"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Star size={20} className="xp-icon" style={{ fill: 'var(--accent-gold)', color: 'var(--accent-gold)' }} />
          <div className="xp-text">
            <span className="xp-amount">+100 XP</span>
            <span className="xp-label">History Complete!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

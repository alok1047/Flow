import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Trophy,
  Timer,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  X,
  Lock,
  AlertCircle,
  Info,
  Lightbulb,
  Zap,
  CheckCircle2,
  Flame,
  HelpCircle,
  RefreshCw,
  Eye,
  BookOpenCheck
} from 'lucide-react';
import { lessons } from '../data/lessons';
import { useStore } from '../store/useStore';
import './LearnMode.css';

// Reuse existing custom Confetti
function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 20,
      size: Math.random() * 8 + 6,
      color: ['#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#22c55e', '#ec4899'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '20%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [p.rotation, p.rotation + 360 * 2],
            x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

// Helper for Star rating rendering
function Stars({ count, max = 3, className = '' }) {
  return (
    <div className={`star-rating-display ${className}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < count ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  );
}

export default function LearnMode() {
  const navigate = useNavigate();
  const { xp, level, streak, addXP, lessonStars, updateLessonStars, soundEnabled } = useStore();

  // Navigation / Phase states
  const [view, setView] = useState('list'); // 'list' | 'lesson' | 'quiz' | 'results' | 'review'
  const [activeLesson, setActiveLesson] = useState(null);

  // Lesson Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);
  const lessonContentRef = useRef(null);

  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes (300 seconds)
  const timerRef = useRef(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  // Results display state
  const [prevStars, setPrevStars] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [quizTimeTaken, setQuizTimeTaken] = useState(0);

  // Sound playback helpers
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'incorrect') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147.14, ctx.currentTime + 0.1); // D3
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'victory') {
        // Arpeggio C Major
        const chime = (freq, delay, vol) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.3);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + delay);
          o.stop(ctx.currentTime + delay + 0.3);
        };
        chime(523.25, 0, 0.04);
        chime(659.25, 0.08, 0.04);
        chime(783.99, 0.16, 0.04);
        chime(1046.50, 0.24, 0.05);
      }
    } catch (e) {
      console.warn('Audio context blocked', e);
    }
  };

  // derived stats
  const totalStars = useMemo(() => {
    return Object.values(lessonStars).reduce((sum, item) => sum + (item.stars || 0), 0);
  }, [lessonStars]);

  const topicsCompleted = useMemo(() => {
    return Object.keys(lessonStars).filter((id) => (lessonStars[id]?.stars || 0) > 0).length;
  }, [lessonStars]);

  // Scroll listener for reading progress
  useEffect(() => {
    if (view !== 'lesson') return;
    const handleScroll = () => {
      const container = lessonContentRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    const container = lessonContentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [view, activeLesson]);

  // Timer logic for quiz
  useEffect(() => {
    if (view !== 'quiz') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSelectedOption((currSelected) => {
            const finalAnswers = [...userAnswers];
            if (currSelected !== null) {
              finalAnswers.push(currSelected);
            }
            while (finalAnswers.length < activeLesson.quiz.length) {
              finalAnswers.push(null);
            }
            setUserAnswers(finalAnswers);
            handleQuizFinish(finalAnswers, 0, true);
            return currSelected;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, userAnswers, activeLesson]);

  // Navigation handlers
  const handleSelectLesson = (lesson) => {
    playSound('click');
    setActiveLesson(lesson);
    setView('lesson');
    setScrollProgress(0);
  };

  const handleStartQuiz = () => {
    playSound('click');
    setQuizIndex(0);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setTimeRemaining(300);
    setUserAnswers([]);
    setView('quiz');
  };

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(idx);
    playSound('click');
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    playSound('click');
    
    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);

    const isCorrect = selectedOption === activeLesson.quiz[quizIndex].correct;
    let newCorrectCount = correctAnswers;
    if (isCorrect) {
      newCorrectCount = correctAnswers + 1;
      setCorrectAnswers(newCorrectCount);
    }

    if (quizIndex < activeLesson.quiz.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      handleQuizFinish(newAnswers, newCorrectCount);
    }
  };

  const handleQuizFinish = (finalAnswers, finalCorrectCount, isTimeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    playSound('victory');

    let finalCorrect = finalCorrectCount;
    if (isTimeout) {
      finalCorrect = 0;
      finalAnswers.forEach((ans, idx) => {
        if (ans === activeLesson.quiz[idx]?.correct) {
          finalCorrect++;
        }
      });
    }

    const timeTakenSec = 300 - timeRemaining;
    setQuizTimeTaken(timeTakenSec);

    // Calculate stars
    let stars = 0;
    if (finalCorrect === 5) stars = 3;
    else if (finalCorrect >= 3) stars = 2;
    else if (finalCorrect >= 1) stars = 1;

    // Get previous score/stars
    const prevData = lessonStars[activeLesson.id] || { stars: 0, bestScore: 0 };
    setPrevStars(prevData.stars || 0);
    setEarnedStars(stars);

    // Calculate XP reward
    let xpReward = 0;
    if (prevData.stars === 0 && stars > 0) {
      xpReward += activeLesson.xp;
    }
    if (finalCorrect === 5 && prevData.bestScore < 5) {
      xpReward += 25; // Perfect score bonus
    }
    setXpGained(xpReward);

    if (xpReward > 0) {
      addXP(xpReward);
    }

    // Update store
    updateLessonStars(activeLesson.id, stars, finalCorrect);
    setView('results');
  };

  const handleNextTopic = () => {
    playSound('click');
    const currentIndex = lessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
      setView('lesson');
      setScrollProgress(0);
    } else {
      setView('list');
    }
  };

  // Format timer into mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Stagger variants
  const staggerVariants = {
    animate: { transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  // Renders section of a lesson dynamically based on its type
  const renderSection = (sec, index) => {
    switch (sec.type) {
      case 'intro':
        return (
          <div className="learn-section learn-section--intro" key={index}>
            <h2>{sec.title}</h2>
            <p>{sec.body}</p>
          </div>
        );
      case 'concept':
        return (
          <div className="learn-section learn-section--concept" key={index}>
            <h3>{sec.title}</h3>
            <p>{sec.body}</p>
            {sec.analogy && (
              <div className="learn-analogy-box">
                <div className="learn-analogy-title">
                  <Lightbulb size={16} />
                  <span>Analogy</span>
                </div>
                <p>{sec.analogy}</p>
              </div>
            )}
          </div>
        );
      case 'codeExample':
        return (
          <div className="learn-section learn-section--code" key={index}>
            <h4>{sec.title}</h4>
            <div className="learn-code-wrapper">
              <div className="learn-code-header">
                <span className="learn-code-lang">{sec.language || 'JavaScript'}</span>
                <span className="learn-code-dot" />
              </div>
              <pre>
                <code>{sec.code}</code>
              </pre>
            </div>
            {sec.explanation && <p className="learn-code-explanation">{sec.explanation}</p>}
          </div>
        );
      case 'tip':
        return (
          <div className="learn-section learn-section--tip" key={index}>
            <div className="learn-alert-icon"><Info size={18} /></div>
            <div className="learn-alert-body">
              <strong>Tip:</strong> {sec.body}
            </div>
          </div>
        );
      case 'warning':
        return (
          <div className="learn-section learn-section--warning" key={index}>
            <div className="learn-alert-icon"><AlertCircle size={18} /></div>
            <div className="learn-alert-body">
              <strong>Warning:</strong> {sec.body}
            </div>
          </div>
        );
      case 'funFact':
        return (
          <div className="learn-section learn-section--funfact" key={index}>
            <div className="learn-alert-icon"><Sparkles size={18} /></div>
            <div className="learn-alert-body">
              <strong>Fun Fact:</strong> {sec.body}
            </div>
          </div>
        );
      case 'commonMistake':
        return (
          <div className="learn-section learn-section--mistake" key={index}>
            <h4>Common Mistake: {sec.title}</h4>
            <div className="learn-mistake-grid">
              <div className="learn-mistake-card learn-mistake-card--wrong">
                <div className="learn-mistake-badge">❌ Avoid</div>
                <pre><code>{sec.wrong}</code></pre>
              </div>
              <div className="learn-mistake-card learn-mistake-card--right">
                <div className="learn-mistake-badge">✅ Preferred</div>
                <pre><code>{sec.right}</code></pre>
              </div>
            </div>
            <p className="learn-mistake-explanation">{sec.explanation}</p>
          </div>
        );
      case 'realWorld':
        return (
          <div className="learn-section learn-section--realworld" key={index}>
            <h4>Real World Use Case: {sec.title}</h4>
            <p>{sec.body}</p>
          </div>
        );
      case 'summary':
        return (
          <div className="learn-section learn-section--summary" key={index}>
            <h3>Summary Checklist</h3>
            <ul className="learn-summary-list">
              {sec.points.map((pt, pIdx) => (
                <li key={pIdx}>
                  <CheckCircle2 size={16} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="learn-page">
      {/* BACKGROUND EFFECTS */}
      <div className="learn-bg-nebula" />
      <div className="learn-bg-grid" />

      <AnimatePresence mode="wait">
        {/* VIEW 1: TOPIC LIST */}
        {view === 'list' && (
          <motion.div
            key="list"
            className="learn-view-container learn-list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header Area */}
            <div className="learn-view-header">
              <div className="learn-back-link" onClick={() => navigate('/js-world')}>
                <ChevronLeft size={16} />
                <span>Back to Map</span>
              </div>
              <h1 className="learn-title">Learning Galaxy</h1>
              <p className="learn-subtitle">Read interactive lessons, explore concepts, and challenge yourself when you feel ready.</p>
            </div>

            {/* Overall Gamification Stats */}
            <div className="learn-stats-bar">
              <div className="learn-stat-pill">
                <Award size={18} className="learn-stat-icon-star" />
                <div className="learn-stat-details">
                  <span className="learn-stat-label">Total Stars</span>
                  <span className="learn-stat-value">{totalStars} ★</span>
                </div>
              </div>
              <div className="learn-stat-pill">
                <BookOpenCheck size={18} className="learn-stat-icon-book" />
                <div className="learn-stat-details">
                  <span className="learn-stat-label">Completed</span>
                  <span className="learn-stat-value">{topicsCompleted} / {lessons.length}</span>
                </div>
              </div>
              <div className="learn-stat-pill">
                <Zap size={18} className="learn-stat-icon-xp" />
                <div className="learn-stat-details">
                  <span className="learn-stat-label">Total XP</span>
                  <span className="learn-stat-value">{xp} XP</span>
                </div>
              </div>
              <div className="learn-stat-pill">
                <Flame size={18} className="learn-stat-icon-streak" />
                <div className="learn-stat-details">
                  <span className="learn-stat-label">Streak</span>
                  <span className="learn-stat-value">{streak} Days</span>
                </div>
              </div>
            </div>

            {/* Topics Grid */}
            <motion.div
              className="learn-topic-grid"
              variants={staggerVariants}
              initial="initial"
              animate="animate"
            >
              {lessons.map((lesson) => {
                const starsData = lessonStars[lesson.id] || { stars: 0, bestScore: 0 };
                const isCompleted = starsData.stars > 0;

                return (
                  <motion.div
                    key={lesson.id}
                    className={`learn-topic-card ${isCompleted ? 'learn-topic-card--completed' : ''}`}
                    variants={cardVariants}
                    style={{ '--card-accent': lesson.color }}
                    onClick={() => handleSelectLesson(lesson)}
                  >
                    <div className="learn-card-meta">
                      <span className="learn-card-difficulty" style={{ color: lesson.color }}>{lesson.difficulty}</span>
                      <span className="learn-card-duration">{lesson.duration}</span>
                    </div>
                    <h3 className="learn-card-title">{lesson.title}</h3>
                    <p className="learn-card-desc">{lesson.description}</p>
                    <div className="learn-card-footer">
                      <div className="learn-card-stars">
                        <Stars count={starsData.stars} />
                      </div>
                      <div className="learn-card-xp-badge">
                        <Zap size={10} />
                        <span>+{lesson.xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* VIEW 2: LESSON PAGE (sidebar removed) */}
        {view === 'lesson' && activeLesson && (
          <motion.div
            key="lesson"
            className="learn-view-container learn-lesson-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scroll Progress Bar at very top */}
            <div className="learn-scroll-progress-container">
              <div className="learn-scroll-progress-bar" style={{ width: `${scrollProgress * 100}%` }} />
            </div>

            {/* Layout container: Scrollable Content */}
            <div className="learn-layout">
              <div className="learn-content-container" ref={lessonContentRef}>
                {/* Lesson Header Navigation */}
                <div className="learn-lesson-top-nav">
                  <div className="learn-back-link" onClick={() => { playSound('click'); setView('list'); }}>
                    <ChevronLeft size={16} />
                    <span>All Lessons</span>
                  </div>
                  <div className="learn-lesson-progress-label">
                    Topic {lessons.findIndex(l => l.id === activeLesson.id) + 1} of {lessons.length}
                  </div>
                </div>

                {/* Lesson Header */}
                <div className="learn-lesson-header">
                  <div className="learn-lesson-meta-row">
                    <span className="learn-lesson-badge" style={{ borderColor: activeLesson.color, color: activeLesson.color }}>
                      {activeLesson.difficulty}
                    </span>
                    <span className="learn-lesson-meta-item">{activeLesson.duration} reading time</span>
                    <span className="learn-lesson-meta-item">⚡ +{activeLesson.xp} XP</span>
                  </div>
                  <h1 className="learn-lesson-title">{activeLesson.title}</h1>
                  <div className="learn-lesson-stars-status">
                    <span>Stars Earned: </span>
                    <Stars count={lessonStars[activeLesson.id]?.stars || 0} />
                  </div>
                </div>

                {/* Lesson Sections */}
                <div className="learn-lesson-body">
                  {activeLesson.content.sections.map((sec, idx) => renderSection(sec, idx))}
                </div>

                {/* Footer Action Buttons */}
                <div className="learn-lesson-footer-actions">
                  <button className="learn-action-btn learn-action-btn--quiz" onClick={handleStartQuiz}>
                    <Sparkles size={16} />
                    <span>Attempt Quiz</span>
                  </button>
                  <button className="learn-action-btn learn-action-btn--next" onClick={handleNextTopic}>
                    <span>Next Topic</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: QUIZ VIEW */}
        {view === 'quiz' && activeLesson && (
          <motion.div
            key="quiz"
            className="learn-view-container learn-quiz-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar for Quiz */}
            <div className="quiz-top-bar">
              <div className="quiz-progress-text">
                Question {quizIndex + 1} of {activeLesson.quiz.length}
              </div>
              <div className="quiz-topic-title">{activeLesson.title} Quiz</div>
              <div className={`quiz-timer-display ${timeRemaining < 60 ? 'quiz-timer-display--warning' : ''}`}>
                <Timer size={16} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {/* Question Card Container */}
            <div className="quiz-card-wrapper">
              <div className="quiz-question-card">
                <h2 className="quiz-question-text">{activeLesson.quiz[quizIndex].question}</h2>

                {/* 4 Clickable option cards (no correct/incorrect indicators until review) */}
                <div className="quiz-options-grid">
                  {activeLesson.quiz[quizIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`quiz-option-card ${isSelected ? 'quiz-option--selected' : ''}`}
                        onClick={() => handleSelectOption(oIdx)}
                      >
                        <span className="quiz-option-letter">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="quiz-option-text">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav inside Quiz */}
              <div className="quiz-footer-nav">
                {selectedOption !== null && (
                  <button className="quiz-next-btn" onClick={handleNextQuestion}>
                    <span>{quizIndex === activeLesson.quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: RESULTS SCREEN */}
        {view === 'results' && activeLesson && (
          <motion.div
            key="results"
            className="learn-view-container learn-results-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti if earned 1 or more stars */}
            {earnedStars > 0 && <Confetti />}

            <div className="results-card">
              <div className="results-badge">
                <Trophy size={48} />
              </div>

              <h1 className="results-title">Quiz Completed!</h1>

              {/* Motivational Message */}
              <p className="results-motivation">
                {correctAnswers === 5 && 'Perfect! You are an absolute master! 🎯'}
                {correctAnswers >= 3 && correctAnswers < 5 && 'Almost perfect! Impressive score! 🌟'}
                {correctAnswers >= 1 && correctAnswers < 3 && 'Good start! Review the concepts and try again! 💪'}
                {correctAnswers === 0 && 'Do not give up! Read the lesson again and try once more! 🔄'}
              </p>

              {/* Animated star display */}
              <div className="results-stars-container">
                {Array.from({ length: 3 }).map((_, i) => {
                  const delay = 0.2 + i * 0.25;
                  const isFilled = i < earnedStars;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay, type: 'spring', stiffness: 100 }}
                    >
                      <Star
                        size={48}
                        className={isFilled ? 'results-star-filled' : 'results-star-empty'}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats Grid */}
              <div className="results-stats-grid">
                <div className="results-stat-box">
                  <span className="results-stat-label">Score</span>
                  <span className="results-stat-value">{correctAnswers} / 5</span>
                </div>
                <div className="results-stat-box">
                  <span className="results-stat-label">Accuracy</span>
                  <span className="results-stat-value">{Math.round((correctAnswers / 5) * 100)}%</span>
                </div>
                <div className="results-stat-box">
                  <span className="results-stat-label">XP Earned</span>
                  <span className="results-stat-value">+{xpGained} XP</span>
                </div>
                <div className="results-stat-box">
                  <span className="results-stat-label">Time Taken</span>
                  <span className="results-stat-value">{formatTime(quizTimeTaken)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="results-action-buttons">
                {correctAnswers < 5 && (
                  <button className="results-btn results-btn--retry" onClick={handleStartQuiz}>
                    <RefreshCw size={16} />
                    <span>Retry Quiz</span>
                  </button>
                )}
                <button className="results-btn results-btn--review-quiz" onClick={() => { playSound('click'); setReviewIndex(0); setView('review'); }}>
                  <Eye size={16} />
                  <span>Review Quiz</span>
                </button>
                <button className="results-btn results-btn--review" onClick={() => setView('lesson')}>
                  <BookOpen size={16} />
                  <span>Review Lesson</span>
                </button>
                <button className="results-btn results-btn--next" onClick={handleNextTopic}>
                  <span>Next Topic</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 5: REVIEW VIEW */}
        {view === 'review' && activeLesson && (
          <motion.div
            key="review"
            className="learn-view-container learn-review-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar for Review */}
            <div className="quiz-top-bar">
              <div className="quiz-progress-text">
                Reviewing Question {reviewIndex + 1} of {activeLesson.quiz.length}
              </div>
              <div className="quiz-topic-title">{activeLesson.title} - Quiz Review</div>
              <button className="review-close-btn" onClick={() => setView('results')}>
                <X size={16} />
                <span>Back to Results</span>
              </button>
            </div>

            {/* Question Card Container */}
            <div className="quiz-card-wrapper">
              <div className="quiz-question-card">
                <h2 className="quiz-question-text">{activeLesson.quiz[reviewIndex].question}</h2>

                {/* 4 options with feedback */}
                <div className="quiz-options-grid">
                  {activeLesson.quiz[reviewIndex].options.map((opt, oIdx) => {
                    const userSelected = userAnswers[reviewIndex] === oIdx;
                    const isCorrect = oIdx === activeLesson.quiz[reviewIndex].correct;

                    let optClass = '';
                    if (isCorrect) {
                      optClass = 'quiz-option--correct';
                    } else if (userSelected) {
                      optClass = 'quiz-option--incorrect';
                    } else {
                      optClass = 'quiz-option--dimmed';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`quiz-option-card ${optClass} quiz-option-card--review`}
                      >
                        <span className="quiz-option-letter">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="quiz-option-text">{opt}</span>
                        {isCorrect && <span className="review-badge-correct">Correct</span>}
                        {userSelected && !isCorrect && <span className="review-badge-incorrect">Your Answer</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <div className="quiz-explanation-box" style={{ display: 'block' }}>
                  <div className="quiz-explanation-header">
                    <HelpCircle size={16} />
                    <span>Explanation</span>
                  </div>
                  <p>{activeLesson.quiz[reviewIndex].explanation}</p>
                </div>
              </div>

              {/* Bottom Nav inside Review */}
              <div className="review-footer-nav">
                <button
                  className="review-nav-btn"
                  disabled={reviewIndex === 0}
                  onClick={() => setReviewIndex((idx) => idx - 1)}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                
                {reviewIndex < activeLesson.quiz.length - 1 ? (
                  <button
                    className="review-nav-btn"
                    onClick={() => setReviewIndex((idx) => idx + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    className="review-nav-btn review-nav-btn--finish"
                    onClick={() => setView('results')}
                  >
                    <span>Finish Review</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

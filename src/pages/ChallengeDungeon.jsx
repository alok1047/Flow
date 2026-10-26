import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Star, 
  Award, 
  RotateCcw 
} from 'lucide-react';
import { challengeTopics } from '../data/challenges';
import { useStore } from '../store/useStore';
import LucideIcon from '../components/ui/LucideIcon';
import './ChallengeDungeon.css';

const difficultyColors = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };

const fadeSlide = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: 'easeIn' } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function ChallengeDungeon() {
  const navigate = useNavigate();
  const { xp, addXP, completeChallenge, unlockAchievement } = useStore();

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [finished, setFinished] = useState(false);

  // Load results from localStorage
  const [topicResults, setTopicResults] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('flow-challenge-results');
      if (saved) {
        setTopicResults(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load challenge results', e);
    }
  }, []);

  const saveResults = (topicId, finalScore, finalStars) => {
    try {
      const updated = {
        ...topicResults,
        [topicId]: { score: finalScore, stars: finalStars, attempted: true },
      };
      setTopicResults(updated);
      localStorage.setItem('flow-challenge-results', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save challenge results', e);
    }
  };

  const calculateStars = (val) => {
    if (val >= 8) return 3;
    if (val >= 5) return 2;
    if (val >= 1) return 1;
    return 0;
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setEarnedXP(0);
    setFinished(false);
  };

  const handleAnswer = (optionIndex) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    const question = selectedTopic.questions[currentIndex];
    if (optionIndex === question.correct) {
      setScore((s) => s + 1);
      setEarnedXP((x) => x + question.xp);
    }
  };

  const handleNext = () => {
    const questions = selectedTopic.questions;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Completed all questions in the topic!
      const finalScore = score;
      const finalStars = calculateStars(finalScore);
      
      setFinished(true);
      addXP(earnedXP);
      completeChallenge(selectedTopic.id);
      saveResults(selectedTopic.id, finalScore, finalStars);

      // Achievements check
      if (finalStars === 3) {
        unlockAchievement('dungeon-crawler');
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setEarnedXP(0);
    setFinished(false);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setFinished(false);
  };

  return (
    <motion.div
      className="dungeon"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          /* View 1: Topic Selection Grid */
          <motion.div
            key="topics-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="dungeon-header">
              <button className="dungeon-back" onClick={() => navigate('/js-world')}>
                <ArrowLeft size={16} /> Back to World
              </button>
              <h1 className="dungeon-title">
                <span className="glow-text-gold">Challenge</span> Dungeon
              </h1>
              <p className="dungeon-subtitle">Enter the dungeon of coding puzzles and earn stars!</p>
            </div>

            <motion.div 
              className="dungeon-topics-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {challengeTopics.map((topic) => {
                const results = topicResults[topic.id] || { score: 0, stars: 0, attempted: false };
                const starsCount = results.stars;

                return (
                  <motion.div
                    key={topic.id}
                    className="dungeon-topic-card"
                    variants={cardVariants}
                    style={{ '--card-accent': topic.color }}
                    onClick={() => handleSelectTopic(topic)}
                  >
                    <span className="dungeon-topic-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <LucideIcon name={topic.icon} size={36} color={topic.color} />
                    </span>
                    <h3 className="dungeon-topic-name">{topic.name}</h3>
                    <p className="dungeon-topic-desc">{topic.description}</p>

                    {/* 3-Star Performance Display */}
                    <div className="dungeon-stars">
                      {[1, 2, 3].map((s) => (
                        <span
                          key={s}
                          className={`dungeon-star ${s <= starsCount ? 'filled' : 'empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>



                    {results.attempted && (
                      <div className="dungeon-topic-score-label">
                        Best Score: {results.score}/10
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ) : (
          /* View 2: Active Challenge or Results */
          <motion.div
            key="active-challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header with Back Button */}
            <div className="dungeon-header">
              <button className="dungeon-back" onClick={handleBackToTopics}>
                <ArrowLeft size={16} /> All Topics
              </button>
              <h1 className="dungeon-title">
                <span className="glow-text-gold">{selectedTopic.name}</span>
              </h1>
            </div>

            <div className="dungeon-content">
              {!finished ? (
                /* Quiz View */
                <motion.div
                  key={`question-${currentIndex}`}
                  {...fadeSlide}
                  className="dungeon-challenge"
                >
                  {/* Progress Bar */}
                  <div className="dungeon-progress">
                    <div className="dungeon-progress-top">
                      <span className="dungeon-progress-text">
                        Question {currentIndex + 1} of {selectedTopic.questions.length}
                      </span>
                      <span className="dungeon-progress-topic">
                        {selectedTopic.name}
                      </span>
                    </div>
                    <div className="dungeon-progress-bar">
                      <motion.div
                        className="dungeon-progress-fill"
                        style={{
                          width: `${((currentIndex + 1) / selectedTopic.questions.length) * 100}%`,
                          background: selectedTopic.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Card with Code & Options */}
                  <div className="dungeon-card">
                    <div className="dungeon-card-header">
                      <span
                        className="dungeon-difficulty"
                        style={{
                          background: `${difficultyColors[selectedTopic.questions[currentIndex].difficulty]}20`,
                          color: difficultyColors[selectedTopic.questions[currentIndex].difficulty],
                          border: `1px solid ${difficultyColors[selectedTopic.questions[currentIndex].difficulty]}40`,
                        }}
                      >
                        {selectedTopic.questions[currentIndex].difficulty}
                      </span>
                      <span className="dungeon-xp-badge">
                        +{selectedTopic.questions[currentIndex].xp} XP
                      </span>
                    </div>

                    {/* Terminal Code Block */}
                    <div className="dungeon-code-block">
                      <div className="dungeon-code-header">
                        <span className="dungeon-code-dot" style={{ background: '#ff5f56' }} />
                        <span className="dungeon-code-dot" style={{ background: '#ffbd2e' }} />
                        <span className="dungeon-code-dot" style={{ background: '#27c93f' }} />
                        <span className="dungeon-code-label">script.js</span>
                      </div>
                      <pre className="dungeon-code">
                        <code>{selectedTopic.questions[currentIndex].code}</code>
                      </pre>
                    </div>

                    <p className="dungeon-question">What's the output?</p>

                    {/* Grid Options */}
                    <div className="dungeon-options">
                      {selectedTopic.questions[currentIndex].options.map((option, i) => {
                        let btnClass = 'dungeon-option';
                        const question = selectedTopic.questions[currentIndex];

                        if (selectedOption !== null) {
                          if (i === question.correct) {
                            btnClass += ' correct';
                          } else if (i === selectedOption) {
                            btnClass += ' incorrect';
                          }
                        }

                        return (
                          <motion.button
                            key={i}
                            className={btnClass}
                            disabled={selectedOption !== null}
                            onClick={() => handleAnswer(i)}
                            whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                            whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                          >
                            <span className="dungeon-option-letter">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="dungeon-option-text">{option}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          className={`dungeon-explanation ${
                            selectedOption === selectedTopic.questions[currentIndex].correct
                              ? 'correct'
                              : 'incorrect'
                          }`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ display: 'flex', alignItems: 'start', gap: '10px' }}
                        >
                          <span className="dungeon-explanation-icon" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '2px' }}>
                            {selectedOption === selectedTopic.questions[currentIndex].correct ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <XCircle size={18} />
                            )}
                          </span>
                          <div>
                            <strong>
                              {selectedOption === selectedTopic.questions[currentIndex].correct
                                ? 'Correct Answer!'
                                : 'Incorrect Answer'}
                            </strong>
                            <p>{selectedTopic.questions[currentIndex].explanation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Next Button */}
                    {showExplanation && (
                      <motion.button
                        className="dungeon-next-btn"
                        onClick={handleNext}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        {currentIndex < selectedTopic.questions.length - 1
                          ? 'Next Challenge'
                          : 'See Results'}
                        <ArrowRight size={16} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Results View */
                <motion.div
                  key="results-view"
                  {...fadeSlide}
                  className="dungeon-results"
                >
                  <div className="dungeon-results-card">
                    <div className="dungeon-results-emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {score >= 8 ? (
                        <Trophy size={64} style={{ color: 'var(--accent-gold)' }} />
                      ) : score >= 5 ? (
                        <Star size={64} style={{ color: 'var(--accent-gold)', fill: 'var(--accent-gold)' }} />
                      ) : (
                        <Award size={64} style={{ color: 'var(--accent-cyan)' }} />
                      )}
                    </div>

                    <h2 className="dungeon-results-title">
                      {score >= 8 ? 'Mastery Unlocked!' : score >= 5 ? 'Well Done!' : 'Keep Practicing!'}
                    </h2>

                    <div className="dungeon-results-score">
                      <span className="dungeon-results-score-num">{score}</span>
                      <span className="dungeon-results-score-total">/{selectedTopic.questions.length}</span>
                    </div>
                    <p className="dungeon-results-label">Correct Answers</p>

                    {/* Results Stars */}
                    <div className="dungeon-results-stars">
                      {[1, 2, 3].map((s) => (
                        <span
                          key={s}
                          className={`dungeon-star ${s <= calculateStars(score) ? 'filled' : 'empty'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="dungeon-results-xp">
                      <span className="glow-text-gold">+{earnedXP} XP Earned</span>
                    </div>

                    {score >= 8 && (
                      <div className="dungeon-results-achievement" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                        <Award size={18} />
                        <span>Achievement Unlocked: Dungeon Crawler!</span>
                      </div>
                    )}

                    <div className="dungeon-results-actions">
                      <button className="dungeon-results-btn primary" onClick={handleRestart} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCcw size={16} /> Try Again
                      </button>
                      <button className="dungeon-results-btn secondary" onClick={handleBackToTopics} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <ArrowLeft size={16} /> All Topics
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

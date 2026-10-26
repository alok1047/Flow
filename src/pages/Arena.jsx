import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Swords, 
  Users, 
  UserPlus, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Hourglass, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Trophy, 
  Award, 
  Star, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { getArenaQuestions } from '../data/arenaQuestions';
import './Arena.css';

// Random opponent names pool
const OPPONENT_NAMES = [
  "ByteKnight", "NullPointer", "CodeSlinger", "ReactWizard", "AsyncAssassin",
  "NodeNinja", "StackSlayer", "ScopeSeeker", "LogicLord", "DataDynamo"
];

// Avatars for players
const AVATARS = ["🧙", "🥷", "🧑‍🚀", "🤖", "👾", "🦖", "🦄", "🦁", "🦊", "🐼"];

export default function Arena() {
  const navigate = useNavigate();
  const { addXP } = useStore();

  // Arena flow state: 'landing' | 'subject' | 'topic' | 'difficulty' | 'params' | 'matchmaking' | 'battle' | 'results' | 'friend-lobby'
  const [arenaState, setArenaState] = useState('landing');
  const [gameMode, setGameMode] = useState(null); // 'online' | 'friend'
  
  // Game Setup Configurations
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(30); // seconds per question

  // Friend lobby specifics
  const [roomCode, setRoomCode] = useState("");
  const [friendJoined, setFriendJoined] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendReady, setFriendReady] = useState(false);
  const [userReady, setUserReady] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Matchmaking simulation
  const [matchmakingStatus, setMatchmakingStatus] = useState("Connecting to server...");
  const [opponent, setOpponent] = useState(null);

  // Active Battle State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [userCorrectCount, setUserCorrectCount] = useState(0);
  const [opponentCorrectCount, setOpponentCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // idx of option clicked
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [battleStarting, setBattleStarting] = useState(true);
  const [battleCountdown, setBattleCountdown] = useState(3);
  
  // Opponent Live Simulation State
  const [opponentStatus, setOpponentStatus] = useState("Opponent is thinking...");
  const [opponentProgress, setOpponentProgress] = useState(1);

  // Results State
  const [rankProgress, setRankProgress] = useState(45); // percentage out of 100 in League

  // Refs for intervals/timeouts
  const timerRef = useRef(null);
  const opponentSimRef = useRef(null);

  // Topics lists map
  const topicsMap = {
    JavaScript: ['History', 'Variables', 'Data Types', 'Operators', 'Loops', 'Numbers', 'Strings'],
    React: ['Components', 'Props', 'State', 'Hooks'],
    Backend: ['APIs', 'Express', 'Authentication', 'Databases']
  };

  // Generate a random room code for friend lobby
  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomCode(`FLW-${code}`);
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/arena?room=${roomCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Play Online sequence navigations
  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setArenaState('topic');
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setArenaState('difficulty');
  };

  const handleSelectDifficulty = (diff) => {
    setSelectedDifficulty(diff);
    setArenaState('params');
  };

  const handleStartMatchmakingSetup = () => {
    setArenaState('matchmaking');
    startMatchmakingSim();
  };

  // Start matchmaking simulation
  const startMatchmakingSim = () => {
    setMatchmakingStatus("Connecting to battle servers...");
    
    setTimeout(() => {
      setMatchmakingStatus("Searching for active opponent...");
      setTimeout(() => {
        setMatchmakingStatus("Analyzing skill rank matches...");
        setTimeout(() => {
          // Found opponent!
          const randomName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
          const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
          setOpponent({
            name: randomName,
            avatar: randomAvatar,
            rank: "Gold III",
            xp: 4200
          });
          setMatchmakingStatus("Match Found! Preparing Arena...");
          
          setTimeout(() => {
            // Setup quiz battle questions
            const gameQuestions = getArenaQuestions(selectedSubject, selectedTopic);
            
            // Slice or loop questions to fit custom questionCount
            let finalQuestions = [...gameQuestions];
            if (finalQuestions.length === 0) {
              // Fail-safe questions fallback
              finalQuestions = [
                {
                  question: "What does HTML stand for?",
                  code: null,
                  options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Tabular Mail Link", "Hyperlink Text Markup Language"],
                  correct: 0
                }
              ];
            }
            
            // Loop or slice to make exactly matches questionCount
            while (finalQuestions.length < questionCount) {
              finalQuestions = [...finalQuestions, ...gameQuestions];
            }
            setQuestions(finalQuestions.slice(0, questionCount));
            
            // Transition to Battle!
            setArenaState('battle');
            startBattleCountdown();
          }, 2000);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  // Lobby Friend Joined Simulation
  useEffect(() => {
    if (arenaState === 'friend-lobby') {
      setUserReady(false);
      setFriendReady(false);
      setFriendJoined(false);

      // Simulate a friend entering room after 4s
      const joinTimer = setTimeout(() => {
        const friendAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        const randomFriendName = "Friend_" + OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
        setFriendName(randomFriendName);
        setFriendJoined(true);
        setOpponent({
          name: randomFriendName,
          avatar: friendAvatar,
          rank: "Silver II",
          xp: 1800
        });

        // Simulate friend marking ready after 2s
        setTimeout(() => {
          setFriendReady(true);
        }, 2000);
      }, 3500);

      return () => clearTimeout(joinTimer);
    }
  }, [arenaState]);

  // Friend lobby launch game when both ready
  useEffect(() => {
    if (arenaState === 'friend-lobby' && userReady && friendReady) {
      const subj = selectedSubject || "JavaScript";
      const top = selectedTopic || "Variables";
      const count = questionCount || 5;

      const gameQuestions = getArenaQuestions(subj, top);
      setQuestions(gameQuestions.slice(0, count));

      setTimeout(() => {
        setArenaState('battle');
        startBattleCountdown();
      }, 1000);
    }
  }, [userReady, friendReady, arenaState, selectedSubject, selectedTopic, questionCount]);

  const startBattleCountdown = () => {
    setBattleStarting(true);
    setBattleCountdown(3);
    setUserScore(0);
    setOpponentScore(0);
    setUserCorrectCount(0);
    setOpponentCorrectCount(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setOpponentProgress(1);

    const interval = setInterval(() => {
      setBattleCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBattleStarting(false);
          startQuestionTimer();
          startOpponentSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Real-time battle timer for current question
  const startQuestionTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(timeLimit);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Simulate opponent answering in real-time
  const startOpponentSimulation = () => {
    if (opponentSimRef.current) clearTimeout(opponentSimRef.current);
    setOpponentStatus("Opponent is thinking...");

    // Opponent thinking speed (random interval between 4s and 8s)
    const thinkTime = Math.random() * 4000 + 3500;

    opponentSimRef.current = setTimeout(() => {
      // Calculate correctness based on difficulty chosen
      let successRate = 0.65; // Medium
      if (selectedDifficulty === 'Easy') successRate = 0.45;
      if (selectedDifficulty === 'Hard') successRate = 0.80;
      if (selectedDifficulty === 'Expert') successRate = 0.95;

      const isCorrect = Math.random() < successRate;
      
      if (isCorrect) {
        // Opponent got it right! Score calculation: base 10 + speed bonus
        const speedBonus = Math.floor(timeLeft / 3);
        const scoreGain = 10 + speedBonus;
        setOpponentScore((s) => s + scoreGain);
        setOpponentCorrectCount((c) => c + 1);
        setOpponentStatus(`Opponent answered correctly (+${scoreGain})!`);
      } else {
        setOpponentStatus("Opponent answered incorrectly (+0)!");
      }

      // Mark that opponent is done with this question
      setOpponentProgress(currentQuestionIdx + 1);
    }, thinkTime);
  };

  const handleTimeOut = () => {
    // Treat as incorrect, lock answers
    setIsAnswered(true);
    setSelectedAnswer(-1); // special index for timeout
    
    // Continue to next question or end battle
    triggerNextStepDelay();
  };

  const handleSelectAnswer = (optionIdx) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedAnswer(optionIdx);

    const currentQuestion = questions[currentQuestionIdx];
    if (optionIdx === currentQuestion.correct) {
      // You got it right! Base 10 + speed bonus
      const speedBonus = Math.floor(timeLeft / 3);
      const scoreGain = 10 + speedBonus;
      setUserScore((s) => s + scoreGain);
      setUserCorrectCount((c) => c + 1);
    }

    triggerNextStepDelay();
  };

  const triggerNextStepDelay = () => {
    setTimeout(() => {
      // Move to next question or complete battle
      if (currentQuestionIdx < questions.length - 1) {
        setCurrentQuestionIdx((idx) => idx + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        startQuestionTimer();
        startOpponentSimulation();
      } else {
        // Game Over - compile results
        endBattle();
      }
    }, 2800); // 2.8s display pause to view feedback/corrections
  };

  const endBattle = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentSimRef.current) clearTimeout(opponentSimRef.current);

    // Calculate XP reward
    const isWinner = userScore > opponentScore;
    const isDraw = userScore === opponentScore;
    let xpGain = 15; // base participation

    if (isWinner) {
      xpGain += 50; // victory bonus
      xpGain += userCorrectCount * 5; // correct answers bonus
      addXP(xpGain);
    } else if (isDraw) {
      xpGain += 25; // draw bonus
      xpGain += userCorrectCount * 5;
      addXP(xpGain);
    } else {
      xpGain += userCorrectCount * 5;
      addXP(xpGain);
    }

    setArenaState('results');

    // Animate rank bar from old percentage to new percentage
    const multiplier = isWinner ? 12 : isDraw ? 5 : -8;
    setRankProgress((prev) => {
      const target = Math.max(0, Math.min(100, prev + multiplier));
      return target;
    });
  };

  const resetGame = () => {
    setArenaState('landing');
    setGameMode(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setUserReady(false);
    setFriendReady(false);
    setFriendJoined(false);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (opponentSimRef.current) clearTimeout(opponentSimRef.current);
    };
  }, []);

  return (
    <motion.div 
      className="arena-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="arena-ambient-stars" />

      {/* Main Flow Controller */}
      <AnimatePresence mode="wait">
        
        {/* ================= STEP 0: LANDING ================= */}
        {arenaState === 'landing' && (
          <motion.div 
            key="landing"
            className="arena-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="arena-landing-header">
              <div className="arena-badge-glowing">
                <Swords size={14} className="badge-icon-spin" />
                Battle Arena Mode
              </div>
              <h1>The <span className="gradient-text-moon">Battle Arena</span></h1>
              <p className="arena-subtitle">Challenge learners around the world in real-time battles and prove your skills.</p>
            </div>

            <div className="arena-cards-grid">
              <motion.div 
                className="arena-game-card glass"
                whileHover={{ y: -8, borderColor: 'rgba(255, 255, 255, 0.4)', boxShadow: '0 12px 40px rgba(255, 255, 255, 0.05), 0 0 30px rgba(255, 255, 255, 0.03)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setGameMode('online');
                  setArenaState('subject');
                }}
              >
                <div className="card-gaming-badge">MATCHMAKING</div>
                <div className="arena-card-main-icon"><Users size={40} className="icon-glow" /></div>
                <h3>Play Online</h3>
                <p>Instantly match with a random challenger matching your skill rank. Earn badges & climb divisions.</p>
                <div className="arena-card-footer">
                  Enter Queue <ArrowRight size={14} />
                </div>
              </motion.div>

              <motion.div 
                className="arena-game-card glass"
                whileHover={{ y: -8, borderColor: 'rgba(255, 255, 255, 0.4)', boxShadow: '0 12px 40px rgba(255, 255, 255, 0.05), 0 0 30px rgba(255, 255, 255, 0.03)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setGameMode('friend');
                  setArenaState('subject');
                }}
              >
                <div className="card-gaming-badge alt">CUSTOM LOBBY</div>
                <div className="arena-card-main-icon"><UserPlus size={40} className="icon-glow" /></div>
                <h3>Play With Friend</h3>
                <p>Generate a private room invite code and duel your friend in a custom 1v1 battle arena.</p>
                <div className="arena-card-footer">
                  Create Room <ArrowRight size={14} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 1: CHOOSE SUBJECT ================= */}
        {arenaState === 'subject' && (
          <motion.div 
            key="subject"
            className="arena-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <button className="arena-back-btn" onClick={() => setArenaState('landing')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flow-step-header">
              <h2>Select <span className="highlight-text-white">Subject</span></h2>
              <p>Choose the core programming subject for this 1v1 battle.</p>
            </div>

            <div className="arena-setup-grid">
              {['JavaScript', 'React', 'Backend'].map((subject) => (
                <motion.div
                  key={subject}
                  className="setup-item-card glass"
                  whileHover={{ scale: 1.03, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  onClick={() => handleSelectSubject(subject)}
                >
                  <div className="setup-card-icon-circle">
                    <Zap size={24} />
                  </div>
                  <h3>{subject}</h3>
                  <p>{subject === 'JavaScript' ? 'Variables, closures, scope, numbers & string algorithms.' : subject === 'React' ? 'State, components lifecycle, props, and custom hooks.' : 'Express servers, restful APIs, databases, and token authentication.'}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: CHOOSE TOPIC ================= */}
        {arenaState === 'topic' && (
          <motion.div 
            key="topic"
            className="arena-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <button className="arena-back-btn" onClick={() => setArenaState('subject')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flow-step-header">
              <h2>Select <span className="highlight-text-white">Topic</span></h2>
              <p>Select the specific curriculum area under {selectedSubject} to test.</p>
            </div>

            <div className="arena-setup-grid select-topics-grid">
              {(topicsMap[selectedSubject] || []).map((topic) => (
                <motion.div
                  key={topic}
                  className="setup-item-card glass compact"
                  whileHover={{ scale: 1.03, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  onClick={() => handleSelectTopic(topic)}
                >
                  <h3>{topic}</h3>
                  <span className="topic-accent-badge">{selectedSubject}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: CHOOSE DIFFICULTY ================= */}
        {arenaState === 'difficulty' && (
          <motion.div 
            key="difficulty"
            className="arena-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <button className="arena-back-btn" onClick={() => setArenaState('topic')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flow-step-header">
              <h2>Choose <span className="highlight-text-white">Difficulty</span></h2>
              <p>Difficulty determines the complexity of questions and opponent skill level.</p>
            </div>

            <div className="arena-setup-grid select-diff-grid">
              {['Easy', 'Medium', 'Hard', 'Expert'].map((diff) => (
                <motion.div
                  key={diff}
                  className={`setup-item-card glass compact diff-${diff.toLowerCase()}`}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleSelectDifficulty(diff)}
                >
                  <h3>{diff}</h3>
                  <span className="diff-multiplier">
                    {diff === 'Easy' ? '1.0x XP' : diff === 'Medium' ? '1.2x XP' : diff === 'Hard' ? '1.5x XP' : '2.0x XP'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= STEP 4: CHOOSE PARAMS ================= */}
        {arenaState === 'params' && (
          <motion.div 
            key="params"
            className="arena-section"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <button className="arena-back-btn" onClick={() => setArenaState('difficulty')}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flow-step-header">
              <h2>Battle <span className="highlight-text-white">Parameters</span></h2>
              <p>Configure the lengths and timer constraints for the match.</p>
            </div>

            <div className="params-settings-container glass">
              <div className="param-setting-row">
                <div className="param-setting-info">
                  <span className="param-label">Number of Questions</span>
                  <span className="param-desc">Total questions in this quiz battle.</span>
                </div>
                <div className="param-options-toggle">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      className={`param-option-btn ${questionCount === num ? 'selected' : ''}`}
                      onClick={() => setQuestionCount(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="param-setting-row">
                <div className="param-setting-info">
                  <span className="param-label">Time Limit per Question</span>
                  <span className="param-desc">Seconds allowed before auto-timeout.</span>
                </div>
                <div className="param-options-toggle">
                  {[15, 30, 45].map((secs) => (
                    <button
                      key={secs}
                      className={`param-option-btn ${timeLimit === secs ? 'selected' : ''}`}
                      onClick={() => setTimeLimit(secs)}
                    >
                      {secs}s
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="arena-primary-btn launch-queue-btn"
                onClick={() => {
                  if (gameMode === 'friend') {
                    generateRoomCode();
                    setArenaState('friend-lobby');
                  } else {
                    handleStartMatchmakingSetup();
                  }
                }}
              >
                {gameMode === 'friend' ? 'Create Lobby' : 'Find Challenger'} {gameMode === 'friend' ? <ArrowRight size={16} /> : <Swords size={16} />}
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 5: MATCHMAKING SCREEN ================= */}
        {arenaState === 'matchmaking' && (
          <motion.div 
            key="matchmaking"
            className="arena-section matchmaking-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="matchmaking-radar-wrapper">
              <div className="matchmaking-radar-ring ring-1" />
              <div className="matchmaking-radar-ring ring-2" />
              <div className="matchmaking-radar-ring ring-3" />
              <div className="matchmaking-radar-pulse" />
              <Swords size={40} className="radar-icon-spin" />
            </div>

            <h2 className="matchmaking-status-text">{matchmakingStatus}</h2>
            <div className="matchmaking-matchup-panel">
              <div className="matchmaking-player user">
                <div className="match-avatar">🧙</div>
                <span className="match-name">You (User)</span>
                <span className="match-rank">Level 1</span>
              </div>
              
              <div className="matchup-versus">VS</div>

              <div className="matchmaking-player opponent">
                <div className="match-avatar">{opponent ? opponent.avatar : "?"}</div>
                <span className="match-name">{opponent ? opponent.name : "Searching..."}</span>
                <span className="match-rank">{opponent ? opponent.rank : "---"}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= private Friend Lobby ================= */}
        {arenaState === 'friend-lobby' && (
          <motion.div 
            key="friend-lobby"
            className="arena-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="arena-back-btn" onClick={resetGame}>
              <ArrowLeft size={14} /> Leave Room
            </button>
            
            <div className="flow-step-header">
              <h2>Custom <span className="highlight-text-white">Lobby</span></h2>
              <p>Invite a friend to join this direct 1v1 battle arena.</p>
            </div>

            <div className="friend-lobby-panel glass">
              <div className="lobby-room-code-section">
                <span className="lobby-label-hint">ROOM CODE</span>
                <div className="room-code-display">{roomCode}</div>
                <button className="lobby-copy-btn glass" onClick={copyInviteLink}>
                  {copiedLink ? <Check size={14} style={{ color: 'var(--color-success)' }} /> : <Copy size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              {/* Lobby settings preview */}
              <div className="lobby-settings-preview glass">
                <div className="lobby-settings-title">Match Rules</div>
                <div className="lobby-settings-grid">
                  <div className="lobby-setting-tag">
                    <span className="label">Subject</span>
                    <span className="value">{selectedSubject || 'JavaScript'}</span>
                  </div>
                  <div className="lobby-setting-tag">
                    <span className="label">Topic</span>
                    <span className="value">{selectedTopic || 'Variables'}</span>
                  </div>
                  <div className="lobby-setting-tag">
                    <span className="label">Difficulty</span>
                    <span className="value">{selectedDifficulty || 'Medium'}</span>
                  </div>
                  <div className="lobby-setting-tag">
                    <span className="label">Questions</span>
                    <span className="value">{questionCount || 5}</span>
                  </div>
                  <div className="lobby-setting-tag">
                    <span className="label">Timer</span>
                    <span className="value">{timeLimit || 30}s</span>
                  </div>
                </div>
              </div>

              <div className="lobby-players-grid">
                <div className="lobby-player-slot ready">
                  <div className="lobby-player-avatar">🧙</div>
                  <div className="lobby-player-details">
                    <span className="player-name">You (Host)</span>
                    <span className="player-status-badge">READY</span>
                  </div>
                </div>

                <div className={`lobby-player-slot ${friendJoined ? 'ready' : 'waiting'}`}>
                  {friendJoined ? (
                    <>
                      <div className="lobby-player-avatar">{opponent ? opponent.avatar : "🥷"}</div>
                      <div className="lobby-player-details">
                        <span className="player-name">{friendName}</span>
                        <span className={`player-status-badge ${friendReady ? 'ready' : 'thinking'}`}>
                          {friendReady ? 'READY' : 'CHOOSING...'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="lobby-slot-placeholder">
                      <RefreshCw size={20} className="spinning-loader" />
                      <span>Waiting for friend to join...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lobby-actions-footer">
                <button
                  className={`arena-primary-btn lobby-start-btn`}
                  disabled={!friendJoined || !friendReady || userReady}
                  onClick={() => setUserReady(true)}
                >
                  {userReady ? 'Waiting for Friend...' : 'Mark Ready'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 6: ACTIVE BATTLE SCREEN ================= */}
        {arenaState === 'battle' && (
          <motion.div 
            key="battle"
            className="arena-section battle-arena-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {battleStarting ? (
              <div className="battle-countdown-screen">
                <motion.div 
                  className="countdown-digit"
                  key={battleCountdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {battleCountdown}
                </motion.div>
                <div className="countdown-title">PREPARE FOR BATTLE!</div>
              </div>
            ) : (
              <div className="battle-grid">
                {/* --- Left Column: Live Match Board & Scores --- */}
                <div className="battle-board glass">
                  <div className="battle-board-header">
                    <div className="battle-progress-badge">
                      Question {currentQuestionIdx + 1} of {questions.length}
                    </div>
                    <div className="battle-timer">
                      <Hourglass size={14} className="timer-icon-animate" />
                      <span>{timeLeft}s</span>
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="battle-question-container">
                    <h2 className="question-text">{questions[currentQuestionIdx]?.question}</h2>
                    
                    {questions[currentQuestionIdx]?.code && (
                      <div className="question-code-block">
                        <div className="code-header-bar">
                          <span className="terminal-dots"><span/><span/><span/></span>
                          <span className="code-filename">arena_script.js</span>
                        </div>
                        <pre><code>{questions[currentQuestionIdx]?.code}</code></pre>
                      </div>
                    )}

                    <div className="battle-options-grid">
                      {questions[currentQuestionIdx]?.options.map((option, idx) => {
                        let btnClass = "battle-option-btn glass";
                        if (isAnswered) {
                          const isCorrect = idx === questions[currentQuestionIdx].correct;
                          const isSelected = idx === selectedAnswer;
                          if (isCorrect) btnClass += " correct-ans";
                          else if (isSelected) btnClass += " incorrect-ans";
                          else btnClass += " disabled-ans";
                        }

                        return (
                          <button
                            key={idx}
                            className={btnClass}
                            disabled={isAnswered}
                            onClick={() => handleSelectAnswer(idx)}
                          >
                            <span className="option-badge">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* --- Right Column: Live Opponent Stats --- */}
                <div className="battle-stats-sidebar">
                  {/* User Profile Stats */}
                  <div className="sidebar-player-card glass">
                    <div className="side-card-header">
                      <div className="sidebar-avatar">🧙</div>
                      <div className="sidebar-details">
                        <span className="side-player-name">You</span>
                        <span className="side-player-desc">Level 1 (FLOW Explorer)</span>
                      </div>
                      <div className="side-player-score">{userScore}</div>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${(currentQuestionIdx / questions.length) * 100}%` }}
                      />
                    </div>
                    <div className="correct-stats">
                      <span>Accuracy: {userCorrectCount} / {questions.length}</span>
                    </div>
                  </div>

                  {/* Opponent Profile Stats */}
                  <div className="sidebar-player-card glass opponent-card">
                    <div className="side-card-header">
                      <div className="sidebar-avatar">{opponent?.avatar || "🤖"}</div>
                      <div className="sidebar-details">
                        <span className="side-player-name">{opponent?.name || "Opponent"}</span>
                        <span className="side-player-desc">{opponent?.rank || "Gold III"}</span>
                      </div>
                      <div className="side-player-score">{opponentScore}</div>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${(opponentProgress / questions.length) * 100}%`, background: 'var(--color-error)' }}
                      />
                    </div>
                    <div className="correct-stats">
                      <span>Accuracy: {opponentCorrectCount} / {questions.length}</span>
                    </div>
                  </div>

                  {/* Live Feed Event Log */}
                  <div className="battle-feed-log glass">
                    <div className="feed-log-title">LIVE COMBAT LOG</div>
                    <div className="feed-log-content">
                      <div className="feed-log-row active">
                        <span className="status-indicator-dot" />
                        <span className="feed-status-text">{opponentStatus}</span>
                      </div>
                      <div className="feed-log-row">
                        <span className="feed-status-text muted">Timer: {timeLeft}s remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= STEP 7: RESULTS SCREEN ================= */}
        {arenaState === 'results' && (
          <motion.div 
            key="results"
            className="arena-section results-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={`results-badge-banner ${userScore > opponentScore ? 'winner' : userScore === opponentScore ? 'draw' : 'loser'}`}>
              {userScore > opponentScore ? 'VICTORY' : userScore === opponentScore ? 'DRAW MATCH' : 'DEFEAT'}
            </div>

            <div className="results-panel-grid">
              {/* Stats Card */}
              <div className="results-card glass">
                <div className="res-card-title">MATCH PERFORMANCE</div>
                
                <div className="results-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-val">{userScore}</span>
                    <span className="metric-lbl">Your Score</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-val">{opponentScore}</span>
                    <span className="metric-lbl">Opponent Score</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-val">{Math.round((userCorrectCount / questions.length) * 100)}%</span>
                    <span className="metric-lbl">Accuracy</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-val">+{userScore > opponentScore ? '65' : userScore === opponentScore ? '35' : '15'}</span>
                    <span className="metric-lbl">XP Earned</span>
                  </div>
                </div>

                <div className="results-table">
                  <div className="table-row header">
                    <span>Player</span>
                    <span className="text-right">Correct Answers</span>
                  </div>
                  <div className="table-row">
                    <span>🧙 You</span>
                    <span className="text-right">{userCorrectCount} / {questions.length}</span>
                  </div>
                  <div className="table-row">
                    <span>{opponent?.avatar || "🤖"} {opponent?.name || "Opponent"}</span>
                    <span className="text-right">{opponentCorrectCount} / {questions.length}</span>
                  </div>
                </div>
              </div>

              {/* Ranks Card */}
              <div className="results-card glass league-card">
                <div className="res-card-title">ARENA LEAGUE STATUS</div>
                <div className="league-visual-box">
                  <Trophy size={48} className="league-trophy-glow" />
                  <div className="league-details-col">
                    <span className="league-name-text">Gold Division III</span>
                    <span className="league-ranking-pos">Global Rank: #4,208</span>
                  </div>
                </div>

                <div className="league-progress-wrapper">
                  <div className="league-progress-labels">
                    <span>Division Progress</span>
                    <span>{rankProgress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${rankProgress}%`, background: 'linear-gradient(90deg, #f6d365, #fda085)' }}
                    />
                  </div>
                  <span className="league-next-level">Next unlock: Gold Division II (+{100 - rankProgress} LP)</span>
                </div>
              </div>
            </div>

            <div className="results-actions">
              <button className="arena-primary-btn rematch-btn" onClick={resetGame}>
                Play Again <RefreshCw size={14} />
              </button>
              <button className="arena-back-btn return-btn" onClick={() => navigate('/')}>
                Return Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

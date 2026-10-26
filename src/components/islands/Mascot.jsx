import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Mascot.css';

const GREETINGS = [

];

export default function Mascot() {
  const mascotRef = useRef(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [speechText, setSpeechText] = useState("");
  
  const idleTimeoutRef = useRef(null);

  useEffect(() => {
    const triggerWave = () => {
      const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setSpeechText(randomGreeting);
      setIsWaving(true);
      
      // Lower hand and hide bubble after 3.5s
      setTimeout(() => {
        setIsWaving(false);
      }, 3500);
    };

    const startIdleTimer = () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        triggerWave();
      }, 7000); // 7 seconds of inactivity
    };

    const handleMouseMove = (e) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - mascotCenterX;
      const dy = e.clientY - mascotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxOffset = 1.5; // keeps pupil (r=2.0) inside eye white (r=3.5)

      const nx = distance === 0 ? 0 : (dx / distance) * Math.min(maxOffset, distance / 50);
      const ny = distance === 0 ? 0 : (dy / distance) * Math.min(maxOffset, distance / 50);

      setEyeOffset({ x: nx, y: ny });
      
      // Proximity threshold for happiness (160px)
      setIsNear(distance < 160);

      // On mouse move, lower arm/hide bubble and reset idle timer
      setIsWaving(false);
      startIdleTimer();
    };

    // Initial countdown when component mounts
    startIdleTimer();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  return (
    <div className="mascot" ref={mascotRef} aria-label="Flow mascot" role="img">
      <AnimatePresence>
        {isWaving && speechText && (
          <motion.div
            className="mascot__speech-bubble"
            initial={{ opacity: 0, scale: 0.6, y: 12, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.6, y: 12, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {speechText}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        className="mascot__svg"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body — round stone */}
        <ellipse cx="30" cy="34" rx="18" ry="16" fill="#d4d4d4" />
        <ellipse cx="30" cy="34" rx="18" ry="16" fill="url(#mascot-body-grad)" />

        {/* Body highlight */}
        <ellipse cx="26" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.15)" />

        {/* Left arm */}
        <motion.g
          className="mascot__arm--left"
          style={{ transformOrigin: "20px 32px" }}
          animate={{
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M13 32 Q8 26 10 22"
            stroke="#c0c0c0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Right arm */}
        <motion.g
          className="mascot__arm--right"
          style={{ transformOrigin: "40px 32px" }}
          animate={isWaving ? {
            rotate: [-110, -135, -110, -135, -110, -135, 0]
          } : {
            rotate: [0, 5, 0]
          }}
          transition={isWaving ? {
            duration: 3.5,
            ease: "easeInOut",
          } : {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M47 32 Q52 26 50 22"
            stroke="#c0c0c0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Left eye — tracks cursor */}
        <g className="mascot__eye">
          <circle cx="24" cy="32" r="3.5" fill="#fff" />
          <circle
            cx={24 + eyeOffset.x}
            cy={32 + eyeOffset.y}
            r="2"
            fill="#2d2d2d"
          />
          <circle
            cx={23.2 + eyeOffset.x * 0.5}
            cy={30.8 + eyeOffset.y * 0.5}
            r="0.7"
            fill="white"
          />
        </g>

        {/* Right eye — tracks cursor */}
        <g className="mascot__eye mascot__eye--right">
          <circle cx="36" cy="32" r="3.5" fill="#fff" />
          <circle
            cx={36 + eyeOffset.x}
            cy={32 + eyeOffset.y}
            r="2"
            fill="#2d2d2d"
          />
          <circle
            cx={35.2 + eyeOffset.x * 0.5}
            cy={30.8 + eyeOffset.y * 0.5}
            r="0.7"
            fill="white"
          />
        </g>

        {/* Mouth — curves smoothly based on proximity */}
        <motion.path
          stroke="#2d2d2d"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: isNear ? "M26 38 Q30 42 34 38" : "M26 40 Q30 36 34 40"
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />

        {/* Cheek blush — fades in/out based on proximity */}
        <motion.circle
          className="mascot__cheek"
          cx="19"
          cy="37"
          r="3"
          fill="#f5a0a0"
          animate={{ opacity: isNear ? 0.65 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.circle
          className="mascot__cheek"
          cx="41"
          cy="37"
          r="3"
          fill="#f5a0a0"
          animate={{ opacity: isNear ? 0.65 : 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* Feet */}
        <ellipse cx="24" cy="49" rx="5" ry="2.5" fill="#bbb" />
        <ellipse cx="36" cy="49" rx="5" ry="2.5" fill="#bbb" />

        {/* Gradient definition */}
        <defs>
          <radialGradient id="mascot-body-grad" cx="0.4" cy="0.35" r="0.65">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

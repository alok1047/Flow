import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LiquidMoonButton.css';

export default function LiquidMoonButton({
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  // Clean up old ripples automatically
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 1200);
    return () => clearTimeout(timer);
  }, [ripples]);

  const addRipple = (clientX, clientY, type) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newRipple = {
      id: Math.random() + Date.now(),
      x,
      y,
      type,
    };
    setRipples((prev) => [...prev, newRipple]);
  };

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS custom properties representing local cursor position
    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    addRipple(e.clientX, e.clientY, 'hover');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    if (disabled) return;
    addRipple(e.clientX, e.clientY, 'click');
    if (onClick) {
      // Small delay to let the click ripple expand before execution
      setTimeout(() => onClick(e), 150);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`liquid-moon-btn ${isHovered ? 'hovered' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      {...props}
    >
      {/* Wobbly Liquid Background Layer */}
      <span className="liquid-moon-bg" />
      
      {/* Spotlight / Caustic reflection tracking cursor */}
      <span className="liquid-moon-spotlight" />

      {/* Ripple Rings container */}
      <span className="liquid-ripples-container">
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className={`liquid-ripple ripple-${ripple.type}`}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: ripple.type === 'click' ? 4.5 : 2.5,
              opacity: 0,
            }}
            transition={{
              duration: ripple.type === 'click' ? 0.95 : 0.75,
              ease: 'easeOut',
            }}
          />
        ))}
      </span>

      {/* Button Content */}
      <span className="liquid-moon-content">
        {children}
      </span>
    </motion.button>
  );
}

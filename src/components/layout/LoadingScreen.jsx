import { motion } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Walking stone mascot */}
      <div className="loading-screen__mascot">
        <div className="loading-screen__stone">
          <div className="loading-screen__eyes">
            <div className="loading-screen__eye" />
            <div className="loading-screen__eye" />
          </div>
        </div>
        <div className="loading-screen__legs">
          <div className="loading-screen__leg loading-screen__leg--left" />
          <div className="loading-screen__leg loading-screen__leg--right" />
        </div>
      </div>

      {/* Logo */}
      <motion.h1
        className="loading-screen__title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        FLOW
      </motion.h1>

      {/* Loading dots */}
      <div className="loading-screen__dots">
        <div className="loading-screen__dot" />
        <div className="loading-screen__dot" />
        <div className="loading-screen__dot" />
      </div>

      {/* Subtitle */}
      <motion.p
        className="loading-screen__subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Preparing your adventure...
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;

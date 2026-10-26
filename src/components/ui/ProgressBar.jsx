import { motion } from 'framer-motion';
import './ProgressBar.css';

const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'var(--glow-primary)',
  label,
  showPercent = true,
  size = 'md',
}) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="flow-progress">
      {(label || showPercent) && (
        <div className="flow-progress__header">
          {label && <span className="flow-progress__label">{label}</span>}
          {showPercent && (
            <span className="flow-progress__percent">{percent}%</span>
          )}
        </div>
      )}

      <div className={`flow-progress__track flow-progress__track--${size}`}>
        <motion.div
          className="flow-progress__fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

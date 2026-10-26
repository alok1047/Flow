import { motion } from 'framer-motion';
import './Moon.css';

const craters = [1, 2, 3, 4, 5];

export default function Moon() {
  return (
    <motion.div
      className="moon"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <div className="moon__body">
        {craters.map((n) => (
          <div key={n} className={`moon__crater moon__crater--${n}`} />
        ))}
      </div>
    </motion.div>
  );
}

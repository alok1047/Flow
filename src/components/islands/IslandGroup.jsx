import { motion } from 'framer-motion';
import { islands } from '../../data/islands';
import Island from './Island';
import Mascot from './Mascot';
import './IslandGroup.css';

/** Stagger animation variants */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const islandVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
    },
  },
};

export default function IslandGroup({ onIslandClick }) {
  return (
    <div className="island-group" aria-label="Learning path islands">
      <div className="island-group__container">
        {/* Islands with stagger entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {islands.map((island) => (
            <motion.div
              key={island.id}
              className="island-group__item"
              variants={islandVariants}
              style={{
                left: `${island.position.x}%`,
                top: `${island.position.y}%`,
              }}
            >
              {/* Mascot sits on the JS island */}
              {island.id === 'javascript' && <Mascot />}

              <Island
                island={island}
                isActive={island.unlocked}
                onClick={onIslandClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

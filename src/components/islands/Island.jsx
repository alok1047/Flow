import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import './Island.css';

/**
 * Renders the appropriate icon for each island type.
 */
function IslandIcon({ island }) {
  const logoSrc = `/logos/${island.id}.png`;
  const isReact = island.id === 'react';

  return (
    <div
      className={`island__icon-symbol ${isReact ? 'island__icon-symbol--spin' : ''}`}
      style={{ borderColor: `${island.color}40`, padding: '4px', background: 'rgba(255, 255, 255, 0.03)' }}
    >
      <img
        src={logoSrc}
        alt={`${island.name} logo`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

/**
 * Small decorative elements (trees / crystals) placed on the island.
 */
function IslandDecor({ island }) {
  if (island.id === 'system-design' || island.id === 'cloud') {
    // Crystals for advanced islands
    return (
      <>
        <div className="island__decor" style={{ top: '-4px', right: '18px' }}>
          <div
            className="island__crystal"
            style={{ background: `${island.color}88` }}
          />
        </div>
        <div className="island__decor" style={{ top: '-2px', right: '28px' }}>
          <div
            className="island__crystal"
            style={{ background: `${island.color}55`, width: 4, height: 8 }}
          />
        </div>
      </>
    );
  }

  // Trees for other islands
  return (
    <>
      <div className="island__decor" style={{ top: '-10px', left: '16px' }}>
        <div className="island__tree">
          <div className="island__tree-top" />
          <div className="island__tree-trunk" />
        </div>
      </div>
      <div className="island__decor" style={{ top: '-6px', right: '20px' }}>
        <div className="island__tree" style={{ transform: 'scale(0.7)' }}>
          <div className="island__tree-top" />
          <div className="island__tree-trunk" />
        </div>
      </div>
    </>
  );
}

export default function Island({ island, isActive, onClick }) {
  const unlocked = island.unlocked;

  const handleClick = () => {
    if (unlocked && onClick) {
      onClick(island);
    }
  };

  return (
    <motion.div
      className={`island ${unlocked ? 'island--active' : 'island--locked'}`}
      onClick={handleClick}
      whileHover={unlocked ? { scale: 1.08 } : undefined}
      whileTap={unlocked ? { scale: 0.96 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="button"
      tabIndex={unlocked ? 0 : -1}
      aria-label={`${island.name} island${unlocked ? '' : ' (locked)'}`}
      aria-disabled={!unlocked}
    >
      {/* Glow ring */}
      <div
        className="island__glow"
        style={{ background: island.glowColor }}
      />

      {/* Island body */}
      <div className="island__body">
        {/* Icon on top */}
        <div className="island__icon-wrapper">
          <IslandIcon island={island} />
        </div>

        {/* Decorative elements */}
        <IslandDecor island={island} />

        {/* Grass top */}
        <div className="island__grass" />

        {/* Rocky bottom */}
        <div className="island__rock" />

        {/* Lock overlay */}
        {!unlocked && (
          <div className="island__lock">
            <span className="island__lock-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><Lock size={12} /></span>
          </div>
        )}
      </div>

      {/* Shadow */}
      <div className="island__shadow" />

      {/* Name label */}
      <span className="island__name">{island.name}</span>
    </motion.div>
  );
}

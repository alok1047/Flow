import './MagicPath.css';

/**
 * Generates a quadratic bezier curve between two points
 * with a natural-looking arc via midpoint vertical offset.
 */
function getCurvePath(from, to) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 6; // slight upward arc
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

export default function MagicPath({ fromPos, toPos, unlocked = false }) {
  // Convert percentage positions to SVG coordinates
  // The SVG viewBox is 100x100 (percentage-based)
  const from = { x: fromPos.x, y: fromPos.y };
  const to = { x: toPos.x, y: toPos.y };

  const pathD = getCurvePath(from, to);
  const stateClass = unlocked ? 'unlocked' : 'locked';

  return (
    <svg
      className="magic-path__svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow underlay */}
      <path
        className={`magic-path__glow magic-path__glow--${stateClass}`}
        d={pathD}
      />
      {/* Dashed animated path */}
      <path
        className={`magic-path__line magic-path__line--${stateClass}`}
        d={pathD}
      />
    </svg>
  );
}

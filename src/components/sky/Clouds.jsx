import './Clouds.css';

/* Inline SVG cloud shapes — soft, rounded, organic */
function CloudShape({ fill = 'rgba(255, 255, 255, 0.5)' }) {
  return (
    <svg
      viewBox="0 0 280 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
    >
      <ellipse cx="70" cy="55" rx="70" ry="25" fill={fill} />
      <ellipse cx="140" cy="42" rx="80" ry="35" fill={fill} />
      <ellipse cx="200" cy="50" rx="65" ry="28" fill={fill} />
      <ellipse cx="110" cy="38" rx="55" ry="30" fill={fill} />
      <ellipse cx="170" cy="55" rx="60" ry="22" fill={fill} />
    </svg>
  );
}

const clouds = [
  { id: 1, fill: 'rgba(255, 255, 255, 0.45)' },
  { id: 2, fill: 'rgba(180, 200, 230, 0.4)' },
  { id: 3, fill: 'rgba(255, 255, 255, 0.35)' },
  { id: 4, fill: 'rgba(170, 195, 230, 0.35)' },
];

export default function Clouds() {
  return (
    <div className="clouds" aria-hidden="true">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`clouds__cloud clouds__cloud--${cloud.id}`}
        >
          <CloudShape fill={cloud.fill} />
        </div>
      ))}
    </div>
  );
}

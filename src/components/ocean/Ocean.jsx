import './Ocean.css';

/**
 * Wave path generator — produces a smooth sine-ish curve.
 * yOffset shifts the baseline, amplitude controls height,
 * frequency controls how many peaks per viewBox-width.
 */
function wavePath(yOffset, amplitude, frequency, phase = 0) {
  const points = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 1440;
    const y =
      yOffset +
      Math.sin((i / steps) * Math.PI * 2 * frequency + phase) * amplitude +
      Math.sin((i / steps) * Math.PI * 2 * frequency * 0.5 + phase * 1.3) *
        (amplitude * 0.4);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,${yOffset} ` + points.map((p) => `L${p}`).join(' ') + ` L1440,320 L0,320 Z`;
}

const waveConfigs = [
  { yOffset: 50, amplitude: 12, frequency: 2, phase: 0, fill: '#0a1628' },
  { yOffset: 70, amplitude: 10, frequency: 2.5, phase: 1.2, fill: '#0d1a2e' },
  { yOffset: 90, amplitude: 8, frequency: 3, phase: 2.5, fill: '#0f2035' },
  { yOffset: 110, amplitude: 6, frequency: 3.5, phase: 0.8, fill: '#142a45' },
];

export default function Ocean() {
  return (
    <div className="ocean" aria-hidden="true">
      {/* Depth gradient overlay */}
      <div className="ocean__depth" />

      {/* Wave layers */}
      {waveConfigs.map((cfg, i) => (
        <div
          key={i}
          className={`ocean__wave-layer ocean__wave-layer--${i + 1}`}
        >
          <svg
            className="ocean__wave-svg"
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* First tile */}
            <path
              d={wavePath(cfg.yOffset, cfg.amplitude, cfg.frequency, cfg.phase)}
              fill={cfg.fill}
            />
            {/* Second tile (offset by 1440 for seamless scroll) */}
            <path
              d={wavePath(cfg.yOffset, cfg.amplitude, cfg.frequency, cfg.phase)}
              fill={cfg.fill}
              transform="translate(1440, 0)"
            />
          </svg>
        </div>
      ))}

      {/* Moonlight reflection */}
      <div className="ocean__moonlight" />

      {/* Sparkle dots */}
      <span className="ocean__sparkle" />
      <span className="ocean__sparkle" />
      <span className="ocean__sparkle" />
      <span className="ocean__sparkle" />
      <span className="ocean__sparkle" />
    </div>
  );
}

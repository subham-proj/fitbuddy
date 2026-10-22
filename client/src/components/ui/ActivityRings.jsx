/**
 * Concentric activity rings (Move / Exercise / Stand), rendered as SVG.
 * Each ring is a value/goal pair; the arc length reflects the ratio.
 *
 * @param {object} props
 * @param {[number, number]} props.move - [value, goal]
 * @param {[number, number]} props.exercise - [value, goal]
 * @param {[number, number]} props.stand - [value, goal]
 * @param {number} [props.size]
 */
function ActivityRings({ move, exercise, stand, size = 180 }) {
  const center = size / 2;
  const strokeWidth = 14;

  const rings = [
    { radius: 70, color: 'var(--color-lime)', pair: move },
    { radius: 52, color: 'var(--color-orange)', pair: exercise },
    { radius: 34, color: 'var(--color-violet)', pair: stand },
  ];

  const pct = (pair) => Math.min(1, pair[0] / pair[1]);
  const label = `Move ${Math.round(pct(move) * 100)} percent, Exercise ${Math.round(
    pct(exercise) * 100,
  )} percent, Stand ${Math.round(pct(stand) * 100)} percent`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
    >
      <g
        transform={`rotate(-90 ${center} ${center})`}
        fill="none"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      >
        {rings.map(({ radius, color, pair }) => {
          const circumference = 2 * Math.PI * radius;
          const offset = circumference * (1 - pct(pair));
          return (
            <g key={radius}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="var(--color-dark-track)"
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke={color}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default ActivityRings;

const WIDTH = 600;
const HEIGHT = 220;
const PLOT_BOTTOM = 210;
const PLOT_RANGE = 200;

/**
 * Line chart with an area fill, drawn in a fixed 600×220 viewBox that scales to
 * its container. Values are normalized to fit with a small vertical margin.
 *
 * @param {object} props
 * @param {number[]} props.values
 * @param {string} props.ariaLabel
 */
function LineChart({ values, ariaLabel }) {
  const lo = Math.min(...values) - 0.5;
  const hi = Math.max(...values) + 0.5;
  const span = hi - lo || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * WIDTH;
    const y = PLOT_BOTTOM - ((v - lo) / span) * PLOT_RANGE;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  const line = `M${points.join(' L')}`;
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      width="100%"
      height="240"
      role="img"
      aria-label={ariaLabel}
    >
      {[55, 110, 165].map((y) => (
        <line key={y} x1="0" y1={y} x2={WIDTH} y2={y} stroke="var(--color-divider)" strokeWidth="1" />
      ))}
      <path d={area} fill="var(--color-lime)" fillOpacity="0.35" />
      <path
        d={line}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default LineChart;

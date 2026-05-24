// SVG works by drawing a circle using a mathematical property called
// "stroke-dasharray" and "stroke-dashoffset"
//
// Imagine a circle drawn with dashed lines
// stroke-dasharray sets how long each dash is (we make it the full circle)
// stroke-dashoffset moves where the dash starts
// By changing the offset we reveal more or less of the circle
// That's how we turn it into a progress indicator

const ScoreCircle = ({ score, size = 56 }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  // circumference is the total length around the circle
  // 2 * PI * radius = ~125.66 for radius 20

  // How much of the circle to "hide" based on score
  // score 100 → offset 0 (full circle shown)
  // score 0   → offset = circumference (nothing shown)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Pick color based on score range
  const color =
    score >= 70
      ? 'var(--color-success)'
      : score >= 40
        ? 'var(--color-warning)'
        : 'var(--color-danger)';

  return (
    // rotate(-90) starts the progress from the top of the circle
    // not from the right (which is SVG's default 0 degrees)
    <svg width={size} height={size} viewBox='0 0 52 52' className='shrink-0'>
      {/* Background track — always full circle in border color */}
      <circle
        cx='26'
        cy='26'
        r={radius}
        fill='none'
        stroke='var(--color-border)'
        strokeWidth='4'
      />

      {/* Colored progress arc */}
      <circle
        cx='26'
        cy='26'
        r={radius}
        fill='none'
        stroke={color}
        strokeWidth='4'
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap='round'
        transform='rotate(-90 26 26)'
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />

      {/* Score text in the center */}
      <text
        x='26'
        y='22'
        textAnchor='middle'
        fontSize='10'
        fontWeight='700'
        fill={color}
      >
        {score}%
      </text>
      <text
        x='26'
        y='32'
        textAnchor='middle'
        fontSize='7'
        fill='var(--color-text-muted)'
      >
        match
      </text>
    </svg>
  );
};

export default ScoreCircle;

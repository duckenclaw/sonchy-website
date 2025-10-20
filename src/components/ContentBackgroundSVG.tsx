interface ContentBackgroundSVGProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  className?: string;
}

/**
 * Reusable SVG background component for content containers.
 * Used by LecturesContainer and ProjectsContainer for consistent styling.
 */
const ContentBackgroundSVG = ({
  fill = '#FFAFE4',
  stroke = '#C4DEF8',
  strokeWidth = '2',
  className = 'lectures-content-bg',
}: ContentBackgroundSVGProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 314 398"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M91.7393 396.718C92.7832 396.902 93.8447 396.967 94.9033 396.912L161.309 393.448L161.377 393.444L161.444 393.45L202.437 396.866C203.46 396.951 204.49 396.924 205.507 396.784L240.592 391.96C242.036 391.761 243.5 391.761 244.944 391.959L277.129 396.371C279.957 396.759 282.837 396.273 285.382 394.978L305.267 384.854C310.001 382.444 312.963 377.562 312.914 372.249L310.621 123.526V123.496L312.774 22.9551C312.901 17.0533 309.312 11.7063 303.802 9.58789L283.889 1.93262C282.285 1.31627 280.582 1 278.864 1H48.1348C46.9045 1 45.6791 1.16227 44.4912 1.48242L11.3564 10.4121C5.24586 12.0591 1.00016 17.6011 1 23.9297V368.948C1.00007 375.741 5.87636 381.553 12.5654 382.734L91.7393 396.718Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default ContentBackgroundSVG;

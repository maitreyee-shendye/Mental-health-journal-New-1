import './MoodFeedback.css';

export default function MoodFeedback({ mood, onDismiss }) {
  if (!mood) return null;

  const { level, label, emoji, message, tips, color, gradient, bgColor, confidence } = mood;

  // Determine dismiss button text based on mood
  const dismissText = level <= 2
    ? "I've noted these resources 💙"
    : level === 3
      ? "Thanks, I'll try these 🙏"
      : level === 4
        ? "Got it, thanks! 👍"
        : "Yay, thanks! 🎉";

  return (
    <div className="mood-overlay" onClick={(e) => {
      // Only allow easy dismiss for non-crisis moods
      if (level > 1 && e.target === e.currentTarget) onDismiss();
    }}>
      <div className="mood-card" data-level={level}>

        {/* Crisis banner */}
        {level === 1 && (
          <div className="crisis-banner">
            <div className="crisis-pulse-dot"></div>
            <span className="crisis-banner-text">
              If you're in immediate danger, please call emergency services or go to your nearest hospital.
            </span>
          </div>
        )}

        {/* Emoji */}
        <div className="mood-emoji">{emoji}</div>

        {/* Label */}
        <div className="mood-label" style={{ color }}>
          {label}
        </div>

        {/* Confidence */}
        <div className="mood-confidence">
          Confidence: {Math.round(confidence * 100)}%
          <div className="confidence-bar-container">
            <div
              className="confidence-bar-fill"
              style={{
                width: `${confidence * 100}%`,
                background: gradient
              }}
            ></div>
          </div>
        </div>

        {/* Message */}
        <div
          className="mood-message"
          style={{
            '--mood-color': color,
            '--mood-bg': bgColor
          }}
        >
          {message}
        </div>

        {/* Tips */}
        <div className="mood-tips-title">
          {level <= 2 ? "🆘 Important Resources" : "💡 Suggestions for You"}
        </div>
        <ul className="mood-tips-list">
          {tips.map((tip, i) => (
            <li className="mood-tip-item" key={i}>
              {tip}
            </li>
          ))}
        </ul>

        {/* Dismiss */}
        <button
          className="mood-dismiss-btn"
          style={{ background: gradient }}
          onClick={onDismiss}
        >
          {dismissText}
        </button>
      </div>
    </div>
  );
}

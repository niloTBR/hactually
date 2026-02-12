import * as React from 'react';

/**
 * SplitText - Animates text by splitting into characters with staggered reveal
 */
export default function SplitText({
  text,
  className = '',
  delay = 30,
  duration = 0.5,
  ease = 'cubic-bezier(0.25, 1, 0.5, 1)',
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  tag: Tag = 'p',
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  // Trigger animation after a small delay to ensure initial state is rendered
  React.useEffect(() => {
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, [text]); // Reset when text changes

  // Split text into words, preserving spaces
  const words = text.split(' ');

  return (
    <Tag className={className} style={{ display: 'inline-block' }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => {
            const overallIndex = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length, 0) + charIndex + wordIndex;

            return (
              <span
                key={charIndex}
                style={{
                  display: 'inline-block',
                  opacity: isVisible ? to.opacity : from.opacity,
                  transform: isVisible
                    ? `translateY(${to.y}px)`
                    : `translateY(${from.y}px)`,
                  transition: `opacity ${duration}s ${ease} ${overallIndex * delay}ms, transform ${duration}s ${ease} ${overallIndex * delay}ms`,
                }}
              >
                {char}
              </span>
            );
          })}
          {/* Add space after word (except last word) */}
          {wordIndex < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}

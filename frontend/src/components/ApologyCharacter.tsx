import { useEffect, useState, useCallback } from 'react';

interface ApologyCharacterProps {
  isApologizing?: boolean;
  size?: number;
  className?: string;
  showContinuously?: boolean; // New prop for continuous idle animations
}

// Random animation configurations
const ANIMATIONS = [
  { bow: 25, speed: 0.4, message: 'すみません', sweat: true, hearts: true },
  { bow: 35, speed: 0.3, message: 'ごめんなさい', sweat: true, hearts: false },
  { bow: 20, speed: 0.5, message: '申し訳ございません', sweat: false, hearts: true },
  { bow: 30, speed: 0.35, message: 'すみません...', sweat: true, hearts: true },
  { bow: 40, speed: 0.25, message: 'ごめんね', sweat: false, hearts: false },
];

// Random idle expressions for variety
const IDLE_EXPRESSIONS = [
  { eyeHeight: 70, mouthCurve: 82 }, // Normal
  { eyeHeight: 68, mouthCurve: 80 }, // Slightly worried
  { eyeHeight: 72, mouthCurve: 84 }, // Hopeful
];

export const ApologyCharacter: React.FC<ApologyCharacterProps> = ({
  isApologizing = false,
  size = 120,
  className = '',
  showContinuously = false,
}) => {
  const [bowAngle, setBowAngle] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(() =>
    ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
  );
  const [currentExpression, setCurrentExpression] = useState(() =>
    IDLE_EXPRESSIONS[Math.floor(Math.random() * IDLE_EXPRESSIONS.length)]
  );

  // Select random animation configuration
  const selectRandomAnimation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ANIMATIONS.length);
    setCurrentAnimation(ANIMATIONS[randomIndex]);
  }, []);

  // Select random expression
  const selectRandomExpression = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * IDLE_EXPRESSIONS.length);
    setCurrentExpression(IDLE_EXPRESSIONS[randomIndex]);
  }, []);

  // Bowing animation effect
  useEffect(() => {
    if (isApologizing) {
      // Select a new random animation each time
      selectRandomAnimation();

      // Bowing animation with random parameters
      const bowDown = setTimeout(() => setBowAngle(currentAnimation.bow), 200);
      const bowUp = setTimeout(() => setBowAngle(0), 200 + currentAnimation.speed * 1000);

      return () => {
        clearTimeout(bowDown);
        clearTimeout(bowUp);
      };
    }
  }, [isApologizing, currentAnimation.bow, currentAnimation.speed, selectRandomAnimation]);

  // Continuous idle animation effect
  useEffect(() => {
    if (showContinuously && !isApologizing) {
      const interval = setInterval(() => {
        // Randomly change expression
        selectRandomExpression();

        // Occasionally do a small bow (30% chance)
        if (Math.random() < 0.3) {
          selectRandomAnimation();
          setBowAngle(15); // Small idle bow
          setTimeout(() => setBowAngle(0), 400);
        }
      }, 3000); // Every 3 seconds

      return () => clearInterval(interval);
    }
  }, [showContinuously, isApologizing, selectRandomAnimation, selectRandomExpression]);

  const showSweat = isApologizing && currentAnimation.sweat;
  const showHearts = isApologizing && currentAnimation.hearts;

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotate(${bowAngle}deg)`,
          transformOrigin: '50% 70%',
          transition: `transform ${currentAnimation.speed}s ease-in-out`,
        }}
      >
        {/* Body (torso) */}
        <ellipse cx="100" cy="120" rx="35" ry="45" fill="#FF6B9D" stroke="#E85A8A" strokeWidth="2" />

        {/* Head */}
        <circle cx="100" cy="70" r="30" fill="#FFE5E5" stroke="#E85A8A" strokeWidth="2" />

        {/* Hair (Japanese style) */}
        <path d="M 70 65 Q 70 45 100 40 Q 130 45 130 65" fill="#2C3E50" stroke="#1A252F" strokeWidth="2" />
        <circle cx="85" cy="55" r="8" fill="#2C3E50" />
        <circle cx="115" cy="55" r="8" fill="#2C3E50" />

        {/* Face - Eyes (closed, apologetic) - with dynamic expression */}
        <path
          d={`M 88 ${currentExpression.eyeHeight} Q 92 ${currentExpression.eyeHeight + 3} 96 ${currentExpression.eyeHeight}`}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.5s ease-in-out' }}
        />
        <path
          d={`M 104 ${currentExpression.eyeHeight} Q 108 ${currentExpression.eyeHeight + 3} 112 ${currentExpression.eyeHeight}`}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.5s ease-in-out' }}
        />

        {/* Blush */}
        <ellipse cx="80" cy="78" rx="8" ry="4" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="120" cy="78" rx="8" ry="4" fill="#FFB6C1" opacity="0.6" />

        {/* Mouth (apologetic smile) - with dynamic expression */}
        <path
          d={`M 92 ${currentExpression.mouthCurve} Q 100 ${currentExpression.mouthCurve + 3} 108 ${currentExpression.mouthCurve}`}
          fill="none"
          stroke="#E85A8A"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.5s ease-in-out' }}
        />

        {/* Arms (in bowing position) */}
        <g id="arms">
          {/* Left arm */}
          <path d="M 70 115 Q 55 105 45 115" fill="none" stroke="#E85A8A" strokeWidth="8" strokeLinecap="round" />
          {/* Left hand */}
          <circle cx="45" cy="115" r="6" fill="#FFE5E5" stroke="#E85A8A" strokeWidth="1" />

          {/* Right arm */}
          <path d="M 130 115 Q 145 105 155 115" fill="none" stroke="#E85A8A" strokeWidth="8" strokeLinecap="round" />
          {/* Right hand */}
          <circle cx="155" cy="115" r="6" fill="#FFE5E5" stroke="#E85A8A" strokeWidth="1" />
        </g>

        {/* Legs */}
        <g id="legs">
          {/* Left leg */}
          <rect x="85" y="155" width="10" height="35" rx="5" fill="#FF6B9D" stroke="#E85A8A" strokeWidth="2" />
          {/* Left foot */}
          <ellipse cx="90" cy="192" rx="8" ry="4" fill="#FFE5E5" stroke="#E85A8A" strokeWidth="1" />

          {/* Right leg */}
          <rect x="105" y="155" width="10" height="35" rx="5" fill="#FF6B9D" stroke="#E85A8A" strokeWidth="2" />
          {/* Right foot */}
          <ellipse cx="110" cy="192" rx="8" ry="4" fill="#FFE5E5" stroke="#E85A8A" strokeWidth="1" />
        </g>

        {/* Sweat drops (showing nervousness/apology) */}
        <g id="sweat" opacity={showSweat ? 1 : 0.3} style={{ transition: 'opacity 0.3s' }}>
          <ellipse cx="75" cy="65" rx="3" ry="5" fill="#87CEEB" />
          <ellipse cx="125" cy="68" rx="3" ry="5" fill="#87CEEB" />
        </g>

        {/* Apology text - with random message */}
        {isApologizing && (
          <g id="speech-bubble" opacity="0.95">
            <ellipse cx="140" cy="40" rx="38" ry="20" fill="white" stroke="#E85A8A" strokeWidth="2" />
            <path d="M 125 48 L 115 55 L 120 48 Z" fill="white" stroke="#E85A8A" strokeWidth="2" />
            <text
              x="140"
              y="45"
              fontFamily="Arial, sans-serif"
              fontSize="12"
              fill="#E85A8A"
              textAnchor="middle"
              fontWeight="bold"
            >
              {currentAnimation.message}
            </text>
          </g>
        )}
      </svg>

      {/* Floating hearts animation when apologizing */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float-heart">
            <span className="text-pink-400 text-2xl absolute" style={{ left: '30%', top: '10%' }}>
              ❤️
            </span>
          </div>
          <div className="animate-float-heart animation-delay-300">
            <span className="text-pink-300 text-xl absolute" style={{ left: '60%', top: '20%' }}>
              💕
            </span>
          </div>
          <div className="animate-float-heart animation-delay-600">
            <span className="text-pink-400 text-lg absolute" style={{ left: '45%', top: '5%' }}>
              ✨
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

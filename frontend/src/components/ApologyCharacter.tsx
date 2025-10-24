import { useEffect, useState } from 'react';

interface ApologyCharacterProps {
  isApologizing?: boolean;
  size?: number;
  className?: string;
}

export const ApologyCharacter: React.FC<ApologyCharacterProps> = ({
  isApologizing = false,
  size = 120,
  className = '',
}) => {
  const [bowAngle, setBowAngle] = useState(0);

  useEffect(() => {
    if (isApologizing) {
      // Bowing animation: 0 -> 30 -> 0 degrees
      const bowDown = setTimeout(() => setBowAngle(30), 200);
      const bowUp = setTimeout(() => setBowAngle(0), 800);

      return () => {
        clearTimeout(bowDown);
        clearTimeout(bowUp);
      };
    }
  }, [isApologizing]);

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
          transition: 'transform 0.3s ease-in-out',
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

        {/* Face - Eyes (closed, apologetic) */}
        <path
          d="M 88 70 Q 92 73 96 70"
          fill="none"
          stroke="#2C3E50"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 104 70 Q 108 73 112 70"
          fill="none"
          stroke="#2C3E50"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Blush */}
        <ellipse cx="80" cy="78" rx="8" ry="4" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="120" cy="78" rx="8" ry="4" fill="#FFB6C1" opacity="0.6" />

        {/* Mouth (apologetic smile) */}
        <path d="M 92 82 Q 100 85 108 82" fill="none" stroke="#E85A8A" strokeWidth="2" strokeLinecap="round" />

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
        <g id="sweat" opacity={isApologizing ? 1 : 0.3} style={{ transition: 'opacity 0.3s' }}>
          <ellipse cx="75" cy="65" rx="3" ry="5" fill="#87CEEB" />
          <ellipse cx="125" cy="68" rx="3" ry="5" fill="#87CEEB" />
        </g>

        {/* Apology text */}
        {isApologizing && (
          <g id="speech-bubble" opacity="0.95">
            <ellipse cx="140" cy="40" rx="32" ry="20" fill="white" stroke="#E85A8A" strokeWidth="2" />
            <path d="M 125 48 L 115 55 L 120 48 Z" fill="white" stroke="#E85A8A" strokeWidth="2" />
            <text
              x="140"
              y="45"
              fontFamily="Arial, sans-serif"
              fontSize="14"
              fill="#E85A8A"
              textAnchor="middle"
              fontWeight="bold"
            >
              すみません
            </text>
          </g>
        )}
      </svg>

      {/* Floating hearts animation when apologizing */}
      {isApologizing && (
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

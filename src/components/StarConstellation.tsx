import { useState, useCallback, useEffect, useRef } from "react";

const starMessages = [
  "You make the world brighter just by being in it ✨",
  "Your laugh is my favorite sound 🎵",
  "You're the kind of person people write songs about 🎶",
  "Every moment with you feels like magic 🪄",
  "You have the most beautiful soul I've ever known 🦋",
  "The world doesn't deserve someone as pure as you 🌸",
  "You turned my ordinary days into adventures 🌈",
  "I hope you know how incredibly special you are 💫",
  "You're the reason I believe in good people 🤍",
  "Jaylynn, you are unforgettable — always 💛",
];

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  revealed: boolean;
  twinkleDelay: number;
}

const generateStars = (): Star[] => {
  const positions = [
    { x: 15, y: 20 }, { x: 45, y: 12 }, { x: 75, y: 22 },
    { x: 25, y: 45 }, { x: 60, y: 38 }, { x: 85, y: 50 },
    { x: 10, y: 65 }, { x: 40, y: 70 }, { x: 70, y: 62 },
    { x: 50, y: 85 },
  ];
  return positions.map((pos, i) => ({
    id: i,
    x: pos.x + (Math.random() - 0.5) * 6,
    y: pos.y + (Math.random() - 0.5) * 6,
    size: 6 + Math.random() * 4,
    revealed: false,
    twinkleDelay: Math.random() * 3,
  }));
};

const StarConstellation = ({ onClose }: { onClose: () => void }) => {
  const [stars, setStars] = useState<Star[]>(generateStars);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showAurora, setShowAurora] = useState(false);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastRevealed = useRef<{ x: number; y: number } | null>(null);

  const handleStarClick = useCallback((starId: number) => {
    setStars((prev) => {
      const star = prev.find((s) => s.id === starId);
      if (!star || star.revealed) return prev;
      return prev.map((s) => (s.id === starId ? { ...s, revealed: true } : s));
    });

    const star = stars.find((s) => s.id === starId);
    if (!star || star.revealed) return;

    // Draw constellation line
    if (lastRevealed.current) {
      setLines((prev) => [
        ...prev,
        { x1: lastRevealed.current!.x, y1: lastRevealed.current!.y, x2: star.x, y2: star.y },
      ]);
    }
    lastRevealed.current = { x: star.x, y: star.y };

    setCurrentMessage(starMessages[starId]);
    const newCount = revealedCount + 1;
    setRevealedCount(newCount);

    if (newCount === stars.length) {
      setTimeout(() => {
        setCurrentMessage(null);
        setShowAurora(true);
        setTimeout(() => setShowFinalMessage(true), 2500);
      }, 3000);
    } else {
      setTimeout(() => setCurrentMessage(null), 3000);
    }
  }, [stars, revealedCount]);

  // Background twinkling stars
  const [bgStars] = useState(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, #0c1445 0%, #020617 60%, #000000 100%)" }}>
      {/* Background twinkling stars */}
      {bgStars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Constellation lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {lines.map((line, i) => (
          <line
            key={i}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="rgba(253, 224, 71, 0.4)"
            strokeWidth="1.5"
            className="animate-fade-in"
          />
        ))}
      </svg>

      {/* Northern Lights / Aurora Borealis */}
      {showAurora && (
        <div className="absolute inset-0 pointer-events-none animate-fade-in" style={{ zIndex: 4 }}>
          <div className="aurora-layer aurora-green" />
          <div className="aurora-layer aurora-teal" />
          <div className="aurora-layer aurora-purple" />
          <div className="aurora-layer aurora-pink" />
        </div>
      )}

      {/* Clickable stars */}
      <div ref={canvasRef} className="absolute inset-0" style={{ zIndex: 10 }}>
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => handleStarClick(star.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 rounded-full ${
              star.revealed
                ? "scale-150 shadow-[0_0_30px_10px_rgba(253,224,71,0.6)]"
                : "hover:scale-150 animate-twinkle cursor-pointer"
            }`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * (star.revealed ? 2.5 : 1),
              height: star.size * (star.revealed ? 2.5 : 1),
              background: star.revealed
                ? "radial-gradient(circle, #fde047, #f59e0b)"
                : "radial-gradient(circle, #ffffff, #e2e8f0)",
              animationDelay: `${star.twinkleDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Message popup */}
      {currentMessage && (
        <div className="absolute inset-x-0 bottom-32 flex justify-center animate-fade-in" style={{ zIndex: 20 }}>
          <div className="mx-4 max-w-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 text-center">
            <p className="text-xl text-white font-body leading-relaxed">{currentMessage}</p>
          </div>
        </div>
      )}

      {/* Final message */}
      {showFinalMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in" style={{ zIndex: 30 }}>
          <div className="mx-4 max-w-lg text-center">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="font-display text-4xl sm:text-5xl text-yellow-300 mb-4">
              You are my constellation
            </h2>
            <p className="text-xl text-white/80 font-body mb-2">
              Every star in the sky reminds me of you, Jaylynn.
            </p>
            <p className="text-lg text-white/60 font-body mb-8">
              No matter where life takes us, you'll always shine the brightest. 💛
            </p>
            <p className="text-white/40 font-body text-sm">- Pancake boy 🥞</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {revealedCount === 0 && !showFinalMessage && (
        <div className="absolute inset-x-0 bottom-12 text-center animate-fade-in" style={{ zIndex: 20, animationDelay: "1s" }}>
          <p className="text-white/50 font-body text-sm tracking-widest uppercase">
            Tap each star to reveal a message ✨
          </p>
        </div>
      )}

      {/* Progress */}
      {revealedCount > 0 && !showFinalMessage && (
        <div className="absolute top-6 inset-x-0 text-center" style={{ zIndex: 20 }}>
          <p className="text-white/40 font-body text-xs tracking-wider">
            {revealedCount} / {stars.length} stars discovered
          </p>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors font-body text-sm"
        style={{ zIndex: 40 }}
      >
        ✕
      </button>
    </div>
  );
};

export default StarConstellation;

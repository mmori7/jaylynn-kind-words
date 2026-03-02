import { useState, useCallback, useRef } from "react";
import FloatingCompliment from "@/components/FloatingCompliment";
import Sparkles from "@/components/Sparkles";

const compliments = [
  "You are the best ✨",
  "You are so cute 🌸",
  "You are perfect 💫",
  "You are so smart 🧠",
];

const YOUTUBE_VIDEO_ID = "SPxwz_id6So";

interface FloatingItem {
  id: number;
  text: string;
  x: number;
  delay: number;
}

const Index = () => {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const counterRef = useRef(0);

  const handleClick = useCallback(() => {
    // Start music
    if (!isPlaying) {
      setIsPlaying(true);
    }

    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);

    // Spawn all compliments with staggered delays
    const newItems: FloatingItem[] = compliments.map((text, i) => ({
      id: counterRef.current++,
      text,
      x: 15 + Math.random() * 70, // random horizontal position (%)
      delay: i * 0.4,
    }));

    setFloatingItems((prev) => [...prev, ...newItems]);

    // Clean up after animation
    setTimeout(() => {
      setFloatingItems((prev) =>
        prev.filter((item) => !newItems.find((n) => n.id === item.id))
      );
    }, 5000);
  }, [isPlaying]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Hidden YouTube player for music */}
      {isPlaying && (
        <iframe
          ref={iframeRef}
          className="absolute h-0 w-0 opacity-0"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0`}
          allow="autoplay"
          title="Background music"
        />
      )}

      {/* Soft decorative circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
      </div>

      {/* Floating compliments */}
      {floatingItems.map((item) => (
        <FloatingCompliment
          key={item.id}
          text={item.text}
          x={item.x}
          delay={item.delay}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl md:text-6xl">
          Hey Jaylynn!
        </h1>
        <p className="max-w-md text-lg text-muted-foreground font-body">
          Press the button and see what we all think of you 💛
        </p>

        <button
          onClick={handleClick}
          className="group relative animate-gentle-bounce rounded-full bg-primary px-10 py-4 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 font-body"
        >
          {showSparkles && <Sparkles />}
          Jaylynn
        </button>

        {isPlaying && (
          <button
            onClick={() => setIsPlaying(false)}
            className="mt-2 text-sm text-muted-foreground underline transition-colors hover:text-foreground font-body"
          >
            🎵 Stop music
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;

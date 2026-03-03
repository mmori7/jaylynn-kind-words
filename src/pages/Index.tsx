import { useState, useCallback, useRef, useEffect } from "react";
import FloatingCompliment from "@/components/FloatingCompliment";
import Sparkles from "@/components/Sparkles";

const compliments = [
  "You are the best ✨",
  "You are so cute 🌸",
  "You are perfect 💫",
  "You are so smart 🧠",
  "You make my heart smile 💖",
  "You are my sunshine 🌞",
  "I love your laugh 😊",
  "You are one of a kind 🦋",
  "You deserve the world 🌍",
  "You light up every room 💡",
  "I'm so lucky to know you 🍀",
  "You are absolutely beautiful 🌹",
  "Your smile is magic ✨",
  "You are loved beyond words 💕",
];

const YOUTUBE_VIDEO_ID = "TS0moaD8gO0";

interface FloatingItem {
  id: number;
  text: string;
  x: number;
  delay: number;
}

const Index = () => {
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const apiReadyRef = useRef(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    if ((window as any).YT) {
      apiReadyRef.current = true;
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => {
      apiReadyRef.current = true;
    };
  }, []);

  const spawnCompliment = useCallback(() => {
    const text = compliments[Math.floor(Math.random() * compliments.length)];
    const item: FloatingItem = {
      id: counterRef.current++,
      text,
      x: 10 + Math.random() * 80,
      delay: 0,
    };
    setFloatingItems((prev) => [...prev, item]);
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((i) => i.id !== item.id));
    }, 4000);
  }, []);

  useEffect(() => {
    if (isActive) {
      spawnCompliment();
      intervalRef.current = setInterval(spawnCompliment, 800);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, spawnCompliment]);

  const startMusic = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      return;
    }
    if (!apiReadyRef.current || !playerContainerRef.current) return;
    playerRef.current = new (window as any).YT.Player(playerContainerRef.current, {
      height: "0",
      width: "0",
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        controls: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => event.target.playVideo(),
      },
    });
  }, []);

  const handleStart = useCallback(() => {
    setIsActive(true);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);
    startMusic();
  }, [startMusic]);

  const handleStop = useCallback(() => {
    setIsActive(false);
    setFloatingItems([]);
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Hidden YouTube player container */}
      <div ref={playerContainerRef} className="absolute h-0 w-0 opacity-0" />

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
          Press the button and see what I think of you 💛
        </p>

        {!isActive ? (
          <button
            onClick={handleStart}
            className="group relative animate-gentle-bounce rounded-full bg-primary px-10 py-4 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 font-body"
          >
            {showSparkles && <Sparkles />}
            Jaylynn
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="rounded-full bg-secondary px-10 py-4 text-xl font-bold text-secondary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 font-body"
          >
            🎵 Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;

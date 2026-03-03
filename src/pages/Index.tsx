import { useState, useCallback, useRef, useEffect } from "react";
import FloatingCompliment from "@/components/FloatingCompliment";
import Sparkles from "@/components/Sparkles";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  "You love matcha 🍵",
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
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const counterRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load the IFrame Player API code asynchronously
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      // Prevent double initialization
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          playsinline: 1,
          controls: 0,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
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

  const handleStart = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.playVideo();
    }
    setIsActive(true);
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);
  }, [isPlayerReady]);

  const handleStop = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.pauseVideo();
    }
    setIsActive(false);
    setFloatingItems([]);
  }, [isPlayerReady]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* YouTube player - Unconditionally mounted but visually hidden when inactive so API is ready */}
      <div
        className={`fixed bottom-4 right-4 z-50 overflow-hidden rounded-full shadow-lg transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ width: 48, height: 48 }}
      >
        <div
          className="pointer-events-none"
          style={{ width: 300, height: 300, marginTop: -126, marginLeft: -126 }}
        >
          <div id="youtube-player" title="Background music"></div>
        </div>
      </div>

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

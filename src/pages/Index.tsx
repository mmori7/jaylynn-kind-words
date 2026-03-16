import { useState, useCallback, useRef, useEffect } from "react";
import "@fontsource/water-brush";
import FloatingCompliment from "@/components/FloatingCompliment";
import FloatingImage from "@/components/FloatingImage";
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

const nailImages = [
  "/nails/1.jpg",
  "/nails/2.png",
  "/nails/3.png",
  "/nails/4.png",
  "/nails/5.png",
];

const YOUTUBE_VIDEO_ID = "TS0moaD8gO0";

interface FloatingItem {
  id: number;
  type: 'compliment' | 'image';
  text?: string;
  imageSrc?: string;
  x: number;
  delay: number;
  rotation?: number;
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
    const isImage = Math.random() > 0.7; // 30% chance to spawn an image

    let item: FloatingItem;

    if (isImage) {
      item = {
        id: counterRef.current++,
        type: 'image',
        imageSrc: nailImages[Math.floor(Math.random() * nailImages.length)],
        x: 10 + Math.random() * 80,
        delay: 0,
        rotation: (Math.random() - 0.5) * 40, // Random rotation between -20 and 20 deg
      };
    } else {
      item = {
        id: counterRef.current++,
        type: 'compliment',
        text: compliments[Math.floor(Math.random() * compliments.length)],
        x: 10 + Math.random() * 80,
        delay: 0,
      };
    }

    setFloatingItems((prev) => [...prev, item]);
    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((i) => i.id !== item.id));
    }, 4500); // Slightly longer for images to finish floating
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
    document.documentElement.classList.add("dark");
    setTimeout(() => setShowSparkles(false), 1500);
  }, [isPlayerReady]);

  const handleStop = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.pauseVideo();
    }
    setIsActive(false);
    setFloatingItems([]);
    document.documentElement.classList.remove("dark");
  }, [isPlayerReady]);

  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-1000 ${isActive ? 'dark-theme' : ''}`}>
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
      <div className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000">
        <div className={`absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors duration-1000 ${isActive ? 'bg-rose-500/20' : 'bg-primary/10'}`} />
        <div className={`absolute -right-20 bottom-20 h-80 w-80 rounded-full blur-3xl transition-colors duration-1000 ${isActive ? 'bg-purple-500/20' : 'bg-secondary/15'}`} />
        <div className={`absolute left-1/3 top-1/4 h-40 w-40 rounded-full blur-2xl transition-colors duration-1000 ${isActive ? 'bg-pink-500/20' : 'bg-accent/10'}`} />
      </div>

      {/* Glowing Hearts Background for Dark Theme */}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => {
            const duration = 10 + Math.random() * 12;
            return (
              <div
                key={i}
                className="absolute text-5xl text-rose-500 opacity-0 animate-float-heart"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  animationDelay: `${i * 1.2}s`,
                  ['--heart-duration' as any]: `${duration}s`,
                  filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.6))',
                }}
              >
                💖
              </div>
            );
          })}
          {Array.from({ length: 10 }).map((_, i) => {
            const duration = 12 + Math.random() * 10;
            return (
              <div
                key={`star-${i}`}
                className="absolute text-3xl text-yellow-300 opacity-0 animate-float-heart"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  animationDelay: `${i * 1.5 + 2}s`,
                  ['--heart-duration' as any]: `${duration}s`,
                  filter: 'drop-shadow(0 0 6px rgba(253, 224, 71, 0.6))',
                }}
              >
                ✨
              </div>
            );
          })}
        </div>
      )}

      {/* Floating compliments and images */}
      {floatingItems.map((item) => (
        item.type === 'compliment' ? (
          <FloatingCompliment
            key={item.id}
            text={item.text!}
            x={item.x}
            delay={item.delay}
          />
        ) : (
          <FloatingImage
            key={item.id}
            src={item.imageSrc!}
            x={item.x}
            delay={item.delay}
            rotation={item.rotation || 0}
          />
        )
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl md:text-6xl">
          Hey Jelly Belly!
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

        <div className="mt-8 text-3xl font-display text-muted-foreground/80 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          - Ronit(dumbie)
        </div>
      </div>
    </div>
  );
};

export default Index;

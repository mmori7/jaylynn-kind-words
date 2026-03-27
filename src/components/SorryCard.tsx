import { useState } from "react";

const sorryMessages = [
  "I'm truly sorry, Jaylynn 💔",
  "I never meant to hurt you 🥺",
  "You mean so much to me 🤍",
  "I hope you can forgive me 🙏",
  "I'll do better, I promise 💫",
];

const SorryCard = ({ onClose }: { onClose: () => void }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const nextMessage = () => {
    setMessageIndex((prev) => (prev + 1) % sorryMessages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Falling teardrops */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-0 animate-float-heart"
            style={{
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.8}s`,
              ['--heart-duration' as any]: `${8 + Math.random() * 6}s`,
            }}
          >
            {i % 3 === 0 ? "🥺" : i % 3 === 1 ? "💧" : "🤍"}
          </div>
        ))}
      </div>

      <div className="relative mx-4 max-w-md w-full rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 p-8 shadow-2xl border border-white/10 text-center">
        <div className="text-6xl mb-6">🥺</div>
        <h2 className="font-display text-3xl text-white mb-4">I'm Sorry</h2>
        <p
          className="text-xl text-white/80 font-body min-h-[3rem] transition-all duration-500"
          key={messageIndex}
          style={{ animation: "fade-in 0.5s ease-out" }}
        >
          {sorryMessages[messageIndex]}
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={nextMessage}
            className="rounded-full bg-white/10 px-6 py-3 text-white font-body hover:bg-white/20 transition-colors"
          >
            Next 💌
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-rose-500/80 px-6 py-3 text-white font-body hover:bg-rose-500 transition-colors"
          >
            I forgive you 🤍
          </button>
        </div>

        <p className="mt-6 text-sm text-white/40 font-body">- Pancake boy 🥞</p>
      </div>
    </div>
  );
};

export default SorryCard;

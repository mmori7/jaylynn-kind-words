const Sparkles = () => {
  const sparkles = Array.from({ length: 6 });

  return (
    <span className="pointer-events-none absolute inset-0">
      {sparkles.map((_, i) => (
        <span
          key={i}
          className="animate-sparkle absolute text-accent"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            fontSize: `${10 + Math.random() * 10}px`,
          }}
        >
          ✦
        </span>
      ))}
    </span>
  );
};

export default Sparkles;

interface FloatingComplimentProps {
  text: string;
  x: number;
  delay: number;
}

const FloatingCompliment = ({ text, x, delay }: FloatingComplimentProps) => {
  return (
    <div
      className="pointer-events-none absolute z-20 whitespace-nowrap rounded-full bg-card/80 px-6 py-3 font-medium text-card-foreground shadow-lg backdrop-blur-sm animate-float-up transition-colors duration-1000 dark:bg-card/40 dark:text-rose-200 dark:shadow-rose-500/20 font-body dark:font-display dark:text-3xl"
      style={{
        left: `${x}%`,
        bottom: "-20px",
        animationDelay: `${delay}ms`,
      }}
    >
      {text}
    </div>
  );
};

export default FloatingCompliment;

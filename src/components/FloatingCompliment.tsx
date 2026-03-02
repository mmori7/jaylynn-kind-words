interface FloatingComplimentProps {
  text: string;
  x: number;
  delay: number;
}

const FloatingCompliment = ({ text, x, delay }: FloatingComplimentProps) => {
  return (
    <div
      className="animate-float-up pointer-events-none absolute bottom-1/3 z-20 rounded-2xl bg-card px-6 py-3 text-lg font-semibold text-foreground shadow-md font-body"
      style={{
        left: `${x}%`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      {text}
    </div>
  );
};

export default FloatingCompliment;

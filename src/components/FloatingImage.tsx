interface FloatingImageProps {
    src: string;
    x: number;
    delay: number;
    rotation: number;
}

const FloatingImage = ({ src, x, delay, rotation }: FloatingImageProps) => {
    return (
        <div
            className="pointer-events-none absolute z-10 animate-float-up transition-colors duration-1000"
            style={{
                left: `${x}%`,
                bottom: "-150px",
                animationDelay: `${delay}ms`,
            }}
        >
            <div
                className="rounded-xl bg-white/10 p-2 shadow-2xl backdrop-blur-md transition-all duration-1000 dark:bg-card/20 dark:shadow-rose-900/40 border border-white/20"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <img
                    src={src}
                    alt="Memory"
                    className="w-32 h-40 object-cover rounded-lg opacity-90 shadow-inner"
                />
            </div>
        </div>
    );
};

export default FloatingImage;

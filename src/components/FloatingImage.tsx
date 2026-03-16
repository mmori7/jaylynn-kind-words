interface FloatingImageProps {
    src: string;
    x: number;
    delay: number;
    rotation: number;
    caption?: string;
}

const FloatingImage = ({ src, x, delay, rotation, caption }: FloatingImageProps) => {
    return (
        <div
            className="pointer-events-none absolute z-10 animate-float-up transition-colors duration-1000"
            style={{
                left: `${x}%`,
                bottom: "-150px",
                animationDelay: `${delay}ms`,
            }}
        >
            {/* Masking Tape Effect */}
            <div 
                className="absolute -top-3 left-1/2 w-10 h-4 -translate-x-1/2 bg-yellow-100/70 border border-yellow-200/30 z-20 shadow-sm"
                style={{ transform: `translateX(-50%) rotate(${(rotation / 4) + 1}deg)` }}
            />
            
            <div
                className="p-2 pb-6 bg-[#fdfdfc] shadow-2xl transition-all duration-1000 border border-white/80 dark:bg-rose-50/95"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <img
                    src={src}
                    alt="Memory"
                    className="w-32 h-40 object-cover opacity-95 shadow-sm"
                />
                {caption && (
                    <p className="mt-2 text-center font-display text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-700">
                        {caption}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FloatingImage;

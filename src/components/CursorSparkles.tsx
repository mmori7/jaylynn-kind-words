import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
    rotation: number;
    vRotation: number;
    type: 'heart' | 'star' | 'dot';
}

const CursorSparkles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, speed: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let particles: Particle[] = [];
        const colors = [
            '#ff4d6d', // Red Rose
            '#ff758f', // Pink Rose
            '#ff85a2', // Light Pink
            '#fec5bb', // Soft Peach
            '#fde047', // Yellow Sparkle
            '#ffffff', // White
            '#e879f9'  // Fuchsia
        ];

        const handleMouseMove = (e: MouseEvent) => {
            const mouse = mouseRef.current;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Speed calculation
            const dx = mouse.x - mouse.lastX;
            const dy = mouse.y - mouse.lastY;
            mouse.speed = Math.sqrt(dx * dx + dy * dy);
            
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;

            // Spawn particles based on speed
            if (mouse.speed > 2) {
                const count = Math.min(Math.floor(mouse.speed / 4) + 1, 6);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const magnitude = Math.random() * 1.5;
                    particles.push({
                        x: mouse.x + (Math.random() - 0.5) * 4,
                        y: mouse.y + (Math.random() - 0.5) * 4,
                        vx: Math.cos(angle) * magnitude,
                        vy: Math.sin(angle) * magnitude - 0.5, // Float up slightly
                        size: 6 + Math.random() * 12,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        alpha: 1,
                        life: 0,
                        maxLife: 20 + Math.random() * 15,
                        rotation: Math.random() * Math.PI,
                        vRotation: (Math.random() - 0.5) * 0.1,
                        type: Math.random() > 0.7 ? 'heart' : Math.random() > 0.4 ? 'star' : 'dot'
                    });
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.03; // Light gravity
                p.vx *= 0.98; // Friction
                p.rotation += p.vRotation;
                p.alpha = 1 - (p.life / p.maxLife);
                p.life++;

                if (p.life >= p.maxLife) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                
                if (p.type === 'heart') {
                    // Draw continuous small filled heart path for performance
                    const size = p.size / 2;
                    ctx.beginPath();
                    ctx.moveTo(0, size / 4);
                    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);
                    ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.75, 0, size);
                    ctx.bezierCurveTo(0, size * 0.75, size / 2, size / 2, size / 2, size / 4);
                    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
                    ctx.fill();
                } else if (p.type === 'star') {
                    // Draw 4-point star for sparkle look
                    const size = p.size / 2;
                    ctx.beginPath();
                    ctx.moveTo(0, -size);
                    ctx.quadraticCurveTo(0, 0, size, 0);
                    ctx.quadraticCurveTo(0, 0, 0, size);
                    ctx.quadraticCurveTo(0, 0, -size, 0);
                    ctx.quadraticCurveTo(0, 0, 0, -size);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
             window.removeEventListener('resize', resize);
             window.removeEventListener('mousemove', handleMouseMove);
             cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-30" // Verify overlays or stays visible
        />
    );
};

export default CursorSparkles;

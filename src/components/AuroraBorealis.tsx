import { useEffect, useRef } from "react";

const AuroraBorealis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fadeIn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Simple 2D noise approximation
    const permutation = Array.from({ length: 512 }, (_, i) => ((i * 131 + 17) * 37) % 256);
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number, y: number) => {
      const h = hash & 3;
      const u = h < 2 ? x : y;
      const v = h < 2 ? y : x;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };
    const noise2D = (x: number, y: number) => {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);
      const aa = permutation[permutation[X] + Y];
      const ab = permutation[permutation[X] + Y + 1];
      const ba = permutation[permutation[X + 1] + Y];
      const bb = permutation[permutation[X + 1] + Y + 1];
      return lerp(
        lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
        lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
        v
      );
    };

    const fbm = (x: number, y: number, octaves: number) => {
      let val = 0, amp = 0.5, freq = 1;
      for (let i = 0; i < octaves; i++) {
        val += amp * noise2D(x * freq, y * freq);
        amp *= 0.5;
        freq *= 2.0;
      }
      return val;
    };

    const bands = [
      { color: [0, 255, 100], speed: 0.12, xScale: 0.8, yOffset: 0.18, width: 0.22, intensity: 1.0 },
      { color: [50, 230, 150], speed: 0.09, xScale: 1.1, yOffset: 0.25, width: 0.18, intensity: 0.7 },
      { color: [100, 200, 255], speed: 0.15, xScale: 0.6, yOffset: 0.15, width: 0.15, intensity: 0.5 },
      { color: [180, 100, 255], speed: 0.07, xScale: 0.9, yOffset: 0.30, width: 0.20, intensity: 0.4 },
      { color: [255, 80, 180], speed: 0.10, xScale: 1.3, yOffset: 0.22, width: 0.12, intensity: 0.3 },
    ];

    const draw = (time: number) => {
      const t = time * 0.001;
      fadeIn.current = Math.min(fadeIn.current + 0.008, 1);
      const globalAlpha = fadeIn.current;

      ctx.clearRect(0, 0, w, h);

      // Draw each aurora band as vertical curtain rays
      const cols = Math.ceil(w / 3);

      for (const band of bands) {
        const { color, speed, xScale, yOffset, width, intensity } = band;

        for (let i = 0; i < cols; i++) {
          const x = (i / cols); // 0..1
          const nx = x * xScale + t * speed;

          // Use noise to create flowing curtain shape
          const n1 = fbm(nx, t * 0.3, 4);
          const n2 = fbm(nx * 2 + 10, t * 0.2 + 5, 3);

          // Curtain center and height vary with noise
          const centerY = (yOffset + n1 * 0.15) * h;
          const bandHeight = (width + n2 * 0.08) * h;
          const alpha = (0.12 + Math.abs(n1) * 0.25) * intensity * globalAlpha;

          if (alpha < 0.01) continue;

          // Draw vertical ray with gradient
          const grd = ctx.createLinearGradient(0, centerY - bandHeight, 0, centerY + bandHeight);
          grd.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},0)`);
          grd.addColorStop(0.3, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.6})`);
          grd.addColorStop(0.5, `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
          grd.addColorStop(0.7, `rgba(${color[0]},${color[1]},${color[2]},${alpha * 0.6})`);
          grd.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);

          ctx.fillStyle = grd;
          ctx.fillRect(i * 3, centerY - bandHeight, 4, bandHeight * 2);
        }
      }

      // Soft glow overlay
      const glowGrd = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.3, w * 0.6);
      glowGrd.addColorStop(0, `rgba(80, 255, 150, ${0.06 * globalAlpha})`);
      glowGrd.addColorStop(0.5, `rgba(50, 200, 120, ${0.03 * globalAlpha})`);
      glowGrd.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrd;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4, opacity: 0.85 }}
    />
  );
};

export default AuroraBorealis;

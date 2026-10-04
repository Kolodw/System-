import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface VoidBackgroundProps {
  themeMode: ThemeMode;
}

export const VoidBackground: React.FC<VoidBackgroundProps> = ({ themeMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isWhite = themeMode === 'white';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system
    const particleCount = isWhite ? 50 : 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (isWhite ? 3.0 : 2.2) + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background base gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        80,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.1
      );

      if (isWhite) {
        // Ethereal white void
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.5, '#f8fafc');
        bgGrad.addColorStop(1, '#e2e8f0');
      } else {
        // Dark Fantasy System Void
        bgGrad.addColorStop(0, '#0d111c');
        bgGrad.addColorStop(0.6, '#080a10');
        bgGrad.addColorStop(1, '#030408');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint grid or coordinates in dark mode, or faint sacred geometry in white mode
      if (!isWhite) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += p.pulseSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.15) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isWhite) {
          ctx.fillStyle = `rgba(100, 116, 139, ${p.alpha * 0.35})`;
        } else {
          ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.65})`;
        }
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWhite]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};

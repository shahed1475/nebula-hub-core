import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetX: number;
  targetY: number;
}

interface AnimatedBackgroundProps {
  mode?: 'particles' | 'waves';
  particleCount?: number;
  colors?: string[];
}

export const AnimatedBackground = ({
  mode = 'particles',
  particleCount = 80,
  colors = ['rgba(138, 43, 226, 0.8)', 'rgba(33, 150, 243, 0.8)', 'rgba(16, 185, 129, 0.8)']
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.3,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height
        });
      }
    };
    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };

    // Draw particles with connections
    const drawParticles = () => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        // Mouse interaction - attract or repel particles
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.1;
          particle.vy += Math.sin(angle) * force * 0.1;
          
          // Increase glow near cursor
          particle.alpha = Math.min(1, particle.alpha + force * 0.3);
        } else {
          particle.alpha = Math.max(0.3, particle.alpha - 0.01);
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add slight drift towards target
        const targetDx = particle.targetX - particle.x;
        const targetDy = particle.targetY - particle.y;
        particle.vx += targetDx * 0.0001;
        particle.vy += targetDy * 0.0001;

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Set new random target occasionally
        if (Math.random() < 0.001) {
          particle.targetX = Math.random() * canvas.width;
          particle.targetY = Math.random() * canvas.height;
        }

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, particle.color.replace('0.8', String(particle.alpha)));
        gradient.addColorStop(1, particle.color.replace('0.8', '0'));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = particle.color.replace('0.8', String((1 - distance / 120) * 0.2));
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

    };

    // Draw waves (alternative mode)
    const drawWaves = () => {
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw multiple wave layers
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yOffset = canvas.height * (0.3 + i * 0.2);
        const amplitude = 30 + i * 20;
        const frequency = 0.01 - i * 0.002;

        for (let x = 0; x <= canvas.width; x += 5) {
          const mouseInfluence = Math.max(0, 1 - Math.abs(x - mouseRef.current.x) / 300);
          const y = yOffset + 
                    Math.sin(x * frequency + time + i) * amplitude +
                    Math.sin(x * frequency * 2 + time * 1.5) * (amplitude * 0.5) +
                    mouseInfluence * 30;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude);
        gradient.addColorStop(0, colors[i].replace('0.8', '0.1'));
        gradient.addColorStop(1, colors[i].replace('0.8', '0.05'));
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      if (mode === 'particles') {
        drawParticles();
      } else {
        drawWaves();
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      resizeCanvas();
      if (mode === 'particles') initParticles();
    });

    // Handle scroll - update canvas height
    const handleScroll = () => {
      if (canvas.height !== document.documentElement.scrollHeight) {
        resizeCanvas();
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mode, particleCount, colors, resolvedTheme]);

  const isDark = resolvedTheme === 'dark';

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none transition-colors duration-500"
      style={{
        zIndex: 0,
        background: isDark
          ? 'linear-gradient(135deg, hsl(230, 90%, 10%), hsl(270, 80%, 15%), hsl(0, 0%, 5%))'
          : 'linear-gradient(135deg, hsl(220, 20%, 96%), hsl(240, 15%, 97%), hsl(210, 20%, 98%))'
      }}
    />
  );
};

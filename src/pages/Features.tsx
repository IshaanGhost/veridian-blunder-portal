import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface TileState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  iconX: number;
  iconY: number;
  iconVx: number;
  iconVy: number;
}

const Features = () => {
  const [features] = useState([
    {
      title: "Automatic Coffee Temperature Regulation",
      description: "Monitors ambient office temperature and adjusts your coffee to be exactly 0.5°C too hot or too cold for optimal discomfort.",
      icon: "☕",
      stat: "2,847",
      unit: "Complaints Logged"
    },
    {
      title: "AI-Powered Meeting Scheduler",
      description: "Uses machine learning to schedule all your meetings during lunch breaks and end-of-day hours exclusively.",
      icon: "📅",
      stat: "156%",
      unit: "Overtime Increase"
    },
    {
      title: "Smart Email Predictor",
      description: "Intelligently delays important emails by exactly 30 minutes after the deadline while prioritizing spam.",
      icon: "📧",
      stat: "98.7%",
      unit: "Missed Deadlines"
    },
    {
      title: "Ergonomic Chair Randomizer",
      description: "Automatically adjusts your chair height to a random setting every 15 minutes for 'improved posture awareness'.",
      icon: "🪑",
      stat: "2,341",
      unit: "Chiropractor Visits"
    },
    {
      title: "Breakthrough Printer Detection System",
      description: "Senses when you're in a hurry and triggers a critical low toner warning or mysterious paper jam.",
      icon: "🖨️",
      stat: "99.2%",
      unit: "Urgent Documents Delayed"
    },
    {
      title: "Revolutionary Password Manager",
      description: "Enforces password changes every 3 days with increasingly complex requirements that must not resemble previous 847 passwords.",
      icon: "🔐",
      stat: "4,892",
      unit: "Reset Requests Daily"
    }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tileStates, setTileStates] = useState<TileState[]>(
    features.map(() => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      iconX: 0,
      iconY: 0,
      iconVx: (Math.random() - 0.5) * 2,
      iconVy: (Math.random() - 0.5) * 2,
    }))
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize tile positions
  useEffect(() => {
    if (containerRef.current && tileRefs.current[0]) {
      const container = containerRef.current;
      const cols = 3;
      const gap = 24;
      const padding = 0;
      
      setTileStates((prevStates) => {
        return prevStates.map((state, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const tile = tileRefs.current[index];
          if (!tile) return state;
          
          const tileWidth = container.offsetWidth / cols - gap * (cols - 1) / cols;
          const tileHeight = 250; // Approximate height
          
          return {
            ...state,
            x: col * (tileWidth + gap) + padding,
            y: row * (tileHeight + gap) + padding,
          };
        });
      });
    }
  }, []);

  // Physics simulation
  useEffect(() => {
    const animate = () => {
      setTileStates((prevStates) => {
        const newStates = prevStates.map((state, index) => {
          const tile = tileRefs.current[index];
          if (!tile || !containerRef.current) return state;

          const tileRect = tile.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const tileWidth = tileRect.width;
          const tileHeight = tileRect.height;
          
          let { x, y, vx, vy, iconX, iconY, iconVx, iconVy } = state;

          // Icon floating and cursor reaction
          const iconElement = tile.querySelector('[data-icon]') as HTMLElement;
          if (iconElement) {
            const iconRect = iconElement.getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;
            
            // Attract icons to cursor but with repulsion when too close
            const dx = mousePos.x - iconCenterX;
            const dy = mousePos.y - iconCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 200) {
              const force = distance < 50 ? -0.3 : 0.2; // Repel when close, attract when far
              iconVx += (dx / distance) * force * 0.05;
              iconVy += (dy / distance) * force * 0.05;
            }

            // Floating animation
            iconVx += (Math.random() - 0.5) * 0.02;
            iconVy += (Math.random() - 0.5) * 0.02;
            
            // Damping
            iconVx *= 0.95;
            iconVy *= 0.95;
            
            iconX += iconVx;
            iconY += iconVy;
            
            // Limit icon movement
            iconX = Math.max(-20, Math.min(20, iconX));
            iconY = Math.max(-20, Math.min(20, iconY));
          }

          // Tile bouncing physics
          vx *= 0.98; // Friction
          vy *= 0.98;
          
          x += vx;
          y += vy;

          // Boundary collision for tiles
          if (x < 0 || x + tileWidth > containerRect.width) {
            vx *= -0.8;
            x = Math.max(0, Math.min(containerRect.width - tileWidth, x));
          }
          if (y < 0 || y + tileHeight > containerRect.height) {
            vy *= -0.8;
            y = Math.max(0, Math.min(containerRect.height - tileHeight, y));
          }

          return { x, y, vx, vy, iconX, iconY, iconVx, iconVy };
        });

        // Collision detection between tiles
        for (let i = 0; i < newStates.length; i++) {
          for (let j = i + 1; j < newStates.length; j++) {
            const tile1 = tileRefs.current[i];
            const tile2 = tileRefs.current[j];
            if (!tile1 || !tile2) continue;

            const rect1 = tile1.getBoundingClientRect();
            const rect2 = tile2.getBoundingClientRect();
            const width1 = rect1.width;
            const height1 = rect1.height;
            const width2 = rect2.width;
            const height2 = rect2.height;

            const x1 = newStates[i].x + width1 / 2;
            const y1 = newStates[i].y + height1 / 2;
            const x2 = newStates[j].x + width2 / 2;
            const y2 = newStates[j].y + height2 / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = Math.max(width1, width2) * 0.6; // Use smaller threshold for easier collisions

            if (distance < minDistance && distance > 0) {
              // Collision response
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate velocities
              const vx1 = newStates[i].vx * cos + newStates[i].vy * sin;
              const vy1 = newStates[i].vy * cos - newStates[i].vx * sin;
              const vx2 = newStates[j].vx * cos + newStates[j].vy * sin;
              const vy2 = newStates[j].vy * cos - newStates[j].vx * sin;

              // Swap velocities (elastic collision)
              const tempVx = vx1;
              const newVx1 = vx2 * 0.9;
              const newVx2 = tempVx * 0.9;

              // Rotate back
              newStates[i].vx = newVx1 * cos - vy1 * sin;
              newStates[i].vy = vy1 * cos + newVx1 * sin;
              newStates[j].vx = newVx2 * cos - vy2 * sin;
              newStates[j].vy = vy2 * cos + newVx2 * sin;

              // Separate tiles
              const overlap = minDistance - distance;
              const separationX = cos * overlap * 0.6;
              const separationY = sin * overlap * 0.6;
              
              newStates[i].x -= separationX;
              newStates[i].y -= separationY;
              newStates[j].x += separationX;
              newStates[j].y += separationY;
            }
          }
        }

        return newStates;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos, features.length]);

  return (
    <div className="min-h-screen bg-corporate-dark text-foreground">
      {/* Header */}
      <header className="border-b border-corporate-border bg-corporate-darker">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-corporate-blue" />
              <h1 className="text-xl font-bold">Veridian Dynamics</h1>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="text-corporate-gray transition-colors hover:text-foreground">
                Home
              </Link>
              <Link to="/features" className="text-foreground font-semibold">
                Features
              </Link>
              <Link to="/forms" className="text-corporate-gray transition-colors hover:text-foreground">
                Forms
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Revolutionary Features</h2>
            <p className="text-lg text-corporate-gray">
              Cutting-edge workplace productivity solutions that definitely won't make you question your life choices
            </p>
          </div>

          {/* Features Grid */}
          <div 
            ref={containerRef}
            className="mb-12 relative"
            style={{ minHeight: '600px' }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => { tileRefs.current[index] = el; }}
                className="absolute rounded-lg border border-corporate-border bg-card p-6 transition-all hover:border-corporate-blue"
                style={{
                  left: `${tileStates[index]?.x || 0}px`,
                  top: `${tileStates[index]?.y || 0}px`,
                  width: 'calc((100% - 48px) / 3)',
                  maxWidth: '350px',
                  transform: `translate(0, 0)`,
                  willChange: 'transform',
                }}
              >
                <div 
                  data-icon
                  className="mb-4 text-4xl relative"
                  style={{
                    transform: `translate(${tileStates[index]?.iconX || 0}px, ${tileStates[index]?.iconY || 0}px)`,
                    transition: 'transform 0.1s ease-out',
                    display: 'inline-block',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="mb-4 text-sm text-corporate-gray">{feature.description}</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-corporate-blue">{feature.stat}</span>
                  <span className="text-xs text-corporate-gray">{feature.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Coming Soon™</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">Keyboard Keys That Randomly Stick</span>
                  <span className="text-xs text-corporate-gray">Q2 2019</span>
                </div>
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">Mouse Cursor Slight Lag Feature</span>
                  <span className="text-xs text-corporate-gray">Q3 2018</span>
                </div>
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">Mandatory Fun Algorithm</span>
                  <span className="text-xs text-corporate-gray">Q4 2017</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adaptive Timezone Confusion</span>
                  <span className="text-xs text-corporate-gray">Soon™</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Premium Guarantees*</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">99.9% Downtime During Critical Hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Security Questions You'll Never Remember</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">24/7 Hold Music Experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Data Storage Until First Disaster</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Deployment Across Servers We Found</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-corporate-gray italic">*Terms subject to creative interpretation</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-corporate-border bg-corporate-darker py-8">
        <div className="container mx-auto px-6 text-center text-sm text-corporate-gray">
          <p>© 2025 Veridian Dynamics. All rights reserved.</p>
          <p className="mt-2">Compliance Portal v2.7.3 | Status: Operational</p>
        </div>
      </footer>
    </div>
  );
};

export default Features;


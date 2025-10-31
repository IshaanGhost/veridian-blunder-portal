import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"login" | "dashboard">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [error, setError] = useState("");
  const [showPityModal, setShowPityModal] = useState(false);
  const [showHomeModal, setShowHomeModal] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [imageOffset, setImageOffset] = useState(0);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Feature states
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [showKonamiCelebration, setShowKonamiCelebration] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorEmoji, setCursorEmoji] = useState("🔒");
  const [showKeyboardRecalibration, setShowKeyboardRecalibration] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved !== null ? saved === "true" : true; // Default ON
  });
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? parseFloat(saved) : 0.5;
  });
  const [clickCount, setClickCount] = useState(() => {
    const saved = localStorage.getItem("clickCount");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastAchievement, setLastAchievement] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Refs
  const volumeSliderRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Regenerate data on component mount and whenever dashboard is shown
  useEffect(() => {
    // Always set refresh key on mount to ensure randomization
    setRefreshKey(Date.now());
    
    // Also regenerate when page becomes visible (e.g., after tab switch or refresh)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && stage === "dashboard") {
        setRefreshKey(Date.now());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [stage]);

  useEffect(() => {
    // Also regenerate when switching to dashboard
    if (stage === "dashboard") {
      setRefreshKey(Date.now());
    }
  }, [stage]);

  // Generate random dashboard data
  const generateRandomStats = () => {
    const statTemplates = [
      { label: "Active Sessions", value: () => Math.floor(Math.random() * 900 + 100), suffix: "", trend: () => `${Math.random() > 0.5 ? "↑" : "↓"} ${Math.floor(Math.random() * 20)}% from last week` },
      { label: "Pending Reviews", value: () => Math.floor(Math.random() * 2000 + 500), suffix: "", trend: () => `${Math.random() > 0.5 ? "↑" : "↓"} ${Math.floor(Math.random() * 15)}% from last week` },
      { label: "Compliance Score", value: () => (Math.random() * 10 + 90).toFixed(1), suffix: "%", trend: () => Math.random() > 0.5 ? "Above target threshold" : "Below target threshold" },
      { label: "System Uptime", value: () => (Math.random() * 0.5 + 99.5).toFixed(1), suffix: "%", trend: () => "Last 30 days" },
      { label: "Data Processing", value: () => Math.floor(Math.random() * 50000 + 10000), suffix: " units", trend: () => `${Math.random() > 0.5 ? "↑" : "↓"} ${Math.floor(Math.random() * 25)}% trend` },
      { label: "Alert Count", value: () => Math.floor(Math.random() * 200 + 50), suffix: "", trend: () => `${Math.random() > 0.5 ? "↑" : "↓"} ${Math.floor(Math.random() * 30)}% this week` },
      { label: "Audit Completion", value: () => (Math.random() * 20 + 80).toFixed(1), suffix: "%", trend: () => `${Math.floor(Math.random() * 100)} audits completed` },
      { label: "Response Time", value: () => (Math.random() * 500 + 100).toFixed(0), suffix: "ms", trend: () => `Average latency` }
    ];

    // Shuffle and take 4 random stats
    const shuffled = [...statTemplates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map(template => ({
      label: template.label,
      value: template.value(),
      suffix: template.suffix,
      trend: template.trend()
    }));
  };

  const generateRandomActivity = () => {
    const activities = [
      { name: "Document Processing", value: Math.floor(Math.random() * 100) },
      { name: "Compliance Checks", value: Math.floor(Math.random() * 100) },
      { name: "Security Audits", value: Math.floor(Math.random() * 100) },
      { name: "Report Generation", value: Math.floor(Math.random() * 100) },
      { name: "Data Validation", value: Math.floor(Math.random() * 100) },
      { name: "Risk Assessments", value: Math.floor(Math.random() * 100) }
    ];
    return activities.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const generateRandomFeed = () => {
    const feedItems = [
      "User session initiated - Compliance Module 7B",
      "Automated compliance check completed",
      "Report export requested - Format: PDF",
      "Security audit scheduled for 14:00 UTC",
      "Database backup completed successfully",
      "Risk assessment review in progress",
      "Document approval workflow initiated",
      "Compliance violation detected - Action required",
      "System update deployed successfully",
      "New compliance policy published",
      "Audit trail export completed",
      "Performance metrics updated"
    ];
    
    const times = ["2 minutes ago", "15 minutes ago", "32 minutes ago", "1 hour ago", "2 hours ago", "3 hours ago", "5 hours ago"];
    
    return feedItems.sort(() => Math.random() - 0.5).slice(0, 5).map((item, i) => ({
      text: item,
      time: times.sort(() => Math.random() - 0.5)[i] || times[0]
    }));
  };

  const generateRandomDepartments = () => {
    const depts = [
      { name: "Legal Compliance", code: "LC", base: 2341 },
      { name: "Risk Assessment", code: "RA", base: 1892 },
      { name: "Quality Assurance", code: "QA", base: 1567 },
      { name: "Internal Audit", code: "IA", base: 1234 },
      { name: "Security Operations", code: "SO", base: 2100 },
      { name: "Data Governance", code: "DG", base: 1789 }
    ];
    
    return depts.map(dept => ({
      name: dept.name,
      code: `${dept.code}-${Math.floor(Math.random() * 9999)}`,
      value: Math.floor(dept.base * (0.8 + Math.random() * 0.4))
    })).sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const generateRandomMetrics = () => {
    return [
      { label: "Regulatory Adherence", value: (Math.random() * 5 + 95).toFixed(1), suffix: "%", note: "ISO 27001 Compliant" },
      { label: "Data Integrity Index", value: (Math.random() * 3 + 97).toFixed(1), suffix: "%", note: "Verified Accuracy Rate" },
      { label: "Audit Trail Coverage", value: "100", suffix: "%", note: "All Transactions Logged" },
      { label: "System Reliability", value: (Math.random() * 2 + 98).toFixed(1), suffix: "%", note: "Uptime Performance" }
    ].sort(() => Math.random() - 0.5).slice(0, 3);
  };

  // Generate random data when dashboard is shown - refreshKey ensures new data on each load
  // We force regeneration by using refreshKey as dependency
  const dashboardStats = useMemo(() => {
    if (stage === "dashboard") {
      return generateRandomStats();
    }
    return [];
  }, [stage, refreshKey]);
  
  const activityData = useMemo(() => {
    if (stage === "dashboard") {
      return generateRandomActivity();
    }
    return [];
  }, [stage, refreshKey]);
  
  const activityFeed = useMemo(() => {
    if (stage === "dashboard") {
      return generateRandomFeed();
    }
    return [];
  }, [stage, refreshKey]);
  
  const departments = useMemo(() => {
    if (stage === "dashboard") {
      return generateRandomDepartments();
    }
    return [];
  }, [stage, refreshKey]);
  
  const metrics = useMemo(() => {
    if (stage === "dashboard") {
      return generateRandomMetrics();
    }
    return [];
  }, [stage, refreshKey]);

  // Backspace trap
  useEffect(() => {
    const handleBackspace = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === "Backspace" && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        e.preventDefault();
        window.history.back();
      }
    };
    window.addEventListener("keydown", handleBackspace);
    return () => window.removeEventListener("keydown", handleBackspace);
  }, []);

  // Jumpy image on scroll
  useEffect(() => {
    let direction = 1;
    const handleScroll = () => {
      direction *= -1;
      setImageOffset(direction * 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleMouseMove = (e: React.MouseEvent) => {
    if (stage !== "login" || !buttonRef.current) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    );
    
    if (distance < 100) {
      const angle = Math.atan2(mouseY - buttonCenterY, mouseX - buttonCenterX);
      const jumpDistance = 50;
      setButtonOffset({
        x: -Math.cos(angle) * jumpDistance,
        y: -Math.sin(angle) * jumpDistance,
      });
    }
  };

  const handleLogin = () => {
    if (username === "username" && password === "password") {
      setStage("dashboard");
      setError("");
      setFailCount(0);
    } else {
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      setError("Authentication Result: Invalid Credentials");
      
      if (newFailCount >= 3) {
        setShowPityModal(true);
      }
    }
  };

  // Auto-login to dashboard after showing pity modal
  useEffect(() => {
    if (showPityModal) {
      const timer = setTimeout(() => {
    setShowPityModal(false);
    setStage("dashboard");
    setFailCount(0);
    setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPityModal]);

  // Reset to login when navigating away from home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setStage("login");
    }
  }, [location.pathname]);

  // 1. Konami Code Detection
  useEffect(() => {
    if (stage !== "dashboard") return;

    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
    
    const handleKeyPress = (e: KeyboardEvent) => {
      setKonamiSequence((prev) => {
        const newSeq = [...prev, e.code];
        if (newSeq.length > konamiCode.length) {
          newSeq.shift();
        }
        
        if (newSeq.length === konamiCode.length && 
            newSeq.every((key, idx) => key === konamiCode[idx])) {
          setShowKonamiCelebration(true);
          return [];
        }
        return newSeq;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [stage]);

  // 2. Cursor Emoji Follower
  useEffect(() => {
    if (stage !== "dashboard") return;

    const emojis = ["🔒", "📊", "☕"];
    let emojiIndex = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const rotateEmoji = () => {
      setCursorEmoji(emojis[emojiIndex]);
      emojiIndex = (emojiIndex + 1) % emojis.length;
    };

    window.addEventListener("mousemove", handleMouseMove);
    const emojiInterval = setInterval(rotateEmoji, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(emojiInterval);
    };
  }, [stage]);

  // 3. Keyboard Recalibration Modal (random trigger)
  useEffect(() => {
    if (stage !== "dashboard") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (Math.random() < 0.01) { // 1% chance
          setShowKeyboardRecalibration(true);
          setPressedKeys(new Set());
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [stage]);

  // Track A-Z keys for recalibration
  useEffect(() => {
    if (!showKeyboardRecalibration || stage !== "dashboard") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key >= "A" && key <= "Z") {
        setPressedKeys((prev) => {
          const newSet = new Set([...prev, key]);
          if (newSet.size === 26) {
            // All 26 letters pressed
            setTimeout(() => {
              setShowKeyboardRecalibration(false);
              setPressedKeys(new Set());
            }, 500);
          }
          return newSet;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showKeyboardRecalibration, stage]);

  // 4. Keyboard Sound Effects
  useEffect(() => {
    if (stage !== "dashboard" || !soundEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const playSound = () => {
      if (!audioContextRef.current || !soundEnabled) return;
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = "square";
      oscillator.frequency.value = 200 + Math.random() * 400;
      gainNode.gain.value = volume * 0.1;
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        playSound();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [stage, soundEnabled, volume]);

  // Save sound settings
  useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled));
    localStorage.setItem("volume", String(volume));
  }, [soundEnabled, volume]);

  // 5. Click Counter with Achievement Badges
  useEffect(() => {
    if (stage !== "dashboard") return;

    const handleClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("clickCount", String(newCount));
        
        // Achievement milestones
        const milestones = [100, 500, 1000, 2500, 5000, 10000];
        const achieved = milestones.find((m) => newCount >= m && prev < m);
        
        if (achieved) {
          setLastAchievement(achieved);
          setTimeout(() => setLastAchievement(null), 3000);
        }
        
        return newCount;
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [stage]);

  // 6. Dark Mode (invert + rotate)
  useEffect(() => {
    if (stage !== "dashboard") return;

    const mainContent = document.querySelector("main");
    if (mainContent) {
      if (darkMode) {
        mainContent.style.filter = "invert(1) rotate(180deg)";
        mainContent.style.transition = "filter 0.3s ease";
      } else {
        mainContent.style.filter = "none";
      }
    }

    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode, stage]);

  // 7. Fake System Notifications
  useEffect(() => {
    if (stage !== "dashboard") return;

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission === "granted");
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      setNotificationPermission(true);
    }

    // Random fake countdown notification
    const showCountdown = () => {
      if (Math.random() < 0.3) { // 30% chance
        const notificationEl = document.getElementById("countdown-notification");
        const textEl = document.getElementById("countdown-text");
        if (!notificationEl || !textEl) return;

        let count = 3;
        notificationEl.classList.remove("hidden");
        
        const countdown = setInterval(() => {
          if (count > 0) {
            textEl.textContent = `Your session will expire in ${count}...`;
          } else {
            textEl.textContent = "... (just kidding!)";
            setTimeout(() => {
              notificationEl.classList.add("hidden");
            }, 2000);
            clearInterval(countdown);
          }
          count--;
        }, 1000);
      }
    };

    // Absurd browser notifications
    const showAbsurdNotification = () => {
      if (notificationPermission && Math.random() < 0.2) { // 20% chance
        const messages = [
          "Critical: Your coffee cup alignment needs adjustment",
          "Warning: Your mouse cursor is 0.3mm off-center",
          "Alert: Your chair height is not optimal for compliance",
          "Important: Your keyboard is 2 degrees off-grid",
          "Urgent: Please realign your monitor for optimal compliance viewing"
        ];
        
        new Notification("Veridian Dynamics Compliance Alert", {
          body: messages[Math.floor(Math.random() * messages.length)],
          icon: "/favicon.svg"
        });
      }
    };

    const countdownInterval = setInterval(showCountdown, 30000); // Every 30 seconds
    const notificationInterval = setInterval(showAbsurdNotification, 45000); // Every 45 seconds

    return () => {
      clearInterval(countdownInterval);
      clearInterval(notificationInterval);
    };
  }, [stage, notificationPermission]);


  return (
    <div 
      className="min-h-screen bg-corporate-dark text-foreground"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <header className="border-b border-corporate-border bg-corporate-darker">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-corporate-blue" />
              <h1 className="text-xl font-bold">Veridian Dynamics</h1>
            </div>
            {stage === "dashboard" ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <nav style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto auto auto',
                  gap: '24px',
                  alignItems: 'center'
                }}>
                <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setStage("dashboard");
                      setShowHomeModal(true);
                    }}
                    className="text-foreground font-semibold cursor-pointer bg-transparent border-none outline-none"
                    style={{ gridColumn: '1', gridRow: '1' }}
                  >
                    Home
                  </button>
                  <Link 
                    to="/features" 
                    className="text-corporate-gray transition-colors hover:text-foreground"
                    style={{ gridColumn: '2', gridRow: '1' }}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/forms" 
                  className="text-corporate-gray transition-colors hover:text-foreground"
                    style={{ gridColumn: '3', gridRow: '1' }}
                  >
                    Forms
                  </Link>
                </nav>
                
                {/* Dark Mode Toggle */}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-corporate-gray hover:text-foreground transition-colors bg-transparent border-none outline-none cursor-pointer text-sm"
                  title={darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
                >
                  {darkMode ? "🔆" : "🌙"}
                </button>

                {/* Sound Toggle & Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-corporate-gray hover:text-foreground transition-colors bg-transparent border-none outline-none cursor-pointer text-sm"
                    title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
                  >
                    {soundEnabled ? "🔊" : "🔇"}
                </button>
                  {soundEnabled && (
                    <div
                      onMouseEnter={(e) => {
                        // Slider moves away from cursor
                        if (volumeSliderRef.current) {
                          const slider = volumeSliderRef.current;
                          const rect = slider.getBoundingClientRect();
                          const randomX = (Math.random() - 0.5) * 100;
                          const randomY = (Math.random() - 0.5) * 100;
                          slider.style.transform = `translate(${randomX}px, ${randomY}px)`;
                          slider.style.transition = 'transform 0.1s ease';
                        }
                      }}
                      style={{ position: 'relative' }}
                    >
                      <input
                        ref={volumeSliderRef}
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={1 - volume}
                        onChange={(e) => {
                          // Reversed: left = louder, right = quieter
                          setVolume(1 - parseFloat(e.target.value));
                          // Random reset chance
                          if (Math.random() < 0.3) {
                            setTimeout(() => setVolume(0.5), 100);
                          }
                        }}
                        style={{
                          width: '60px',
                          height: '4px',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          background: 'linear-gradient(to right, #333 0%, #555 100%)',
                          outline: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transform: 'rotate(180deg)',
                          borderRadius: '2px'
                        }}
                        title="Volume (inconvenient slider)"
                      />
                    </div>
                  )}
                </div>

                {/* Click Counter Display */}
                <div className="text-xs text-corporate-gray">
                  Clicks: {clickCount}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {stage === "dashboard" ? (
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="mb-2 text-4xl font-bold">Network Diagnostics</h2>
              <p className="text-corporate-gray">System connection information</p>
            </div>
            
            {/* IP Display */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-corporate-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-corporate-blue">Device IP Address</h3>
                <p className="text-4xl font-mono font-bold mb-2">127.0.0.1</p>
                <p className="text-sm text-corporate-gray">Local loopback interface</p>
              </div>
              <div className="rounded-lg border border-corporate-border bg-card p-8">
                <h3 className="mb-4 text-xl font-semibold text-corporate-blue">Network IP Address</h3>
                <p className="text-4xl font-mono font-bold mb-2">192.168.0.1</p>
                <p className="text-sm text-corporate-gray">Default gateway address</p>
              </div>
            </div>
            
            {/* Stats Grid - Randomized */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="rounded-lg border border-corporate-border bg-card p-6">
                  <h3 className="mb-2 text-sm font-medium text-corporate-gray">{stat.label}</h3>
                  <p className="text-4xl font-bold text-corporate-blue">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                  </p>
                  <p className="mt-2 text-xs text-corporate-gray">{stat.trend}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Activity Overview</h3>
                <div className="space-y-4">
                  {activityData.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-corporate-gray">{activity.name}</span>
                      <div className="flex-1 mx-4 h-2 bg-corporate-darker rounded-full overflow-hidden">
                        <div className="h-full bg-corporate-blue" style={{ width: `${activity.value}%` }} />
                      </div>
                      <span className="text-sm font-medium">{activity.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Recent Activity Feed</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activityFeed.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 ${index < activityFeed.length - 1 ? "pb-3 border-b border-corporate-border" : ""}`}
                    >
                      <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-corporate-gray mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Tables */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Top Departments by Activity</h3>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded bg-corporate-darker">
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-xs text-corporate-gray">Dept. Code: {dept.code}</p>
                      </div>
                      <span className="text-corporate-blue font-semibold">{dept.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">System Status Indicators</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Primary Database</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Authentication Server</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Backup System</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Maintenance Mode</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">API Gateway</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Compliance Engine</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm">Reporting Module</span>
                    </div>
                    <span className="text-xs text-corporate-gray">Operational</span>
                  </div>
                </div>
              </div>
              </div>

            {/* Additional Info Section */}
              <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Compliance Metrics Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="p-4 rounded bg-corporate-darker">
                    <p className="text-sm text-corporate-gray mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}{metric.suffix}</p>
                    <p className="text-xs text-corporate-gray mt-1">{metric.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <div 
                className="mx-auto mb-4 h-24 w-24 rounded-lg bg-corporate-blue transition-transform"
                style={{ transform: `translateX(${imageOffset}px)` }}
              />
              <h2 className="mb-2 text-2xl font-bold">Compliance Portal</h2>
              <p className="text-corporate-gray">Secure Access Authentication</p>
            </div>

            <div className="rounded-lg border border-corporate-border bg-card p-8">
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                      Enter username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="username"
                    />
                  </div>
              
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                      Enter password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="password"
                    />
                  </div>

                  <button
                ref={buttonRef}
                onClick={handleLogin}
                className="w-full rounded-md bg-corporate-blue px-4 py-2 font-medium text-corporate-dark transition-all hover:bg-corporate-blue-hover"
                style={{
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                  transition: "transform 0.2s ease-out",
                }}
                  >
                    Login
                  </button>

              {error && (
                <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Pity Modal */}
      {showPityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="mx-4 w-full max-w-md rounded-lg border-2 border-yellow-500 bg-card p-8 shadow-2xl">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20">
                <span className="text-3xl">😬</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-yellow-500">Oops! You're Having Trouble</h3>
              <p className="mb-1 text-sm font-semibold text-corporate-gray">
                After 3 failed login attempts, we're just going to...
              </p>
            </div>
            <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
              <p className="text-center text-sm leading-relaxed text-foreground">
                We noticed you're struggling with the login. Don't worry! Everyone makes mistakes. 
                Your password is literally "password" and you still couldn't get it right? 
                <span className="block mt-2 font-semibold">No judgment here!</span>
                We're automatically logging you in because honestly, you've tried hard enough. 
                Welcome to the dashboard! 🎉
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-corporate-gray">
                Auto-logging you in... Please wait a moment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Home Definition Modal - Funny Definition */}
      {showHomeModal && (
        <Dialog 
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setShowHomeModal(false);
            }
          }}
        >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">What is "Home"? 🏠</DialogTitle>
            <DialogDescription>
              A Philosophical Investigation Into The Nature Of "Home"
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-corporate-border bg-corporate-darker p-6">
              <h3 className="mb-3 text-lg font-semibold text-corporate-blue">Dictionary Definition:</h3>
              <p className="text-sm text-corporate-gray mb-4 italic">
                "Home: A place where one lives; a residence. Also, the dashboard page of this portal."
              </p>
              
              <h3 className="mb-3 text-lg font-semibold text-corporate-blue">Our Definition:</h3>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Home</span> is where the dashboard is. It's that magical place 
                where you were before you clicked "Features" or "Forms", and it's where you are now because you 
                clicked "Home" - creating a beautiful philosophical paradox: you're already home, but you clicked 
                home to come home to where you already were. 
              </p>
              
              <p className="text-sm leading-relaxed mt-3">
                Think of it like Schrödinger's Dashboard: you're both here and not here until you observe the 
                modal confirming that yes, indeed, this is Home. The button works like a compass that always 
                points... well, here. Welcome Home! 🎉
              </p>
              
              <div className="mt-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
                <p className="text-xs text-yellow-500/90">
                  💡 <strong>Fun Fact:</strong> In web development, "Home" is typically the root route ("/"), 
                  but in this portal, Home is wherever your dashboard dreams take you. Mostly here, though.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
        </Dialog>
      )}

      {/* Cursor Emoji Follower */}
      {stage === "dashboard" && (
        <div
          style={{
            position: 'fixed',
            left: cursorPos.x + 15,
            top: cursorPos.y + 15,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: '20px',
            transition: 'transform 0.1s ease-out',
            transform: 'translate(0, 0)'
          }}
        >
          {cursorEmoji}
        </div>
      )}

      {/* Konami Code Celebration Modal */}
      {showKonamiCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
          <div className="mx-4 w-full max-w-2xl rounded-lg border-4 border-yellow-500 bg-card p-12 shadow-2xl text-center">
            <div className="mb-6">
              <div className="text-8xl mb-4">🎉🎉🎉</div>
              <h2 className="text-5xl font-bold text-yellow-500 mb-4">Compliance Achieved: 1000%!</h2>
              <p className="text-2xl text-foreground mb-2">You've unlocked the secret code!</p>
              <p className="text-lg text-corporate-gray">Maximum compliance levels activated</p>
            </div>
            <button
              onClick={() => setShowKonamiCelebration(false)}
              className="mt-6 rounded-md bg-corporate-blue px-8 py-3 font-medium text-corporate-dark transition-colors hover:bg-corporate-blue-hover"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Recalibration Modal */}
      {showKeyboardRecalibration && (
        <Dialog open={true} onOpenChange={(open) => !open && setShowKeyboardRecalibration(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Keyboard Recalibration Required</DialogTitle>
              <DialogDescription>
                Your keyboard needs to be recalibrated — please press all keys in alphabetical order
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-corporate-gray mb-2">
                  <span>Progress: {pressedKeys.size} / 26 letters</span>
                  <span>{Math.round((pressedKeys.size / 26) * 100)}%</span>
                </div>
                <div className="w-full bg-corporate-darker rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-corporate-blue h-full transition-all duration-300"
                    style={{ width: `${(pressedKeys.size / 26) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(13, 1fr)' }}>
                {Array.from({ length: 26 }, (_, i) => {
                  const letter = String.fromCharCode(65 + i);
                  const pressed = pressedKeys.has(letter);
                  return (
                    <div
                      key={letter}
                      className={`text-xs p-1 text-center rounded ${
                        pressed
                          ? "bg-green-500/30 text-green-500"
                          : "bg-corporate-darker text-corporate-gray"
                      }`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  setShowKeyboardRecalibration(false);
                  setPressedKeys(new Set());
                }}
                className="w-full rounded-md bg-corporate-blue px-4 py-2 font-medium text-corporate-dark transition-colors hover:bg-corporate-blue-hover"
              >
                Cancel
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Achievement Badge Notification */}
      {lastAchievement !== null && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right">
          <div className="rounded-lg border-2 border-yellow-500 bg-yellow-500/10 p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="font-bold text-yellow-500">Achievement Unlocked!</p>
                <p className="text-sm text-foreground">
                  You clicked {lastAchievement} times! Compliance through persistence!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fake Countdown Notification */}
      {stage === "dashboard" && (
        <div id="countdown-notification" className="fixed bottom-6 left-6 z-50 hidden">
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 shadow-lg">
            <p className="text-sm text-red-500 font-semibold" id="countdown-text"></p>
          </div>
        </div>
      )}

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

export default Index;

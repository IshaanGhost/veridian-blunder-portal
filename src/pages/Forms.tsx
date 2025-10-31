import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Forms = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [fieldsFrozen, setFieldsFrozen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    requestType: "",
    priority: "",
    description: ""
  });

  // Fun feature states
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [showKonamiCelebration, setShowKonamiCelebration] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorEmoji, setCursorEmoji] = useState("🔒");
  const [showKeyboardRecalibration, setShowKeyboardRecalibration] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("soundEnabled");
    return saved !== null ? saved === "true" : true;
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

  // Randomly freeze form fields after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setFieldsFrozen(true);
      setTimeout(() => setFieldsFrozen(false), 5000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-clear description field randomly
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.description.length > 20 && Math.random() > 0.7) {
        setFormData(prev => ({ ...prev, description: "" }));
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [formData.description]);

  // 1. Konami Code Detection
  useEffect(() => {
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
  }, []);

  // 2. Cursor Emoji Follower
  useEffect(() => {
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
  }, []);

  // 3. Keyboard Recalibration Modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (Math.random() < 0.01) {
          setShowKeyboardRecalibration(true);
          setPressedKeys(new Set());
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Track A-Z keys for recalibration
  useEffect(() => {
    if (!showKeyboardRecalibration) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key >= "A" && key <= "Z") {
        setPressedKeys((prev) => {
          const newSet = new Set([...prev, key]);
          if (newSet.size === 26) {
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
  }, [showKeyboardRecalibration]);

  // 4. Keyboard Sound Effects
  useEffect(() => {
    if (!soundEnabled) return;

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
  }, [soundEnabled, volume]);

  // Save sound settings
  useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled));
    localStorage.setItem("volume", String(volume));
  }, [soundEnabled, volume]);

  // 5. Click Counter with Achievement Badges
  useEffect(() => {
    const handleClick = () => {
      setClickCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("clickCount", String(newCount));
        
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
  }, []);

  // 6. Dark Mode
  useEffect(() => {
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
  }, [darkMode]);

  // 7. Fake System Notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission === "granted");
      });
    } else if ("Notification" in window && Notification.permission === "granted") {
      setNotificationPermission(true);
    }

    const showCountdown = () => {
      if (Math.random() < 0.3) {
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

    const showAbsurdNotification = () => {
      if (notificationPermission && Math.random() < 0.2) {
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

    const countdownInterval = setInterval(showCountdown, 30000);
    const notificationInterval = setInterval(showAbsurdNotification, 45000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(notificationInterval);
    };
  }, [notificationPermission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempts(prev => prev + 1);
    
    // Various failure conditions
    if (submitAttempts === 0) {
      setSubmitError("Error Code 418: I'm a teapot. Please try again.");
      return;
    }
    if (submitAttempts === 1) {
      setSubmitError("Network Error: Server is taking a coffee break. (Retry in 5-7 business days)");
      return;
    }
    if (submitAttempts === 2) {
      setSubmitError("Submission Failed: Form data was successfully received but we decided not to process it.");
      return;
    }
    if (formData.name.length < 50) {
      setSubmitError("Name field must be at least 50 characters for security purposes.");
      return;
    }
    if (!formData.email.includes("@corporate.veridian.dynamics.internal.local")) {
      setSubmitError("Email must use official corporate domain (@corporate.veridian.dynamics.internal.local)");
      return;
    }
    
    // Success after all that
    setSubmitted(true);
    setSubmitError("");
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        department: "",
        requestType: "",
        priority: "",
        description: ""
      });
      setSubmitAttempts(0);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (fieldsFrozen) return;
    
    let value = e.target.value;
    
    // Randomly capitalize or lowercase certain inputs
    if (e.target.name === "name" && Math.random() > 0.7) {
      value = value.split('').map(char => 
        Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
      ).join('');
    }
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const forms = [
    {
      id: "COMP-001",
      title: "Compliance Review Request",
      status: "Active",
      submissions: 234,
      lastUpdated: "2 hours ago"
    },
    {
      id: "AUDIT-042",
      title: "Internal Audit Submission",
      status: "Active",
      submissions: 892,
      lastUpdated: "5 hours ago"
    },
    {
      id: "RISK-789",
      title: "Risk Assessment Form",
      status: "Pending Review",
      submissions: 156,
      lastUpdated: "1 day ago"
    },
    {
      id: "DOC-456",
      title: "Document Approval Request",
      status: "Active",
      submissions: 445,
      lastUpdated: "3 hours ago"
    }
  ];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <nav className="flex space-x-6">
                <Link to="/" className="text-corporate-gray transition-colors hover:text-foreground">
                  Home
                </Link>
                <Link to="/features" className="text-corporate-gray transition-colors hover:text-foreground">
                  Features
                </Link>
                <Link to="/forms" className="text-foreground font-semibold">
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
                      if (volumeSliderRef.current) {
                        const slider = volumeSliderRef.current;
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
                        setVolume(1 - parseFloat(e.target.value));
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="mb-2 text-4xl font-bold">Compliance Forms</h2>
            <p className="text-corporate-gray">Submit and manage compliance-related forms</p>
          </div>

          {/* Forms List */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            {forms.map((form) => (
              <div
                key={form.id}
                className="rounded-lg border border-corporate-border bg-card p-6"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-corporate-gray">{form.id}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    form.status === "Active" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}>
                    {form.status}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{form.title}</h3>
                <div className="flex items-center justify-between text-sm text-corporate-gray">
                  <span>{form.submissions} submissions</span>
                  <span>{form.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Form */}
          <div className="mb-8 rounded-lg border border-corporate-border bg-card p-8">
            <h3 className="mb-6 text-2xl font-semibold">Submit New Request</h3>
            
            {fieldsFrozen && (
              <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
                <p className="text-yellow-500 font-semibold">⚠️ Form temporarily frozen for security scan...</p>
              </div>
            )}
            
            {submitError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
                <p className="text-red-500 font-semibold">{submitError}</p>
              </div>
            )}
            
            {submitted ? (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                <p className="text-green-500 font-semibold">Form submitted successfully!</p>
                <p className="text-sm text-corporate-gray mt-1">Your request ID: REQ-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                <p className="text-xs text-corporate-gray mt-2 italic">Note: This doesn't mean we'll actually do anything about it.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Full Name (Minimum 50 characters)</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={fieldsFrozen}
                      placeholder="Include middle name, maiden name, nicknames, titles, etc."
                    />
                    <p className="mt-1 text-xs text-corporate-gray">{formData.name.length}/50 characters</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Corporate Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={fieldsFrozen}
                      placeholder="user@corporate.veridian.dynamics.internal.local"
                    />
                    <p className="mt-1 text-xs text-corporate-gray">Must end with @corporate.veridian.dynamics.internal.local</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={fieldsFrozen}
                    >
                      <option value="">Select Department</option>
                      <option value="legal">Legal Compliance (Currently Understaffed)</option>
                      <option value="risk">Risk Assessment (On Vacation)</option>
                      <option value="quality">Quality Assurance (Ironically Broken)</option>
                      <option value="audit">Internal Audit (Auditing Itself)</option>
                      <option value="mystery">Mystery Department (Location Unknown)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Request Type</label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      disabled={fieldsFrozen}
                    >
                      <option value="">Select Type</option>
                      <option value="review">Compliance Review (6-8 months)</option>
                      <option value="audit">Audit Request (Will be ignored)</option>
                      <option value="document">Document Approval (Requires 47 signatures)</option>
                      <option value="complaint">Complaint (Sent to /dev/null)</option>
                      <option value="other">Other (Definitely won't be read)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Priority (All treated as Low)</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                    disabled={fieldsFrozen}
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low (2-3 years)</option>
                    <option value="medium">Medium (1-2 years)</option>
                    <option value="high">High (6-12 months)</option>
                    <option value="urgent">Urgent (Still 3-6 months)</option>
                    <option value="critical">CRITICAL (Maybe never)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Description (May randomly clear)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                    disabled={fieldsFrozen}
                    placeholder="Please describe your request in excruciating detail..."
                  />
                  <p className="mt-1 text-xs text-corporate-gray italic">Note: This field may spontaneously clear itself for your convenience</p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-corporate-blue px-6 py-3 font-medium text-corporate-dark transition-colors hover:bg-corporate-blue-hover"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-corporate-border bg-card p-6 text-center">
              <p className="text-3xl font-bold text-corporate-blue">1,727</p>
              <p className="mt-2 text-sm text-corporate-gray">Total Submissions</p>
            </div>
            <div className="rounded-lg border border-corporate-border bg-card p-6 text-center">
              <p className="text-3xl font-bold text-corporate-blue">234</p>
              <p className="mt-2 text-sm text-corporate-gray">Pending Review</p>
            </div>
            <div className="rounded-lg border border-corporate-border bg-card p-6 text-center">
              <p className="text-3xl font-bold text-corporate-blue">98.3%</p>
              <p className="mt-2 text-sm text-corporate-gray">Approval Rate</p>
            </div>
          </div>
        </div>
      </main>

      {/* Cursor Emoji Follower */}
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
      <div id="countdown-notification" className="fixed bottom-6 left-6 z-50 hidden">
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 shadow-lg">
          <p className="text-sm text-red-500 font-semibold" id="countdown-text"></p>
        </div>
      </div>

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

export default Forms;


import React, { useState, useEffect, useRef } from "react";

const Index = () => {
  const [stage, setStage] = useState<"login" | "dashboard">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [error, setError] = useState("");
  const [showPityModal, setShowPityModal] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [navItems, setNavItems] = useState(["Home", "Features", "Forms"]);
  const [imageOffset, setImageOffset] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const shuffleNav = () => {
    setNavItems((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

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
      shuffleNav();
    } else {
      const newFailCount = failCount + 1;
      setFailCount(newFailCount);
      setError("Authentication Result: Invalid Credentials");
      
      if (newFailCount >= 3) {
        setShowPityModal(true);
      }
      shuffleNav();
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
        shuffleNav();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPityModal]);

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
            <nav className="flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={shuffleNav}
                  className="text-corporate-gray transition-colors hover:text-foreground"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {stage === "dashboard" ? (
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="mb-2 text-4xl font-bold">Compliance Dashboard</h2>
              <p className="text-corporate-gray">Welcome back, authorized personnel</p>
            </div>
            
            {/* Stats Grid */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-2 text-sm font-medium text-corporate-gray">Active Sessions</h3>
                <p className="text-4xl font-bold text-corporate-blue">847</p>
                <p className="mt-2 text-xs text-corporate-gray">↑ 12% from last week</p>
              </div>
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-2 text-sm font-medium text-corporate-gray">Pending Reviews</h3>
                <p className="text-4xl font-bold text-corporate-blue">1,203</p>
                <p className="mt-2 text-xs text-corporate-gray">↓ 8% from last week</p>
              </div>
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-2 text-sm font-medium text-corporate-gray">Compliance Score</h3>
                <p className="text-4xl font-bold text-corporate-blue">94.7%</p>
                <p className="mt-2 text-xs text-corporate-gray">Above target threshold</p>
              </div>
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-2 text-sm font-medium text-corporate-gray">System Uptime</h3>
                <p className="text-4xl font-bold text-corporate-blue">99.9%</p>
                <p className="mt-2 text-xs text-corporate-gray">Last 30 days</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Activity Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-gray">Document Processing</span>
                    <div className="flex-1 mx-4 h-2 bg-corporate-darker rounded-full overflow-hidden">
                      <div className="h-full bg-corporate-blue" style={{ width: "78%" }} />
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-gray">Compliance Checks</span>
                    <div className="flex-1 mx-4 h-2 bg-corporate-darker rounded-full overflow-hidden">
                      <div className="h-full bg-corporate-blue" style={{ width: "65%" }} />
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-gray">Security Audits</span>
                    <div className="flex-1 mx-4 h-2 bg-corporate-darker rounded-full overflow-hidden">
                      <div className="h-full bg-corporate-blue" style={{ width: "92%" }} />
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-corporate-gray">Report Generation</span>
                    <div className="flex-1 mx-4 h-2 bg-corporate-darker rounded-full overflow-hidden">
                      <div className="h-full bg-corporate-blue" style={{ width: "45%" }} />
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Recent Activity Feed</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex items-start space-x-3 pb-3 border-b border-corporate-border">
                    <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">User session initiated - Compliance Module 7B</p>
                      <p className="text-xs text-corporate-gray mt-1">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pb-3 border-b border-corporate-border">
                    <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Automated compliance check completed</p>
                      <p className="text-xs text-corporate-gray mt-1">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pb-3 border-b border-corporate-border">
                    <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Report export requested - Format: PDF</p>
                      <p className="text-xs text-corporate-gray mt-1">32 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pb-3 border-b border-corporate-border">
                    <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Security audit scheduled for 14:00 UTC</p>
                      <p className="text-xs text-corporate-gray mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 rounded-full bg-corporate-blue mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Database backup completed successfully</p>
                      <p className="text-xs text-corporate-gray mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Tables */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-corporate-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Top Departments by Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-corporate-darker">
                    <div>
                      <p className="font-medium">Legal Compliance</p>
                      <p className="text-xs text-corporate-gray">Dept. Code: LC-8472</p>
                    </div>
                    <span className="text-corporate-blue font-semibold">2,341</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-corporate-darker">
                    <div>
                      <p className="font-medium">Risk Assessment</p>
                      <p className="text-xs text-corporate-gray">Dept. Code: RA-3291</p>
                    </div>
                    <span className="text-corporate-blue font-semibold">1,892</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-corporate-darker">
                    <div>
                      <p className="font-medium">Quality Assurance</p>
                      <p className="text-xs text-corporate-gray">Dept. Code: QA-5643</p>
                    </div>
                    <span className="text-corporate-blue font-semibold">1,567</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-corporate-darker">
                    <div>
                      <p className="font-medium">Internal Audit</p>
                      <p className="text-xs text-corporate-gray">Dept. Code: IA-2201</p>
                    </div>
                    <span className="text-corporate-blue font-semibold">1,234</span>
                  </div>
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
                <div className="p-4 rounded bg-corporate-darker">
                  <p className="text-sm text-corporate-gray mb-1">Regulatory Adherence</p>
                  <p className="text-2xl font-bold">98.3%</p>
                  <p className="text-xs text-corporate-gray mt-1">ISO 27001 Compliant</p>
                </div>
                <div className="p-4 rounded bg-corporate-darker">
                  <p className="text-sm text-corporate-gray mb-1">Data Integrity Index</p>
                  <p className="text-2xl font-bold">99.7%</p>
                  <p className="text-xs text-corporate-gray mt-1">Verified Accuracy Rate</p>
                </div>
                <div className="p-4 rounded bg-corporate-darker">
                  <p className="text-sm text-corporate-gray mb-1">Audit Trail Coverage</p>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-xs text-corporate-gray mt-1">All Transactions Logged</p>
                </div>
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

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"login" | "dashboard">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [error, setError] = useState("");
  const [showPityModal, setShowPityModal] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [imageOffset, setImageOffset] = useState(0);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const buttonRef = useRef<HTMLButtonElement>(null);

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
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
                className="text-corporate-gray transition-colors hover:text-foreground cursor-pointer bg-transparent border-none outline-none"
              >
                Home
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/features");
                }}
                className="text-corporate-gray transition-colors hover:text-foreground cursor-pointer bg-transparent border-none outline-none"
              >
                Features
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forms");
                }}
                className="text-corporate-gray transition-colors hover:text-foreground cursor-pointer bg-transparent border-none outline-none"
              >
                Forms
              </button>
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

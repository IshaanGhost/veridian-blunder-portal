import { useState } from "react";
import { Link } from "react-router-dom";

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
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-corporate-border bg-card p-6 transition-all hover:border-corporate-blue"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
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


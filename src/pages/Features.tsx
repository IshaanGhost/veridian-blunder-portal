import { useState } from "react";
import { Link } from "react-router-dom";

const Features = () => {
  const [features] = useState([
    {
      title: "Advanced Compliance Tracking",
      description: "Real-time monitoring of regulatory compliance metrics across all departments and operational units.",
      icon: "📊",
      stat: "247",
      unit: "Active Metrics"
    },
    {
      title: "Automated Audit Generation",
      description: "Generate comprehensive audit reports automatically with customizable templates and scheduling options.",
      icon: "📄",
      stat: "1,892",
      unit: "Reports Generated"
    },
    {
      title: "Risk Assessment Dashboard",
      description: "Visualize and analyze potential risks with integrated analytics and predictive modeling capabilities.",
      icon: "⚠️",
      stat: "94.2%",
      unit: "Accuracy Rate"
    },
    {
      title: "Document Management System",
      description: "Centralized repository for all compliance documents with version control and access management.",
      icon: "📁",
      stat: "12,847",
      unit: "Documents Stored"
    },
    {
      title: "Workflow Automation",
      description: "Streamline compliance processes with automated workflows and approval chains.",
      icon: "⚙️",
      stat: "156",
      unit: "Active Workflows"
    },
    {
      title: "Integration Hub",
      description: "Connect with external systems and third-party services through our secure API gateway.",
      icon: "🔗",
      stat: "23",
      unit: "Active Integrations"
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
            <h2 className="mb-4 text-4xl font-bold">Platform Features</h2>
            <p className="text-lg text-corporate-gray">
              Comprehensive compliance management tools designed for enterprise needs
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
              <h3 className="mb-4 text-xl font-semibold">Feature Roadmap</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">AI-Powered Risk Prediction</span>
                  <span className="text-xs text-corporate-gray">Q2 2025</span>
                </div>
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">Enhanced Mobile Application</span>
                  <span className="text-xs text-corporate-gray">Q3 2025</span>
                </div>
                <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                  <span className="text-sm">Blockchain Audit Trail</span>
                  <span className="text-xs text-corporate-gray">Q4 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Advanced Analytics Suite</span>
                  <span className="text-xs text-corporate-gray">Q1 2026</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">System Capabilities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">99.9% Uptime SLA Guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Enterprise-grade Security (ISO 27001)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">24/7 Technical Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Unlimited Data Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-corporate-blue" />
                  <span className="text-sm">Multi-region Deployment</span>
                </div>
              </div>
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


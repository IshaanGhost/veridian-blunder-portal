import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
              <a href="/" className="text-corporate-gray transition-colors hover:text-foreground">
                Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Error Section */}
          <div className="mb-12 text-center">
            <div className="mb-6">
              <h1 className="mb-4 text-8xl font-bold text-corporate-blue">404</h1>
              <h2 className="mb-4 text-3xl font-bold">Resource Not Found</h2>
              <p className="mb-6 text-lg text-corporate-gray">
                The requested resource could not be located within the compliance portal infrastructure.
              </p>
              <a 
                href="/" 
                className="inline-block rounded-md bg-corporate-blue px-6 py-3 font-medium text-corporate-dark transition-colors hover:bg-corporate-blue-hover"
              >
                Return to Dashboard
              </a>
            </div>
          </div>

          {/* Error Details */}
          <div className="mb-8 rounded-lg border border-corporate-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Error Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                <span className="text-sm text-corporate-gray">Error Code</span>
                <span className="font-mono text-sm font-semibold">ERR_404_RESOURCE_NOT_FOUND</span>
              </div>
              <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                <span className="text-sm text-corporate-gray">Requested Path</span>
                <span className="font-mono text-sm">{location.pathname}</span>
              </div>
              <div className="flex items-center justify-between border-b border-corporate-border pb-2">
                <span className="text-sm text-corporate-gray">Timestamp</span>
                <span className="font-mono text-sm">{new Date().toISOString()}</span>
              </div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm text-corporate-gray">Status</span>
                <span className="text-sm font-semibold text-yellow-500">Non-Critical</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="mb-8 rounded-lg border border-corporate-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Suggested Actions</h3>
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm text-corporate-gray">
                Verify the URL path is correct and matches an existing resource endpoint
              </li>
              <li className="text-sm text-corporate-gray">
                Check your access permissions for the requested resource module
              </li>
              <li className="text-sm text-corporate-gray">
                Ensure you are authenticated with valid session credentials
              </li>
              <li className="text-sm text-corporate-gray">
                Contact the compliance portal administrator if the issue persists
              </li>
            </ol>
          </div>

          {/* System Status */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h4 className="mb-2 text-sm font-medium text-corporate-gray">Portal Status</h4>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-semibold">Operational</span>
              </div>
            </div>
            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h4 className="mb-2 text-sm font-medium text-corporate-gray">API Response</h4>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-semibold">404 Status</span>
              </div>
            </div>
            <div className="rounded-lg border border-corporate-border bg-card p-6">
              <h4 className="mb-2 text-sm font-medium text-corporate-gray">Session State</h4>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-lg border border-corporate-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded bg-corporate-darker p-4">
                <h4 className="mb-2 font-semibold">Compliance Dashboard</h4>
                <p className="mb-3 text-xs text-corporate-gray">
                  Access your main compliance metrics and reporting tools
                </p>
                <a href="/" className="text-sm text-corporate-blue hover:underline">
                  Go to Dashboard →
                </a>
              </div>
              <div className="rounded bg-corporate-darker p-4">
                <h4 className="mb-2 font-semibold">Support Resources</h4>
                <p className="mb-3 text-xs text-corporate-gray">
                  Documentation and troubleshooting guides available
                </p>
                <span className="text-sm text-corporate-gray">Portal ID: VD-404-REF-7829</span>
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

export default NotFound;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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


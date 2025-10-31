import { useState } from "react";
import { Link } from "react-router-dom";

const Forms = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    requestType: "",
    priority: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just show success - this is the blunder portal after all
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            
            {submitted ? (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                <p className="text-green-500 font-semibold">Form submitted successfully!</p>
                <p className="text-sm text-corporate-gray mt-1">Your request ID: REQ-{Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
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
                    >
                      <option value="">Select Department</option>
                      <option value="legal">Legal Compliance</option>
                      <option value="risk">Risk Assessment</option>
                      <option value="quality">Quality Assurance</option>
                      <option value="audit">Internal Audit</option>
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
                    >
                      <option value="">Select Type</option>
                      <option value="review">Compliance Review</option>
                      <option value="audit">Audit Request</option>
                      <option value="document">Document Approval</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
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


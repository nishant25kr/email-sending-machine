import { useState } from "react";
import Modal from "./Modal";
import { scheduleEmails } from "../api/email.api";

export default function ComposeEmailModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emails, setEmails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(1);
  const [hourlyLimit, setHourlyLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Validation
      if (!subject.trim()) {
        setError("Subject is required");
        setLoading(false);
        return;
      }
      if (!body.trim()) {
        setError("Email body is required");
        setLoading(false);
        return;
      }
      if (!emails.trim()) {
        setError("At least one email is required");
        setLoading(false);
        return;
      }
      if (!startTime) {
        setError("Start time is required");
        setLoading(false);
        return;
      }

      const payload = {
        subject,
        body,
        emails: emails.split(",").map((e) => e.trim()).filter(e => e),
        startTime: new Date(startTime).toISOString(),
        delaySeconds: Number(delaySeconds),
        hourlyLimit: Number(hourlyLimit),
      };

      await scheduleEmails(payload);

      // Reset form
      setSubject("");
      setBody("");
      setEmails("");
      setStartTime("");
      setDelaySeconds(1);
      setHourlyLimit(10);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule emails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Compose Email</h2>
          <p className="text-sm text-gray-500 mt-1">Schedule emails to be sent to multiple recipients</p>
        </div>

        <div className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              placeholder="Write your email message here..."
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients <span className="text-red-500">*</span>
            </label>
            <textarea
              className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              placeholder="email1@example.com, email2@example.com, email3@example.com"
              rows={3}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1.5">Separate multiple email addresses with commas</p>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay (seconds)
              </label>
              <input
                type="number"
                min="1"
                className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="1"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1.5">Time between emails</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Limit
              </label>
              <input
                type="number"
                min="1"
                className="border border-gray-300 w-full px-4 py-2.5 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="10"
                value={hourlyLimit}
                onChange={(e) => setHourlyLimit(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1.5">Max emails per hour</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
              <svg 
                className="w-5 h-5 text-red-600 shrink-0 mt-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Scheduling...
                </>
              ) : (
                <>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                    />
                  </svg>
                  Schedule Emails
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
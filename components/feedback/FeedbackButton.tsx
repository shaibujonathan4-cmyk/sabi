"use client";

import { useState } from "react";
import { submitFeedback } from "@/server/actions/feedback.actions";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    await submitFeedback(formData);
    setSubmitted(true);
    setMessage("");
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
    }, 1500);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-90 z-20"
        aria-label="Send feedback"
      >
        💬
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-30">
          <div className="bg-black border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            {submitted ? (
              <p className="text-center text-green-400 py-8">
                Thanks for your feedback!
              </p>
            ) : (
              <form action={handleSubmit}>
                <h2 className="text-lg font-semibold mb-3">Send Feedback</h2>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-gray-700 bg-transparent rounded-md px-3 py-2 mb-4"
                  placeholder="Found a bug? Have a suggestion? Let us know."
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

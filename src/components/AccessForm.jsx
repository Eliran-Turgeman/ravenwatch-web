import { useId, useState } from "react";
import {
  AccessRequestUnavailableError,
  submitAccessRequest,
} from "../services/access.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccessForm() {
  const emailId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!emailPattern.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Enter a valid work email.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      await submitAccessRequest({ email: normalizedEmail });
      setStatus("success");
      setMessage("Request received.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof AccessRequestUnavailableError
          ? "Request intake is not connected yet. No data was sent."
          : "The request could not be sent. Try again later.",
      );
    }
  }

  return (
    <form className="access-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={emailId}>Work email</label>
      <div className="access-control">
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={email}
          aria-describedby={messageId}
          aria-invalid={status === "error"}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Request access"}
        </button>
      </div>
      <p
        className={`form-message${status === "error" ? " is-error" : ""}`}
        id={messageId}
        aria-live="polite"
      >
        {message || "Private preview. No marketing list."}
      </p>
    </form>
  );
}

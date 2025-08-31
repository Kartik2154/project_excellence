// frontend/src/components/PasswordManager.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function PasswordManager({
  role,
  initialMode = "change",
  redirectAfterReset = true,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    otp: "",
  });
  const [mode, setMode] = useState(initialMode); // change | forgot | reset
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill behavior:
  // 1) if location.state.email (from login link) use that
  // 2) otherwise if logged-in user (localStorage) use that when in "change" mode
  useEffect(() => {
    if (location?.state?.email) {
      setForm((s) => ({ ...s, email: location.state.email }));
    } else if (initialMode === "change") {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const email = parsed?.email ?? parsed?.data?.email;
          if (email) setForm((s) => ({ ...s, email }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setMode(initialMode);
  }, [location?.state, initialMode]);

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);
    try {
      let res;
      if (mode === "change") {
        res = await api.post(`/${role}/change-password`, {
          email: form.email,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        });
        setMessage(res.data.message || "Password changed");
      } else if (mode === "forgot") {
        // send OTP, keep email, switch to reset on success
        res = await api.post(`/${role}/forgot-password`, { email: form.email });
        setMessage(res.data.message || "OTP sent to email");
        setMode("reset");
      } else if (mode === "reset") {
        res = await api.post(`/${role}/reset-password`, {
          email: form.email,
          otp: form.otp,
          newPassword: form.newPassword,
        });
        setMessage(res.data.message || "Password reset successful");
        // optional redirect to login after reset (only if this was forgot/reset flow)
        if (redirectAfterReset) {
          setTimeout(() => {
            navigate("/admin/login");
          }, 1800);
        }
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">
        🔑 {role.toUpperCase()} Password Settings
      </h2>

      <div className="flex gap-2 mb-4">
        {["change", "forgot", "reset"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setMessage("");
            }}
            className={`px-3 py-1 rounded ${
              mode === m ? "bg-cyan-600" : "bg-gray-600"
            }`}
            type="button"
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Email: editable only during 'forgot'. Locked for change/reset */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 rounded bg-gray-700"
          disabled={mode === "change" || mode === "reset"}
        />

        {mode === "change" && (
          <>
            <input
              type="password"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={(e) =>
                setForm({ ...form, oldPassword: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700"
            />
            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700"
            />
          </>
        )}

        {mode === "reset" && (
          <>
            <input
              type="text"
              placeholder="OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              className="w-full p-2 rounded bg-gray-700"
            />
            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700"
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded disabled:opacity-50"
          type="button"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "forgot"
            ? "Send OTP"
            : mode === "reset"
            ? "Reset Password"
            : "Change Password"}
        </button>
      </div>

      {message && <p className="mt-3 text-cyan-300">{message}</p>}
    </div>
  );
}

export default PasswordManager;

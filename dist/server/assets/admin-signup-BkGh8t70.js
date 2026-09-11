import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { s as supabase } from "./supabase-Dpbthl1L.js";
import "@supabase/supabase-js";
function AdminSignup() {
  const [adminExists, setAdminExists] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data,
        error: error2
      } = await supabase.from("app_settings").select("admin_email").eq("id", 1).single();
      if (error2) return;
      if (data?.admin_email) {
        setAdminExists(true);
        setError("Admin already exists. Signup is disabled.");
      }
    };
    checkAdmin();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (adminExists) {
      setError("Signup disabled. Admin already exists.");
      return;
    }
    if (!fullName.trim()) return setError("Full name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const {
        data,
        error: signUpError
      } = await supabase.auth.signUp({
        email,
        password
      });
      if (signUpError || !data?.user) {
        setError(signUpError?.message || "Sign up failed");
        setLoading(false);
        return;
      }
      const userId = data.user.id;
      const {
        error: settingsError
      } = await supabase.from("app_settings").update({
        admin_email: email
      }).eq("id", 1);
      if (settingsError) {
        setError(settingsError.message);
        setLoading(false);
        return;
      }
      const {
        error: profileError
      } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName,
        email,
        role: "admin"
      }, {
        onConflict: "id"
      });
      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
      setSuccess("Admin created successfully!");
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white rounded-lg shadow p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Admin Signup" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx("input", { placeholder: "Full Name", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full px-3 py-2 border rounded-md" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2 border rounded-md" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2 border rounded-md" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Confirm Password", type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value), className: "w-full px-3 py-2 border rounded-md" }),
      error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: error }),
      success && /* @__PURE__ */ jsx("p", { className: "text-sm text-green-600", children: success }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading || adminExists, className: "w-full py-2 bg-[#483226] text-white rounded-md disabled:opacity-50", children: loading ? "Creating..." : "Create Admin" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => window.location.href = "/admin-login", className: "w-full text-sm text-blue-600 mt-2", children: "Already have account? Login" })
    ] })
  ] }) });
}
export {
  AdminSignup as component
};

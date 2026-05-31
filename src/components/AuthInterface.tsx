import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, UserPlus, LogIn, Sparkles, ShieldCheck } from "lucide-react";

interface Props {
  lang: "ar" | "en";
  onSuccess?: () => void;
  defaultRole?: "client" | "admin";
}

export default function AuthInterface({ lang, onSuccess, defaultRole = "client" }: Props) {
  const isAr = lang === "ar";
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [roleMode, setRoleMode] = useState<"client" | "admin">(defaultRole);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    if (!email || !password) {
      setError(isAr ? "الرجاء كمل بيانات البريد وكلمة السر" : "Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(isAr ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "login") {
        await signIn(email, password);
        setStatus(isAr ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!");
        if (onSuccess) onSuccess();
      } else {
        await signUp(email, password);
        setStatus(isAr ? "تم إنشاء حسابك وتفعيله بنجاح!" : "Account created successfully!");
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || String(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = isAr ? "بيان الدخول خاطئ أو البريد غير كود موثق" : "Invalid email or password.";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = isAr ? "هذا البريد الإلكتروني مسجل بالفعل." : "This email address is already registered.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = isAr ? "صيغة البريد الإلكتروني غير صحيحة." : "Invalid email address style.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setStatus(isAr ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 max-w-md w-full mx-auto shadow-xl transition-all font-sans relative overflow-hidden" id="login-auth-card">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-700 via-amber-400 to-emerald-900" />
      
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-black text-gray-950 font-sans tracking-tight">
          {isAr ? "تسجيل الدخول وبوابة المحمدية" : "Customs Client Portal"}
        </h3>
        <p className="text-xs text-gray-400">
          {isAr 
            ? "سجّل الآن لتتبع شحنتك والملفات الرسمية بمكتب إسكندرية للتخليص" 
            : "Authenticate to save documents and track port clearance records."}
        </p>
      </div>

      {/* Role Selector toggles */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          onClick={() => {
            setRoleMode("client");
            setError(null);
          }}
          className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            roleMode === "client" ? "bg-white text-emerald-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isAr ? "حساب عميل" : "Client Portal"}</span>
        </button>
        <button
          onClick={() => {
            setRoleMode("admin");
            setMode("login"); // Admin must log in only, no sign up interface
            setError(null);
          }}
          className={`py-2 px-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            roleMode === "admin" ? "bg-white text-emerald-950 shadow-xs" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{isAr ? "إدارة / أدمن" : "Admin Panel"}</span>
        </button>
      </div>

      {/* Mode switcher (Login vs Signup) for client */}
      {roleMode === "client" && (
        <div className="flex justify-center gap-6 border-b border-gray-100 pb-3.5 mb-5 text-sm font-semibold">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`pb-1 px-1 transition-all relative cursor-pointer ${
              mode === "login" ? "text-emerald-800" : "text-gray-450 hover:text-gray-800"
            }`}
          >
            <span>{isAr ? "تسجيل دخول" : "Sign In"}</span>
            {mode === "login" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />}
          </button>
          
          <button
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`pb-1 px-1 transition-all relative cursor-pointer ${
              mode === "signup" ? "text-emerald-800" : "text-gray-450 hover:text-gray-800"
            }`}
          >
            <span>{isAr ? "إنشاء حساب جديد" : "Register Account"}</span>
            {mode === "signup" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />}
          </button>
        </div>
      )}

      {/* Display messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs leading-relaxed mb-4">
          ⚠️ {error}
        </div>
      )}

      {status && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold mb-4">
          ✓ {status}
        </div>
      )}

      {/* Login / Auth Form */}
      <form onSubmit={handleAuth} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">
            {isAr ? "البريد الإلكتروني أو اسم المستخدم" : "E-mail Address or Username"}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? "مثال: info@almuhammadiyah.com" : "e.g., info@almuhammadiyah.com"}
              className="w-full bg-slate-50 border border-slate-350 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">
            {isAr ? "كلمة المرور" : "Security Password"}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-350 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:bg-white text-gray-805 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-800 hover:bg-emerald-900 font-black text-white py-2.5 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          <span>
            {loading
              ? (isAr ? "جاري الإرسال والمطابقة..." : "Processing...")
              : roleMode === "admin"
                ? (isAr ? "دخول لوحة التحكم للأستاذ إسلام" : "Sign in as Executive Owner")
                : mode === "login"
                  ? (isAr ? "دخول ومتابعة شحنتي" : "Sign In & Track")
                  : (isAr ? "تسجيل حساب عميل جديد" : "Create My Account")
            }
          </span>
        </button>
      </form>

      {/* Google Sign in only if client */}
      {roleMode === "client" && (
        <div className="mt-5 pt-4 border-t border-gray-150 space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 border border-slate-350 text-gray-700 font-bold py-2 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.74 15.02 1 12 1 7.35 1 3.37 3.65 1.56 7.56l3.86 3C6.35 7.67 8.94 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.79c2.1-1.94 3.77-4.8 3.77-8.42z"
              />
              <path
                fill="#FBBC05"
                d="M5.42 14.56C5.18 13.84 5.04 13.08 5.04 12.3c0-.78.14-1.54.38-2.26l-3.86-3C.56 8.56 0 10.36 0 12.3s.56 3.74 1.56 5.26l3.86-3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.6-2.79c-1.1.74-2.52 1.18-4.36 1.18-3.06 0-5.65-2.63-6.58-5.52l-3.86 3C3.37 20.35 7.35 23 12 23z"
              />
            </svg>
            <span>{isAr ? "دخول سريع عبر Google" : "Connect with Google"}</span>
          </button>
        </div>
      )}

      {/* Guide notice explaining email/password activation instructions */}
      <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-250 text-[10px] text-amber-900 leading-normal mt-5 space-y-1">
        <span className="font-bold block">💡 {isAr ? "تنويه وإرشاد تفعيل:" : "Notice on Provider setup:"}</span>
        <p>
          {isAr 
            ? "تأكد من تمكين خيار التسجيل بالبريد الإلكتروني والمطابقة في لوحة تحكم Firebase Console الخاصة بك."
            : "Please make sure Email Provider is toggled active inside your Firebase Auth dashboard console."}
        </p>
      </div>
    </div>
  );
}

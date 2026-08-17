import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Database,
  Eye,
  EyeOff,
  Laptop,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "@/features/auth/api/auth.query";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateLoginForm(email, password) {
  const errors = {};

  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email = "Email wajib diisi.";
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = "Format email tidak valid.";
  }

  if (!password) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const redirectTimerRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const isSubmitting = login.isPending;

  useEffect(() => {
    emailRef.current?.focus();

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function clearFieldError(field) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: "",
      };
    });
  }

  function getLoginErrorMessage(error) {
    const status = error?.status;

    if (status === 400) {
      return (
        error?.message ||
        "Data login tidak valid. Periksa kembali email dan password."
      );
    }

    if (status === 401) {
      return "Email atau password yang kamu masukkan salah.";
    }

    if (status === 403) {
      return "Akun ini tidak memiliki akses ke internal workspace.";
    }

    if (status === 429) {
      return "Terlalu banyak percobaan login. Coba lagi beberapa saat.";
    }

    if (status >= 500) {
      return "Server sedang mengalami masalah. Coba lagi sebentar.";
    }

    if (
      error?.name === "TypeError" ||
      error?.message?.toLowerCase().includes("fetch")
    ) {
      return "Tidak dapat terhubung ke server. Periksa koneksi dan coba lagi.";
    }

    return error?.message || "Login gagal. Silakan coba kembali.";
  }

  function handleBackendError(error) {
    const backendErrors = Array.isArray(error?.errors)
      ? error.errors
      : [];

    if (backendErrors.length > 0) {
      const nextFieldErrors = {
        email: "",
        password: "",
      };

      backendErrors.forEach((item) => {
        const field = item?.field;
        const message = item?.message;

        if (
          (field === "email" || field === "password") &&
          message
        ) {
          nextFieldErrors[field] = message;
        }
      });

      const hasFieldError =
        Boolean(nextFieldErrors.email) ||
        Boolean(nextFieldErrors.password);

      if (hasFieldError) {
        setFieldErrors(nextFieldErrors);

        toast.error("Login gagal", {
          description:
            error?.message ||
            "Periksa kembali data yang kamu masukkan.",
        });

        if (nextFieldErrors.email) {
          emailRef.current?.focus();
        } else if (nextFieldErrors.password) {
          passwordRef.current?.focus();
        }

        return;
      }
    }

    const message = getLoginErrorMessage(error);

    toast.error("Login gagal", {
      description: message,
    });

    emailRef.current?.focus();
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);

    clearFieldError("email");
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);

    clearFieldError("password");
  }

  function handlePasswordKeyEvent(event) {
    setCapsLockActive(
      event.getModifierState?.("CapsLock") ?? false,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();

    const validationErrors = validateLoginForm(
      normalizedEmail,
      password,
    );

    if (Object.keys(validationErrors).length > 0) {
      const nextErrors = {
        email: validationErrors.email || "",
        password: validationErrors.password || "",
      };

      setFieldErrors(nextErrors);

      if (nextErrors.email) {
        emailRef.current?.focus();
      } else if (nextErrors.password) {
        passwordRef.current?.focus();
      }

      return;
    }

    setFieldErrors({
      email: "",
      password: "",
    });

    try {
      await login.mutateAsync({
        email: normalizedEmail,
        password,
      });

      toast.success("Login berhasil", {
        description: "Membuka Malaikat Biru Internal...",
      });

      redirectTimerRef.current = setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 600);
    } catch (error) {
      handleBackendError(error);
    }
  }

  return (
    <>
      {/* Unsupported Device */}
      <div className="flex h-dvh overflow-hidden bg-background lg:hidden">
        <div className="m-auto max-w-sm px-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Laptop className="size-5" />
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
            Buka melalui laptop atau desktop
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Malaikat Biru Internal dirancang untuk kebutuhan pengelolaan
            platform melalui layar desktop.
          </p>
        </div>
      </div>

      {/* Desktop */}
      <main className="hidden h-dvh w-full overflow-hidden bg-background lg:block">
        <div className="grid h-full grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)] p-3">
          {/* Left */}
          <section className="relative h-full min-h-0 overflow-hidden rounded-[28px] bg-primary">
            {/* Background grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, white 1px, transparent 1px),
                  linear-gradient(to bottom, white 1px, transparent 1px)
                `,
                backgroundSize: "48px 48px",
              }}
            />

            {/* Ambient */}
            <div className="pointer-events-none absolute -left-36 -top-40 size-[440px] rounded-full bg-white/15 blur-[110px]" />
            <div className="pointer-events-none absolute -bottom-48 right-[-100px] size-[520px] rounded-full bg-cyan-300/20 blur-[130px]" />

            {/* Decorative rings */}
            <div className="pointer-events-none absolute right-[7%] top-[11%] size-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute right-[13%] top-[17%] size-36 rounded-full border border-white/10" />

            <div className="relative z-10 flex h-full min-h-0 flex-col px-10 py-8 xl:px-14 xl:py-10">
              {/* Brand */}
              <header className="flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md">
                    <Sparkles className="size-[18px]" />
                  </div>

                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-white">
                      Malaikat Biru
                    </p>

                    <p className="text-xs text-white/70">
                      Internal Operations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-emerald-300" />

                  <span className="text-[11px] font-medium text-white/75">
                    Private workspace
                  </span>
                </div>
              </header>

              {/* Main Content */}
              <div className="my-auto max-w-[620px]">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur-md">
                  <ShieldCheck className="size-3.5" />
                  Internal access
                </div>

                <h1 className="max-w-[590px] text-[clamp(2.7rem,4vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
                  Kendali Malaikat Biru dalam satu ruang.
                </h1>

                <p className="mt-6 max-w-[540px] text-[15px] leading-7 text-white/75">
                  Kelola akun pengguna, pantau penggunaan Aoi, evaluasi biaya
                  dan performa AI, serta jaga data Malaikat Biru tetap rapi dan
                  terpantau.
                </p>

                {/* Capability Cards */}
                <div className="mt-8 grid max-w-[560px] grid-cols-3 gap-2.5">
                  <FeatureItem
                    icon={Activity}
                    label="Monitoring"
                    description="Aktivitas platform"
                  />

                  <FeatureItem
                    icon={BarChart3}
                    label="Analytics"
                    description="Account & Aoi"
                  />

                  <FeatureItem
                    icon={Database}
                    label="Data"
                    description="Database Aoi"
                  />
                </div>
              </div>

              {/* Footer */}
              <footer className="flex shrink-0 items-center justify-between text-[11px] text-white/55">
                <p>Malaikat Biru Internal</p>
                <p>Authorized access only</p>
              </footer>
            </div>
          </section>

          {/* Right */}
          <section className="flex h-full min-h-0 items-center justify-center overflow-hidden px-10 xl:px-16">
            <div className="w-full max-w-[390px]">
              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-primary">
                  Internal Access
                </p>

                <h2 className="text-[31px] font-semibold tracking-[-0.04em] text-foreground">
                  Selamat datang kembali
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  Masuk untuk melanjutkan pengelolaan platform Malaikat Biru dan
                  seluruh layanan Aoi.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-[18px]"
                noValidate
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[13px] font-medium text-foreground"
                  >
                    Email
                  </Label>

                  <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    disabled={isSubmitting}
                    onChange={handleEmailChange}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email
                        ? "email-error"
                        : undefined
                    }
                    className={`h-11 rounded-xl bg-background px-3.5 text-sm shadow-none transition-all placeholder:text-muted-foreground/70 focus-visible:ring-3 ${
                      fieldErrors.email
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
                        : "border-border focus-visible:border-primary focus-visible:ring-primary/10"
                    }`}
                  />

                  {fieldErrors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-destructive"
                    >
                      <TriangleAlert className="size-3.5 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[13px] font-medium text-foreground"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      ref={passwordRef}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      value={password}
                      disabled={isSubmitting}
                      onChange={handlePasswordChange}
                      onKeyDown={handlePasswordKeyEvent}
                      onKeyUp={handlePasswordKeyEvent}
                      onBlur={() => setCapsLockActive(false)}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={
                        fieldErrors.password
                          ? "password-error"
                          : capsLockActive
                            ? "caps-lock-warning"
                            : undefined
                      }
                      className={`h-11 rounded-xl bg-background px-3.5 pr-11 text-sm shadow-none transition-all placeholder:text-muted-foreground/70 focus-visible:ring-3 ${
                        fieldErrors.password
                          ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/10"
                          : "border-border focus-visible:border-primary focus-visible:ring-primary/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      disabled={isSubmitting}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-[17px]" />
                      ) : (
                        <Eye className="size-[17px]" />
                      )}
                    </button>
                  </div>

                  {fieldErrors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="flex items-center gap-1.5 text-xs text-destructive"
                    >
                      <TriangleAlert className="size-3.5 shrink-0" />
                      {fieldErrors.password}
                    </p>
                  )}

                  {!fieldErrors.password &&
                    capsLockActive && (
                      <p
                        id="caps-lock-warning"
                        className="flex items-center gap-1.5 text-xs text-amber-600"
                      >
                        <TriangleAlert className="size-3.5 shrink-0" />
                        Caps Lock sedang aktif.
                      </p>
                    )}
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    disabled={isSubmitting}
                    onCheckedChange={(checked) =>
                      setRememberMe(Boolean(checked))
                    }
                  />

                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-[13px] font-normal text-muted-foreground"
                  >
                    Tetap masuk di perangkat ini
                  </Label>
                </div>

                {/* Login */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="group h-11 w-full cursor-pointer rounded-xl font-medium disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      Masuk ke Internal
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Information */}
              <div className="mt-7 border-t border-border pt-5">
                <p className="text-xs leading-5 text-muted-foreground">
                  Akses hanya tersedia untuk akun internal yang telah
                  diotorisasi untuk mengelola Malaikat Biru.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function FeatureItem({
  icon: Icon,
  label,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-3.5 backdrop-blur-md">
      <div className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-white">
        <Icon className="size-3.5" />
      </div>

      <p className="mt-3 text-xs font-medium text-white">
        {label}
      </p>

      <p className="mt-0.5 text-[10px] text-white/65">
        {description}
      </p>
    </div>
  );
}
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const planOptions = [
  {
    value: "FREE",
    label: "Free",
    eyebrow: "Standard",
    description: "Akses dasar untuk menggunakan Malaikat Biru dan Aoi.",
    icon: UserRound,
  },
  {
    value: "PLUS",
    label: "Plus",
    eyebrow: "Higher limits",
    description: "Limit penggunaan Aoi lebih tinggi dibandingkan paket Free.",
    icon: Sparkles,
  },
  {
    value: "ULTIMATE",
    label: "Ultimate",
    eyebrow: "Full access",
    description: "Akses dan limit tertinggi untuk seluruh layanan Aoi.",
    icon: Zap,
  },
]

export default function CreateUserPage() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    plan: "FREE",
    forcePasswordChange: true,
  })

  const selectedPlan = useMemo(
    () => planOptions.find((plan) => plan.value === form.plan),
    [form.plan],
  )

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  )

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }))
    }
  }

  const handlePasswordKeyEvent = (event) => {
    setIsCapsLockOn(
      event.getModifierState("CapsLock"),
    )
  }

  const handleGeneratePassword = () => {
    const password = generatePassword()

    updateField("password", password)
    setCopied(false)
  }

  const handleCopyPassword = async () => {
    if (!form.password) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        form.password,
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setCopied(false)
    }
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.fullname.trim()) {
      nextErrors.fullname =
        "Nama user wajib diisi."
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Email wajib diisi."
    } else if (!isValidEmail(form.email)) {
      nextErrors.email =
        "Format email tidak valid."
    }

    if (!form.password) {
      nextErrors.password =
        "Temporary password wajib diisi."
    } else if (
      !isStrongEnoughPassword(form.password)
    ) {
      nextErrors.password =
        "Password belum memenuhi seluruh persyaratan keamanan."
    }

    setErrors(nextErrors)

    return (
      Object.keys(nextErrors).length === 0
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        fullname: form.fullname.trim(),
        email: form.email
          .trim()
          .toLowerCase(),
        password: form.password,
        plan: form.plan,
        forcePasswordChange:
          form.forcePasswordChange,
      }

      console.log({
        ...payload,
        password: "[REDACTED]",
      })

      // TODO:
      // mutation create user via TanStack Query.

      navigate("/users")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1320px] px-6 py-6 xl:px-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/users")}
        className="group flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Users
      </button>

      {/* Page Header */}
      <div className="mt-4">
        <p className="text-xs font-medium text-primary">
          Account Management
        </p>

        <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
          Create User
        </h1>

        <p className="mt-1.5 max-w-[620px] text-[13px] leading-5 text-muted-foreground">
          Buat akun baru untuk Malaikat
          Biru. Akun akan langsung aktif
          setelah berhasil dibuat.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-5"
      >
        {/* Main Large Card */}
        <section className="overflow-hidden rounded-2xl border border-border bg-background">
          {/* Card Header */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                User Information
              </h2>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Lengkapi informasi akun, akses
              awal, dan plan pengguna.
            </p>
          </div>

          {/* ====================================================== */}
          {/* Account Information */}
          {/* ====================================================== */}

          <div className="px-6 py-5">
            <SectionTitle
              number="01"
              title="Account Information"
              description="Identitas utama yang digunakan pengguna pada Malaikat Biru."
            />

            <div className="mt-5 grid grid-cols-2 gap-5">
              {/* Full Name */}
              <Field>
                <Label
                  htmlFor="fullname"
                  className="text-xs font-medium text-foreground"
                >
                  Full Name
                </Label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="fullname"
                    value={form.fullname}
                    onChange={(event) =>
                      updateField(
                        "fullname",
                        event.target.value,
                      )
                    }
                    autoFocus
                    autoComplete="name"
                    placeholder="Contoh: Rafi Asshiddiqie"
                    className={[
                      "h-10 rounded-xl pl-10 text-sm",
                      errors.fullname
                        ? "border-destructive focus-visible:border-destructive"
                        : "",
                    ].join(" ")}
                  />
                </div>

                {errors.fullname ? (
                  <FieldError>
                    {errors.fullname}
                  </FieldError>
                ) : (
                  <FieldHint>
                    Nama yang ditampilkan pada
                    profil pengguna.
                  </FieldHint>
                )}
              </Field>

              {/* Email */}
              <Field>
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground"
                >
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    autoComplete="email"
                    placeholder="user@example.com"
                    className={[
                      "h-10 rounded-xl pl-10 text-sm",
                      errors.email
                        ? "border-destructive focus-visible:border-destructive"
                        : "",
                    ].join(" ")}
                  />
                </div>

                {errors.email ? (
                  <FieldError>
                    {errors.email}
                  </FieldError>
                ) : (
                  <FieldHint>
                    Email digunakan sebagai
                    identitas utama untuk login.
                  </FieldHint>
                )}
              </Field>
            </div>
          </div>

          <SectionDivider />

          {/* ====================================================== */}
          {/* Initial Access */}
          {/* ====================================================== */}

          <div className="px-6 py-5">
            <SectionTitle
              number="02"
              title="Initial Access"
              description="Temporary password yang digunakan ketika user pertama kali login."
            />

            <div className="mt-5">
              <Field>
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="password"
                    className="text-xs font-medium text-foreground"
                  >
                    Temporary Password
                  </Label>

                  <button
                    type="button"
                    onClick={
                      handleGeneratePassword
                    }
                    className="flex cursor-pointer items-center gap-1.5 text-[11px] font-medium text-primary transition-opacity hover:opacity-75"
                  >
                    <RefreshCw className="size-3" />

                    Generate password
                  </button>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value,
                      )
                    }
                    onKeyDown={
                      handlePasswordKeyEvent
                    }
                    onKeyUp={
                      handlePasswordKeyEvent
                    }
                    onFocus={
                      handlePasswordKeyEvent
                    }
                    onBlur={() =>
                      setIsCapsLockOn(false)
                    }
                    autoComplete="new-password"
                    placeholder="Masukkan temporary password"
                    className={[
                      "h-10 rounded-xl pl-10 pr-[84px] text-sm",
                      errors.password
                        ? "border-destructive focus-visible:border-destructive"
                        : "",
                    ].join(" ")}
                  />

                  {/* Input Actions */}
                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
                    {/* Copy */}
                    <button
                      type="button"
                      disabled={!form.password}
                      onClick={
                        handleCopyPassword
                      }
                      className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30"
                      aria-label="Copy password"
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>

                    {/* Show */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current,
                        )
                      }
                      className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Caps Lock */}
                {isCapsLockOn && (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-500/[0.08] px-3 py-2 text-amber-700">
                    <TriangleAlert className="size-3.5 shrink-0" />

                    <p className="text-[10px] font-medium">
                      Caps Lock sedang aktif
                    </p>
                  </div>
                )}

                {/* Error */}
                {errors.password && (
                  <FieldError>
                    {errors.password}
                  </FieldError>
                )}

                {/* Password UX */}
                <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-4">
                  <PasswordRequirements
                    password={form.password}
                  />

                  <div className="rounded-xl bg-muted/30 px-4 py-3">
                    <p className="text-[10px] font-medium text-foreground">
                      Password strength
                    </p>

                    {form.password ? (
                      <div className="mt-2.5">
                        <PasswordStrength
                          strength={
                            passwordStrength
                          }
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                        Strength akan muncul
                        setelah password diisi.
                      </p>
                    )}
                  </div>
                </div>

                {/* Force Password */}
                <div className="mt-1 flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-3.5">
                  <Checkbox
                    id="force-password"
                    checked={
                      form.forcePasswordChange
                    }
                    onCheckedChange={(
                      checked,
                    ) =>
                      updateField(
                        "forcePasswordChange",
                        Boolean(checked),
                      )
                    }
                    className="mt-0.5"
                  />

                  <div>
                    <Label
                      htmlFor="force-password"
                      className="cursor-pointer text-xs font-medium text-foreground"
                    >
                      Require password change
                      on first login
                    </Label>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      Direkomendasikan agar
                      temporary password hanya
                      digunakan sekali.
                    </p>
                  </div>
                </div>
              </Field>
            </div>
          </div>

          <SectionDivider />

          {/* ====================================================== */}
          {/* Plan */}
          {/* ====================================================== */}

          <div className="px-6 py-5">
            <SectionTitle
              number="03"
              title="User Plan"
              description="Pilih paket yang langsung dimiliki user ketika akun dibuat."
            />

            <div className="mt-5 grid grid-cols-3 gap-3">
              {planOptions.map((plan) => {
                const selected =
                  form.plan === plan.value

                const Icon = plan.icon

                return (
                  <button
                    key={plan.value}
                    type="button"
                    onClick={() =>
                      updateField(
                        "plan",
                        plan.value,
                      )
                    }
                    className={[
                      "group relative cursor-pointer rounded-xl border p-4 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/20",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={[
                          "flex size-8 items-center justify-center rounded-lg transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-foreground",
                        ].join(" ")}
                      >
                        <Icon className="size-3.5" />
                      </div>

                      <div
                        className={[
                          "flex size-5 items-center justify-center rounded-full border transition-all",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-transparent",
                        ].join(" ")}
                      >
                        <Check className="size-3" />
                      </div>
                    </div>

                    <p className="mt-4 text-[13px] font-semibold text-foreground">
                      {plan.label}
                    </p>

                    <p className="mt-1 text-[10px] font-medium text-primary">
                      {plan.eyebrow}
                    </p>

                    <p className="mt-2 max-w-[220px] text-[10px] leading-4 text-muted-foreground">
                      {plan.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* Right Summary */}
        {/* ======================================================== */}

        <aside className="sticky top-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-background">
            {/* Header */}
            <div className="p-5">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                User Summary
              </p>

              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                Periksa informasi sebelum
                membuat akun.
              </p>

              {/* User */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(
                    form.fullname,
                  ) || "NU"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {form.fullname.trim() ||
                      "New User"}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {form.email.trim() ||
                      "Email belum diisi"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="border-t border-border px-5 py-4">
              <div className="space-y-3.5">
                <SummaryRow
                  label="Plan"
                  value={
                    selectedPlan?.label
                  }
                />

                <SummaryRow
                  label="Account"
                  value="Active"
                  success
                />

                <SummaryRow
                  label="First login"
                  value={
                    form.forcePasswordChange
                      ? "Change password"
                      : "Use current password"
                  }
                />
              </div>
            </div>

            {/* Active Info */}
            <div className="border-t border-border p-4">
              <div className="rounded-xl bg-emerald-500/[0.07] p-3.5">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />

                  <div>
                    <p className="text-[11px] font-medium text-foreground">
                      Account will be active
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                      User dapat langsung login
                      dan menggunakan Aoi setelah
                      akun berhasil dibuat.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-border p-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full cursor-pointer rounded-xl text-xs"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <UserRound className="size-3.5" />
                    Create User
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() =>
                  navigate("/users")
                }
                className="mt-2 h-9 w-full cursor-pointer rounded-xl text-xs text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </section>

          {/* Security Information */}
          <div className="mt-3 flex gap-2.5 px-1">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <p className="text-[10px] leading-4 text-muted-foreground">
              Temporary password tidak boleh
              disimpan pada application log dan
              hanya digunakan untuk initial
              access.
            </p>
          </div>
        </aside>
      </form>
    </div>
  )
}

/* ========================================================================== */
/*                                UI HELPERS                                  */
/* ========================================================================== */

function SectionTitle({
  number,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
        {number}
      </div>

      <div>
        <h3 className="text-[13px] font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="mx-6 border-t border-border" />
  )
}

function Field({ children }) {
  return (
    <div className="space-y-2">
      {children}
    </div>
  )
}

function FieldHint({ children }) {
  return (
    <p className="text-[10px] leading-4 text-muted-foreground">
      {children}
    </p>
  )
}

function FieldError({ children }) {
  return (
    <p className="text-[10px] font-medium leading-4 text-destructive">
      {children}
    </p>
  )
}

function SummaryRow({
  label,
  value,
  success,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <div className="flex items-center gap-1.5">
        {success && (
          <span className="size-1.5 rounded-full bg-emerald-500" />
        )}

        <p className="max-w-[160px] truncate text-[11px] font-medium text-foreground">
          {value || "-"}
        </p>
      </div>
    </div>
  )
}

/* ========================================================================== */
/*                              PASSWORD UI                                   */
/* ========================================================================== */

function PasswordRequirements({
  password,
}) {
  const requirements = [
    {
      label: "Minimal 8 karakter",
      valid: password.length >= 8,
    },
    {
      label: "Huruf besar A-Z",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Huruf kecil a-z",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Angka 0-9",
      valid: /\d/.test(password),
    },
    {
      label: "Simbol !@#$...",
      valid: /[^A-Za-z0-9]/.test(
        password,
      ),
    },
  ]

  return (
    <div className="rounded-xl bg-muted/30 px-4 py-3">
      <p className="text-[10px] font-medium text-foreground">
        Password requirements
      </p>

      <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-2">
        {requirements.map(
          (requirement) => (
            <PasswordRequirementItem
              key={requirement.label}
              valid={requirement.valid}
            >
              {requirement.label}
            </PasswordRequirementItem>
          ),
        )}
      </div>
    </div>
  )
}

function PasswordRequirementItem({
  valid,
  children,
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "flex size-4 shrink-0 items-center justify-center rounded-full transition-all",
          valid
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-muted text-muted-foreground/50",
        ].join(" ")}
      >
        {valid ? (
          <Check className="size-2.5" />
        ) : (
          <span className="size-1 rounded-full bg-current" />
        )}
      </div>

      <p
        className={[
          "text-[10px] transition-colors",
          valid
            ? "text-foreground"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {children}
      </p>
    </div>
  )
}

function PasswordStrength({
  strength,
}) {
  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(
          (level) => (
            <div
              key={level}
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                level <= strength.level
                  ? strength.barClass
                  : "bg-muted",
              ].join(" ")}
            />
          ),
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          Security
        </p>

        <p
          className={[
            "text-[10px] font-medium",
            strength.textClass,
          ].join(" ")}
        >
          {strength.label}
        </p>
      </div>
    </div>
  )
}

/* ========================================================================== */
/*                                  HELPERS                                   */
/* ========================================================================== */

function getInitials(name) {
  if (!name?.trim()) {
    return ""
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim(),
  )
}

function isStrongEnoughPassword(
  password,
) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}

function getPasswordStrength(
  password,
) {
  if (!password) {
    return {
      level: 0,
      label: "",
      barClass: "bg-muted",
      textClass:
        "text-muted-foreground",
    }
  }

  let score = 0

  if (password.length >= 8) {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  if (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  ) {
    score += 1
  }

  if (
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    score += 1
  }

  if (score <= 1) {
    return {
      level: 1,
      label: "Weak",
      barClass: "bg-destructive",
      textClass: "text-destructive",
    }
  }

  if (score === 2) {
    return {
      level: 2,
      label: "Fair",
      barClass: "bg-amber-500",
      textClass: "text-amber-600",
    }
  }

  if (score === 3) {
    return {
      level: 3,
      label: "Good",
      barClass: "bg-primary",
      textClass: "text-primary",
    }
  }

  return {
    level: 4,
    label: "Strong",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600",
  }
}

function generatePassword() {
  const uppercase =
    "ABCDEFGHJKLMNPQRSTUVWXYZ"

  const lowercase =
    "abcdefghijkmnopqrstuvwxyz"

  const numbers = "23456789"

  const symbols = "!@#$%&*?"

  const all =
    uppercase +
    lowercase +
    numbers +
    symbols

  const requiredCharacters = [
    randomCharacter(uppercase),
    randomCharacter(lowercase),
    randomCharacter(numbers),
    randomCharacter(symbols),
  ]

  const remainingCharacters =
    Array.from(
      { length: 10 },
      () => randomCharacter(all),
    )

  return shuffle([
    ...requiredCharacters,
    ...remainingCharacters,
  ]).join("")
}

function randomCharacter(
  characters,
) {
  const values = new Uint32Array(1)

  crypto.getRandomValues(values)

  return characters[
    values[0] % characters.length
  ]
}

function shuffle(array) {
  const result = [...array]

  for (
    let index = result.length - 1;
    index > 0;
    index -= 1
  ) {
    const values =
      new Uint32Array(1)

    crypto.getRandomValues(values)

    const randomIndex =
      values[0] % (index + 1)

    const current =
      result[index]

    result[index] =
      result[randomIndex]

    result[randomIndex] =
      current
  }

  return result
}
import { useMemo, useState } from "react"

import {
  Bell,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Database,
  Coins,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const tabs = [
  {
    id: "PROFILE",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "SECURITY",
    label: "Security",
    icon: ShieldCheck,
  },
  {
    id: "NOTIFICATIONS",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "APPEARANCE",
    label: "Appearance",
    icon: Palette,
  },
]

const initialProfile = {
  fullname: "Rafi",
  email: "rafi@malaikatbiru.site",
  role: "OWNER",
}

const initialNotificationSettings = {
  newUser: true,
  subscriptionChange: true,
  subscriptionExpiry: true,
  dataUpdate: false,
  aiCostAlert: true,
  systemIssue: true,
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("PROFILE")

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-6 xl:px-8">
      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <div>
        <p className="text-xs font-medium text-primary">
          Platform
        </p>

        <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
          Settings
        </h1>

        <p className="mt-1.5 max-w-[680px] text-[13px] leading-5 text-muted-foreground">
          Kelola informasi akun, keamanan, notifikasi, dan preferensi tampilan
          internal Malaikat Biru.
        </p>
      </div>

      {/* ================================================================ */}
      {/* TAB NAVIGATION                                                   */}
      {/* ================================================================ */}

      <div className="mt-7 border-b border-border">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative flex h-11 cursor-pointer items-center gap-2 text-[12px] font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-3.5",
                    active
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                />

                {tab.label}

                {active && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-t-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* CONTENT                                                          */}
      {/* ================================================================ */}

      <div className="pt-6">
        {activeTab === "PROFILE" && (
          <ProfileSettings />
        )}

        {activeTab === "SECURITY" && (
          <SecuritySettings />
        )}

        {activeTab === "NOTIFICATIONS" && (
          <NotificationSettings />
        )}

        {activeTab === "APPEARANCE" && (
          <AppearanceSettings />
        )}
      </div>

      <div className="h-8" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* PROFILE                                                                    */
/* -------------------------------------------------------------------------- */

function ProfileSettings() {
  const [profile, setProfile] = useState(initialProfile)

  const [saved, setSaved] = useState(false)

  const [hasChanges, setHasChanges] = useState(false)

  const initials = useMemo(
    () => getInitials(profile.fullname),
    [profile.fullname],
  )

  function updateFullname(value) {
    setProfile((current) => ({
      ...current,
      fullname: value,
    }))

    setSaved(false)
    setHasChanges(true)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!hasChanges) {
      return
    }

    /*
      TODO API:

      await updateProfile({
        fullname: profile.fullname,
      })

      Email sengaja tidak dikirim karena
      email tidak dapat diubah dari settings.
    */

    setSaved(true)
    setHasChanges(false)

    window.setTimeout(() => {
      setSaved(false)
    }, 2200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[860px]"
    >
      <SettingsSectionHeader
        title="Profile Information"
        description="Informasi dasar akun yang digunakan untuk mengakses internal Malaikat Biru."
      />

      {/* ================================================================ */}
      {/* ACCOUNT SUMMARY                                                  */}
      {/* ================================================================ */}

      <div className="mt-6 flex items-center gap-4 border-b border-border pb-6">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground">
          {initials}
        </div>

        <div>
          <p className="text-[13px] font-semibold text-foreground">
            {profile.fullname}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="h-5 px-2 text-[8px]"
            >
              Owner
            </Badge>

            <span className="text-[10px] text-muted-foreground">
              Internal administrator
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* PROFILE FIELDS                                                   */}
      {/* ================================================================ */}

      <div className="mt-6 grid grid-cols-2 gap-5">
        <FormField
          label="Full Name"
          description="Nama yang tampil di internal dashboard."
        >
          <Input
            value={profile.fullname}
            onChange={(event) =>
              updateFullname(event.target.value)
            }
            className="h-10 rounded-lg text-xs"
          />
        </FormField>

        <FormField
          label="Email Address"
          description="Email utama yang terhubung dengan akun internal."
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="email"
              value={profile.email}
              readOnly
              aria-readonly="true"
              className="h-10 cursor-not-allowed rounded-lg bg-muted/40 pl-9 pr-20 text-xs text-muted-foreground"
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-medium text-muted-foreground">
              Locked
            </span>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
            Email tidak dapat diubah dari halaman settings.
          </p>
        </FormField>
      </div>

      {/* ================================================================ */}
      {/* ROLE                                                             */}
      {/* ================================================================ */}

      <div className="mt-6 border-t border-border pt-6">
        <FormField
          label="Account Role"
          description="Role menentukan akses terhadap fitur internal."
        >
          <div className="flex h-10 items-center justify-between rounded-lg border border-border bg-muted/20 px-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-muted-foreground" />

              <span className="text-xs font-medium text-foreground">
                Owner
              </span>
            </div>

            <Badge
              variant="secondary"
              className="text-[8px]"
            >
              Full Access
            </Badge>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
            Role akun tidak dapat diubah dari halaman ini.
          </p>
        </FormField>
      </div>

      <SettingsActions
        saved={saved}
        label="Save Changes"
        disabled={!hasChanges}
      />
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* SECURITY                                                                   */
/* -------------------------------------------------------------------------- */

function SecuritySettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [saved, setSaved] = useState(false)

  const requirements = useMemo(
    () => getPasswordRequirements(form.newPassword),
    [form.newPassword],
  )

  const passwordsMatch =
    form.newPassword.length > 0 &&
    form.newPassword === form.confirmPassword

  const canSubmit =
    form.currentPassword.length > 0 &&
    requirements.every((requirement) => requirement.valid) &&
    passwordsMatch

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    /*
      TODO API:

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
    */

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[860px]"
    >
      <SettingsSectionHeader
        title="Password & Security"
        description="Perbarui password akun internal untuk menjaga keamanan akses."
      />

      {/* ================================================================ */}
      {/* SECURITY NOTICE                                                  */}
      {/* ================================================================ */}

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
          <LockKeyhole className="size-3.5" />
        </div>

        <div>
          <p className="text-[11px] font-medium text-foreground">
            Internal account security
          </p>

          <p className="mt-1 max-w-[600px] text-[9px] leading-4 text-muted-foreground">
            Gunakan password yang berbeda dari akun publik Malaikat Biru dan
            hindari menggunakan kembali password dari layanan lainnya.
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CURRENT PASSWORD                                                 */}
      {/* ================================================================ */}

      <div className="mt-6 max-w-[520px]">
        <FormField
          label="Current Password"
          description="Masukkan password yang sedang digunakan."
        >
          <PasswordInput
            value={form.currentPassword}
            show={showCurrent}
            onToggle={() =>
              setShowCurrent((current) => !current)
            }
            onChange={(value) =>
              updateField("currentPassword", value)
            }
            placeholder="Current password"
          />
        </FormField>
      </div>

      <div className="my-6 border-t border-border" />

      {/* ================================================================ */}
      {/* NEW PASSWORD                                                     */}
      {/* ================================================================ */}

      <div className="grid max-w-[760px] grid-cols-2 gap-5">
        <FormField
          label="New Password"
          description="Buat password baru untuk akun ini."
        >
          <PasswordInput
            value={form.newPassword}
            show={showNew}
            onToggle={() =>
              setShowNew((current) => !current)
            }
            onChange={(value) =>
              updateField("newPassword", value)
            }
            placeholder="New password"
          />
        </FormField>

        <FormField
          label="Confirm Password"
          description="Masukkan kembali password baru."
        >
          <PasswordInput
            value={form.confirmPassword}
            show={showConfirm}
            onToggle={() =>
              setShowConfirm((current) => !current)
            }
            onChange={(value) =>
              updateField("confirmPassword", value)
            }
            placeholder="Confirm password"
          />

          {form.confirmPassword && (
            <p
              className={[
                "mt-2 text-[9px]",
                passwordsMatch
                  ? "text-emerald-600"
                  : "text-destructive",
              ].join(" ")}
            >
              {passwordsMatch
                ? "Password cocok."
                : "Password belum cocok."}
            </p>
          )}
        </FormField>
      </div>

      {/* ================================================================ */}
      {/* REQUIREMENTS                                                     */}
      {/* ================================================================ */}

      <div className="mt-5 max-w-[520px]">
        <p className="text-[10px] font-medium text-foreground">
          Password requirements
        </p>

        <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2">
          {requirements.map((requirement) => (
            <RequirementItem
              key={requirement.label}
              label={requirement.label}
              valid={requirement.valid}
            />
          ))}
        </div>
      </div>

      <SettingsActions
        saved={saved}
        label="Update Password"
        disabled={!canSubmit}
      />
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* NOTIFICATIONS                                                              */
/* -------------------------------------------------------------------------- */

function NotificationSettings() {
  const [settings, setSettings] = useState(
    initialNotificationSettings,
  )

  const [savedSettings, setSavedSettings] = useState(
    initialNotificationSettings,
  )

  const [saved, setSaved] = useState(false)

  const hasChanges = useMemo(() => {
    return Object.keys(settings).some(
      (key) => settings[key] !== savedSettings[key],
    )
  }, [settings, savedSettings])

  function updateSetting(key) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setSaved(false)
  }

  function handleSave() {
    if (!hasChanges) {
      return
    }

    /*
      TODO API:

      await updateNotificationSettings(settings)
    */

    setSavedSettings({
      ...settings,
    })

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2200)
  }

  return (
    <div className="max-w-[860px]">
      <SettingsSectionHeader
        title="Notifications"
        description="Atur notifikasi operasional yang ingin diterima dari internal Malaikat Biru."
      />

      {/* ================================================================ */}
      {/* ACCOUNT                                                          */}
      {/* ================================================================ */}

      <NotificationGroup
        title="Account"
        description="Aktivitas yang berkaitan dengan user dan subscription."
      >
        <NotificationSetting
          icon={UserRound}
          title="New User"
          description="Beritahu ketika user baru membuat akun."
          checked={settings.newUser}
          onToggle={() =>
            updateSetting("newUser")
          }
        />

        <NotificationSetting
          icon={Sparkles}
          title="Subscription Changes"
          description="Beritahu ketika subscription user diubah, diperpanjang, atau dibatalkan."
          checked={settings.subscriptionChange}
          onToggle={() =>
            updateSetting("subscriptionChange")
          }
        />

        <NotificationSetting
          icon={Bell}
          title="Subscription Expiry"
          description="Beritahu ketika subscription user mendekati tanggal berakhir."
          checked={settings.subscriptionExpiry}
          onToggle={() =>
            updateSetting("subscriptionExpiry")
          }
        />
      </NotificationGroup>

      {/* ================================================================ */}
      {/* AOI                                                              */}
      {/* ================================================================ */}

      <NotificationGroup
        title="Aoi"
        description="Aktivitas yang berkaitan dengan data dan penggunaan AI."
      >
        <NotificationSetting
          icon={Database}
          title="Data Updates"
          description="Beritahu ketika terdapat perubahan penting pada data Aoi."
          checked={settings.dataUpdate}
          onToggle={() =>
            updateSetting("dataUpdate")
          }
        />

        <NotificationSetting
          icon={Coins}
          title="AI Cost Alerts"
          description="Beritahu ketika penggunaan AI melewati batas biaya yang ditentukan."
          checked={settings.aiCostAlert}
          onToggle={() =>
            updateSetting("aiCostAlert")
          }
        />
      </NotificationGroup>

      {/* ================================================================ */}
      {/* SYSTEM                                                           */}
      {/* ================================================================ */}

      <NotificationGroup
        title="System"
        description="Notifikasi untuk kondisi penting pada aplikasi internal."
        last
      >
        <NotificationSetting
          icon={ShieldCheck}
          title="System Issues"
          description="Beritahu ketika terjadi error atau masalah penting pada platform."
          checked={settings.systemIssue}
          onToggle={() =>
            updateSetting("systemIssue")
          }
        />
      </NotificationGroup>

      <SettingsActions
        saved={saved}
        label="Save Preferences"
        disabled={!hasChanges}
        onClick={handleSave}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NOTIFICATION GROUP                                                         */
/* -------------------------------------------------------------------------- */

function NotificationGroup({
  title,
  description,
  children,
  last,
}) {
  return (
    <section
      className={[
        "pt-6",
        !last
          ? "border-b border-border pb-6"
          : "",
      ].join(" ")}
    >
      <div className="mb-2">
        <p className="text-[11px] font-semibold text-foreground">
          {title}
        </p>

        <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="divide-y divide-border">
        {children}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* NOTIFICATION SETTING                                                       */
/* -------------------------------------------------------------------------- */

function NotificationSetting({
  icon: Icon,
  title,
  description,
  checked,
  onToggle,
}) {
  return (
    <div className="flex min-h-[72px] items-center gap-4 py-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 max-w-[620px] text-[9px] leading-4 text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        onClick={onToggle}
        label={title}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SWITCH                                                                     */
/* -------------------------------------------------------------------------- */

function Switch({
  checked,
  onClick,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={onClick}
      className={[
        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200",
        checked
          ? "border-primary bg-primary"
          : "border-border bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-[3px] size-4 rounded-full bg-white shadow-sm transition-[left] duration-200",
          checked
            ? "left-[23px]"
            : "left-[3px]",
        ].join(" ")}
      />
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* APPEARANCE                                                                 */
/* -------------------------------------------------------------------------- */

function AppearanceSettings() {
  const [theme, setTheme] = useState("LIGHT")

  const [savedTheme, setSavedTheme] = useState("LIGHT")

  const [density, setDensity] = useState("COMFORTABLE")

  const [savedDensity, setSavedDensity] = useState(
    "COMFORTABLE",
  )

  const [saved, setSaved] = useState(false)

  const hasChanges =
    theme !== savedTheme ||
    density !== savedDensity

  function changeTheme(value) {
    setTheme(value)
    setSaved(false)
  }

  function changeDensity(value) {
    setDensity(value)
    setSaved(false)
  }

  function handleSave() {
    if (!hasChanges) {
      return
    }

    /*
      TODO:

      save ke backend / local storage.
    */

    setSavedTheme(theme)
    setSavedDensity(density)

    setSaved(true)

    window.setTimeout(() => {
      setSaved(false)
    }, 2200)
  }

  return (
    <div className="max-w-[860px]">
      <SettingsSectionHeader
        title="Appearance"
        description="Sesuaikan tampilan internal dashboard dengan preferensi kerja."
      />

      {/* ================================================================ */}
      {/* THEME                                                            */}
      {/* ================================================================ */}

      <div className="mt-6">
        <SettingLabel
          title="Theme"
          description="Pilih mode tampilan aplikasi."
        />

        <div className="mt-4 grid grid-cols-3 gap-3">
          <AppearanceOption
            icon={Sun}
            title="Light"
            description="Gunakan tampilan terang."
            selected={theme === "LIGHT"}
            onClick={() =>
              changeTheme("LIGHT")
            }
          />

          <AppearanceOption
            icon={Moon}
            title="Dark"
            description="Gunakan tampilan gelap."
            selected={theme === "DARK"}
            onClick={() =>
              changeTheme("DARK")
            }
          />

          <AppearanceOption
            icon={Monitor}
            title="System"
            description="Ikuti pengaturan perangkat."
            selected={theme === "SYSTEM"}
            onClick={() =>
              changeTheme("SYSTEM")
            }
          />
        </div>
      </div>

      {/* ================================================================ */}
      {/* DENSITY                                                          */}
      {/* ================================================================ */}

      <div className="mt-7 border-t border-border pt-6">
        <SettingLabel
          title="Interface Density"
          description="Atur seberapa rapat informasi ditampilkan."
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <AppearanceOption
            title="Comfortable"
            description="Spacing lebih lega untuk penggunaan sehari-hari."
            selected={density === "COMFORTABLE"}
            onClick={() =>
              changeDensity("COMFORTABLE")
            }
          />

          <AppearanceOption
            title="Compact"
            description="Menampilkan lebih banyak informasi dalam satu layar."
            selected={density === "COMPACT"}
            onClick={() =>
              changeDensity("COMPACT")
            }
          />
        </div>
      </div>

      <SettingsActions
        saved={saved}
        label="Save Appearance"
        disabled={!hasChanges}
        onClick={handleSave}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SECTION HEADER                                                             */
/* -------------------------------------------------------------------------- */

function SettingsSectionHeader({
  title,
  description,
}) {
  return (
    <div>
      <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h2>

      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FORM FIELD                                                                 */
/* -------------------------------------------------------------------------- */

function FormField({
  label,
  description,
  children,
}) {
  return (
    <div>
      <label className="text-[11px] font-medium text-foreground">
        {label}
      </label>

      {description && (
        <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
          {description}
        </p>
      )}

      <div className="mt-2">
        {children}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* PASSWORD INPUT                                                             */
/* -------------------------------------------------------------------------- */

function PasswordInput({
  value,
  show,
  onToggle,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative">
      <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-10 rounded-lg pl-9 pr-10 text-xs"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={
          show
            ? "Hide password"
            : "Show password"
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        {show ? (
          <EyeOff className="size-3.5" />
        ) : (
          <Eye className="size-3.5" />
        )}
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* PASSWORD REQUIREMENT                                                       */
/* -------------------------------------------------------------------------- */

function RequirementItem({
  label,
  valid,
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "flex size-4 shrink-0 items-center justify-center rounded-full",
          valid
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Check className="size-2.5" />
      </div>

      <span
        className={[
          "text-[9px]",
          valid
            ? "text-foreground"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* APPEARANCE OPTION                                                          */
/* -------------------------------------------------------------------------- */

function AppearanceOption({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative cursor-pointer rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary/40 bg-primary/[0.04]"
          : "border-border bg-background hover:bg-muted/20",
      ].join(" ")}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </div>
      )}

      {Icon && (
        <div
          className={[
            "flex size-8 items-center justify-center rounded-lg",
            selected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          <Icon className="size-3.5" />
        </div>
      )}

      <p
        className={[
          Icon ? "mt-4" : "",
          "text-[11px] font-semibold text-foreground",
        ].join(" ")}
      >
        {title}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* SETTING LABEL                                                              */
/* -------------------------------------------------------------------------- */

function SettingLabel({
  title,
  description,
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-foreground">
        {title}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ACTIONS                                                                    */
/* -------------------------------------------------------------------------- */

function SettingsActions({
  saved,
  label,
  disabled,
  onClick,
}) {
  return (
    <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
      <Button
        type={onClick ? "button" : "submit"}
        disabled={disabled}
        onClick={onClick}
        className="h-9 cursor-pointer gap-2 rounded-lg px-4 text-[11px]"
      >
        {saved ? (
          <>
            <Check className="size-3.5" />
            Saved
          </>
        ) : (
          <>
            <Save className="size-3.5" />
            {label}
          </>
        )}
      </Button>

      {saved && (
        <p className="text-[9px] text-emerald-600">
          Changes saved successfully.
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name) {
  if (!name?.trim()) {
    return "U"
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}

function getPasswordRequirements(password) {
  return [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ]
}
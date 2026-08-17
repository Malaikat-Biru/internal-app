import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* -------------------------------------------------------------------------- */
/*                                  MOCK DATA                                 */
/* -------------------------------------------------------------------------- */

const users = [
  {
    id: "USR-0001",
    username: "rafi",
    fullname: "Rafi Asshiddiqie",
    email: "rafi@example.com",

    plan: "FREE",

    subscription: null,
  },

  {
    id: "USR-0002",
    username: "abi",
    fullname: "Abi Rachman",
    email: "abi@example.com",

    plan: "PLUS",

    subscription: {
      plan: "PLUS",

      startedAt: "2026-08-01",
      expiresAt: "2026-09-01",
    },
  },

  {
    id: "USR-0003",
    username: "mikaaoi",
    fullname: "Mika Aoi",
    email: "mika@example.com",

    plan: "FREE",

    subscription: null,
  },

  {
    id: "USR-0004",
    username: "akira",
    fullname: "Akira",
    email: "akira@example.com",

    plan: "ULTIMATE",

    subscription: {
      plan: "ULTIMATE",

      startedAt: "2026-07-20",
      expiresAt: "2026-08-20",
    },
  },

  {
    id: "USR-0005",
    username: "yuki",
    fullname: "Yuki",
    email: "yuki@example.com",

    plan: "FREE",

    subscription: null,
  },
]

const planOptions = [
  {
    value: "PLUS",
    label: "Plus",
    icon: Sparkles,

    description:
      "Limit penggunaan Aoi lebih tinggi untuk penggunaan rutin.",
  },

  {
    value: "ULTIMATE",
    label: "Ultimate",
    icon: Zap,

    description:
      "Akses dan limit tertinggi untuk seluruh layanan Aoi.",
  },
]

const durationPresets = {
  DAYS: [7, 14, 30, 60],

  MONTHS: [1, 3, 6, 12],
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function AssignSubscriptionPage() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] =
    useState("")

  const [user, setUser] =
    useState(null)

  const [lookupError, setLookupError] =
    useState("")

  const [checking, setChecking] =
    useState(false)

  const [plan, setPlan] =
    useState("PLUS")

  const [startDate, setStartDate] =
    useState(getTodayDate())

  const [
    durationType,
    setDurationType,
  ] = useState("MONTHS")

  const [
    durationValue,
    setDurationValue,
  ] = useState(1)

  const [note, setNote] =
    useState("")

  const [assigning, setAssigning] =
    useState(false)

  const expirationDate =
    useMemo(() => {
      if (!startDate) {
        return null
      }

      if (
        durationType === "DAYS"
      ) {
        return addDays(
          startDate,
          durationValue,
        )
      }

      return addMonths(
        startDate,
        durationValue,
      )
    }, [
      startDate,
      durationType,
      durationValue,
    ])

  const presets =
    durationPresets[
      durationType
    ]

  /* ---------------------------------------------------------------------- */
  /* CHECK USER                                                             */
  /* ---------------------------------------------------------------------- */

  const handleCheckUser =
    async (event) => {
      event.preventDefault()

      const query =
        identifier
          .trim()
          .toLowerCase()

      setLookupError("")
      setUser(null)

      if (!query) {
        setLookupError(
          "Masukkan username atau email user.",
        )

        return
      }

      setChecking(true)

      try {
        await Promise.resolve()

        /*
          Nantinya bisa diganti:

          const response =
            await checkUser({
              identifier: query,
            })

          Exact match.
          Tidak menggunakan autocomplete.
        */

        const foundUser =
          users.find(
            (item) =>
              item.username.toLowerCase() ===
                query ||
              item.email.toLowerCase() ===
                query,
          )

        if (!foundUser) {
          setLookupError(
            "User tidak ditemukan. Pastikan username atau email sudah benar.",
          )

          return
        }

        const activeSubscription =
          foundUser.subscription &&
          getSubscriptionStatus(
            foundUser.subscription
              .expiresAt,
          ) !== "EXPIRED"

        if (activeSubscription) {
          setLookupError(
            `${foundUser.fullname} masih memiliki plan ${formatPlan(
              foundUser
                .subscription.plan,
            )} aktif sampai ${formatDate(
              foundUser
                .subscription
                .expiresAt,
            )}. Kelola plan melalui Manage Subscription.`,
          )

          return
        }

        setUser(foundUser)
      } finally {
        setChecking(false)
      }
    }

  /* ---------------------------------------------------------------------- */
  /* RESET USER                                                             */
  /* ---------------------------------------------------------------------- */

  const handleChangeUser = () => {
    setUser(null)
    setIdentifier("")
    setLookupError("")

    setPlan("PLUS")

    setStartDate(
      getTodayDate(),
    )

    setDurationType(
      "MONTHS",
    )

    setDurationValue(1)

    setNote("")
  }

  /* ---------------------------------------------------------------------- */
  /* DURATION                                                               */
  /* ---------------------------------------------------------------------- */

  const handleDurationType = (
    type,
  ) => {
    setDurationType(type)

    setDurationValue(
      type === "DAYS"
        ? 30
        : 1,
    )
  }

  /* ---------------------------------------------------------------------- */
  /* ASSIGN                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleAssign = async () => {
    if (!user) {
      return
    }

    setAssigning(true)

    try {
      const payload = {
        userId: user.id,

        plan,

        startedAt:
          startDate,

        expiresAt:
          expirationDate,

        duration: {
          type:
            durationType,

          value: Number(
            durationValue,
          ),
        },

        assignedAt:
          getCurrentDateTime(),

        assignedBy: "Rafi",

        note:
          note.trim() ||
          null,
      }

      console.log(
        "Assign plan payload:",
        payload,
      )

      /*
        TODO:

        await assignPlanMutation.mutateAsync(
          payload,
        )
      */

      navigate(
        "/subscriptions",
      )
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-6 xl:px-8">
      {/* ================================================================ */}
      {/* Back                                                             */}
      {/* ================================================================ */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/subscriptions",
          )
        }
        className="group flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />

        Subscriptions
      </button>

      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <div className="mt-4">
        <p className="text-xs font-medium text-primary">
          Subscription Management
        </p>

        <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
          Assign Plan
        </h1>

        <p className="mt-1.5 max-w-[640px] text-[13px] leading-5 text-muted-foreground">
          Verifikasi akun terlebih dahulu, kemudian berikan plan sesuai
          pembelian user.
        </p>
      </div>

      {/* ================================================================ */}
      {/* USER LOOKUP                                                      */}
      {/* ================================================================ */}

      <section className="mt-6 rounded-2xl border border-border bg-background">
        <div className="flex items-start justify-between gap-6 border-b border-border px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <UserRound className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold tracking-tight">
                User Verification
              </h2>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Masukkan username atau email secara tepat untuk memverifikasi
              akun.
            </p>
          </div>

          {user && (
            <Badge className="border-emerald-500/15 bg-emerald-500/10 text-[10px] font-medium text-emerald-700 hover:bg-emerald-500/10">
              Verified
            </Badge>
          )}
        </div>

        <div className="px-5 py-5">
          {!user ? (
            <form
              onSubmit={
                handleCheckUser
              }
              className="max-w-[680px]"
            >
              <Label
                htmlFor="identifier"
                className="text-[11px] font-medium"
              >
                Username or Email
              </Label>

              <div className="mt-2 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="identifier"
                    value={
                      identifier
                    }
                    onChange={(
                      event,
                    ) => {
                      setIdentifier(
                        event.target
                          .value,
                      )

                      setLookupError(
                        "",
                      )
                    }}
                    autoFocus
                    autoComplete="off"
                    placeholder="username atau email@example.com"
                    className="h-10 rounded-xl pl-10 text-xs"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    checking
                  }
                  className="h-10 min-w-[120px] cursor-pointer rounded-xl text-xs"
                >
                  {checking ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />

                      Checking...
                    </>
                  ) : (
                    "Check User"
                  )}
                </Button>
              </div>

              <p className="mt-2 text-[10px] text-muted-foreground">
                Exact username atau email diperlukan. Sistem tidak menampilkan
                suggestion user.
              </p>

              {lookupError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/10 bg-destructive/[0.045] px-3.5 py-3">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />

                  <p className="text-[10px] leading-4 text-destructive">
                    {lookupError}
                  </p>
                </div>
              )}
            </form>
          ) : (
            <div className="flex items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                  {getInitials(
                    user.fullname,
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {user.fullname}
                    </p>

                    <PlanBadge
                      plan="FREE"
                    />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <UserRound className="size-3" />

                      @{user.username}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Mail className="size-3" />

                      {user.email}
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                      {user.id}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={
                  handleChangeUser
                }
                className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-[11px]"
              >
                Change User
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* FORM                                                             */}
      {/* ================================================================ */}

      {user && (
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_330px] items-start gap-4">
          {/* ============================================================ */}
          {/* LEFT                                                        */}
          {/* ============================================================ */}

          <div className="overflow-hidden rounded-2xl border border-border bg-background">
            {/* ========================================================== */}
            {/* PLAN                                                       */}
            {/* ========================================================== */}

            <section className="px-5 py-5">
              <div>
                <h2 className="text-[13px] font-semibold tracking-tight">
                  Select Plan
                </h2>

                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                  Pilih plan yang sudah dibeli oleh user.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {planOptions.map(
                  (option) => {
                    const Icon =
                      option.icon

                    const selected =
                      plan ===
                      option.value

                    return (
                      <button
                        key={
                          option.value
                        }
                        type="button"
                        onClick={() =>
                          setPlan(
                            option.value,
                          )
                        }
                        className={[
                          "group cursor-pointer rounded-xl border p-4 text-left transition-all",
                          selected
                            ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
                            : "border-border hover:border-primary/30 hover:bg-muted/20",
                        ].join(
                          " ",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={[
                              "flex size-9 items-center justify-center rounded-xl transition-colors",
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:text-foreground",
                            ].join(
                              " ",
                            )}
                          >
                            <Icon className="size-4" />
                          </div>

                          <div
                            className={[
                              "flex size-5 items-center justify-center rounded-full border",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-transparent",
                            ].join(
                              " ",
                            )}
                          >
                            <Check className="size-3" />
                          </div>
                        </div>

                        <p className="mt-3 text-xs font-semibold">
                          {
                            option.label
                          }
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                          {
                            option.description
                          }
                        </p>
                      </button>
                    )
                  },
                )}
              </div>
            </section>

            <SectionDivider />

            {/* ========================================================== */}
            {/* PERIOD                                                     */}
            {/* ========================================================== */}

            <section className="px-5 py-5">
              <div>
                <h2 className="text-[13px] font-semibold tracking-tight">
                  Subscription Period
                </h2>

                <p className="mt-1 text-[10px] text-muted-foreground">
                  Tentukan kapan plan mulai aktif dan berapa lama akses
                  diberikan.
                </p>
              </div>

              {/* Start date */}
              <div className="mt-5 max-w-[320px]">
                <Label
                  htmlFor="start-date"
                  className="text-[10px] font-medium text-muted-foreground"
                >
                  Start Date
                </Label>

                <div className="relative mt-2">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="start-date"
                    type="date"
                    value={
                      startDate
                    }
                    onChange={(
                      event,
                    ) =>
                      setStartDate(
                        event.target
                          .value,
                      )
                    }
                    className="h-10 rounded-xl pl-10 text-xs"
                  />
                </div>
              </div>

              {/* Unit */}
              <div className="mt-5">
                <Label className="text-[10px] font-medium text-muted-foreground">
                  Duration Type
                </Label>

                <div className="mt-2 inline-flex rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleDurationType(
                        "DAYS",
                      )
                    }
                    className={[
                      "h-8 min-w-[100px] cursor-pointer rounded-lg px-4 text-[11px] font-medium transition-all",
                      durationType ===
                      "DAYS"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(
                      " ",
                    )}
                  >
                    Days
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDurationType(
                        "MONTHS",
                      )
                    }
                    className={[
                      "h-8 min-w-[100px] cursor-pointer rounded-lg px-4 text-[11px] font-medium transition-all",
                      durationType ===
                      "MONTHS"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(
                      " ",
                    )}
                  >
                    Months
                  </button>
                </div>
              </div>

              {/* Quick duration */}
              <div className="mt-4">
                <Label className="text-[10px] font-medium text-muted-foreground">
                  Quick Select
                </Label>

                <div className="mt-2 flex flex-wrap gap-2">
                  {presets.map(
                    (value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDurationValue(
                            value,
                          )
                        }
                        className={[
                          "h-9 cursor-pointer rounded-xl border px-3.5 text-[11px] font-medium transition-all",
                          Number(
                            durationValue,
                          ) ===
                          value
                            ? "border-primary bg-primary/[0.055] text-primary ring-3 ring-primary/10"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        ].join(
                          " ",
                        )}
                      >
                        {value}{" "}
                        {durationType ===
                        "DAYS"
                          ? value ===
                            1
                            ? "day"
                            : "days"
                          : value ===
                              1
                            ? "month"
                            : "months"}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Custom */}
              <div className="mt-4 max-w-[210px]">
                <Label
                  htmlFor="custom-duration"
                  className="text-[10px] font-medium text-muted-foreground"
                >
                  Custom Duration
                </Label>

                <div className="relative mt-2">
                  <Input
                    id="custom-duration"
                    type="number"
                    min="1"
                    value={
                      durationValue
                    }
                    onChange={(
                      event,
                    ) =>
                      setDurationValue(
                        Math.max(
                          1,
                          Number(
                            event.target
                              .value,
                          ) || 1,
                        ),
                      )
                    }
                    className="h-9 rounded-xl pr-20 text-xs"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    {durationType ===
                    "DAYS"
                      ? "days"
                      : "months"}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-5 overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.035]">
                <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
                  <Clock3 className="size-3.5 text-primary" />

                  <p className="text-[10px] font-medium text-primary">
                    Subscription Period Preview
                  </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-primary/10">
                  <PeriodItem
                    label="Plan"
                    value={formatPlan(
                      plan,
                    )}
                  />

                  <PeriodItem
                    label="Starts"
                    value={formatDate(
                      startDate,
                    )}
                  />

                  <PeriodItem
                    label="Expires"
                    value={formatDate(
                      expirationDate,
                    )}
                    highlight
                  />
                </div>
              </div>
            </section>

            <SectionDivider />

            {/* ========================================================== */}
            {/* NOTE                                                       */}
            {/* ========================================================== */}

            <section className="px-5 py-5">
              <h2 className="text-[13px] font-semibold tracking-tight">
                Internal Note
              </h2>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Optional. Catatan transaksi hanya dapat dilihat oleh admin.
              </p>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value,
                  )
                }
                rows={3}
                placeholder="Contoh: Ultimate 30 hari, pembayaran via Discord."
                className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-xs leading-5 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </section>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SUMMARY                                               */}
          {/* ============================================================ */}

          <aside className="sticky top-6">
            <section className="rounded-2xl border border-border bg-background p-5">
              <h2 className="text-sm font-semibold tracking-tight">
                Assignment Summary
              </h2>

              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                Pastikan user, plan, dan durasi sudah sesuai dengan pembelian.
              </p>

              {/* User */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-semibold text-primary">
                  {getInitials(
                    user.fullname,
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">
                    {user.fullname}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-border" />

              {/* Summary */}
              <div className="space-y-4">
                <SummaryRow
                  label="Plan"
                  value={formatPlan(
                    plan,
                  )}
                />

                <SummaryRow
                  label="Duration"
                  value={formatDuration(
                    durationType,
                    durationValue,
                  )}
                />

                <SummaryRow
                  label="Start Date"
                  value={formatDate(
                    startDate,
                  )}
                />

                <SummaryRow
                  label="Expiration"
                  value={formatDate(
                    expirationDate,
                  )}
                  highlight
                />
              </div>

              <div className="mt-5 rounded-xl bg-muted/35 px-3.5 py-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />

                  <p className="text-[10px] leading-4 text-muted-foreground">
                    User akan langsung mendapatkan akses{" "}
                    <span className="font-medium text-foreground">
                      {formatPlan(
                        plan,
                      )}
                    </span>{" "}
                    mulai{" "}
                    {formatDate(
                      startDate,
                    )}
                    .
                  </p>
                </div>
              </div>

              <Button
                type="button"
                disabled={assigning}
                onClick={
                  handleAssign
                }
                className="mt-5 h-10 w-full cursor-pointer rounded-xl text-xs"
              >
                {assigning ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />

                    Assigning...
                  </>
                ) : (
                  "Assign Plan"
                )}
              </Button>
            </section>
          </aside>
        </div>
      )}

      {/* Empty */}
      {!user && (
        <section className="mt-4 flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/[0.12]">
          <div className="max-w-[360px] text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <UserRound className="size-4" />
            </div>

            <p className="mt-3 text-xs font-medium text-foreground">
              Verify a user first
            </p>

            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              Konfigurasi plan akan tersedia setelah username atau email berhasil
              diverifikasi.
            </p>
          </div>
        </section>
      )}

      <div className="h-8" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SMALL UI                                                                   */
/* -------------------------------------------------------------------------- */

function SectionDivider() {
  return (
    <div className="mx-5 border-t border-border" />
  )
}

function PeriodItem({
  label,
  value,
  highlight,
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-[11px] font-medium",
          highlight
            ? "text-primary"
            : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  highlight,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "text-right text-[11px] font-medium",
          highlight
            ? "text-primary"
            : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  )
}

function PlanBadge({ plan }) {
  if (plan === "ULTIMATE") {
    return (
      <Badge className="border-primary/15 bg-primary/10 text-[9px] text-primary hover:bg-primary/10">
        Ultimate
      </Badge>
    )
  }

  if (plan === "PLUS") {
    return (
      <Badge
        variant="secondary"
        className="text-[9px]"
      >
        Plus
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="text-[9px] text-muted-foreground"
    >
      Free
    </Badge>
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
    .map((word) =>
      word.charAt(0),
    )
    .join("")
    .toUpperCase()
}

function formatPlan(plan) {
  if (plan === "ULTIMATE") {
    return "Ultimate"
  }

  if (plan === "PLUS") {
    return "Plus"
  }

  return "Free"
}

function formatDuration(
  type,
  value,
) {
  if (type === "DAYS") {
    return `${value} ${
      Number(value) === 1
        ? "day"
        : "days"
    }`
  }

  return `${value} ${
    Number(value) === 1
      ? "month"
      : "months"
  }`
}

function formatDate(value) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  )
}

function getTodayDate() {
  return getISODate(
    new Date(),
  )
}

function getISODate(date) {
  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0")

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function addDays(
  value,
  days,
) {
  const date =
    new Date(
      `${value}T00:00:00`,
    )

  date.setDate(
    date.getDate() +
      Number(days),
  )

  return getISODate(date)
}

function addMonths(
  value,
  months,
) {
  const date =
    new Date(
      `${value}T00:00:00`,
    )

  const originalDay =
    date.getDate()

  date.setDate(1)

  date.setMonth(
    date.getMonth() +
      Number(months),
  )

  const lastDay =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate()

  date.setDate(
    Math.min(
      originalDay,
      lastDay,
    ),
  )

  return getISODate(date)
}

function getRemainingDays(
  expiresAt,
) {
  if (!expiresAt) {
    return -1
  }

  const today =
    new Date()

  today.setHours(
    0,
    0,
    0,
    0,
  )

  const expiration =
    new Date(
      `${expiresAt}T00:00:00`,
    )

  return Math.ceil(
    (expiration.getTime() -
      today.getTime()) /
      86400000,
  )
}

function getSubscriptionStatus(
  expiresAt,
) {
  const remaining =
    getRemainingDays(
      expiresAt,
    )

  if (remaining < 0) {
    return "EXPIRED"
  }

  if (remaining <= 7) {
    return "EXPIRING"
  }

  return "ACTIVE"
}

function getCurrentDateTime() {
  const date =
    new Date()

  const hours =
    String(
      date.getHours(),
    ).padStart(2, "0")

  const minutes =
    String(
      date.getMinutes(),
    ).padStart(2, "0")

  return `${getISODate(
    date,
  )} ${hours}:${minutes}`
}
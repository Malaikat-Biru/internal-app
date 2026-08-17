import { useMemo, useState } from "react"
import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gamepad2,
  KeyRound,
  Mail,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* -------------------------------------------------------------------------- */
/*                                  MOCK DATA                                 */
/* -------------------------------------------------------------------------- */

const users = {
  "USR-0001": {
    id: "USR-0001",

    fullname: "Rafi Asshiddiqie",
    email: "rafi@example.com",

    status: "ACTIVE",

    registeredAt: "2026-07-12",
    lastActiveAt: "2026-08-08 15:42",

    password: {
      lastChangedAt: "2026-07-28 20:14",
      forceChange: false,
    },

    characters: [
      {
        id: "CHAR-001",
        name: "Aoi",
        level: 290,
        className: "Dual Sword",
        main: true,
      },
      {
        id: "CHAR-002",
        name: "Kuro",
        level: 284,
        className: "Mage",
        main: false,
      },
      {
        id: "CHAR-003",
        name: "Hina",
        level: 270,
        className: "Bow",
        main: false,
      },
    ],

    chatbot: {
      messagesThisMonth: 67,
      conversationsThisMonth: 18,
      totalTokensThisMonth: 124820,

      lastUsedAt: "2026-08-08 15:17",

      reports: 0,
    },

    subscription: {
  plan: "ULTIMATE",

  startedAt: "2026-07-20",
  expiresAt: "2026-08-20",

  duration: {
    type: "MONTHS",
    value: 1,
  },

  assignedAt: "2026-07-20 18:12",
  assignedBy: "Rafi",

  note: "Ultimate 1 bulan via Discord.",
},
  },
}

/* -------------------------------------------------------------------------- */
/*                                  PLAN DATA                                 */
/* -------------------------------------------------------------------------- */

const planOptions = [
  {
    value: "PLUS",
    label: "Plus",
    description:
      "Limit penggunaan Aoi lebih tinggi untuk penggunaan rutin.",
    icon: Sparkles,
  },
  {
    value: "ULTIMATE",
    label: "Ultimate",
    description:
      "Akses dan limit tertinggi untuk seluruh layanan Aoi.",
    icon: Zap,
  },
]

const durationOptions = [
  {
    value: 1,
    label: "1 Month",
  },
  {
    value: 3,
    label: "3 Months",
  },
  {
    value: 6,
    label: "6 Months",
  },
  {
    value: 12,
    label: "12 Months",
  },
]

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function UserDetailPage() {
  const navigate = useNavigate()
  const { userId } = useParams()

  const sourceUser =
    users[userId] || users["USR-0001"]

  const [user, setUser] =
    useState(sourceUser)

  const [
    showSubscriptionModal,
    setShowSubscriptionModal,
  ] = useState(false)

  const initials = useMemo(
    () =>
      getInitials(user.fullname),
    [user.fullname],
  )

  const subscriptionStatus =
    getSubscriptionStatus(
      user.subscription?.expiresAt,
    )

  return (
    <>
      <div className="mx-auto w-full max-w-[1380px] px-6 py-6 xl:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/users")
          }
          className="group flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />

          Users
        </button>

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <section className="mt-4 rounded-2xl border border-border bg-background">
          <div className="flex items-start justify-between gap-8 px-6 py-5">
            <div className="flex min-w-0 items-center gap-4">
              {/* Avatar */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-semibold text-primary">
                {initials}
              </div>

              {/* Identity */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-[24px] font-semibold tracking-[-0.04em] text-foreground">
                    {user.fullname}
                  </h1>

                  <AccountStatus
                    status={user.status}
                  />

                  <PlanBadge
                    plan={
                      subscriptionStatus ===
                      "EXPIRED"
                        ? "FREE"
                        : user.subscription
                            ?.plan
                    }
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <HeaderInformation
                    icon={Mail}
                    value={user.email}
                  />

                  <HeaderInformation
                    icon={UserRound}
                    value={user.id}
                  />

                  <HeaderInformation
                    icon={CalendarDays}
                    value={`Bergabung ${formatDate(
                      user.registeredAt,
                    )}`}
                  />

                  <HeaderInformation
                    icon={Clock3}
                    value={formatLastActive(
                      user.lastActiveAt,
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              type="button"
              variant="outline"
              className="h-9 shrink-0 cursor-pointer gap-2 rounded-lg text-xs"
            >
              <Pencil className="size-3.5" />

              Edit User
            </Button>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CONTENT                                                          */}
        {/* ================================================================ */}

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_350px] items-start gap-4">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Account */}
            <section className="rounded-2xl border border-border bg-background">
              <SectionHeader
                icon={UserRound}
                title="Account Information"
                description="Informasi utama akun pengguna Malaikat Biru."
              />

              <div className="grid grid-cols-2 gap-x-10 gap-y-5 px-5 py-5">
                <InformationItem
                  label="Full Name"
                  value={user.fullname}
                />

                <InformationItem
                  label="Email Address"
                  value={user.email}
                />

                <InformationItem
                  label="User ID"
                  value={user.id}
                />

                <InformationItem label="Account Status">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />

                    <span className="text-xs font-medium text-foreground">
                      Active
                    </span>
                  </div>
                </InformationItem>

                <InformationItem
                  label="Registered"
                  value={formatDate(
                    user.registeredAt,
                  )}
                />

                <InformationItem
                  label="Last Active"
                  value={formatDateTime(
                    user.lastActiveAt,
                  )}
                />
              </div>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-border bg-background">
              <SectionHeader
                icon={ShieldCheck}
                title="Security"
                description="Informasi password dan keamanan akun."
              />

              <div className="flex items-center justify-between gap-8 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <KeyRound className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Account Password
                    </p>

                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Terakhir diubah{" "}
                      {formatDateTime(
                        user.password
                          .lastChangedAt,
                      )}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />

                      <p className="text-[10px] text-muted-foreground">
                        Tidak ada perubahan password yang diwajibkan.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-9 shrink-0 cursor-pointer rounded-lg text-xs"
                >
                  Reset Password
                </Button>
              </div>
            </section>

            {/* Characters */}
            <section className="rounded-2xl border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="size-4 text-muted-foreground" />

                    <h2 className="text-sm font-semibold tracking-tight">
                      Characters
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Character Toram yang tersimpan pada akun.
                  </p>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {user.characters.length}{" "}
                  characters
                </p>
              </div>

              <div>
                {user.characters.map(
                  (
                    character,
                    index,
                  ) => (
                    <CharacterRow
                      key={character.id}
                      character={
                        character
                      }
                      last={
                        index ===
                        user.characters
                          .length -
                          1
                      }
                    />
                  ),
                )}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-4">
            {/* Subscription */}
            <SubscriptionCard
              subscription={
                user.subscription
              }
              onManage={() =>
                setShowSubscriptionModal(
                  true,
                )
              }
            />

            {/* Aoi Chatbot */}
            <section className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center gap-2">
                <Bot className="size-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold tracking-tight">
                  Aoi Chatbot
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Penggunaan chatbot bulan ini.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <ChatbotMetric
                  label="Messages"
                  value={
                    user.chatbot
                      .messagesThisMonth
                  }
                />

                <ChatbotMetric
                  label="Conversations"
                  value={
                    user.chatbot
                      .conversationsThisMonth
                  }
                />

                <ChatbotMetric
                  label="Tokens"
                  value={formatTokenCount(
                    user.chatbot
                      .totalTokensThisMonth,
                  )}
                />
              </div>

              <div className="mt-5 space-y-4 border-t border-border pt-4">
                <DetailRow
                  label="Last Used"
                  value={formatDateTime(
                    user.chatbot
                      .lastUsedAt,
                  )}
                />

                <DetailRow
                  label="Reports"
                  value={
                    user.chatbot.reports
                  }
                />
              </div>

              {user.chatbot.reports ===
                0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/[0.07] px-3 py-2.5">
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />

                  <p className="text-[10px] leading-4 text-emerald-700">
                    Tidak ada report chatbot dari user ini.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>

        <div className="h-8" />
      </div>

      {/* ================================================================ */}
      {/* MANAGE SUBSCRIPTION MODAL                                       */}
      {/* ================================================================ */}

      {showSubscriptionModal && (
        <ManageSubscriptionModal
          user={user}
          subscription={
            user.subscription
          }
          onClose={() =>
            setShowSubscriptionModal(
              false,
            )
          }
          onSave={(payload) => {
            setUser((current) => ({
              ...current,

              subscription: {
                ...current.subscription,

                plan: payload.plan,

                startedAt:
                  payload.startedAt,

                expiresAt:
                  payload.expiresAt,

                durationMonths:
                  payload.durationMonths,

                assignedAt:
                  getCurrentDateTime(),

                assignedBy: "Rafi",

                note: payload.note,
              },
            }))

            setShowSubscriptionModal(
              false,
            )
          }}
        />
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTION CARD                                                          */
/* -------------------------------------------------------------------------- */

function SubscriptionCard({
  subscription,
  onManage,
}) {
  const status =
    subscription?.expiresAt
      ? getSubscriptionStatus(
          subscription.expiresAt,
        )
      : "FREE"

  const active =
    subscription &&
    subscription.plan !== "FREE" &&
    status !== "EXPIRED"

  if (!active) {
    return (
      <section className="rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Subscription
          </h2>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Plan dan masa aktif user.
        </p>

        <div className="mt-5 rounded-xl bg-muted/35 p-4">
          <p className="text-[10px] text-muted-foreground">
            Current plan
          </p>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-lg font-semibold">
              Free
            </p>

            <Badge variant="secondary">
              Free
            </Badge>
          </div>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              `/subscriptions/assign?user=${user.id}`,
            )
          }
          className="mt-5 h-9 w-full cursor-pointer text-xs"
        >
          Assign Plan
        </Button>
      </section>
    )
  }

  const remaining =
    getRemainingDays(
      subscription.expiresAt,
    )

  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold">
          Subscription
        </h2>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Plan dan masa aktif user.
      </p>

      <div className="mt-5 rounded-xl bg-primary/[0.055] p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">
              Current plan
            </p>

            <p className="mt-1 text-lg font-semibold text-primary">
              {formatPlan(
                subscription.plan,
              )}
            </p>
          </div>

          <SubscriptionStatusBadge
            status={status}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DetailRow
          label="Started"
          value={formatDate(
            subscription.startedAt,
          )}
        />

        <DetailRow
          label="Expires"
          value={formatDate(
            subscription.expiresAt,
          )}
        />

        <DetailRow
          label="Remaining"
          value={`${remaining} days`}
        />

        <DetailRow
          label="Duration"
          value={`${subscription.duration.value} ${
            subscription.duration.type ===
            "DAYS"
              ? "Days"
              : "Months"
          }`}
        />

        <DetailRow
          label="Assigned By"
          value={subscription.assignedBy}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onManage}
        className="mt-5 h-9 w-full cursor-pointer text-xs"
      >
        Manage Subscription
      </Button>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* MANAGE SUBSCRIPTION MODAL                                                  */
/* -------------------------------------------------------------------------- */

function ManageSubscriptionModal({
  user,
  subscription,
  onClose,
  onSave,
}) {
  const currentStatus =
    getSubscriptionStatus(
      subscription?.expiresAt,
    )

  const hasActiveSubscription =
    subscription?.plan &&
    subscription.plan !== "FREE" &&
    currentStatus !== "EXPIRED"

  const [action, setAction] =
    useState(
      hasActiveSubscription
        ? "EXTEND"
        : "ASSIGN",
    )

  const [selectedPlan, setSelectedPlan] =
    useState(
      hasActiveSubscription
        ? subscription.plan
        : "PLUS",
    )

  const [startDate, setStartDate] =
    useState(getTodayDate())

  const [duration, setDuration] =
    useState(1)

  const [note, setNote] =
    useState(
      subscription?.note || "",
    )

  const [isSaving, setIsSaving] =
    useState(false)

  const calculatedPeriod =
    useMemo(() => {
      if (
        action === "EXTEND" &&
        subscription?.expiresAt
      ) {
        const extensionStart =
          isDateExpired(
            subscription.expiresAt,
          )
            ? getTodayDate()
            : subscription.expiresAt

        return {
          start:
            subscription.startedAt,

          expires: addMonths(
            extensionStart,
            duration,
          ),
        }
      }

      return {
        start: startDate,

        expires: addMonths(
          startDate,
          duration,
        ),
      }
    }, [
      action,
      subscription,
      startDate,
      duration,
    ])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const payload = {
        plan:
          action === "EXTEND"
            ? subscription.plan
            : selectedPlan,

        startedAt:
          calculatedPeriod.start,

        expiresAt:
          calculatedPeriod.expires,

        durationMonths:
          duration,

        note:
          note.trim() || null,
      }

      await Promise.resolve()

      onSave(payload)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-[590px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">
              Manage Subscription
            </h2>

            <p className="mt-1 text-[11px] text-muted-foreground">
              Kelola plan untuk{" "}
              <span className="font-medium text-foreground">
                {user.fullname}
              </span>
              .
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 cursor-pointer rounded-lg"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="max-h-[75dvh] overflow-y-auto">
          {/* Current */}
          {hasActiveSubscription && (
            <div className="border-b border-border px-5 py-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Current Subscription
              </p>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/35 p-3.5">
                <div>
                  <p className="text-xs font-semibold">
                    {formatPlan(
                      subscription.plan,
                    )}
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatDate(
                      subscription.startedAt,
                    )}{" "}
                    —{" "}
                    {formatDate(
                      subscription.expiresAt,
                    )}
                  </p>
                </div>

                <SubscriptionStatusBadge
                  status={
                    currentStatus
                  }
                />
              </div>
            </div>
          )}

          {/* Action */}
          {hasActiveSubscription && (
            <div className="border-b border-border px-5 py-4">
              <p className="text-xs font-semibold">
                Subscription Action
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Perpanjang masa aktif atau ubah plan user.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionOption
                  selected={
                    action === "EXTEND"
                  }
                  title="Extend"
                  description="Tambah masa aktif plan saat ini."
                  icon={Clock3}
                  onClick={() =>
                    setAction("EXTEND")
                  }
                />

                <ActionOption
                  selected={
                    action ===
                    "CHANGE_PLAN"
                  }
                  title="Change Plan"
                  description="Ubah ke Plus atau Ultimate."
                  icon={CreditCard}
                  onClick={() =>
                    setAction(
                      "CHANGE_PLAN",
                    )
                  }
                />
              </div>
            </div>
          )}

          {/* Plan */}
          {action !== "EXTEND" && (
            <div className="border-b border-border px-5 py-4">
              <p className="text-xs font-semibold">
                Select Plan
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Pilih plan yang dibeli user.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {planOptions.map(
                  (plan) => {
                    const Icon =
                      plan.icon

                    const selected =
                      selectedPlan ===
                      plan.value

                    return (
                      <button
                        key={plan.value}
                        type="button"
                        onClick={() =>
                          setSelectedPlan(
                            plan.value,
                          )
                        }
                        className={[
                          "cursor-pointer rounded-xl border p-4 text-left transition-all",
                          selected
                            ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
                            : "border-border hover:border-primary/30 hover:bg-muted/20",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={[
                              "flex size-9 items-center justify-center rounded-xl",
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            ].join(" ")}
                          >
                            <Icon className="size-4" />
                          </div>

                          <div
                            className={[
                              "flex size-5 items-center justify-center rounded-full border",
                              selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-transparent",
                            ].join(" ")}
                          >
                            <Check className="size-3" />
                          </div>
                        </div>

                        <p className="mt-4 text-xs font-semibold">
                          {plan.label}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                          {plan.description}
                        </p>
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          )}

          {/* Period */}
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-semibold">
              Subscription Period
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Tentukan durasi masa aktif subscription.
            </p>

            {action !== "EXTEND" && (
              <div className="mt-4 space-y-2">
                <Label
                  htmlFor="start-date"
                  className="text-[11px]"
                >
                  Start Date
                </Label>

                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value,
                    )
                  }
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            )}

            <div className="mt-4">
              <Label className="text-[11px]">
                Duration
              </Label>

              <div className="mt-2 grid grid-cols-4 gap-2">
                {durationOptions.map(
                  (item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setDuration(
                          item.value,
                        )
                      }
                      className={[
                        "h-10 cursor-pointer rounded-xl border text-[11px] font-medium transition-all",
                        duration ===
                        item.value
                          ? "border-primary bg-primary/[0.055] text-primary ring-3 ring-primary/10"
                          : "border-border text-muted-foreground hover:border-primary/30",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/35 p-3.5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
                  Started
                </p>

                <p className="mt-1 text-[11px] font-medium">
                  {formatDate(
                    calculatedPeriod.start,
                  )}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
                  Expires
                </p>

                <p className="mt-1 text-[11px] font-medium text-primary">
                  {formatDate(
                    calculatedPeriod.expires,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="px-5 py-4">
            <Label
              htmlFor="subscription-note"
              className="text-xs font-semibold"
            >
              Internal Note
            </Label>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Catatan ini hanya digunakan internal.
            </p>

            <textarea
              id="subscription-note"
              value={note}
              onChange={(event) =>
                setNote(
                  event.target.value,
                )
              }
              rows={3}
              placeholder="Contoh: Pembelian Ultimate 1 bulan via Discord."
              className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={onClose}
            className="h-9 cursor-pointer rounded-lg text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="h-9 min-w-[145px] cursor-pointer rounded-lg text-xs"
          >
            {isSaving ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />
                Saving...
              </>
            ) : action ===
              "EXTEND" ? (
              "Extend Subscription"
            ) : action ===
              "CHANGE_PLAN" ? (
              "Update Subscription"
            ) : (
              "Assign Subscription"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SMALL UI                                                                   */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="border-b border-border px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function InformationItem({
  label,
  value,
  children,
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>

      {children ? (
        <div className="mt-1.5">
          {children}
        </div>
      ) : (
        <p className="mt-1.5 text-xs font-medium">
          {value || "-"}
        </p>
      )}
    </div>
  )
}

function HeaderInformation({
  icon: Icon,
  value,
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Icon className="size-3.5" />
      {value}
    </div>
  )
}

function CharacterRow({
  character,
  last,
}) {
  return (
    <div
      className={[
        "flex items-center gap-4 px-5 py-4",
        !last
          ? "border-b border-border"
          : "",
      ].join(" ")}
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Gamepad2 className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium">
            {character.name}
          </p>

          {character.main && (
            <Badge
              variant="secondary"
              className="h-5 text-[9px]"
            >
              Main
            </Badge>
          )}
        </div>

        <p className="mt-1 text-[10px] text-muted-foreground">
          {character.className}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold">
          Lv. {character.level}
        </p>

        <p className="mt-1 text-[10px] text-muted-foreground">
          {character.id}
        </p>
      </div>
    </div>
  )
}

function ChatbotMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="truncate text-base font-semibold tracking-[-0.03em]">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="text-right text-[11px] font-medium">
        {value || "-"}
      </p>
    </div>
  )
}

function ActionOption({
  selected,
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer rounded-xl border p-3.5 text-left transition-all",
        selected
          ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
          : "border-border hover:border-primary/30 hover:bg-muted/20",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-8 items-center justify-center rounded-lg",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Icon className="size-3.5" />
      </div>

      <p className="mt-3 text-[11px] font-semibold">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

function AccountStatus({
  status,
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700">
      <span className="size-1.5 rounded-full bg-emerald-500" />

      {status === "ACTIVE"
        ? "Active"
        : status}
    </div>
  )
}

function PlanBadge({ plan }) {
  if (plan === "ULTIMATE") {
    return (
      <Badge className="bg-primary/10 text-[10px] text-primary hover:bg-primary/10">
        Ultimate
      </Badge>
    )
  }

  if (plan === "PLUS") {
    return (
      <Badge
        variant="secondary"
        className="text-[10px]"
      >
        Plus
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="text-[10px]"
    >
      Free
    </Badge>
  )
}

function SubscriptionStatusBadge({
  status,
}) {
  if (status === "EXPIRING") {
    return (
      <Badge className="bg-amber-500/10 text-[10px] text-amber-700 hover:bg-amber-500/10">
        Expiring Soon
      </Badge>
    )
  }

  if (status === "EXPIRED") {
    return (
      <Badge
        variant="secondary"
        className="text-[10px]"
      >
        Expired
      </Badge>
    )
  }

  return (
    <Badge className="bg-emerald-500/10 text-[10px] text-emerald-700 hover:bg-emerald-500/10">
      Active
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name) {
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

function formatDateTime(value) {
  if (!value) {
    return "-"
  }

  const [date, time] =
    value.split(" ")

  return `${formatDate(
    date,
  )}${time ? `, ${time}` : ""}`
}

function formatLastActive(value) {
  if (!value) {
    return "Belum pernah aktif"
  }

  const [date, time] =
    value.split(" ")

  if (date === getTodayDate()) {
    return `Aktif terakhir hari ini, ${time}`
  }

  return `Aktif terakhir ${formatDateTime(
    value,
  )}`
}

function formatTokenCount(value) {
  if (value >= 1_000_000) {
    return `${(
      value / 1_000_000
    ).toFixed(2)}M`
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}K`
  }

  return value.toLocaleString(
    "id-ID",
  )
}

function getTodayDate() {
  const date = new Date()

  const year =
    date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function addMonths(dateString, months) {
  const date = new Date(
    `${dateString}T00:00:00`,
  )

  const originalDay =
    date.getDate()

  date.setDate(1)

  date.setMonth(
    date.getMonth() + months,
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

function getISODate(date) {
  const year =
    date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getRemainingDays(
  expiresAt,
) {
  if (!expiresAt) {
    return -1
  }

  const today = new Date()

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
  const days =
    getRemainingDays(
      expiresAt,
    )

  if (days < 0) {
    return "EXPIRED"
  }

  if (days <= 7) {
    return "EXPIRING"
  }

  return "ACTIVE"
}

function isDateExpired(value) {
  return (
    getRemainingDays(value) < 0
  )
}

function getCurrentDateTime() {
  const date = new Date()

  const hour = String(
    date.getHours(),
  ).padStart(2, "0")

  const minute = String(
    date.getMinutes(),
  ).padStart(2, "0")

  return `${getISODate(
    date,
  )} ${hour}:${minute}`
}
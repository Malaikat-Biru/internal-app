import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  CreditCard,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UserPlus,
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

const initialSubscriptions = [
  {
    id: "SUB-0001",

    user: {
      id: "USR-0001",
      username: "rafi",
      fullname: "Rafi Asshiddiqie",
      email: "rafi@example.com",
    },

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

  {
    id: "SUB-0002",

    user: {
      id: "USR-0002",
      username: "abi",
      fullname: "Abi Rachman",
      email: "abi@example.com",
    },

    plan: "PLUS",

    startedAt: "2026-08-01",
    expiresAt: "2026-09-01",

    duration: {
      type: "MONTHS",
      value: 1,
    },

    assignedAt: "2026-08-01 13:20",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0003",

    user: {
      id: "USR-0003",
      username: "mikaaoi",
      fullname: "Mika Aoi",
      email: "mika@example.com",
    },

    plan: "ULTIMATE",

    startedAt: "2026-07-12",
    expiresAt: "2026-08-12",

    duration: {
      type: "MONTHS",
      value: 1,
    },

    assignedAt: "2026-07-12 16:40",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0004",

    user: {
      id: "USR-0004",
      username: "akira",
      fullname: "Akira",
      email: "akira@example.com",
    },

    plan: "PLUS",

    startedAt: "2026-07-20",
    expiresAt: "2026-08-10",

    duration: {
      type: "DAYS",
      value: 21,
    },

    assignedAt: "2026-07-20 21:11",
    assignedBy: "Rafi",

    note: "Plus 21 hari.",
  },

  {
    id: "SUB-0005",

    user: {
      id: "USR-0005",
      username: "yuki",
      fullname: "Yuki",
      email: "yuki@example.com",
    },

    plan: "ULTIMATE",

    startedAt: "2026-08-05",
    expiresAt: "2026-09-05",

    duration: {
      type: "MONTHS",
      value: 1,
    },

    assignedAt: "2026-08-05 10:30",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0006",

    user: {
      id: "USR-0006",
      username: "haru",
      fullname: "Haru",
      email: "haru@example.com",
    },

    plan: "PLUS",

    startedAt: "2026-06-08",
    expiresAt: "2026-08-08",

    duration: {
      type: "MONTHS",
      value: 2,
    },

    assignedAt: "2026-06-08 12:14",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0007",

    user: {
      id: "USR-0007",
      username: "reina",
      fullname: "Reina",
      email: "reina@example.com",
    },

    plan: "PLUS",

    startedAt: "2026-08-03",
    expiresAt: "2026-11-03",

    duration: {
      type: "MONTHS",
      value: 3,
    },

    assignedAt: "2026-08-03 18:40",
    assignedBy: "Rafi",

    note: "Plus 3 bulan.",
  },

  {
    id: "SUB-0008",

    user: {
      id: "USR-0008",
      username: "kazuki",
      fullname: "Kazuki",
      email: "kazuki@example.com",
    },

    plan: "ULTIMATE",

    startedAt: "2026-07-28",
    expiresAt: "2026-08-28",

    duration: {
      type: "MONTHS",
      value: 1,
    },

    assignedAt: "2026-07-28 21:10",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0009",

    user: {
      id: "USR-0009",
      username: "nia",
      fullname: "Nia",
      email: "nia@example.com",
    },

    plan: "PLUS",

    startedAt: "2026-06-17",
    expiresAt: "2026-07-17",

    duration: {
      type: "MONTHS",
      value: 1,
    },

    assignedAt: "2026-06-17 14:11",
    assignedBy: "Rafi",

    note: null,
  },

  {
    id: "SUB-0010",

    user: {
      id: "USR-0010",
      username: "astra",
      fullname: "Astra",
      email: "astra@example.com",
    },

    plan: "ULTIMATE",

    startedAt: "2026-07-30",
    expiresAt: "2026-08-29",

    duration: {
      type: "DAYS",
      value: 30,
    },

    assignedAt: "2026-07-30 19:05",
    assignedBy: "Rafi",

    note: "Ultimate 30 hari.",
  },
]

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

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function SubscriptionsPage() {
  const navigate = useNavigate()

  const [subscriptions, setSubscriptions] =
    useState(initialSubscriptions)

  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const [
    managedSubscription,
    setManagedSubscription,
  ] = useState(null)

  const filteredSubscriptions = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase()

    return subscriptions.filter((subscription) => {
      const status = getSubscriptionStatus(
        subscription.expiresAt,
      )

      const matchesSearch =
        !keyword ||
        subscription.user.fullname
          .toLowerCase()
          .includes(keyword) ||
        subscription.user.username
          .toLowerCase()
          .includes(keyword) ||
        subscription.user.email
          .toLowerCase()
          .includes(keyword) ||
        subscription.user.id
          .toLowerCase()
          .includes(keyword) ||
        subscription.id
          .toLowerCase()
          .includes(keyword)

      const matchesPlan =
        planFilter === "ALL" ||
        subscription.plan === planFilter

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter

      return (
        matchesSearch &&
        matchesPlan &&
        matchesStatus
      )
    })
  }, [
    subscriptions,
    search,
    planFilter,
    statusFilter,
  ])

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          getSubscriptionStatus(
            subscription.expiresAt,
          ) !== "EXPIRED",
      ),
    [subscriptions],
  )

  const paidUsers =
    activeSubscriptions.length

  const plusUsers =
    activeSubscriptions.filter(
      (subscription) =>
        subscription.plan === "PLUS",
    ).length

  const ultimateUsers =
    activeSubscriptions.filter(
      (subscription) =>
        subscription.plan === "ULTIMATE",
    ).length

  const expiringSoon =
    activeSubscriptions.filter(
      (subscription) =>
        getSubscriptionStatus(
          subscription.expiresAt,
        ) === "EXPIRING",
    ).length

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSubscriptions.length /
        pageSize,
    ),
  )

  const currentPage = Math.min(
    page,
    totalPages,
  )

  const rows = filteredSubscriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const handleUpdateSubscription = (
    payload,
  ) => {
    setSubscriptions((current) =>
      current.map((subscription) => {
        if (
          subscription.id !==
          managedSubscription.id
        ) {
          return subscription
        }

        return {
          ...subscription,

          ...payload,

          assignedAt:
            getCurrentDateTime(),

          assignedBy: "Rafi",
        }
      }),
    )

    setManagedSubscription(null)
  }

  const handleCancelSubscription = () => {
    /*
      Nantinya backend sebaiknya:
      1. update subscription -> cancelled
      2. update user plan -> FREE
      3. simpan cancelledAt / cancelledBy untuk history

      Untuk overview mock sekarang subscription
      langsung dihilangkan dari active list.
    */

    setSubscriptions((current) =>
      current.filter(
        (subscription) =>
          subscription.id !==
          managedSubscription.id,
      ),
    )

    setManagedSubscription(null)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6 xl:px-8">
        {/* ================================================================ */}
        {/* Header                                                           */}
        {/* ================================================================ */}

        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-primary">
              Account Management
            </p>

            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
              Subscriptions
            </h1>

            <p className="mt-1.5 max-w-[620px] text-[13px] leading-5 text-muted-foreground">
              Kelola plan Plus dan Ultimate yang diberikan secara manual
              kepada pengguna Malaikat Biru.
            </p>
          </div>

          <Button
            type="button"
            onClick={() =>
              navigate(
                "/subscriptions/assign",
              )
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-4 text-xs"
          >
            <UserPlus className="size-3.5" />

            Assign Plan
          </Button>
        </div>

        {/* ================================================================ */}
        {/* Metrics                                                          */}
        {/* ================================================================ */}

        <section className="mt-6 grid grid-cols-4 gap-3">
          <MetricCard
            icon={CreditCard}
            label="Paid Users"
            value={paidUsers}
            description="Subscription aktif saat ini"
          />

          <MetricCard
            icon={Sparkles}
            label="Plus"
            value={plusUsers}
            description="User dengan plan Plus"
          />

          <MetricCard
            icon={Zap}
            label="Ultimate"
            value={ultimateUsers}
            description="User dengan plan Ultimate"
          />

          <MetricCard
            icon={CalendarClock}
            label="Expiring Soon"
            value={expiringSoon}
            description="Berakhir dalam 7 hari"
          />
        </section>

        {/* ================================================================ */}
        {/* Subscription List                                                */}
        {/* ================================================================ */}

        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-5 border-b border-border px-4 py-3.5">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative w-[310px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value,
                    )

                    setPage(1)
                  }}
                  placeholder="Cari user, username, email..."
                  className="h-9 rounded-lg pl-9 text-xs"
                />
              </div>

              {/* Plan filter */}
              <select
                value={planFilter}
                onChange={(event) => {
                  setPlanFilter(
                    event.target.value,
                  )

                  setPage(1)
                }}
                className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
              >
                <option value="ALL">
                  Semua plan
                </option>

                <option value="PLUS">
                  Plus
                </option>

                <option value="ULTIMATE">
                  Ultimate
                </option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value,
                  )

                  setPage(1)
                }}
                className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
              >
                <option value="ALL">
                  Semua status
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="EXPIRING">
                  Expiring Soon
                </option>

                <option value="EXPIRED">
                  Expired
                </option>
              </select>
            </div>

            <p className="text-[11px] text-muted-foreground">
              {filteredSubscriptions.length} subscriptions
            </p>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[minmax(260px,1.7fr)_110px_125px_125px_115px_125px_105px] items-center border-b border-border bg-muted/20 px-4">
            <TableHeaderCell>
              User
            </TableHeaderCell>

            <TableHeaderCell>
              Plan
            </TableHeaderCell>

            <TableHeaderCell>
              Started
            </TableHeaderCell>

            <TableHeaderCell>
              Expires
            </TableHeaderCell>

            <TableHeaderCell>
              Remaining
            </TableHeaderCell>

            <TableHeaderCell>
              Status
            </TableHeaderCell>

            <TableHeaderCell align="right">
              Action
            </TableHeaderCell>
          </div>

          {/* Rows */}
          {rows.length > 0 ? (
            rows.map((subscription) => (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
                onUserClick={() =>
                  navigate(
                    `/users/${subscription.user.id}`,
                  )
                }
                onManage={() =>
                  setManagedSubscription(
                    subscription,
                  )
                }
              />
            ))
          ) : (
            <div className="flex h-40 flex-col items-center justify-center">
              <CreditCard className="size-5 text-muted-foreground" />

              <p className="mt-3 text-xs font-medium text-foreground">
                Subscription tidak ditemukan
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Coba ubah keyword atau filter yang digunakan.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">
                Rows per page
              </p>

              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(
                    Number(
                      event.target.value,
                    ),
                  )

                  setPage(1)
                }}
                className="h-8 cursor-pointer rounded-lg border border-input bg-background px-2 text-[11px] outline-none"
              >
                {[5, 8, 10, 20].map(
                  (size) => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-[11px] text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={
                    currentPage <= 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current - 1,
                        ),
                    )
                  }
                  className="size-8 cursor-pointer rounded-lg"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={
                    currentPage >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          totalPages,
                          current + 1,
                        ),
                    )
                  }
                  className="size-8 cursor-pointer rounded-lg"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="h-8" />
      </div>

      {/* ================================================================ */}
      {/* Manage Subscription Modal                                        */}
      {/* ================================================================ */}

      {managedSubscription && (
        <ManageSubscriptionModal
          subscription={
            managedSubscription
          }
          onClose={() =>
            setManagedSubscription(
              null,
            )
          }
          onUpdate={
            handleUpdateSubscription
          }
          onCancel={
            handleCancelSubscription
          }
        />
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* SUBSCRIPTION ROW                                                           */
/* -------------------------------------------------------------------------- */

function SubscriptionRow({
  subscription,
  onUserClick,
  onManage,
}) {
  const status =
    getSubscriptionStatus(
      subscription.expiresAt,
    )

  const remaining =
    getRemainingDays(
      subscription.expiresAt,
    )

  return (
    <div className="grid grid-cols-[minmax(260px,1.7fr)_110px_125px_125px_115px_125px_105px] items-center border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* User */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-semibold text-primary">
          {getInitials(
            subscription.user.fullname,
          )}
        </div>

        <div className="min-w-0">
          <button
            type="button"
            onClick={onUserClick}
            className="block max-w-[230px] cursor-pointer truncate text-left text-xs font-medium text-foreground transition-colors hover:text-primary"
          >
            {subscription.user.fullname}
          </button>

          <div className="mt-0.5 flex items-center gap-1.5">
            <p className="truncate text-[10px] text-muted-foreground">
              @{subscription.user.username}
            </p>

            <span className="text-[9px] text-muted-foreground/50">
              •
            </span>

            <p className="max-w-[150px] truncate text-[10px] text-muted-foreground">
              {subscription.user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Plan */}
      <PlanBadge
        plan={subscription.plan}
      />

      {/* Started */}
      <p className="whitespace-nowrap text-[11px] text-muted-foreground">
        {formatDate(
          subscription.startedAt,
        )}
      </p>

      {/* Expires */}
      <p className="whitespace-nowrap text-[11px] font-medium text-foreground">
        {formatDate(
          subscription.expiresAt,
        )}
      </p>

      {/* Remaining */}
      <p
        className={[
          "text-[11px] font-medium",
          remaining < 0
            ? "text-muted-foreground"
            : remaining <= 7
              ? "text-amber-700"
              : "text-foreground",
        ].join(" ")}
      >
        {remaining < 0
          ? "Expired"
          : remaining === 0
            ? "Today"
            : remaining === 1
              ? "1 day"
              : `${remaining} days`}
      </p>

      {/* Status */}
      <StatusBadge status={status} />

      {/* Manage */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onManage}
          className="h-8 cursor-pointer rounded-lg px-3 text-[11px]"
        >
          Manage
        </Button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MANAGE SUBSCRIPTION MODAL                                                  */
/* -------------------------------------------------------------------------- */

function ManageSubscriptionModal({
  subscription,
  onClose,
  onUpdate,
  onCancel,
}) {
  const currentStatus =
    getSubscriptionStatus(
      subscription.expiresAt,
    )

  const [action, setAction] =
    useState("EXTEND")

  const [plan, setPlan] =
    useState(subscription.plan)

  const [
    durationType,
    setDurationType,
  ] = useState("MONTHS")

  const [
    durationValue,
    setDurationValue,
  ] = useState(1)

  const [note, setNote] =
    useState(
      subscription.note || "",
    )

  const [saving, setSaving] =
    useState(false)

  const [
    showCancelConfirmation,
    setShowCancelConfirmation,
  ] = useState(false)

  const presets =
    durationType === "DAYS"
      ? [7, 14, 30, 60]
      : [1, 3, 6, 12]

  const preview =
    useMemo(() => {
      /*
        EXTEND:
        extension dihitung dari expiration saat ini.
        Jika sudah expired, extension dimulai hari ini.

        CHANGE:
        plan baru aktif sekarang dan membuat
        subscription period baru.
      */

      if (action === "EXTEND") {
        const baseDate =
          currentStatus === "EXPIRED"
            ? getTodayDate()
            : subscription.expiresAt

        const newExpiration =
          durationType === "DAYS"
            ? addDays(
                baseDate,
                durationValue,
              )
            : addMonths(
                baseDate,
                durationValue,
              )

        return {
          plan: subscription.plan,

          startedAt:
            subscription.startedAt,

          expiresAt:
            newExpiration,

          baseDate,
        }
      }

      const today = getTodayDate()

      const newExpiration =
        durationType === "DAYS"
          ? addDays(
              today,
              durationValue,
            )
          : addMonths(
              today,
              durationValue,
            )

      return {
        plan,

        startedAt: today,

        expiresAt:
          newExpiration,

        baseDate: today,
      }
    }, [
      action,
      plan,
      durationType,
      durationValue,
      subscription,
      currentStatus,
    ])

  const planChanged =
    plan !== subscription.plan

  const handleSelectAction = (
    nextAction,
  ) => {
    setAction(nextAction)

    if (nextAction === "CHANGE") {
      setPlan(
        subscription.plan === "PLUS"
          ? "ULTIMATE"
          : "PLUS",
      )
    } else {
      setPlan(subscription.plan)
    }
  }

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

  const handleUpdate = async () => {
    if (
      action === "CHANGE" &&
      !planChanged
    ) {
      return
    }

    setSaving(true)

    try {
      await Promise.resolve()

      onUpdate({
        plan: preview.plan,

        startedAt:
          preview.startedAt,

        expiresAt:
          preview.expiresAt,

        duration: {
          type: durationType,
          value: Number(
            durationValue,
          ),
        },

        note:
          note.trim() || null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-6 backdrop-blur-[3px]">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close manage subscription"
          onClick={onClose}
          className="absolute inset-0 cursor-default"
        />

        {/* Modal */}
        <div className="relative z-10 flex max-h-[90dvh] w-full max-w-[660px] flex-col overflow-hidden rounded-[20px] border border-border bg-background shadow-2xl">
          {/* ============================================================ */}
          {/* Header                                                       */}
          {/* ============================================================ */}

          <header className="flex shrink-0 items-start justify-between gap-6 border-b border-border px-6 py-5">
            <div>
              <p className="text-[10px] font-medium text-primary">
                Subscription Management
              </p>

              <h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-foreground">
                Manage Subscription
              </h2>

              <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
                Kelola plan dan masa aktif{" "}
                <span className="font-medium text-foreground">
                  {subscription.user.fullname}
                </span>
                .
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 shrink-0 cursor-pointer rounded-lg"
            >
              <X className="size-4" />
            </Button>
          </header>

          {/* ============================================================ */}
          {/* Scrollable content                                           */}
          {/* ============================================================ */}

          <div className="min-h-0 flex-1 overflow-y-auto">
            {/* Current Subscription */}
            <section className="px-6 py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Current Subscription
              </p>

              <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                <div className="flex items-start justify-between gap-6 bg-muted/20 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <PlanIcon
                      plan={subscription.plan}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {formatPlan(
                            subscription.plan,
                          )}
                        </p>

                        <StatusBadge
                          status={
                            currentStatus
                          }
                        />
                      </div>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Assigned by{" "}
                        {subscription.assignedBy ||
                          "-"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                      Remaining
                    </p>

                    <p
                      className={[
                        "mt-1 text-xs font-semibold",
                        currentStatus ===
                        "EXPIRING"
                          ? "text-amber-700"
                          : currentStatus ===
                              "EXPIRED"
                            ? "text-muted-foreground"
                            : "text-foreground",
                      ].join(" ")}
                    >
                      {getRemainingText(
                        subscription.expiresAt,
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                  <CurrentInfo
                    label="Started"
                    value={formatDate(
                      subscription.startedAt,
                    )}
                  />

                  <CurrentInfo
                    label="Expires"
                    value={formatDate(
                      subscription.expiresAt,
                    )}
                  />

                  <CurrentInfo
                    label="Duration"
                    value={formatDuration(
                      subscription.duration,
                    )}
                  />
                </div>
              </div>
            </section>

            <SectionDivider />

            {/* Action */}
            <section className="px-6 py-5">
              <h3 className="text-[13px] font-semibold text-foreground">
                What do you want to do?
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                Tambahkan masa aktif atau pindahkan user ke plan lain.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <ActionCard
                  icon={Clock3}
                  selected={
                    action === "EXTEND"
                  }
                  title="Extend Subscription"
                  description="Tambah durasi tanpa mengubah plan user."
                  onClick={() =>
                    handleSelectAction(
                      "EXTEND",
                    )
                  }
                />

                <ActionCard
                  icon={CreditCard}
                  selected={
                    action === "CHANGE"
                  }
                  title="Change Plan"
                  description="Ubah plan dan mulai periode baru dari hari ini."
                  onClick={() =>
                    handleSelectAction(
                      "CHANGE",
                    )
                  }
                />
              </div>
            </section>

            {/* Plan */}
            {action === "CHANGE" && (
              <>
                <SectionDivider />

                <section className="px-6 py-5">
                  <h3 className="text-[13px] font-semibold text-foreground">
                    Select New Plan
                  </h3>

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Plan baru akan langsung menggantikan plan saat ini.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {planOptions.map(
                      (option) => (
                        <PlanOption
                          key={
                            option.value
                          }
                          option={
                            option
                          }
                          selected={
                            plan ===
                            option.value
                          }
                          current={
                            subscription.plan ===
                            option.value
                          }
                          onClick={() =>
                            setPlan(
                              option.value,
                            )
                          }
                        />
                      ),
                    )}
                  </div>

                  {!planChanged && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/[0.07] px-3.5 py-2.5">
                      <CircleAlert className="size-3.5 shrink-0 text-amber-600" />

                      <p className="text-[10px] text-amber-700">
                        Pilih plan yang berbeda dari plan saat ini.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            <SectionDivider />

            {/* Duration */}
            <section className="px-6 py-5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Duration
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                {action === "EXTEND"
                  ? "Tentukan berapa lama masa aktif akan ditambahkan."
                  : "Tentukan durasi untuk periode plan baru."}
              </p>

              {/* Unit */}
              <div className="mt-4 inline-flex rounded-xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() =>
                    handleDurationType(
                      "DAYS",
                    )
                  }
                  className={[
                    "h-8 min-w-[100px] cursor-pointer rounded-lg px-4 text-[11px] font-medium transition-all",
                    durationType === "DAYS"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
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
                  ].join(" ")}
                >
                  Months
                </button>
              </div>

              {/* Presets */}
              <div className="mt-4">
                <Label className="text-[10px] font-medium text-muted-foreground">
                  Quick select
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
                          ) === value
                            ? "border-primary bg-primary/[0.055] text-primary ring-3 ring-primary/10"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        ].join(" ")}
                      >
                        {value}{" "}
                        {durationType ===
                        "DAYS"
                          ? value === 1
                            ? "day"
                            : "days"
                          : value === 1
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
                  htmlFor="subscription-duration"
                  className="text-[10px] font-medium text-muted-foreground"
                >
                  Custom duration
                </Label>

                <div className="relative mt-2">
                  <Input
                    id="subscription-duration"
                    type="number"
                    min="1"
                    value={durationValue}
                    onChange={(event) =>
                      setDurationValue(
                        Math.max(
                          1,
                          Number(
                            event.target.value,
                          ) || 1,
                        ),
                      )
                    }
                    className="h-9 rounded-xl pr-20 text-xs"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                    {durationType === "DAYS"
                      ? "days"
                      : "months"}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-5 overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.035]">
                <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3">
                  <CalendarClock className="size-3.5 text-primary" />

                  <p className="text-[10px] font-medium text-primary">
                    Change Preview
                  </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-primary/10">
                  <PreviewItem
                    label="Plan"
                    value={formatPlan(
                      preview.plan,
                    )}
                  />

                  <PreviewItem
                    label={
                      action === "EXTEND"
                        ? "Extend From"
                        : "Starts"
                    }
                    value={formatDate(
                      preview.baseDate,
                    )}
                  />

                  <PreviewItem
                    label="New Expiry"
                    value={formatDate(
                      preview.expiresAt,
                    )}
                    highlight
                  />
                </div>
              </div>

              {action === "EXTEND" &&
                currentStatus !==
                  "EXPIRED" && (
                  <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                    Durasi ditambahkan dari tanggal expired saat ini, jadi sisa masa aktif user tidak hilang.
                  </p>
                )}

              {action === "CHANGE" && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/[0.06] px-3.5 py-3">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-600" />

                  <p className="text-[10px] leading-4 text-muted-foreground">
                    Mengganti plan akan memulai periode baru dari hari ini. Sisa masa aktif plan sebelumnya tidak dibawa.
                  </p>
                </div>
              )}
            </section>

            <SectionDivider />

            {/* Note */}
            <section className="px-6 py-5">
              <h3 className="text-[13px] font-semibold text-foreground">
                Internal Note
              </h3>

              <p className="mt-1 text-[10px] text-muted-foreground">
                Optional. Hanya dapat dilihat oleh admin internal.
              </p>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value,
                  )
                }
                rows={3}
                placeholder="Contoh: Extend Ultimate 30 hari, pembayaran via Discord."
                className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-xs leading-5 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </section>

            {/* ============================================================ */}
            {/* Danger Zone                                                  */}
            {/* ============================================================ */}

            <section className="border-t border-border bg-destructive/[0.018] px-6 py-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-destructive">
                Danger Zone
              </p>

              <div className="mt-3 flex items-center justify-between gap-6 rounded-xl border border-destructive/15 bg-background p-4">
                <div>
                  <p className="text-[11px] font-semibold text-foreground">
                    Cancel Subscription
                  </p>

                  <p className="mt-1 max-w-[390px] text-[10px] leading-4 text-muted-foreground">
                    Hentikan subscription sekarang dan langsung kembalikan user ke Free plan. Sisa masa aktif akan dibatalkan.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowCancelConfirmation(
                      true,
                    )
                  }
                  className="h-9 shrink-0 cursor-pointer gap-2 rounded-lg border-destructive/30 px-3 text-[11px] text-destructive hover:bg-destructive/5 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />

                  Cancel
                </Button>
              </div>
            </section>
          </div>

          {/* ============================================================ */}
          {/* Footer                                                       */}
          {/* ============================================================ */}

          <footer className="flex shrink-0 items-center justify-between gap-5 border-t border-border bg-background px-6 py-4">
            <p className="max-w-[280px] text-[10px] leading-4 text-muted-foreground">
              Perubahan akan langsung diterapkan ke akun user setelah disimpan.
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={onClose}
                className="h-9 cursor-pointer rounded-lg px-4 text-xs"
              >
                Close
              </Button>

              <Button
                type="button"
                disabled={
                  saving ||
                  (action ===
                    "CHANGE" &&
                    !planChanged)
                }
                onClick={
                  handleUpdate
                }
                className="h-9 min-w-[155px] cursor-pointer rounded-lg px-4 text-xs"
              >
                {saving ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />

                    Saving...
                  </>
                ) : action ===
                  "EXTEND" ? (
                  "Extend Subscription"
                ) : (
                  "Update Plan"
                )}
              </Button>
            </div>
          </footer>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Cancel Confirmation                                              */}
      {/* ================================================================ */}

      {showCancelConfirmation && (
        <CancelSubscriptionConfirmation
          subscription={
            subscription
          }
          onClose={() =>
            setShowCancelConfirmation(
              false,
            )
          }
          onConfirm={onCancel}
        />
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* CANCEL CONFIRMATION                                                        */
/* -------------------------------------------------------------------------- */

function CancelSubscriptionConfirmation({
  subscription,
  onClose,
  onConfirm,
}) {
  const [
    cancelling,
    setCancelling,
  ] = useState(false)

  const handleConfirm =
    async () => {
      setCancelling(true)

      try {
        await Promise.resolve()

        onConfirm()
      } finally {
        setCancelling(false)
      }
    }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close confirmation"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border bg-background p-5 shadow-2xl">
        <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <CircleAlert className="size-5" />
        </div>

        <h2 className="mt-4 text-[15px] font-semibold tracking-[-0.02em]">
          Cancel subscription?
        </h2>

        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Subscription{" "}
          <span className="font-medium text-foreground">
            {formatPlan(
              subscription.plan,
            )}
          </span>{" "}
          milik{" "}
          <span className="font-medium text-foreground">
            {subscription.user.fullname}
          </span>{" "}
          akan langsung dihentikan.
        </p>

        <div className="mt-4 rounded-xl border border-destructive/10 bg-destructive/[0.045] p-3.5">
          <div className="flex items-start gap-2.5">
            <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />

            <p className="text-[10px] leading-4 text-muted-foreground">
              User akan langsung menggunakan{" "}
              <span className="font-medium text-foreground">
                Free plan
              </span>
              . Sisa subscription sampai{" "}
              <span className="font-medium text-foreground">
                {formatDate(
                  subscription.expiresAt,
                )}
              </span>{" "}
              tidak akan digunakan.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={cancelling}
            onClick={onClose}
            className="h-9 cursor-pointer rounded-lg px-4 text-xs"
          >
            Keep Subscription
          </Button>

          <Button
            type="button"
            disabled={cancelling}
            onClick={
              handleConfirm
            }
            className="h-9 min-w-[155px] cursor-pointer gap-2 rounded-lg bg-destructive px-4 text-xs text-white hover:bg-destructive/90"
          >
            {cancelling ? (
              <>
                <RefreshCw className="size-3.5 animate-spin" />

                Cancelling...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />

                Cancel Subscription
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-foreground">
            {value}
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function TableHeaderCell({
  children,
  align = "left",
}) {
  return (
    <div
      className={[
        "py-3 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground",
        align === "right"
          ? "text-right"
          : "",
      ].join(" ")}
    >
      {children}
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="mx-6 border-t border-border" />
  )
}

function PlanIcon({ plan }) {
  const Icon =
    plan === "ULTIMATE"
      ? Zap
      : Sparkles

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="size-4" />
    </div>
  )
}

function CurrentInfo({
  label,
  value,
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-[9px] uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-medium text-foreground">
        {value}
      </p>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  selected,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group cursor-pointer rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
          : "border-border bg-background hover:border-primary/30 hover:bg-muted/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={[
            "flex size-9 items-center justify-center rounded-xl transition-colors",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground group-hover:text-foreground",
          ].join(" ")}
        >
          <Icon className="size-4" />
        </div>

        <div
          className={[
            "flex size-5 shrink-0 items-center justify-center rounded-full border",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-transparent",
          ].join(" ")}
        >
          <Check className="size-3" />
        </div>
      </div>

      <p className="mt-3 text-[11px] font-semibold text-foreground">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {description}
      </p>
    </button>
  )
}

function PlanOption({
  option,
  selected,
  current,
  onClick,
}) {
  const Icon = option.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/[0.045] ring-3 ring-primary/10"
          : "border-border hover:border-primary/30 hover:bg-muted/20",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
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

        <div className="flex items-center gap-2">
          {current && (
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[9px]"
            >
              Current
            </Badge>
          )}

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
      </div>

      <p className="mt-3 text-xs font-semibold text-foreground">
        {option.label}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {option.description}
      </p>
    </button>
  )
}

function PreviewItem({
  label,
  value,
  highlight,
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-[9px] uppercase tracking-[0.05em] text-muted-foreground">
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

function PlanBadge({ plan }) {
  if (plan === "ULTIMATE") {
    return (
      <Badge className="border-primary/15 bg-primary/10 text-[10px] font-medium text-primary hover:bg-primary/10">
        Ultimate
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="text-[10px]"
    >
      Plus
    </Badge>
  )
}

function StatusBadge({ status }) {
  if (status === "EXPIRING") {
    return (
      <Badge className="border-amber-500/15 bg-amber-500/10 text-[10px] font-medium text-amber-700 hover:bg-amber-500/10">
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
    <Badge className="border-emerald-500/15 bg-emerald-500/10 text-[10px] font-medium text-emerald-700 hover:bg-emerald-500/10">
      Active
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

function formatDuration(duration) {
  if (
    !duration ||
    !duration.value
  ) {
    return "-"
  }

  const value =
    duration.value

  if (duration.type === "DAYS") {
    return `${value} ${
      value === 1
        ? "day"
        : "days"
    }`
  }

  return `${value} ${
    value === 1
      ? "month"
      : "months"
  }`
}

function formatDate(value) {
  if (!value) {
    return "-"
  }

  const date = new Date(
    `${value}T00:00:00`,
  )

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date)
}

function getTodayDate() {
  return getISODate(new Date())
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

function addDays(
  value,
  days,
) {
  const date = new Date(
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
  const date = new Date(
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

function getRemainingText(
  expiresAt,
) {
  const days =
    getRemainingDays(
      expiresAt,
    )

  if (days < 0) {
    return "Expired"
  }

  if (days === 0) {
    return "Expires today"
  }

  if (days === 1) {
    return "1 day"
  }

  return `${days} days`
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
  const date = new Date()

  const hours = String(
    date.getHours(),
  ).padStart(2, "0")

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0")

  return `${getISODate(
    date,
  )} ${hours}:${minutes}`
}
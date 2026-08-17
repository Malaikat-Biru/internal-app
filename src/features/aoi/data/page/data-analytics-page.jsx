import { useMemo, useState } from "react"

import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileMusic,
  Gem,
  Map,
  Package,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/* -------------------------------------------------------------------------- */
/*                                  MOCK DATA                                 */
/* -------------------------------------------------------------------------- */

const usageTrend = [
  {
    date: "02 Aug",
    views: 3218,
    users: 1184,
  },
  {
    date: "03 Aug",
    views: 3482,
    users: 1246,
  },
  {
    date: "04 Aug",
    views: 3610,
    users: 1278,
  },
  {
    date: "05 Aug",
    views: 3524,
    users: 1261,
  },
  {
    date: "06 Aug",
    views: 3942,
    users: 1365,
  },
  {
    date: "07 Aug",
    views: 4218,
    users: 1448,
  },
  {
    date: "08 Aug",
    views: 4684,
    users: 1572,
  },
]

const categories = [
  {
    id: "DATA-001",
    name: "Items",
    slug: "items",
    icon: Package,

    views: 12480,
    users: 3284,

    records: 12430,
    published: 11864,
    draft: 566,

    updatedAt: "2026-08-08 17:42",
  },

  {
    id: "DATA-002",
    name: "Monsters",
    slug: "monsters",
    icon: Sparkles,

    views: 9240,
    users: 2682,

    records: 2481,
    published: 2298,
    draft: 183,

    updatedAt: "2026-08-08 17:14",
  },

  {
    id: "DATA-003",
    name: "Worlds & Maps",
    slug: "worlds",
    icon: Map,

    views: 6184,
    users: 1948,

    records: 842,
    published: 801,
    draft: 41,

    updatedAt: "2026-08-08 16:22",
  },

  {
    id: "DATA-004",
    name: "Crystas",
    slug: "crystas",
    icon: Gem,

    views: 5542,
    users: 1784,

    records: 684,
    published: 652,
    draft: 32,

    updatedAt: "2026-08-08 15:30",
  },

  {
    id: "DATA-005",
    name: "BGM",
    slug: "bgm",
    icon: FileMusic,

    views: 2314,
    users: 1028,

    records: 183,
    published: 164,
    draft: 19,

    updatedAt: "2026-08-08 15:20",
  },

  {
    id: "DATA-006",
    name: "NPC",
    slug: "npc",
    icon: Users,

    views: 1988,
    users: 914,

    records: 1268,
    published: 1182,
    draft: 86,

    updatedAt: "2026-08-08 14:48",
  },

  {
    id: "DATA-007",
    name: "Recipes",
    slug: "recipes",
    icon: Database,

    views: 1744,
    users: 812,

    records: 2184,
    published: 2062,
    draft: 122,

    updatedAt: "2026-08-08 13:54",
  },

  {
    id: "DATA-008",
    name: "Quests",
    slug: "quests",
    icon: CheckCircle2,

    views: 1562,
    users: 742,

    records: 946,
    published: 891,
    draft: 55,

    updatedAt: "2026-08-08 12:33",
  },
]

const rangeOptions = [
  {
    value: "7D",
    label: "Last 7 days",
  },
  {
    value: "30D",
    label: "Last 30 days",
  },
  {
    value: "90D",
    label: "Last 90 days",
  },
]

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function DataAnalyticsPage() {
  const [range, setRange] = useState("7D")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const totals = useMemo(() => {
    return categories.reduce(
      (result, category) => {
        result.views += category.views
        result.records += category.records
        result.published += category.published
        result.draft += category.draft

        return result
      },
      {
        views: 0,
        records: 0,
        published: 0,
        draft: 0,
      },
    )
  }, [])

  /*
    Jangan jumlahkan category.users karena satu user
    bisa membuka beberapa kategori.
  */
  const uniqueUsers = 4821

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return categories
    }

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(keyword) ||
        category.slug.toLowerCase().includes(keyword),
    )
  }, [search])

  const topCategories = useMemo(
    () =>
      [...categories]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
    [],
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / pageSize),
  )

  const currentPage = Math.min(page, totalPages)

  const rows = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const publishedPercentage = getPercentage(
    totals.published,
    totals.records,
  )

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-6 xl:px-8">
      {/* ================================================================ */}
      {/* Header                                                           */}
      {/* ================================================================ */}

      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium text-primary">
            Aoi
          </p>

          <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
            Data Analytics
          </h1>

          <p className="mt-1.5 max-w-[700px] text-[13px] leading-5 text-muted-foreground">
            Pantau penggunaan dan kondisi data yang digunakan di seluruh
            layanan Aoi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-muted-foreground" />

          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
          >
            {rangeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Metrics                                                          */}
      {/* ================================================================ */}

      <section className="mt-6 grid grid-cols-4 gap-3">
        <MetricCard
          icon={Activity}
          label="Data Views"
          value={formatNumber(totals.views)}
          description={`Across ${rangeLabel(range)}`}
        />

        <MetricCard
          icon={Users}
          label="Unique Users"
          value={formatNumber(uniqueUsers)}
          description="Users yang membuka data Aoi"
        />

        <MetricCard
          icon={Database}
          label="Total Records"
          value={formatNumber(totals.records)}
          description={`${categories.length} data categories`}
        />

        <MetricCard
          icon={CheckCircle2}
          label="Published Data"
          value={formatNumber(totals.published)}
          description={`${publishedPercentage}% dari seluruh records`}
        />
      </section>

      {/* ================================================================ */}
      {/* Usage Trend + Top Categories                                     */}
      {/* ================================================================ */}

      <section className="mt-4 grid grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)] gap-4">
        {/* Usage Trend */}
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Data Usage Trend
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Data views dan unique users setiap hari.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="text-[9px]"
            >
              {rangeLabel(range)}
            </Badge>
          </div>

          <div className="h-[290px] px-3 pb-3 pt-5">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={usageTrend}
                margin={{
                  top: 5,
                  right: 14,
                  left: -12,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.25}
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                  dy={8}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                />

                <Tooltip content={<UsageTooltip />} />

                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="currentColor"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                  className="text-primary"
                />

                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  className="text-muted-foreground"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-5 border-t border-border px-5 py-3">
            <ChartLegend label="Data Views" />

            <ChartLegend
              label="Unique Users"
              secondary
            />
          </div>
        </div>

        {/* Top Categories */}
        <div className="rounded-2xl border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Top Data Categories
              </h2>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Kategori data yang paling sering dibuka user.
            </p>
          </div>

          <div className="px-5 py-2">
            {topCategories.map((category, index) => (
              <TopCategoryRow
                key={category.id}
                index={index + 1}
                category={category}
                maxViews={topCategories[0]?.views || 1}
                last={index === topCategories.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Data Health Summary                                              */}
      {/* ================================================================ */}

      <section className="mt-4 grid grid-cols-[minmax(0,1fr)_340px] gap-4">
        {/* Published Health */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Data Availability
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Perbandingan data yang sudah published dan masih draft.
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <CheckCircle2 className="size-4" />
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-5">
            <div>
              <p className="text-[32px] font-semibold tracking-[-0.05em] text-foreground">
                {publishedPercentage}%
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                dari seluruh records tersedia secara published
              </p>
            </div>

            <div className="text-right">
              <p className="text-[11px] font-semibold text-foreground">
                {formatNumber(totals.published)}
              </p>

              <p className="mt-1 text-[9px] text-muted-foreground">
                Published records
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${publishedPercentage}%`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <AvailabilityItem
              label="Published"
              value={totals.published}
            />

            <AvailabilityItem
              label="Draft"
              value={totals.draft}
              muted
            />
          </div>
        </div>

        {/* Category count */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Data Coverage
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Ringkasan category yang saat ini tersedia di Aoi.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[32px] font-semibold tracking-[-0.05em] text-foreground">
              {categories.length}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              active data categories
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <div
                  key={category.id}
                  className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5"
                >
                  <Icon className="size-3 text-muted-foreground" />

                  <span className="text-[9px] font-medium text-muted-foreground">
                    {category.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Category Performance                                             */}
      {/* ================================================================ */}

      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
        {/* Section Header */}
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Category Performance
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Ringkasan penggunaan dan kondisi data untuk setiap kategori Aoi.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5">
          <div className="relative w-[300px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Cari category..."
              className="h-9 rounded-lg pl-9 text-xs"
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            {filteredCategories.length} categories
          </p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[minmax(260px,1.5fr)_130px_130px_130px_150px_120px_150px] items-center border-b border-border bg-muted/20 px-4">
          <TableHeaderCell>
            Category
          </TableHeaderCell>

          <TableHeaderCell>
            Views
          </TableHeaderCell>

          <TableHeaderCell>
            Users
          </TableHeaderCell>

          <TableHeaderCell>
            Records
          </TableHeaderCell>

          <TableHeaderCell>
            Published
          </TableHeaderCell>

          <TableHeaderCell>
            Draft
          </TableHeaderCell>

          <TableHeaderCell>
            Last Updated
          </TableHeaderCell>
        </div>

        {/* Rows */}
        {rows.length > 0 ? (
          rows.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
            />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center">
            <Database className="size-5 text-muted-foreground" />

            <p className="mt-3 text-xs font-medium text-foreground">
              Category tidak ditemukan
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Coba gunakan keyword lain.
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
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
              className="h-8 cursor-pointer rounded-lg border border-input bg-background px-2 text-[11px]"
            >
              {[5, 6, 10, 20].map((size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ))}
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
                disabled={currentPage <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
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
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1),
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
  )
}

/* -------------------------------------------------------------------------- */
/* METRIC CARD                                                                */
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

/* -------------------------------------------------------------------------- */
/* AVAILABILITY                                                               */
/* -------------------------------------------------------------------------- */

function AvailabilityItem({
  label,
  value,
  muted,
}) {
  return (
    <div className="rounded-xl bg-muted/35 p-3.5">
      <p className="text-[9px] uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 text-[15px] font-semibold",
          muted
            ? "text-muted-foreground"
            : "text-foreground",
        ].join(" ")}
      >
        {formatNumber(value)}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TOP CATEGORY                                                               */
/* -------------------------------------------------------------------------- */

function TopCategoryRow({
  index,
  category,
  maxViews,
  last,
}) {
  const percentage =
    maxViews > 0
      ? (category.views / maxViews) * 100
      : 0

  const Icon = category.icon

  return (
    <div
      className={[
        "py-4",
        !last
          ? "border-b border-border"
          : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
          {index}
        </div>

        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-foreground">
                {category.name}
              </p>

              <p className="mt-1 text-[9px] text-muted-foreground">
                {formatNumber(category.users)} users
              </p>
            </div>

            <p className="shrink-0 text-[11px] font-semibold text-foreground">
              {formatNumber(category.views)}
            </p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY ROW                                                               */
/* -------------------------------------------------------------------------- */

function CategoryRow({
  category,
}) {
  const Icon = category.icon

  const publishedRate =
    category.records > 0
      ? (
          (category.published / category.records) *
          100
        ).toFixed(1)
      : "0"

  return (
    <div className="grid grid-cols-[minmax(260px,1.5fr)_130px_130px_130px_150px_120px_150px] items-center border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* Category */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">
            {category.name}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {category.slug}
          </p>
        </div>
      </div>

      {/* Views */}
      <p className="text-[11px] font-semibold text-foreground">
        {formatNumber(category.views)}
      </p>

      {/* Users */}
      <p className="text-[11px] text-foreground">
        {formatNumber(category.users)}
      </p>

      {/* Records */}
      <p className="text-[11px] text-foreground">
        {formatNumber(category.records)}
      </p>

      {/* Published */}
      <div>
        <p className="text-[11px] font-medium text-foreground">
          {formatNumber(category.published)}
        </p>

        <p className="mt-0.5 text-[9px] text-muted-foreground">
          {publishedRate}%
        </p>
      </div>

      {/* Draft */}
      <div>
        {category.draft > 0 ? (
          <Badge
            variant="secondary"
            className="text-[9px]"
          >
            {formatNumber(category.draft)}
          </Badge>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            —
          </span>
        )}
      </div>

      {/* Updated */}
      <p className="text-[10px] text-muted-foreground">
        {formatRelativeTime(category.updatedAt)}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TABLE HEADER                                                               */
/* -------------------------------------------------------------------------- */

function TableHeaderCell({
  children,
}) {
  return (
    <div className="py-3 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CHART UI                                                                   */
/* -------------------------------------------------------------------------- */

function ChartLegend({
  label,
  secondary,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "size-2 rounded-full",
          secondary
            ? "bg-muted-foreground"
            : "bg-primary",
        ].join(" ")}
      />

      <span className="text-[10px] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function UsageTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null
  }

  const views =
    payload.find(
      (item) =>
        item.dataKey === "views",
    )?.value || 0

  const users =
    payload.find(
      (item) =>
        item.dataKey === "users",
    )?.value || 0

  return (
    <div className="min-w-[160px] rounded-xl border border-border bg-background px-3 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold text-foreground">
        {label}
      </p>

      <div className="mt-2 space-y-1.5">
        <TooltipRow
          label="Data Views"
          value={formatNumber(views)}
        />

        <TooltipRow
          label="Unique Users"
          value={formatNumber(users)}
        />
      </div>
    </div>
  )
}

function TooltipRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-[9px] text-muted-foreground">
        {label}
      </span>

      <span className="text-[10px] font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(value) {
  return Number(value || 0).toLocaleString("id-ID")
}

function getPercentage(value, total) {
  if (!total) {
    return "0"
  }

  return (
    (Number(value) / Number(total)) *
    100
  ).toFixed(1)
}

function rangeLabel(range) {
  if (range === "30D") {
    return "30 days"
  }

  if (range === "90D") {
    return "90 days"
  }

  return "7 days"
}

function formatRelativeTime(value) {
  if (!value) {
    return "-"
  }

  const [dateValue, timeValue] =
    value.split(" ")

  const target = new Date(
    `${dateValue}T${timeValue || "00:00"}:00`,
  )

  const now = new Date()

  const differenceMs =
    now.getTime() -
    target.getTime()

  const minutes =
    Math.floor(differenceMs / 60000)

  if (minutes < 0) {
    return formatDateTime(value)
  }

  if (minutes < 1) {
    return "just now"
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours =
    Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days =
    Math.floor(hours / 24)

  if (days === 1) {
    return "1 day ago"
  }

  if (days <= 7) {
    return `${days} days ago`
  }

  return formatDateTime(value)
}

function formatDateTime(value) {
  if (!value) {
    return "-"
  }

  const [dateValue, timeValue] =
    value.split(" ")

  const date = new Date(
    `${dateValue}T00:00:00`,
  )

  const formattedDate =
    new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    ).format(date)

  if (!timeValue) {
    return formattedDate
  }

  return `${formattedDate}, ${timeValue}`
}
import { useMemo, useState } from "react"

import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Users,
  Wrench,
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

const toolUsageTrend = [
  {
    date: "02 Aug",
    runs: 684,
    users: 312,
  },
  {
    date: "03 Aug",
    runs: 742,
    users: 341,
  },
  {
    date: "04 Aug",
    runs: 801,
    users: 355,
  },
  {
    date: "05 Aug",
    runs: 768,
    users: 349,
  },
  {
    date: "06 Aug",
    runs: 892,
    users: 386,
  },
  {
    date: "07 Aug",
    runs: 964,
    users: 421,
  },
  {
    date: "08 Aug",
    runs: 1038,
    users: 448,
  },
]

const initialTools = [
  {
    id: "TOOL-001",
    name: "Fillstat Simulator",
    slug: "fillstat-simulator",
    category: "Smithing",
    status: "ACTIVE",

    runs: 5240,
    users: 1240,

    lastUsedAt: "2026-08-08 17:56",
  },

  {
    id: "TOOL-002",
    name: "Leveling Calculator",
    slug: "leveling-calculator",
    category: "Leveling",
    status: "ACTIVE",

    runs: 4184,
    users: 1088,

    lastUsedAt: "2026-08-08 17:52",
  },

  {
    id: "TOOL-003",
    name: "MQ Calculator",
    slug: "mq-calculator",
    category: "Quest",
    status: "ACTIVE",

    runs: 3261,
    users: 854,

    lastUsedAt: "2026-08-08 17:48",
  },

  {
    id: "TOOL-004",
    name: "Stat Calculator",
    slug: "stat-calculator",
    category: "Character",
    status: "ACTIVE",

    runs: 2418,
    users: 728,

    lastUsedAt: "2026-08-08 17:39",
  },

  {
    id: "TOOL-005",
    name: "Crysta Tree",
    slug: "crysta-tree",
    category: "Crysta",
    status: "ACTIVE",

    runs: 1982,
    users: 621,

    lastUsedAt: "2026-08-08 17:20",
  },

  {
    id: "TOOL-006",
    name: "Refinement Calculator",
    slug: "refinement-calculator",
    category: "Smithing",
    status: "ACTIVE",

    runs: 1643,
    users: 516,

    lastUsedAt: "2026-08-08 16:58",
  },

  {
    id: "TOOL-007",
    name: "Skill Point Calculator",
    slug: "skill-point-calculator",
    category: "Character",
    status: "ACTIVE",

    runs: 1254,
    users: 471,

    lastUsedAt: "2026-08-08 16:44",
  },

  {
    id: "TOOL-008",
    name: "Material Calculator",
    slug: "material-calculator",
    category: "Crafting",
    status: "ACTIVE",

    runs: 1088,
    users: 407,

    lastUsedAt: "2026-08-08 16:18",
  },

  {
    id: "TOOL-009",
    name: "Damage Calculator",
    slug: "damage-calculator",
    category: "Combat",
    status: "BETA",

    runs: 714,
    users: 268,

    lastUsedAt: "2026-08-08 15:44",
  },

  {
    id: "TOOL-010",
    name: "Food Buff Calculator",
    slug: "food-buff-calculator",
    category: "Character",
    status: "BETA",

    runs: 482,
    users: 194,

    lastUsedAt: "2026-08-08 15:02",
  },

  {
    id: "TOOL-011",
    name: "Skill Tree Planner",
    slug: "skill-tree-planner",
    category: "Character",
    status: "INACTIVE",

    runs: 194,
    users: 88,

    lastUsedAt: "2026-08-04 18:14",
  },

  {
    id: "TOOL-012",
    name: "Drop Rate Calculator",
    slug: "drop-rate-calculator",
    category: "Farming",
    status: "INACTIVE",

    runs: 102,
    users: 49,

    lastUsedAt: "2026-08-01 13:20",
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

export default function ToolAnalyticsPage() {
  const [range, setRange] =
    useState("7D")

  const [search, setSearch] =
    useState("")

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("ALL")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL")

  const [page, setPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(8)

  const filteredTools =
    useMemo(() => {
      const keyword = search
        .trim()
        .toLowerCase()

      return initialTools.filter(
        (tool) => {
          const matchesSearch =
            !keyword ||
            tool.name
              .toLowerCase()
              .includes(keyword) ||
            tool.slug
              .toLowerCase()
              .includes(keyword) ||
            tool.category
              .toLowerCase()
              .includes(keyword)

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            tool.category ===
              categoryFilter

          const matchesStatus =
            statusFilter === "ALL" ||
            tool.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          )
        },
      )
    }, [
      search,
      categoryFilter,
      statusFilter,
    ])

  const totalRuns =
    initialTools.reduce(
      (total, tool) =>
        total + tool.runs,
      0,
    )

  const uniqueUsers = 3278

  const activeTools =
    initialTools.filter(
      (tool) =>
        tool.status === "ACTIVE" ||
        tool.status === "BETA",
    ).length

  const averageRunsPerUser =
    uniqueUsers > 0
      ? (
          totalRuns /
          uniqueUsers
        ).toFixed(1)
      : "0"

  const topTools = useMemo(
    () =>
      [...initialTools]
        .sort(
          (a, b) =>
            b.runs - a.runs,
        )
        .slice(0, 5),
    [],
  )

  const maxRuns =
    topTools[0]?.runs || 1

  const categories =
    useMemo(
      () => [
        ...new Set(
          initialTools.map(
            (tool) =>
              tool.category,
          ),
        ),
      ],
      [],
    )

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTools.length /
        pageSize,
    ),
  )

  const currentPage =
    Math.min(page, totalPages)

  const rows =
    filteredTools.slice(
      (currentPage - 1) *
        pageSize,
      currentPage * pageSize,
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
            Tool Analytics
          </h1>

          <p className="mt-1.5 max-w-[680px] text-[13px] leading-5 text-muted-foreground">
            Pantau penggunaan tools Aoi untuk melihat tool yang paling sering
            digunakan dan bagaimana aktivitas user berkembang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-muted-foreground" />

          <select
            value={range}
            onChange={(event) =>
              setRange(
                event.target.value,
              )
            }
            className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
          >
            {rangeOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Metrics                                                          */}
      {/* ================================================================ */}

      <section className="mt-6 grid grid-cols-4 gap-3">
        <MetricCard
          icon={Activity}
          label="Total Tool Runs"
          value={formatNumber(
            totalRuns,
          )}
          description={`Across ${rangeLabel(
            range,
          )}`}
        />

        <MetricCard
          icon={Users}
          label="Unique Users"
          value={formatNumber(
            uniqueUsers,
          )}
          description="Users yang menggunakan tools"
        />

        <MetricCard
          icon={Wrench}
          label="Active Tools"
          value={activeTools}
          description={`${initialTools.length} tools registered`}
        />

        <MetricCard
          icon={BarChart3}
          label="Avg. Runs / User"
          value={averageRunsPerUser}
          description="Rata-rata penggunaan per user"
        />
      </section>

      {/* ================================================================ */}
      {/* Trend + Top Tools                                                */}
      {/* ================================================================ */}

      <section className="mt-4 grid grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)] gap-4">
        {/* Trend */}
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex items-start justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Tool Usage Trend
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Total tool runs dan unique users per hari.
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
                data={toolUsageTrend}
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

                <Tooltip
                  content={
                    <UsageTooltip />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="runs"
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
            <ChartLegend
              label="Tool Runs"
            />

            <ChartLegend
              label="Unique Users"
              secondary
            />
          </div>
        </div>

        {/* Top tools */}
        <div className="rounded-2xl border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold tracking-tight">
                Top Tools
              </h2>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Tools dengan jumlah penggunaan tertinggi.
            </p>
          </div>

          <div className="px-5 py-2">
            {topTools.map(
              (tool, index) => (
                <TopToolRow
                  key={tool.id}
                  index={index + 1}
                  tool={tool}
                  maxRuns={maxRuns}
                  last={
                    index ===
                    topTools.length - 1
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Tool Performance                                                 */}
      {/* ================================================================ */}

      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
        {/* Section header */}
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold tracking-tight">
            Tool Performance
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Ringkasan penggunaan untuk setiap tool yang tersedia di Aoi.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="relative w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value,
                  )

                  setPage(1)
                }}
                placeholder="Cari tool..."
                className="h-9 rounded-lg pl-9 text-xs"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(
                  event.target.value,
                )

                setPage(1)
              }}
              className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
            >
              <option value="ALL">
                Semua category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value,
                )

                setPage(1)
              }}
              className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs outline-none transition-colors hover:bg-muted/30 focus:border-primary focus:ring-3 focus:ring-primary/10"
            >
              <option value="ALL">
                Semua status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="BETA">
                Beta
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {filteredTools.length} tools
          </p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[minmax(280px,1.7fr)_140px_130px_130px_130px_140px] items-center border-b border-border bg-muted/20 px-4">
          <TableHeaderCell>
            Tool
          </TableHeaderCell>

          <TableHeaderCell>
            Category
          </TableHeaderCell>

          <TableHeaderCell>
            Runs
          </TableHeaderCell>

          <TableHeaderCell>
            Users
          </TableHeaderCell>

          <TableHeaderCell>
            Avg / User
          </TableHeaderCell>

          <TableHeaderCell>
            Last Used
          </TableHeaderCell>
        </div>

        {/* Rows */}
        {rows.length > 0 ? (
          rows.map((tool) => (
            <ToolRow
              key={tool.id}
              tool={tool}
            />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center">
            <Wrench className="size-5 text-muted-foreground" />

            <p className="mt-3 text-xs font-medium">
              Tool tidak ditemukan
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Coba ubah keyword atau filter.
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
              className="h-8 cursor-pointer rounded-lg border border-input bg-background px-2 text-[11px]"
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
              Page {currentPage} of{" "}
              {totalPages}
            </p>

            <div className="flex gap-1">
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
/* TOP TOOL                                                                  */
/* -------------------------------------------------------------------------- */

function TopToolRow({
  index,
  tool,
  maxRuns,
  last,
}) {
  const percentage =
    maxRuns > 0
      ? (tool.runs / maxRuns) *
        100
      : 0

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

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-foreground">
                {tool.name}
              </p>

              <p className="mt-1 text-[9px] text-muted-foreground">
                {formatNumber(
                  tool.users,
                )}{" "}
                users
              </p>
            </div>

            <p className="shrink-0 text-[11px] font-semibold text-foreground">
              {formatNumber(
                tool.runs,
              )}
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
/* TOOL ROW                                                                  */
/* -------------------------------------------------------------------------- */

function ToolRow({ tool }) {
  const average =
    tool.users > 0
      ? (
          tool.runs /
          tool.users
        ).toFixed(1)
      : "0"

  return (
    <div className="grid grid-cols-[minmax(280px,1.7fr)_140px_130px_130px_130px_140px] items-center border-b border-border px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* Tool */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Wrench className="size-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-medium text-foreground">
              {tool.name}
            </p>

            <ToolStatusBadge
              status={tool.status}
            />
          </div>

          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {tool.slug}
          </p>
        </div>
      </div>

      {/* Category */}
      <p className="text-[11px] text-muted-foreground">
        {tool.category}
      </p>

      {/* Runs */}
      <p className="text-[11px] font-semibold text-foreground">
        {formatNumber(
          tool.runs,
        )}
      </p>

      {/* Users */}
      <p className="text-[11px] text-foreground">
        {formatNumber(
          tool.users,
        )}
      </p>

      {/* Avg */}
      <p className="text-[11px] text-muted-foreground">
        {average}
      </p>

      {/* Last Used */}
      <p className="text-[11px] text-muted-foreground">
        {formatRelativeUsage(
          tool.lastUsedAt,
        )}
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
/* TOOL STATUS                                                                */
/* -------------------------------------------------------------------------- */

function ToolStatusBadge({
  status,
}) {
  if (status === "BETA") {
    return (
      <Badge className="h-5 border-amber-500/15 bg-amber-500/10 px-1.5 text-[8px] font-medium text-amber-700 hover:bg-amber-500/10">
        Beta
      </Badge>
    )
  }

  if (status === "INACTIVE") {
    return (
      <Badge
        variant="secondary"
        className="h-5 px-1.5 text-[8px]"
      >
        Inactive
      </Badge>
    )
  }

  return (
    <Badge className="h-5 border-emerald-500/15 bg-emerald-500/10 px-1.5 text-[8px] font-medium text-emerald-700 hover:bg-emerald-500/10">
      Active
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* CHART                                                                     */
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
  if (
    !active ||
    !payload?.length
  ) {
    return null
  }

  const runs =
    payload.find(
      (item) =>
        item.dataKey === "runs",
    )?.value || 0

  const users =
    payload.find(
      (item) =>
        item.dataKey === "users",
    )?.value || 0

  return (
    <div className="min-w-[150px] rounded-xl border border-border bg-background px-3 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold text-foreground">
        {label}
      </p>

      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between gap-5">
          <span className="text-[9px] text-muted-foreground">
            Tool Runs
          </span>

          <span className="text-[10px] font-medium">
            {formatNumber(runs)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-5">
          <span className="text-[9px] text-muted-foreground">
            Unique Users
          </span>

          <span className="text-[10px] font-medium">
            {formatNumber(users)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(value) {
  return Number(
    value || 0,
  ).toLocaleString("id-ID")
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

function formatRelativeUsage(
  value,
) {
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

  const differenceMinutes =
    Math.floor(
      differenceMs / 60000,
    )

  if (differenceMinutes < 0) {
    return formatDateTime(value)
  }

  if (differenceMinutes < 1) {
    return "Just now"
  }

  if (differenceMinutes < 60) {
    return `${differenceMinutes} min ago`
  }

  const differenceHours =
    Math.floor(
      differenceMinutes / 60,
    )

  if (differenceHours < 24) {
    return `${differenceHours}h ago`
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
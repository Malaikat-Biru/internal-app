import { useMemo, useState } from "react"

import {
  Bot,
  CalendarDays,
  Coins,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
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

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const usageTrendData = {
  "7D": [
    {
      date: "02 Aug",
      messages: 684,
      users: 248,
      conversations: 294,
      tokens: 924000,
      cost: 2.18,
    },
    {
      date: "03 Aug",
      messages: 742,
      users: 267,
      conversations: 318,
      tokens: 1018000,
      cost: 2.42,
    },
    {
      date: "04 Aug",
      messages: 801,
      users: 281,
      conversations: 342,
      tokens: 1134000,
      cost: 2.68,
    },
    {
      date: "05 Aug",
      messages: 768,
      users: 274,
      conversations: 328,
      tokens: 1086000,
      cost: 2.54,
    },
    {
      date: "06 Aug",
      messages: 892,
      users: 318,
      conversations: 374,
      tokens: 1284000,
      cost: 2.94,
    },
    {
      date: "07 Aug",
      messages: 964,
      users: 347,
      conversations: 408,
      tokens: 1428000,
      cost: 3.14,
    },
    {
      date: "08 Aug",
      messages: 1038,
      users: 368,
      conversations: 436,
      tokens: 1572000,
      cost: 2.80,
    },
  ],

  "30D": [
    {
      date: "10 Jul",
      messages: 2184,
      users: 684,
      conversations: 824,
      tokens: 3240000,
      cost: 7.82,
    },
    {
      date: "15 Jul",
      messages: 2482,
      users: 742,
      conversations: 918,
      tokens: 3618000,
      cost: 8.64,
    },
    {
      date: "20 Jul",
      messages: 2844,
      users: 816,
      conversations: 1012,
      tokens: 4142000,
      cost: 9.84,
    },
    {
      date: "25 Jul",
      messages: 3128,
      users: 884,
      conversations: 1128,
      tokens: 4624000,
      cost: 11.08,
    },
    {
      date: "30 Jul",
      messages: 3484,
      users: 962,
      conversations: 1246,
      tokens: 5184000,
      cost: 12.36,
    },
    {
      date: "04 Aug",
      messages: 3812,
      users: 1048,
      conversations: 1374,
      tokens: 5628000,
      cost: 13.52,
    },
    {
      date: "08 Aug",
      messages: 4124,
      users: 1124,
      conversations: 1488,
      tokens: 6142000,
      cost: 14.74,
    },
  ],

  "90D": [
    {
      date: "May",
      messages: 8284,
      users: 1842,
      conversations: 3284,
      tokens: 12184000,
      cost: 28.42,
    },
    {
      date: "Jun",
      messages: 11248,
      users: 2348,
      conversations: 4484,
      tokens: 16842000,
      cost: 39.84,
    },
    {
      date: "Jul",
      messages: 14842,
      users: 2942,
      conversations: 5884,
      tokens: 21844000,
      cost: 51.62,
    },
    {
      date: "Aug",
      messages: 16842,
      users: 3248,
      conversations: 6684,
      tokens: 24724000,
      cost: 58.74,
    },
  ],
}

const modelUsage = [
  {
    id: "MODEL-001",
    provider: "DeepSeek",
    name: "DeepSeek V4 Flash",
    modelId: "deepseek-v4-flash",
    description:
      "Fast model untuk request Aoi yang membutuhkan response cepat.",
    usage: 4284,
    inputTokens: 4624000,
    outputTokens: 1428000,
    cost: 3.84,
    badge: "Primary",
  },

  {
    id: "MODEL-002",
    provider: "DeepSeek",
    name: "DeepSeek V4 Pro",
    modelId: "deepseek-v4-pro",
    description:
      "Higher capability model untuk request Aoi yang lebih kompleks.",
    usage: 2184,
    inputTokens: 2864000,
    outputTokens: 982000,
    cost: 7.42,
    badge: "Advanced",
  },

  {
    id: "MODEL-003",
    provider: "OpenAI",
    name: "GPT-5 Mini",
    modelId: "gpt-5-mini",
    description:
      "Balanced model untuk kualitas dan efisiensi penggunaan Aoi.",
    usage: 1842,
    inputTokens: 2184000,
    outputTokens: 684000,
    cost: 6.18,
    badge: "Balanced",
  },

  {
    id: "MODEL-004",
    provider: "OpenAI",
    name: "GPT-5 Nano",
    modelId: "gpt-5-nano",
    description:
      "Lightweight model untuk request sederhana dan volume tinggi.",
    usage: 1028,
    inputTokens: 924000,
    outputTokens: 284000,
    cost: 1.26,
    badge: "Lightweight",
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
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AoiAIPage() {
  const [range, setRange] = useState("7D")
  const [chartMetric, setChartMetric] = useState("MESSAGES")

  const trendData =
    usageTrendData[range] || usageTrendData["7D"]

  const metrics = useMemo(() => {
    const totals = trendData.reduce(
      (result, item) => {
        result.messages += item.messages
        result.conversations += item.conversations
        result.tokens += item.tokens

        return result
      },
      {
        messages: 0,
        conversations: 0,
        tokens: 0,
      },
    )

    const uniqueUsers =
      range === "7D"
        ? 1248
        : range === "30D"
          ? 3484
          : 7284

    return {
      ...totals,
      uniqueUsers,
    }
  }, [range, trendData])

  const modelStatistics = useMemo(() => {
    return modelUsage.reduce(
      (result, model) => {
        result.usage += model.usage
        result.inputTokens += model.inputTokens
        result.outputTokens += model.outputTokens
        result.cost += model.cost

        return result
      },
      {
        usage: 0,
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
      },
    )
  }, [])

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
            Aoi AI
          </h1>

          <p className="mt-1.5 max-w-[700px] text-[13px] leading-5 text-muted-foreground">
            Pantau penggunaan Aoi AI, aktivitas user, conversation, token, dan
            biaya model AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-muted-foreground" />

          <select
            value={range}
            onChange={(event) =>
              setRange(event.target.value)
            }
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
      {/* Main Statistics                                                  */}
      {/* ================================================================ */}

      <section className="mt-6 grid grid-cols-5 gap-3">
        <MetricCard
          icon={MessageSquare}
          label="Messages"
          value={formatNumber(metrics.messages)}
          description={`Across ${rangeLabel(range)}`}
        />

        <MetricCard
          icon={Users}
          label="Unique Users"
          value={formatNumber(metrics.uniqueUsers)}
          description="Users yang menggunakan Aoi"
        />

        <MetricCard
          icon={Bot}
          label="Conversations"
          value={formatNumber(metrics.conversations)}
          description="Conversation sessions"
        />

        <MetricCard
          icon={Zap}
          label="Total Tokens"
          value={formatCompactNumber(metrics.tokens)}
          description="Input + output tokens"
        />

        <MetricCard
          icon={Coins}
          label="Total Cost"
          value={formatCurrency(modelStatistics.cost)}
          description="Across all AI models"
        />
      </section>

      {/* ================================================================ */}
      {/* Aoi Usage Trend                                                  */}
      {/* ================================================================ */}

      <section className="mt-4 rounded-2xl border border-border bg-background">
        <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Aoi Usage Trend
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Perkembangan penggunaan dan biaya Aoi AI berdasarkan periode yang
              dipilih.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg bg-muted p-1">
              <ChartMetricButton
                label="Messages"
                active={chartMetric === "MESSAGES"}
                onClick={() =>
                  setChartMetric("MESSAGES")
                }
              />

              <ChartMetricButton
                label="Users"
                active={chartMetric === "USERS"}
                onClick={() =>
                  setChartMetric("USERS")
                }
              />

              <ChartMetricButton
                label="Conversations"
                active={
                  chartMetric ===
                  "CONVERSATIONS"
                }
                onClick={() =>
                  setChartMetric(
                    "CONVERSATIONS",
                  )
                }
              />

              <ChartMetricButton
                label="Tokens"
                active={chartMetric === "TOKENS"}
                onClick={() =>
                  setChartMetric("TOKENS")
                }
              />

              <ChartMetricButton
                label="Cost"
                active={chartMetric === "COST"}
                onClick={() =>
                  setChartMetric("COST")
                }
              />
            </div>

            <Badge
              variant="secondary"
              className="text-[9px]"
            >
              {rangeLabel(range)}
            </Badge>
          </div>
        </div>

        <div className="h-[310px] px-3 pb-3 pt-5">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={trendData}
              margin={{
                top: 5,
                right: 18,
                left: -5,
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
                tickFormatter={(value) =>
                  formatChartAxis(
                    value,
                    chartMetric,
                  )
                }
              />

              <Tooltip
                content={
                  <UsageTooltip
                    metric={chartMetric}
                  />
                }
              />

              <Line
                type="monotone"
                dataKey={getChartDataKey(
                  chartMetric,
                )}
                stroke="currentColor"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                }}
                className="text-primary"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-2 border-t border-border px-5 py-3">
          <span className="size-2 rounded-full bg-primary" />

          <p className="text-[10px] text-muted-foreground">
            {chartMetricLabel(chartMetric)}
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Model Usage                                                      */}
      {/* ================================================================ */}

      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-muted-foreground" />

            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Model Usage
            </h2>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Penggunaan token dan estimated cost untuk setiap model Aoi.
          </p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[minmax(330px,1.8fr)_140px_130px_170px_170px_140px] items-center border-b border-border bg-muted/20 px-4">
          <TableHeaderCell>
            Model
          </TableHeaderCell>

          <TableHeaderCell>
            Provider
          </TableHeaderCell>

          <TableHeaderCell>
            Usage
          </TableHeaderCell>

          <TableHeaderCell>
            Usage Share
          </TableHeaderCell>

          <TableHeaderCell>
            Tokens
          </TableHeaderCell>

          <TableHeaderCell>
            Cost
          </TableHeaderCell>
        </div>

        {modelUsage.map((model) => (
          <ModelUsageRow
            key={model.id}
            model={model}
            totalUsage={
              modelStatistics.usage
            }
          />
        ))}
      </section>

      <div className="h-8" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MODEL USAGE ROW                                                            */
/* -------------------------------------------------------------------------- */

function ModelUsageRow({
  model,
  totalUsage,
}) {
  const totalTokens =
    model.inputTokens +
    model.outputTokens

  const usageShare =
    totalUsage > 0
      ? (model.usage / totalUsage) * 100
      : 0

  const costPerUsage =
    model.usage > 0
      ? model.cost / model.usage
      : 0

  return (
    <div className="grid grid-cols-[minmax(330px,1.8fr)_140px_130px_170px_170px_140px] items-center border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* Model */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bot className="size-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-semibold text-foreground">
              {model.name}
            </p>

            <ModelBadge
              label={model.badge}
            />
          </div>

          <p className="mt-1 max-w-[350px] truncate text-[10px] text-muted-foreground">
            {model.description}
          </p>

          <p className="mt-1 text-[9px] text-muted-foreground/70">
            {model.modelId}
          </p>
        </div>
      </div>

      {/* Provider */}
      <p className="text-[11px] text-muted-foreground">
        {model.provider}
      </p>

      {/* Usage */}
      <div>
        <p className="text-[12px] font-semibold text-foreground">
          {formatNumber(model.usage)}
        </p>

        <p className="mt-0.5 text-[9px] text-muted-foreground">
          requests
        </p>
      </div>

      {/* Usage Share */}
      <div className="max-w-[130px]">
        <p className="text-[10px] font-medium text-foreground">
          {usageShare.toFixed(1)}%
        </p>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${usageShare}%`,
            }}
          />
        </div>
      </div>

      {/* Tokens */}
      <div>
        <p className="text-[11px] font-semibold text-foreground">
          {formatCompactNumber(
            totalTokens,
          )}
        </p>

        <p className="mt-0.5 text-[8px] text-muted-foreground">
          {formatCompactNumber(
            model.inputTokens,
          )}{" "}
          in /{" "}
          {formatCompactNumber(
            model.outputTokens,
          )}{" "}
          out
        </p>
      </div>

      {/* Cost */}
      <div>
        <p className="text-[12px] font-semibold text-foreground">
          {formatCurrency(model.cost)}
        </p>

        <p className="mt-0.5 text-[8px] text-muted-foreground">
          {formatCurrency(
            costPerUsage,
            4,
          )}{" "}
          / usage
        </p>
      </div>
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
    <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 truncate text-[23px] font-semibold tracking-[-0.04em] text-foreground">
            {value}
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="mt-2 truncate text-[9px] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MODEL BADGE                                                                */
/* -------------------------------------------------------------------------- */

function ModelBadge({
  label,
}) {
  if (label === "Primary") {
    return (
      <Badge className="h-5 border-primary/15 bg-primary/10 px-1.5 text-[8px] text-primary hover:bg-primary/10">
        Primary
      </Badge>
    )
  }

  if (label === "Advanced") {
    return (
      <Badge className="h-5 border-violet-500/15 bg-violet-500/10 px-1.5 text-[8px] text-violet-700 hover:bg-violet-500/10">
        Advanced
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="h-5 px-1.5 text-[8px]"
    >
      {label}
    </Badge>
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
/* CHART                                                                      */
/* -------------------------------------------------------------------------- */

function ChartMetricButton({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-7 cursor-pointer rounded-md px-3 text-[10px] font-medium transition-all",

        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

function UsageTooltip({
  active,
  payload,
  label,
  metric,
}) {
  if (!active || !payload?.length) {
    return null
  }

  const value =
    payload[0]?.value || 0

  return (
    <div className="min-w-[150px] rounded-xl border border-border bg-background px-3 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold text-foreground">
        {label}
      </p>

      <div className="mt-2 flex items-center justify-between gap-6">
        <span className="text-[9px] text-muted-foreground">
          {chartMetricLabel(metric)}
        </span>

        <span className="text-[10px] font-medium text-foreground">
          {metric === "TOKENS"
            ? formatCompactNumber(value)
            : metric === "COST"
              ? formatCurrency(value)
              : formatNumber(value)}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getChartDataKey(
  metric,
) {
  if (
    metric ===
    "CONVERSATIONS"
  ) {
    return "conversations"
  }

  if (metric === "USERS") {
    return "users"
  }

  if (metric === "TOKENS") {
    return "tokens"
  }

  if (metric === "COST") {
    return "cost"
  }

  return "messages"
}

function chartMetricLabel(
  metric,
) {
  if (
    metric ===
    "CONVERSATIONS"
  ) {
    return "Conversations"
  }

  if (metric === "USERS") {
    return "Unique Users"
  }

  if (metric === "TOKENS") {
    return "Tokens"
  }

  if (metric === "COST") {
    return "Cost"
  }

  return "Messages"
}

function formatChartAxis(
  value,
  metric,
) {
  if (metric === "COST") {
    return `$${Number(
      value || 0,
    ).toFixed(1)}`
  }

  return formatCompactNumber(value)
}

function formatNumber(value) {
  return Number(
    value || 0,
  ).toLocaleString("id-ID")
}

function formatCompactNumber(
  value,
) {
  const number =
    Number(value || 0)

  if (number >= 1_000_000) {
    return `${(
      number / 1_000_000
    ).toFixed(2)}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(1)}K`
  }

  return number.toLocaleString(
    "id-ID",
  )
}

function formatCurrency(
  value,
  decimals = 2,
) {
  return `$${Number(
    value || 0,
  ).toFixed(decimals)}`
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
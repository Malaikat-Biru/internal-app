import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CircleAlert,
  Clock3,
  CreditCard,
  Database,
  Users,
  Wrench,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const userGrowth = [
  { date: "02 Aug", users: 182 },
  { date: "03 Aug", users: 218 },
  { date: "04 Aug", users: 246 },
  { date: "05 Aug", users: 290 },
  { date: "06 Aug", users: 322 },
  { date: "07 Aug", users: 361 },
  { date: "08 Aug", users: 412 },
];

const toolUsage = [
  {
    name: "Fillstat Simulator",
    value: 4218,
    percentage: 100,
  },
  {
    name: "Leveling Calculator",
    value: 3842,
    percentage: 91,
  },
  {
    name: "MQ Calculator",
    value: 2982,
    percentage: 71,
  },
  {
    name: "Crysta Tree",
    value: 2167,
    percentage: 51,
  },
  {
    name: "Stat Calculator",
    value: 1821,
    percentage: 43,
  },
];

const dataCenterUsage = [
  {
    name: "Items",
    views: 8421,
    percentage: 100,
  },
  {
    name: "Monsters",
    views: 4832,
    percentage: 57,
  },
  {
    name: "Worlds",
    views: 3742,
    percentage: 44,
  },
  {
    name: "Crystas",
    views: 2841,
    percentage: 34,
  },
  {
    name: "BGM",
    views: 821,
    percentage: 10,
  },
];

const subscriptions = [
  {
    name: "Free",
    value: 2919,
    percentage: 76,
  },
  {
    name: "Plus",
    value: 621,
    percentage: 16,
  },
  {
    name: "Ultimate",
    value: 302,
    percentage: 8,
  },
];

export default function OverviewPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-6 xl:px-8">
      {/* Page Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium text-primary">
            Operations Overview
          </p>

          <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
            Selamat datang, Rafi.
          </h1>

          <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
            Pantau aktivitas pengguna, penggunaan Aoi, AI, subscription, dan
            kondisi data Malaikat Biru.
          </p>
        </div>

        <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />
          Data hari ini
        </div>
      </div>

      {/* Primary User Metrics */}
      <section className="mt-6 grid grid-cols-5 gap-3">
        <MetricCard
          icon={Users}
          title="Total Users"
          value="3,842"
          hint="+82 minggu ini"
          change="+6.2%"
        />

        <MetricCard
          icon={Activity}
          title="DAU"
          value="412"
          hint="Aktif hari ini"
          change="+12.8%"
        />

        <MetricCard
          icon={Users}
          title="WAU"
          value="1,382"
          hint="7 hari terakhir"
          change="+9.4%"
        />

        <MetricCard
          icon={Users}
          title="MAU"
          value="3,241"
          hint="30 hari terakhir"
          change="+7.1%"
        />

        <MetricCard
          icon={CreditCard}
          title="Paid Users"
          value="923"
          hint="Plus + Ultimate"
          change="+2.1%"
        />
      </section>

      {/* User Activity & Health */}
      <section className="mt-4 grid grid-cols-[minmax(0,1.55fr)_minmax(300px,0.45fr)] gap-4">
        {/* Activity Chart */}
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex items-start justify-between px-5 pb-2 pt-5">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                User Activity
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Perkembangan daily active users selama tujuh hari terakhir.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="font-normal"
            >
              7 hari
            </Badge>
          </div>

          <div className="h-[270px] px-2 pb-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient
                    id="userActivityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={38}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                />

                <Tooltip
                  content={<ChartTooltip />}
                />

                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#userActivityGradient)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: "var(--primary)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Health */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              User Health
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Retention dan penggunaan akun Malaikat Biru.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <HealthMetric
              label="Returning Users"
              value="61%"
            />

            <HealthMetric
              label="New Users"
              value="39%"
            />

            <HealthMetric
              label="Users with Character"
              value="72%"
            />

            <HealthMetric
              label="Avg. Characters / User"
              value="1.8"
            />
          </div>

          <div className="mt-6 rounded-xl bg-primary/[0.06] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">
                DAU / MAU
              </p>

              <p className="text-sm font-semibold text-primary">
                12.7%
              </p>
            </div>

            <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
              Persentase user bulanan yang kembali menggunakan platform hari
              ini.
            </p>
          </div>
        </div>
      </section>

      {/* Aoi Usage */}
      <section className="mt-4">
        <SectionHeading
          title="Aoi Usage"
          description="Lihat fitur dan informasi Aoi yang paling banyak digunakan oleh user."
        />

        <div className="mt-3 grid grid-cols-2 gap-4">
          {/* Top Aoi Tools */}
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  Top Aoi Tools
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Lima tools yang paling sering digunakan hari ini.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 cursor-pointer gap-1 text-xs"
              >
                Lihat detail
                <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {toolUsage.map((tool, index) => (
                <RankUsageRow
                  key={tool.name}
                  rank={index + 1}
                  label={tool.name}
                  value={tool.value.toLocaleString()}
                  percentage={tool.percentage}
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 border-t border-border pt-4">
              <InlineMetric
                label="Total Runs"
                value="8,421"
              />

              <InlineMetric
                label="Tool Users"
                value="284"
              />

              <InlineMetric
                label="Avg. Runs"
                value="29.7"
              />
            </div>
          </div>

          {/* Top Data Center */}
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  Top Data Center
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Lima kategori informasi yang paling banyak dibuka hari ini.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 cursor-pointer gap-1 text-xs"
              >
                Lihat detail
                <ArrowRight className="size-3.5" />
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {dataCenterUsage.map((item, index) => (
                <RankUsageRow
                  key={item.name}
                  rank={index + 1}
                  label={item.name}
                  value={`${item.views.toLocaleString()} views`}
                  percentage={item.percentage}
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 border-t border-border pt-4">
              <InlineMetric
                label="Page Views"
                value="18,482"
              />

              <InlineMetric
                label="Data Users"
                value="218"
              />

              <InlineMetric
                label="Avg. Views"
                value="84.8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI + Subscription */}
      <section className="mt-4 grid grid-cols-2 gap-4">
        {/* Aoi AI Health */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Aoi AI Health
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Penggunaan, performa, dan biaya Aoi AI hari ini.
              </p>
            </div>

            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="size-4" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-x-5 gap-y-6">
            <SmallMetric
              label="Messages"
              value="2,142"
            />

            <SmallMetric
              label="AI Users"
              value="121"
            />

            <SmallMetric
              label="Total Tokens"
              value="3.84M"
            />

            <SmallMetric
              label="AI Cost"
              value="Rp38.200"
            />

            <SmallMetric
              label="Avg. Response"
              value="2.4s"
            />

            <SmallMetric
              label="Reports"
              value="5"
              warning
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs font-medium">
                Avg. cost / message
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Penggunaan seluruh model hari ini
              </p>
            </div>

            <p className="text-sm font-semibold">
              Rp17,83
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/[0.08] px-3 py-2.5">
            <Activity className="size-4 text-emerald-600" />

            <p className="text-[11px] font-medium text-emerald-700">
              Semua layanan Aoi AI berjalan normal.
            </p>
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Subscription
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Distribusi paket pengguna Malaikat Biru.
              </p>
            </div>

            <CreditCard className="size-4 text-muted-foreground" />
          </div>

          <div className="mt-5 space-y-4">
            {subscriptions.map((plan) => (
              <PlanRow
                key={plan.name}
                name={plan.name}
                value={plan.value}
                percentage={plan.percentage}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 border-t border-border pt-4">
            <InlineMetric
              label="Paid Users"
              value="923"
            />

            <InlineMetric
              label="Paid Adoption"
              value="24.0%"
            />

            <InlineMetric
              label="New Paid"
              value="+41"
              positive
            />
          </div>
        </div>
      </section>

      {/* Data Health */}
      <section className="mt-4">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Data Health
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Kondisi database utama yang digunakan oleh Aoi.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer gap-1.5 text-xs"
            >
              Kelola data
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-3">
            <DataMetric
              label="Published"
              value="23,421"
              description="Data aktif"
              status="success"
            />

            <DataMetric
              label="Draft"
              value="482"
              description="Belum dipublish"
            />

            <DataMetric
              label="Missing Source"
              value="82"
              description="Belum memiliki sumber"
              status="warning"
            />

            <DataMetric
              label="Needs Review"
              value="24"
              description="Perlu validasi ulang"
              status="warning"
            />
          </div>
        </div>
      </section>

      {/* Needs Attention */}
      <section className="mt-4 pb-8">
        <div className="rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <CircleAlert className="size-4 text-amber-500" />

                <h2 className="text-sm font-semibold">
                  Needs Attention
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Hal yang perlu kamu periksa atau tindaklanjuti.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 cursor-pointer gap-1 text-xs"
            >
              Lihat semua
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 border-t border-border">
            <AttentionItem
              icon={Database}
              value="82"
              title="Missing source"
              description="Data belum memiliki sumber"
            />

            <AttentionItem
              icon={Bot}
              value="5"
              title="AI reports"
              description="Feedback AI belum ditinjau"
            />

            <AttentionItem
              icon={CircleAlert}
              value="2"
              title="System errors"
              description="Error operasional perlu diperiksa"
              last
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-tight">
        {title}
      </h2>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  hint,
  change,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
          <ArrowUpRight className="size-3" />
          {change}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[25px] font-semibold tracking-[-0.04em]">
          {value}
        </p>

        <p className="mt-1 text-xs font-medium">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          {hint}
        </p>
      </div>
    </div>
  );
}

function HealthMetric({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-semibold tracking-[-0.02em]">
        {value}
      </p>
    </div>
  );
}

function RankUsageRow({
  rank,
  label,
  value,
  percentage,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-semibold text-muted-foreground">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-xs font-medium text-foreground">
            {label}
          </p>

          <p className="shrink-0 text-[11px] text-muted-foreground">
            {value}
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
  );
}

function PlanRow({
  name,
  value,
  percentage,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium">
            {name}
          </p>

          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {percentage}% dari total user
          </p>
        </div>

        <p className="text-sm font-semibold">
          {value.toLocaleString()}
        </p>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function InlineMetric({
  label,
  value,
  positive,
}) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-sm font-semibold",
          positive
            ? "text-emerald-600"
            : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function SmallMetric({
  label,
  value,
  warning,
}) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1 text-[18px] font-semibold tracking-[-0.03em]",
          warning
            ? "text-amber-600"
            : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function DataMetric({
  label,
  value,
  description,
  status,
}) {
  const statusClass =
    status === "warning"
      ? "bg-amber-500"
      : status === "success"
        ? "bg-emerald-500"
        : "bg-muted-foreground";

  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <span
          className={`size-1.5 rounded-full ${statusClass}`}
        />

        <p className="text-[10px] text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 text-xl font-semibold tracking-[-0.035em]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AttentionItem({
  icon: Icon,
  value,
  title,
  description,
  last,
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-5 py-4",
        !last ? "border-r border-border" : "",
      ].join(" ")}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {value}
          </p>

          <p className="truncate text-xs font-medium">
            {title}
          </p>
        </div>

        <p className="mt-1 truncate text-[10px] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-popover-foreground">
        {payload[0].value} active users
      </p>
    </div>
  );
}
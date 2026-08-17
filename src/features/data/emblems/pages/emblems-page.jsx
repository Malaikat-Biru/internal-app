import {
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react"

import {
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  Button,
} from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const emblems = [
  {
    id: "EMBLEM-001",

    name:
      "Haven't Played Enough!",

    category:
      "PLAY_TIME",

    frequency:
      "DAILY",

    reward: {
      type:
        "EXP_BONUS",

      value: 10,

      unit:
        "PERCENT",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-002",

    name:
      "Haven't Played Enough at All!!",

    category:
      "PLAY_TIME",

    frequency:
      "DAILY",

    reward: {
      type:
        "EXP_BONUS",

      value: 10,

      unit:
        "PERCENT",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-003",

    name:
      "Tune Up",

    category:
      "BATTLE",

    frequency:
      "DAILY",

    reward: {
      type:
        "EXP_BONUS",

      value: 10,

      unit:
        "PERCENT",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-004",

    name:
      "Warm Up",

    category:
      "BATTLE",

    frequency:
      "DAILY",

    reward: {
      type:
        "EXP_BONUS",

      value: 10,

      unit:
        "PERCENT",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-005",

    name:
      "Best Condition",

    category:
      "BATTLE",

    frequency:
      "DAILY",

    reward: {
      type:
        "EXP_BONUS",

      value: 10,

      unit:
        "PERCENT",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-006",

    name:
      "Today's Part-Time Job",

    category:
      "QUEST",

    frequency:
      "DAILY",

    reward: {
      type:
        "SPINA",

      value: 100,
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-007",

    name:
      "Known Adventurer",

    category:
      "CHARACTER",

    frequency:
      "ONE_TIME",

    reward: {
      type:
        "STAT_POINT",

      value: 5,
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-008",

    name:
      "Combine the Skills!",

    category:
      "SKILL",

    frequency:
      "ONE_TIME",

    reward: {
      type:
        "OTHER",

      label:
        "Unlock Combo",
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-009",

    name:
      "Production Beginner",

    category:
      "PRODUCTION",

    frequency:
      "ONE_TIME",

    reward: {
      type:
        "SKILL_POINT",

      value: 1,
    },

    status:
      "DRAFT",
  },

  {
    id: "EMBLEM-010",

    name:
      "Weekly Adventurer",

    category:
      "QUEST",

    frequency:
      "WEEKLY",

    reward: {
      type:
        "ITEM",

      itemName:
        "Teleport Ticket",

      quantity: 1,
    },

    status:
      "DRAFT",
  },

  {
    id: "EMBLEM-011",

    name:
      "Anniversary Challenge",

    category:
      "EVENT",

    frequency:
      "EVENT",

    reward: {
      type:
        "ITEM",

      itemName:
        "Teleport Ticket",

      quantity: 10,
    },

    status:
      "PUBLISHED",
  },

  {
    id: "EMBLEM-012",

    name:
      "Master Adventurer",

    category:
      "CHARACTER",

    frequency:
      "ONE_TIME",

    reward: {
      type:
        "STAT_POINT",

      value: 5,
    },

    status:
      "DRAFT",
  },
]

/* -------------------------------------------------------------------------- */
/* FILTER OPTIONS                                                             */
/* -------------------------------------------------------------------------- */

const categoryOptions = [
  {
    value: "ALL",
    label: "All Categories",
  },
  {
    value: "CHARACTER",
    label: "Character",
  },
  {
    value: "PLAY_TIME",
    label: "Play Time",
  },
  {
    value: "BATTLE",
    label: "Battle",
  },
  {
    value: "QUEST",
    label: "Quest",
  },
  {
    value: "SKILL",
    label: "Skill",
  },
  {
    value: "PRODUCTION",
    label: "Production",
  },
  {
    value: "EVENT",
    label: "Event",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

const frequencyOptions = [
  {
    value: "ALL",
    label: "All Frequencies",
  },
  {
    value: "ONE_TIME",
    label: "One Time",
  },
  {
    value: "DAILY",
    label: "Daily",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "EVENT",
    label: "Event",
  },
]

const statusOptions = [
  {
    value: "ALL",
    label: "All Status",
  },
  {
    value: "PUBLISHED",
    label: "Published",
  },
  {
    value: "DRAFT",
    label: "Draft",
  },
]

const pageSize =
  10

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EmblemsPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("ALL")

  const [
    frequencyFilter,
    setFrequencyFilter,
  ] = useState("ALL")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL")

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)

  /* ---------------------------------------------------------------------- */
  /* STATISTICS                                                             */
  /* ---------------------------------------------------------------------- */

  const totalEmblems =
    emblems.length

  const totalPublished =
    emblems.filter(
      (emblem) =>
        emblem.status ===
        "PUBLISHED",
    ).length

  const totalDraft =
    emblems.filter(
      (emblem) =>
        emblem.status ===
        "DRAFT",
    ).length

  /* ---------------------------------------------------------------------- */
  /* FILTERED DATA                                                          */
  /* ---------------------------------------------------------------------- */

  const filteredEmblems =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return emblems.filter(
        (emblem) => {
          const rewardText =
            formatReward(
              emblem.reward,
            ).toLowerCase()

          const matchesSearch =
            !keyword ||
            emblem.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            rewardText.includes(
              keyword,
            )

          const matchesCategory =
            categoryFilter ===
              "ALL" ||
            emblem.category ===
              categoryFilter

          const matchesFrequency =
            frequencyFilter ===
              "ALL" ||
            emblem.frequency ===
              frequencyFilter

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            emblem.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesCategory &&
            matchesFrequency &&
            matchesStatus
          )
        },
      )
    }, [
      search,
      categoryFilter,
      frequencyFilter,
      statusFilter,
    ])

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredEmblems.length /
          pageSize,
      ),
    )

  const safePage =
    Math.min(
      currentPage,
      totalPages,
    )

  const paginatedEmblems =
    useMemo(() => {
      const start =
        (safePage - 1) *
        pageSize

      return filteredEmblems.slice(
        start,
        start +
          pageSize,
      )
    }, [
      filteredEmblems,
      safePage,
    ])

  const startItem =
    filteredEmblems.length ===
    0
      ? 0
      : (safePage - 1) *
          pageSize +
        1

  const endItem =
    Math.min(
      safePage *
        pageSize,
      filteredEmblems.length,
    )

  /* ---------------------------------------------------------------------- */
  /* HANDLERS                                                               */
  /* ---------------------------------------------------------------------- */

  function handleSearch(
    value,
  ) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleCategoryFilter(
    value,
  ) {
    setCategoryFilter(value)
    setCurrentPage(1)
  }

  function handleFrequencyFilter(
    value,
  ) {
    setFrequencyFilter(value)
    setCurrentPage(1)
  }

  function handleStatusFilter(
    value,
  ) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function clearFilters() {
    setSearch("")
    setCategoryFilter("ALL")
    setFrequencyFilter("ALL")
    setStatusFilter("ALL")
    setCurrentPage(1)
  }

  function handleDelete(
    emblem,
  ) {
    console.log(
      "Delete emblem:",
      emblem,
    )

    /*
      TODO:
      open confirmation dialog
    */
  }

  const hasActiveFilter =
    Boolean(search) ||
    categoryFilter !==
      "ALL" ||
    frequencyFilter !==
      "ALL" ||
    statusFilter !==
      "ALL"

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-7 xl:px-8">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header className="flex items-end justify-between gap-8">
        <div>
          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-muted-foreground">
              Data
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-muted-foreground">
              Character System
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Emblems
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Emblems
          </h1>

          <p className="mt-2 max-w-[780px] text-sm leading-6 text-muted-foreground">
            Kelola data prestasi Toram, jenis aktivitas, frekuensi
            penyelesaian, dan reward yang diperoleh pemain.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/character-system/emblems/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <CirclePlus className="size-4" />

          Add Emblem
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          label="Total Emblems"
          value={
            totalEmblems
          }
        />

        <StatCard
          label="Published"
          value={
            totalPublished
          }
        />

        <StatCard
          label="Draft"
          value={
            totalDraft
          }
        />
      </div>

      {/* ================================================================== */}
      {/* TABLE CARD                                                         */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-visible rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* TOOLBAR                                                          */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-5 border-b border-border p-4">
          {/* SEARCH */}

          <div className="relative w-full max-w-[360px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={
                search
              }
              onChange={(
                event,
              ) =>
                handleSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search emblem..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </div>

          {/* FILTERS */}

          <div className="flex items-center gap-2">
            <FilterSelect
              value={
                categoryFilter
              }
              options={
                categoryOptions
              }
              onChange={
                handleCategoryFilter
              }
            />

            <FilterSelect
              value={
                frequencyFilter
              }
              options={
                frequencyOptions
              }
              onChange={
                handleFrequencyFilter
              }
            />

            <FilterSelect
              value={
                statusFilter
              }
              options={
                statusOptions
              }
              onChange={
                handleStatusFilter
              }
            />

            {hasActiveFilter && (
              <Button
                type="button"
                variant="ghost"
                onClick={
                  clearFilters
                }
                className="h-10 cursor-pointer gap-1.5 px-3 text-xs text-muted-foreground"
              >
                <X className="size-3.5" />

                Reset
              </Button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* TABLE                                                            */}
        {/* ================================================================= */}

        <div className="overflow-x-auto">
          <div className="min-w-[1050px]">
            {/* TABLE HEAD */}

            <div className="grid grid-cols-[minmax(300px,1.5fr)_180px_160px_minmax(220px,1fr)_140px_64px] items-center border-b border-border bg-muted/15 px-5 py-3">
              <TableHead>
                Emblem
              </TableHead>

              <TableHead>
                Category
              </TableHead>

              <TableHead>
                Frequency
              </TableHead>

              <TableHead>
                Reward
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <span />
            </div>

            {/* TABLE BODY */}

            {paginatedEmblems.length >
            0 ? (
              paginatedEmblems.map(
                (emblem) => (
                  <EmblemRow
                    key={
                      emblem.id
                    }
                    emblem={
                      emblem
                    }
                    navigate={
                      navigate
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                ),
              )
            ) : (
              <div className="flex min-h-[300px] items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Award className="size-5" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No emblems found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Tidak ada data yang sesuai dengan filter.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* PAGINATION                                                       */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-6 border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}

            <span className="font-medium text-foreground">
              {startItem}
            </span>

            {" - "}

            <span className="font-medium text-foreground">
              {endItem}
            </span>

            {" of "}

            <span className="font-medium text-foreground">
              {
                filteredEmblems.length
              }
            </span>

            {" emblems"}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={
                safePage <= 1
              }
              onClick={() =>
                setCurrentPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                )
              }
              className="size-9 cursor-pointer rounded-lg disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex h-9 min-w-[82px] items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground">
              {safePage} /{" "}
              {totalPages}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={
                safePage >=
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (current) =>
                    Math.min(
                      totalPages,
                      current + 1,
                    ),
                )
              }
              className="size-9 cursor-pointer rounded-lg disabled:cursor-not-allowed"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EMBLEM ROW                                                                 */
/* -------------------------------------------------------------------------- */

function EmblemRow({
  emblem,
  navigate,
  onDelete,
}) {
  return (
    <div className="grid grid-cols-[minmax(300px,1.5fr)_180px_160px_minmax(220px,1fr)_140px_64px] items-center border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/[0.08]">
      {/* EMBLEM */}

      <button
        type="button"
        onClick={() =>
          navigate(
            `/data/character-system/emblems/${emblem.id}`,
          )
        }
        className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Award className="size-4" />
        </div>

        <p className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary">
          {emblem.name}
        </p>
      </button>

      {/* CATEGORY */}

      <CategoryBadge
        category={
          emblem.category
        }
      />

      {/* FREQUENCY */}

      <p className="text-sm text-foreground">
        {formatFrequency(
          emblem.frequency,
        )}
      </p>

      {/* REWARD */}

      <p className="truncate text-sm font-medium text-foreground">
        {formatReward(
          emblem.reward,
        )}
      </p>

      {/* STATUS */}

      <StatusBadge
        status={
          emblem.status
        }
      />

      {/* ACTION */}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 cursor-pointer rounded-lg"
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Actions
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/data/character-system/emblems/${emblem.id}`,
                )
              }
              className="cursor-pointer gap-2"
            >
              <Eye className="size-4" />

              View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/data/character-system/emblems/${emblem.id}/edit`,
                )
              }
              className="cursor-pointer gap-2"
            >
              <Pencil className="size-4" />

              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                onDelete(
                  emblem,
                )
              }
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />

              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* STAT CARD                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-5 py-4">
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-foreground">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TABLE HEAD                                                                 */
/* -------------------------------------------------------------------------- */

function TableHead({
  children,
}) {
  return (
    <span className="text-xs font-medium text-muted-foreground">
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* FILTER SELECT                                                              */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  value,
  options,
  onChange,
}) {
  const selected =
    options.find(
      (option) =>
        option.value ===
        value,
    ) || options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 min-w-[145px] cursor-pointer justify-between gap-3 rounded-lg px-3.5 text-xs font-medium"
          />
        }
      >
        <span className="truncate">
          {
            selected.label
          }
        </span>

        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[190px]"
      >
        <DropdownMenuGroup>
          {options.map(
            (option) => (
              <DropdownMenuItem
                key={
                  option.value
                }
                onClick={() =>
                  onChange(
                    option.value,
                  )
                }
                className={[
                  "cursor-pointer",

                  option.value ===
                  value
                    ? "font-medium text-primary"
                    : "",
                ].join(" ")}
              >
                {
                  option.label
                }
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY BADGE                                                             */
/* -------------------------------------------------------------------------- */

function CategoryBadge({
  category,
}) {
  return (
    <span className="inline-flex w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {formatCategory(
        category,
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}) {
  const published =
    status ===
    "PUBLISHED"

  return (
    <span
      className={[
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",

        published
          ? "bg-emerald-500/10 text-emerald-700"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "size-1.5 rounded-full",

          published
            ? "bg-emerald-500"
            : "bg-muted-foreground/60",
        ].join(" ")}
      />

      {published
        ? "Published"
        : "Draft"}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatCategory(
  category,
) {
  const labels = {
    CHARACTER:
      "Character",

    PLAY_TIME:
      "Play Time",

    BATTLE:
      "Battle",

    QUEST:
      "Quest",

    SKILL:
      "Skill",

    PRODUCTION:
      "Production",

    EVENT:
      "Event",

    OTHER:
      "Other",
  }

  return (
    labels[category] ||
    category
  )
}

function formatFrequency(
  frequency,
) {
  const labels = {
    ONE_TIME:
      "One Time",

    DAILY:
      "Daily",

    WEEKLY:
      "Weekly",

    EVENT:
      "Event",
  }

  return (
    labels[frequency] ||
    frequency
  )
}

function formatReward(
  reward,
) {
  if (!reward) {
    return "—"
  }

  if (
    reward.type ===
    "EXP_BONUS"
  ) {
    return `EXP +${reward.value || 0}%`
  }

  if (
    reward.type ===
    "SPINA"
  ) {
    return `${formatNumber(
      reward.value || 0,
    )} Spina`
  }

  if (
    reward.type ===
    "STAT_POINT"
  ) {
    return `${reward.value || 0} Stat Point${
      reward.value === 1
        ? ""
        : "s"
    }`
  }

  if (
    reward.type ===
    "SKILL_POINT"
  ) {
    return `${reward.value || 0} Skill Point${
      reward.value === 1
        ? ""
        : "s"
    }`
  }

  if (
    reward.type ===
    "ITEM"
  ) {
    return `${reward.itemName || "Item"} ×${reward.quantity || 1}`
  }

  if (
    reward.type ===
    "OTHER"
  ) {
    return (
      reward.label ||
      "Other Reward"
    )
  }

  return "—"
}

function formatNumber(
  value,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value)
}
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  ScrollText,
  Trash2,
  UserRound,
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

const sideQuests = [
  {
    id: "QUEST-001",

    name: "Proof of Courage?",

    requiredLevel: 25,

    npc: {
      id: "NPC-001",
      name: "Lefina",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-002",

    name: "Timber Shortage",

    requiredLevel: 15,

    npc: {
      id: "NPC-001",
      name: "Lefina",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-003",

    name: "The Overlooked Snack",

    requiredLevel: 10,

    npc: {
      id: "NPC-005",
      name: "Forf",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-004",

    name: "Nightmare Crystal",

    requiredLevel: 50,

    npc: {
      id: "NPC-001",
      name: "Lefina",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-005",

    name: "Pride of the Rich",

    requiredLevel: 40,

    npc: {
      id: "NPC-006",
      name: "Yunis",
    },

    status: "DRAFT",
  },

  {
    id: "QUEST-006",

    name: "A Drinking Pal at the Fortress",

    requiredLevel: 30,

    npc: {
      id: "NPC-009",
      name: "Zaldo",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-007",

    name: "Collecting Medicinal Herbs",

    requiredLevel: 12,

    npc: {
      id: "NPC-011",
      name: "Ravagne",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-008",

    name: "Lost Adventurer",

    requiredLevel: 35,

    npc: {
      id: "NPC-012",
      name: "Talia",
    },

    status: "DRAFT",
  },

  {
    id: "QUEST-009",

    name: "Supplies for the Journey",

    requiredLevel: 20,

    npc: {
      id: "NPC-014",
      name: "Loma",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-010",

    name: "Something in the Forest",

    requiredLevel: 45,

    npc: {
      id: "NPC-016",
      name: "Miela",
    },

    status: "DRAFT",
  },

  {
    id: "QUEST-011",

    name: "Trouble in the Sewer",

    requiredLevel: 60,

    npc: {
      id: "NPC-018",
      name: "Elen",
    },

    status: "PUBLISHED",
  },

  {
    id: "QUEST-012",

    name: "Request from the Wasteland",

    requiredLevel: 70,

    npc: {
      id: "NPC-019",
      name: "Luria",
    },

    status: "DRAFT",
  },
]

/* -------------------------------------------------------------------------- */
/* FILTER OPTIONS                                                             */
/* -------------------------------------------------------------------------- */

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

const pageSize = 10

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function SideQuestsPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    npcFilter,
    setNpcFilter,
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
  /* NPC OPTIONS                                                            */
  /* ---------------------------------------------------------------------- */

  const npcOptions =
    useMemo(() => {
      const uniqueNpc =
        new Map()

      sideQuests.forEach(
        (quest) => {
          if (
            quest.npc
          ) {
            uniqueNpc.set(
              quest.npc.id,
              quest.npc,
            )
          }
        },
      )

      return [
        {
          value: "ALL",
          label: "All NPCs",
        },

        ...Array.from(
          uniqueNpc.values(),
        ).map((npc) => ({
          value: npc.id,
          label: npc.name,
        })),
      ]
    }, [])

  /* ---------------------------------------------------------------------- */
  /* STATISTICS                                                             */
  /* ---------------------------------------------------------------------- */

  const totalQuests =
    sideQuests.length

  const totalPublished =
    sideQuests.filter(
      (quest) =>
        quest.status ===
        "PUBLISHED",
    ).length

  const totalDraft =
    sideQuests.filter(
      (quest) =>
        quest.status ===
        "DRAFT",
    ).length

  /* ---------------------------------------------------------------------- */
  /* FILTERED DATA                                                          */
  /* ---------------------------------------------------------------------- */

  const filteredQuests =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return sideQuests.filter(
        (quest) => {
          const matchesSearch =
            !keyword ||
            quest.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            quest.npc?.name
              ?.toLowerCase()
              .includes(
                keyword,
              )

          const matchesNpc =
            npcFilter ===
              "ALL" ||
            quest.npc?.id ===
              npcFilter

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            quest.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesNpc &&
            matchesStatus
          )
        },
      )
    }, [
      search,
      npcFilter,
      statusFilter,
    ])

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredQuests.length /
          pageSize,
      ),
    )

  const safePage =
    Math.min(
      currentPage,
      totalPages,
    )

  const paginatedQuests =
    useMemo(() => {
      const start =
        (safePage - 1) *
        pageSize

      return filteredQuests.slice(
        start,
        start +
          pageSize,
      )
    }, [
      filteredQuests,
      safePage,
    ])

  const startItem =
    filteredQuests.length ===
    0
      ? 0
      : (safePage - 1) *
          pageSize +
        1

  const endItem =
    Math.min(
      safePage *
        pageSize,
      filteredQuests.length,
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

  function handleNpcFilter(
    value,
  ) {
    setNpcFilter(value)
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
    setNpcFilter("ALL")
    setStatusFilter("ALL")
    setCurrentPage(1)
  }

  function handleDelete(
    quest,
  ) {
    console.log(
      "Delete side quest:",
      quest,
    )
  }

  const hasActiveFilter =
    Boolean(search) ||
    npcFilter !==
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
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-muted-foreground">
              Data
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-muted-foreground">
              Worlds
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Side Quests
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Side Quests
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Kelola side quest dan NPC yang memberikan quest kepada pemain.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/worlds/side-quests/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <CirclePlus className="size-4" />

          Add Side Quest
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          label="Total Side Quests"
          value={
            totalQuests
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
          {/* Search */}

          <div className="relative w-full max-w-[380px]">
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
              placeholder="Search side quest or NPC..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </div>

          {/* Filters */}

          <div className="flex items-center gap-2">
            <FilterSelect
              value={
                npcFilter
              }
              options={
                npcOptions
              }
              onChange={
                handleNpcFilter
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
          <div className="min-w-[880px]">
            {/* TABLE HEAD */}

            <div className="grid grid-cols-[minmax(320px,1.8fr)_170px_minmax(240px,1fr)_150px_64px] items-center border-b border-border bg-muted/15 px-5 py-3">
              <TableHead>
                Side Quest
              </TableHead>

              <TableHead>
                Required Level
              </TableHead>

              <TableHead>
                NPC
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <span />
            </div>

            {/* TABLE BODY */}

            {paginatedQuests.length >
            0 ? (
              paginatedQuests.map(
                (quest) => (
                  <SideQuestRow
                    key={
                      quest.id
                    }
                    quest={
                      quest
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
                    <ScrollText className="size-5" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No side quests found
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
                filteredQuests.length
              }
            </span>

            {" side quests"}
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
/* SIDE QUEST ROW                                                             */
/* -------------------------------------------------------------------------- */

function SideQuestRow({
  quest,
  navigate,
  onDelete,
}) {
  return (
    <div className="grid grid-cols-[minmax(320px,1.8fr)_170px_minmax(240px,1fr)_150px_64px] items-center border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/[0.08]">
      {/* SIDE QUEST */}

      <button
        type="button"
        onClick={() =>
          navigate(
            `/data/worlds/side-quests/${quest.id}`,
          )
        }
        className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <ScrollText className="size-4" />
        </div>

        <p className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary">
          {quest.name}
        </p>
      </button>

      {/* REQUIRED LEVEL */}

      <p className="text-sm font-medium text-foreground">
        Lv.{" "}
        {
          quest.requiredLevel
        }
      </p>

      {/* NPC */}

      {quest.npc ? (
        <button
          type="button"
          onClick={() =>
            navigate(
              `/data/worlds/npcs/${quest.npc.id}`,
            )
          }
          className="flex min-w-0 cursor-pointer items-center gap-2 text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <UserRound className="size-4 shrink-0 text-muted-foreground" />

          <span className="truncate">
            {
              quest.npc.name
            }
          </span>
        </button>
      ) : (
        <span className="text-sm text-muted-foreground">
          —
        </span>
      )}

      {/* STATUS */}

      <StatusBadge
        status={
          quest.status
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
                  `/data/worlds/side-quests/${quest.id}`,
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
                  `/data/worlds/side-quests/${quest.id}/edit`,
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
                  quest,
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
            className="h-10 min-w-[140px] cursor-pointer justify-between gap-3 rounded-lg px-3.5 text-xs font-medium"
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
        className="min-w-[180px]"
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
/* STATUS BADGE                                                               */
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
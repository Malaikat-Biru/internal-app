import {
  useMemo,
  useState,
} from "react"

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Ellipsis,
  MapPinned,
  Search,
  UserRound,
  Users,
} from "lucide-react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

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

const npcData = [
  {
    id: "NPC-001",

    name: "Lefina",

    type: "QUEST",

    map: {
      id: "MAP-001",
      name: "Sofya City",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-002",

    name: "Sololo",

    type: "MERCHANT",

    map: {
      id: "MAP-001",
      name: "Sofya City",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-003",

    name: "Zono",

    type: "BLACKSMITH",

    map: {
      id: "MAP-001",
      name: "Sofya City",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-004",

    name: "Forf",

    type: "GENERAL",

    map: {
      id: "MAP-001",
      name: "Sofya City",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-005",

    name: "Pelulu",

    type: "STORY",

    map: {
      id: "MAP-002",
      name: "Rakau Plains",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-006",

    name: "Pino",

    type: "STORY",

    map: {
      id: "MAP-003",
      name: "Government Office",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-007",

    name: "Lilulu",

    type: "GENERAL",

    map: {
      id: "MAP-003",
      name: "Government Office",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-008",

    name: "Synthesist Mubia",

    type: "SYNTHESIST",

    map: {
      id: "MAP-001",
      name: "Sofya City",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-009",

    name: "Shreya",

    type: "STORY",

    map: {
      id: "MAP-007",
      name: "El Scaro",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-010",

    name: "King Elbano",

    type: "STORY",

    map: {
      id: "MAP-007",
      name: "El Scaro",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-011",

    name: "Resistance Merchant",

    type: "MERCHANT",

    map: {
      id: "MAP-010",
      name: "Hora Diomedea",
    },

    world: {
      id: "WORLD-001",
      name: "Toram World",
    },

    status: "DRAFT",
  },

  {
    id: "NPC-012",

    name: "Nov Saterica Merchant",

    type: "MERCHANT",

    map: {
      id: "MAP-015",
      name: "Nov Saterica",
    },

    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },

    status: "DRAFT",
  },

  {
    id: "NPC-013",

    name: "Nov Saterica Guard",

    type: "GENERAL",

    map: {
      id: "MAP-015",
      name: "Nov Saterica",
    },

    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },

    status: "PUBLISHED",
  },

  {
    id: "NPC-014",

    name: "Explorer",

    type: "GENERAL",

    map: {
      id: "MAP-014",
      name: "Erva Tronc",
    },

    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },

    status: "DRAFT",
  },
]

const typeOptions = [
  {
    value: "ALL",
    label: "All Types",
  },
  {
    value: "GENERAL",
    label: "General NPC",
  },
  {
    value: "STORY",
    label: "Story NPC",
  },
  {
    value: "QUEST",
    label: "Quest NPC",
  },
  {
    value: "MERCHANT",
    label: "Merchant",
  },
  {
    value: "BLACKSMITH",
    label: "Blacksmith",
  },
  {
    value: "SYNTHESIST",
    label: "Synthesist",
  },
]

const worldOptions = [
  {
    value: "ALL",
    label: "All Worlds",
  },
  {
    value: "WORLD-001",
    label: "Toram World",
  },
  {
    value: "WORLD-002",
    label: "Iruna World",
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

const PAGE_SIZE = 10

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function NpcsPage() {
  const navigate = useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    worldFilter,
    setWorldFilter,
  ] = useState("ALL")

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("ALL")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL")

  const [
    page,
    setPage,
  ] = useState(1)

  /* ---------------------------------------------------------------------- */
  /* STATS                                                                  */
  /* ---------------------------------------------------------------------- */

  const stats = useMemo(() => {
    const published =
      npcData.filter(
        (npc) =>
          npc.status ===
          "PUBLISHED",
      ).length

    const draft =
      npcData.filter(
        (npc) =>
          npc.status ===
          "DRAFT",
      ).length

    return {
      total:
        npcData.length,

      published,

      draft,
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* FILTER                                                                 */
  /* ---------------------------------------------------------------------- */

  const filteredNpcs =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return npcData.filter(
        (npc) => {
          const matchesSearch =
            !keyword ||
            npc.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            npc.map.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            npc.world.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            formatNpcType(
              npc.type,
            )
              .toLowerCase()
              .includes(
                keyword,
              )

          const matchesWorld =
            worldFilter ===
              "ALL" ||
            npc.world.id ===
              worldFilter

          const matchesType =
            typeFilter ===
              "ALL" ||
            npc.type ===
              typeFilter

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            npc.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesWorld &&
            matchesType &&
            matchesStatus
          )
        },
      )
    }, [
      search,
      worldFilter,
      typeFilter,
      statusFilter,
    ])

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredNpcs.length /
          PAGE_SIZE,
      ),
    )

  const safePage =
    Math.min(
      page,
      totalPages,
    )

  const paginatedNpcs =
    useMemo(() => {
      const start =
        (safePage - 1) *
        PAGE_SIZE

      return filteredNpcs.slice(
        start,
        start +
          PAGE_SIZE,
      )
    }, [
      filteredNpcs,
      safePage,
    ])

  const startItem =
    filteredNpcs.length === 0
      ? 0
      : (safePage - 1) *
          PAGE_SIZE +
        1

  const endItem =
    Math.min(
      safePage *
        PAGE_SIZE,
      filteredNpcs.length,
    )

  /* ---------------------------------------------------------------------- */
  /* FILTER HANDLERS                                                        */
  /* ---------------------------------------------------------------------- */

  function changeSearch(
    value,
  ) {
    setSearch(
      value,
    )

    setPage(1)
  }

  function changeWorld(
    value,
  ) {
    setWorldFilter(
      value,
    )

    setPage(1)
  }

  function changeType(
    value,
  ) {
    setTypeFilter(
      value,
    )

    setPage(1)
  }

  function changeStatus(
    value,
  ) {
    setStatusFilter(
      value,
    )

    setPage(1)
  }

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
              Worlds
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              NPCs
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            NPCs
          </h1>

          <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
            Kelola data NPC, jenis, lokasi map, dan world
            tempat NPC berada.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/worlds/npcs/create",
            )
          }
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-5 text-sm"
        >
          <CirclePlus className="size-4" />

          Add NPC
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <section className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total NPCs"
          value={
            stats.total
          }
          description="Seluruh NPC yang tersimpan"
        />

        <StatCard
          icon={PublishedIcon}
          label="Published"
          value={
            stats.published
          }
          description="NPC tersedia untuk Aoi"
        />

        <StatCard
          icon={DraftIcon}
          label="Draft"
          value={
            stats.draft
          }
          description="NPC belum dipublikasikan"
        />
      </section>

      {/* ================================================================== */}
      {/* TABLE CARD                                                         */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* FILTERS                                                           */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-5 border-b border-border px-5 py-4">
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
                changeSearch(
                  event.target.value,
                )
              }
              placeholder="Search NPC..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </div>

          {/* Filters */}
          <div className="flex shrink-0 items-center gap-2.5">
            <FilterSelect
              value={
                worldFilter
              }
              options={
                worldOptions
              }
              onChange={
                changeWorld
              }
            />

            <FilterSelect
              value={
                typeFilter
              }
              options={
                typeOptions
              }
              onChange={
                changeType
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
                changeStatus
              }
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* TABLE                                                             */}
        {/* ================================================================= */}

        <div className="w-full overflow-x-auto">
          {/* Header */}
          <div className="grid min-w-[980px] grid-cols-[minmax(270px,1.6fr)_180px_minmax(230px,1.2fr)_180px_130px_48px] items-center border-b border-border bg-muted/20 px-5 py-3">
            <TableHead>
              NPC
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Map
            </TableHead>

            <TableHead>
              World
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <span />
          </div>

          {/* Rows */}
          {paginatedNpcs.length >
          0 ? (
            paginatedNpcs.map(
              (npc) => (
                <NpcRow
                  key={
                    npc.id
                  }
                  npc={
                    npc
                  }
                  onView={() =>
                    navigate(
                      `/data/worlds/npcs/${npc.id}`,
                    )
                  }
                  onEdit={() =>
                    navigate(
                      `/data/worlds/npcs/${npc.id}/edit`,
                    )
                  }
                  onMapClick={() =>
                    navigate(
                      `/data/worlds/maps/${npc.map.id}`,
                    )
                  }
                />
              ),
            )
          ) : (
            <EmptyState />
          )}
        </div>

        {/* ================================================================= */}
        {/* PAGINATION                                                        */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredNpcs.length}
            </span>{" "}
            NPCs
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
                setPage(
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

            <div className="flex h-9 min-w-[76px] items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground">
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
                setPage(
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
/* NPC ROW                                                                    */
/* -------------------------------------------------------------------------- */

function NpcRow({
  npc,
  onView,
  onEdit,
  onMapClick,
}) {
  return (
    <div className="grid min-w-[980px] grid-cols-[minmax(270px,1.6fr)_180px_minmax(230px,1.2fr)_180px_130px_48px] items-center border-b border-border px-5 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* ================================================================== */}
      {/* NPC                                                                */}
      {/* ================================================================== */}

      <button
        type="button"
        onClick={
          onView
        }
        className="group flex min-w-0 cursor-pointer items-center gap-3 text-left"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <UserRound className="size-4" />
        </div>

        <p className="min-w-0 truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {npc.name}
        </p>
      </button>

      {/* ================================================================== */}
      {/* TYPE                                                               */}
      {/* ================================================================== */}

      <div>
        <NpcTypeBadge
          type={
            npc.type
          }
        />
      </div>

      {/* ================================================================== */}
      {/* MAP                                                                */}
      {/* ================================================================== */}

      <button
        type="button"
        onClick={
          onMapClick
        }
        className="group flex min-w-0 cursor-pointer items-center gap-2 text-left"
      >
        <MapPinned className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />

        <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {npc.map.name}
        </span>
      </button>

      {/* ================================================================== */}
      {/* WORLD                                                              */}
      {/* ================================================================== */}

      <p className="truncate pr-4 text-sm text-muted-foreground">
        {npc.world.name}
      </p>

      {/* ================================================================== */}
      {/* STATUS                                                             */}
      {/* ================================================================== */}

      <StatusBadge
        status={
          npc.status
        }
      />

      {/* ================================================================== */}
      {/* ACTION                                                             */}
      {/* ================================================================== */}

      <NpcActions
        onView={
          onView
        }
        onEdit={
          onEdit
        }
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NPC ACTIONS                                                                */
/* -------------------------------------------------------------------------- */

function NpcActions({
  onView,
  onEdit,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer rounded-lg text-muted-foreground"
          />
        }
      >
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            NPC
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={
              onView
            }
            className="cursor-pointer"
          >
            View NPC
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={
              onEdit
            }
            className="cursor-pointer"
          >
            Edit NPC
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            Delete NPC
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
  return (
    <div className="relative">
      <select
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="h-10 min-w-[145px] cursor-pointer appearance-none rounded-lg border border-border bg-background pl-3.5 pr-9 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/20 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* STAT CARD                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-5 py-4">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NPC TYPE BADGE                                                             */
/* -------------------------------------------------------------------------- */

function NpcTypeBadge({
  type,
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground">
      {formatNpcType(
        type,
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}) {
  if (
    status ===
    "PUBLISHED"
  ) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <span className="size-1.5 rounded-full bg-emerald-500" />

        Published
      </span>
    )
  }

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground/60" />

      Draft
    </span>
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
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 text-center">
      <div>
        <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <UserRound className="size-5" />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">
          No NPCs found
        </p>

        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          Coba ubah keyword atau filter yang digunakan.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* STAT ICONS                                                                 */
/* -------------------------------------------------------------------------- */

function PublishedIcon({
  className,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />

      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function DraftIcon({
  className,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z" />

      <polyline points="14 2 14 8 20 8" />

      <path d="M8 13h8" />

      <path d="M8 17h5" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatNpcType(
  type,
) {
  const labels = {
    GENERAL:
      "General NPC",

    STORY:
      "Story NPC",

    QUEST:
      "Quest NPC",

    MERCHANT:
      "Merchant",

    BLACKSMITH:
      "Blacksmith",

    SYNTHESIST:
      "Synthesist",
  }

  return (
    labels[type] ||
    "General NPC"
  )
}
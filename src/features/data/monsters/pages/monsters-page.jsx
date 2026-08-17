import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Crown,
  Ellipsis,
  Eye,
  MapPinned,
  Pencil,
  Plus,
  Search,
  Shield,
  Skull,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const monstersData = [
  {
    id: "MONSTER-001",
    name: "Pova",
    slug: "pova",
    type: "NORMAL",

    variants: [
      {
        id: "VARIANT-001",
        level: 15,
        hp: 320,
        exp: 12,
        element: "WATER",

        map: {
          id: "MAP-001",
          name: "Lonogo Canyon",
        },

        drops: [
          {
            itemId: "ITEM-001",
            itemName: "Pova Material",
          },
        ],
      },

      {
        id: "VARIANT-002",
        level: 18,
        hp: 410,
        exp: 16,
        element: "EARTH",

        map: {
          id: "MAP-002",
          name: "Land Under Cultivation",
        },

        drops: [
          {
            itemId: "ITEM-002",
            itemName: "Pova Leaf",
          },
        ],
      },

      {
        id: "VARIANT-003",
        level: 22,
        hp: 540,
        exp: 21,
        element: "WIND",

        map: {
          id: "MAP-003",
          name: "Rakau Plains",
        },

        drops: [
          {
            itemId: "ITEM-003",
            itemName: "Pova Flower",
          },
        ],
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-10 16:42",
  },

  {
    id: "MONSTER-002",
    name: "Goblin",
    slug: "goblin",
    type: "NORMAL",

    variants: [
      {
        id: "VARIANT-004",
        level: 12,
        hp: 230,
        exp: 10,
        element: "EARTH",

        map: {
          id: "MAP-004",
          name: "Ribisco Cave",
        },

        drops: [
          {
            itemId: "ITEM-010",
            itemName: "Goblin Claw",
          },
        ],
      },

      {
        id: "VARIANT-005",
        level: 18,
        hp: 380,
        exp: 15,
        element: "EARTH",

        map: {
          id: "MAP-005",
          name: "Underground Channel",
        },

        drops: [
          {
            itemId: "ITEM-011",
            itemName: "Goblin Material",
          },
        ],
      },

      {
        id: "VARIANT-006",
        level: 27,
        hp: 640,
        exp: 24,
        element: "DARK",

        map: {
          id: "MAP-006",
          name: "Ancient Empress Tomb",
        },

        drops: [
          {
            itemId: "ITEM-012",
            itemName: "Goblin Fang",
          },
        ],
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-10 15:18",
  },

  {
    id: "MONSTER-003",
    name: "Shell Mask",
    slug: "shell-mask",
    type: "NORMAL",

    variants: [
      {
        id: "VARIANT-007",
        level: 17,
        hp: 350,
        exp: 14,
        element: "EARTH",

        map: {
          id: "MAP-007",
          name: "Nisel Mountain",
        },

        drops: [
          {
            itemId: "ITEM-020",
            itemName: "Shell Mask",
          },
        ],
      },

      {
        id: "VARIANT-008",
        level: 23,
        hp: 510,
        exp: 20,
        element: "EARTH",

        map: {
          id: "MAP-008",
          name: "Nisel Mountain: Mountainside",
        },

        drops: [
          {
            itemId: "ITEM-021",
            itemName: "Nisel Wood",
          },
        ],
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-09 22:11",
  },

  {
    id: "MONSTER-004",
    name: "Nightmare Roar",
    slug: "nightmare-roar",
    type: "NORMAL",

    variants: [
      {
        id: "VARIANT-009",
        level: 52,
        hp: 2800,
        exp: 110,
        element: "DARK",

        map: {
          id: "MAP-009",
          name: "Ancient Empress Tomb",
        },

        drops: [
          {
            itemId: "ITEM-030",
            itemName: "Nightmare Crystal",
          },
        ],
      },
    ],

    status: "DRAFT",
    updatedAt: "2026-08-09 19:44",
  },

  {
    id: "MONSTER-005",
    name: "Colon Commander",
    slug: "colon-commander",
    type: "MINI_BOSS",

    stats: {
      level: 35,
      hp: 15000,
      exp: 540,
    },

    element: "EARTH",

    map: {
      id: "MAP-010",
      name: "Land Under Cultivation",
    },

    drops: [
      {
        itemId: "ITEM-040",
        itemName: "Colon Commander Crysta",
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-09 16:23",
  },

  {
    id: "MONSTER-006",
    name: "Moonlight Potum",
    slug: "moonlight-potum",
    type: "MINI_BOSS",

    stats: {
      level: 45,
      hp: 28000,
      exp: 840,
    },

    element: "LIGHT",

    map: {
      id: "MAP-011",
      name: "New Moon Palace",
    },

    drops: [
      {
        itemId: "ITEM-041",
        itemName: "Moonlight Potum Crysta",
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-08 18:16",
  },

  {
    id: "MONSTER-007",
    name: "Golden Skeleton",
    slug: "golden-skeleton",
    type: "MINI_BOSS",

    stats: {
      level: 54,
      hp: 42000,
      exp: 1320,
    },

    element: "LIGHT",

    map: {
      id: "MAP-012",
      name: "Zoktzda Ruins",
    },

    drops: [
      {
        itemId: "ITEM-042",
        itemName: "Golden Skeleton Crysta",
      },
    ],

    status: "DRAFT",
    updatedAt: "2026-08-08 14:52",
  },

  {
    id: "MONSTER-008",
    name: "Minotaur",
    slug: "minotaur",
    type: "BOSS",

    baseStats: {
      level: 32,
      hp: 18000,
      exp: 420,
    },

    element: "WIND",

    map: {
      id: "MAP-013",
      name: "Ruined Temple: Forbidden Hall",
    },

    difficulties: [
      {
        mode: "EASY",
        level: 28,
        hp: 9000,
        exp: 210,
      },

      {
        mode: "NORMAL",
        level: 32,
        hp: 18000,
        exp: 420,
      },

      {
        mode: "HARD",
        level: 36,
        hp: 36000,
        exp: 840,
      },

      {
        mode: "NIGHTMARE",
        level: 40,
        hp: 72000,
        exp: 1680,
      },

      {
        mode: "ULTIMATE",
        level: 48,
        hp: 144000,
        exp: 3360,
      },
    ],

    drops: [
      {
        itemId: "ITEM-050",
        itemName: "Minotaur Horn",
      },
      {
        itemId: "ITEM-051",
        itemName: "Minotaur Hoof",
      },
      {
        itemId: "ITEM-052",
        itemName: "Minotaur Crysta",
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-08 12:28",
  },

  {
    id: "MONSTER-009",
    name: "Boss Roga",
    slug: "boss-roga",
    type: "BOSS",

    baseStats: {
      level: 42,
      hp: 38000,
      exp: 870,
    },

    element: "DARK",

    map: {
      id: "MAP-014",
      name: "Saham Underground Cave: Deepest Part",
    },

    difficulties: [
      {
        mode: "EASY",
        level: 38,
        hp: 19000,
        exp: 435,
      },

      {
        mode: "NORMAL",
        level: 42,
        hp: 38000,
        exp: 870,
      },

      {
        mode: "HARD",
        level: 46,
        hp: 76000,
        exp: 1740,
      },

      {
        mode: "NIGHTMARE",
        level: 50,
        hp: 152000,
        exp: 3480,
      },

      {
        mode: "ULTIMATE",
        level: 58,
        hp: 304000,
        exp: 6960,
      },
    ],

    drops: [
      {
        itemId: "ITEM-060",
        itemName: "Boss Roga Crysta",
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-07 22:44",
  },

  {
    id: "MONSTER-010",
    name: "Brutal Dragon Decel",
    slug: "brutal-dragon-decel",
    type: "BOSS",

    baseStats: {
      level: 40,
      hp: 42000,
      exp: 930,
    },

    element: "FIRE",

    map: {
      id: "MAP-015",
      name: "Nisel Mountain: Summit",
    },

    difficulties: [
      {
        mode: "EASY",
        level: 36,
        hp: 21000,
        exp: 465,
      },

      {
        mode: "NORMAL",
        level: 40,
        hp: 42000,
        exp: 930,
      },

      {
        mode: "HARD",
        level: 44,
        hp: 84000,
        exp: 1860,
      },

      {
        mode: "NIGHTMARE",
        level: 48,
        hp: 168000,
        exp: 3720,
      },

      {
        mode: "ULTIMATE",
        level: 56,
        hp: 336000,
        exp: 7440,
      },
    ],

    drops: [
      {
        itemId: "ITEM-070",
        itemName: "Dragon Material",
      },
    ],

    status: "PUBLISHED",
    updatedAt: "2026-08-07 19:31",
  },

  {
    id: "MONSTER-011",
    name: "Anniversary Golem",
    slug: "anniversary-golem",
    type: "BOSS",

    baseStats: {
      level: 250,
      hp: 12000000,
      exp: 240000,
    },

    element: "NEUTRAL",

    map: {
      id: "MAP-016",
      name: "Anniversary Arena",
    },

    difficulties: [
      {
        mode: "EASY",
        level: 245,
        hp: 6000000,
        exp: 120000,
      },

      {
        mode: "NORMAL",
        level: 250,
        hp: 12000000,
        exp: 240000,
      },

      {
        mode: "HARD",
        level: 255,
        hp: 24000000,
        exp: 480000,
      },

      {
        mode: "NIGHTMARE",
        level: 260,
        hp: 48000000,
        exp: 960000,
      },

      {
        mode: "ULTIMATE",
        level: 270,
        hp: 96000000,
        exp: 1920000,
      },
    ],

    drops: [
      {
        itemId: "ITEM-080",
        itemName: "Anniversary Medal",
      },
    ],

    status: "DRAFT",
    updatedAt: "2026-08-06 18:10",
  },
]

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
/* -------------------------------------------------------------------------- */

const typeOptions = [
  "ALL",
  "NORMAL",
  "MINI_BOSS",
  "BOSS",
]

const statusOptions = [
  "ALL",
  "PUBLISHED",
  "DRAFT",
]

const PAGE_SIZE = 10

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function MonstersPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

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
  /* STATISTICS                                                             */
  /* ---------------------------------------------------------------------- */

  const statistics =
    useMemo(() => {
      const total =
        monstersData.length

      const normal =
        monstersData.filter(
          (monster) =>
            monster.type ===
            "NORMAL",
        ).length

      const miniBoss =
        monstersData.filter(
          (monster) =>
            monster.type ===
            "MINI_BOSS",
        ).length

      const boss =
        monstersData.filter(
          (monster) =>
            monster.type ===
            "BOSS",
        ).length

      const draft =
        monstersData.filter(
          (monster) =>
            monster.status ===
            "DRAFT",
        ).length

      return {
        total,
        normal,
        miniBoss,
        boss,
        draft,
      }
    }, [])

  /* ---------------------------------------------------------------------- */
  /* FILTERING                                                              */
  /* ---------------------------------------------------------------------- */

  const filteredMonsters =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return monstersData.filter(
        (monster) => {
          const locationNames =
            getMonsterLocations(
              monster,
            )
              .map(
                (location) =>
                  location.name,
              )
              .join(" ")
              .toLowerCase()

          const matchesSearch =
            !keyword ||
            monster.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            locationNames.includes(
              keyword,
            )

          const matchesType =
            typeFilter ===
              "ALL" ||
            monster.type ===
              typeFilter

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            monster.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          )
        },
      )
    }, [
      search,
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
        filteredMonsters.length /
          PAGE_SIZE,
      ),
    )

  const currentPage =
    Math.min(
      page,
      totalPages,
    )

  const visibleMonsters =
    filteredMonsters.slice(
      (currentPage - 1) *
        PAGE_SIZE,

      currentPage *
        PAGE_SIZE,
    )

  const firstRow =
    filteredMonsters.length ===
    0
      ? 0
      : (currentPage - 1) *
          PAGE_SIZE +
        1

  const lastRow =
    Math.min(
      currentPage *
        PAGE_SIZE,
      filteredMonsters.length,
    )

  const hasFilters =
    Boolean(search) ||
    typeFilter !== "ALL" ||
    statusFilter !== "ALL"

  /* ---------------------------------------------------------------------- */
  /* HANDLERS                                                               */
  /* ---------------------------------------------------------------------- */

  function handleSearch(
    value,
  ) {
    setSearch(value)
    setPage(1)
  }

  function handleTypeFilter(
    value,
  ) {
    setTypeFilter(value)
    setPage(1)
  }

  function handleStatusFilter(
    value,
  ) {
    setStatusFilter(value)
    setPage(1)
  }

  function clearFilters() {
    setSearch("")
    setTypeFilter("ALL")
    setStatusFilter("ALL")
    setPage(1)
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-7 xl:px-8">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-muted-foreground">
              Data
            </span>

            <span className="text-muted-foreground/50">
              /
            </span>

            <span className="text-primary">
              Monsters
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Monsters
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Kelola monster, variasi level, lokasi spawn,
            boss difficulty, dan informasi terkait lainnya.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/monsters/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Plus className="size-4" />

          Add Monster
        </Button>
      </div>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <section className="mt-7 grid grid-cols-5 gap-4">
        <MetricCard
          icon={Skull}
          label="Total Monsters"
          value={
            statistics.total
          }
          description="All monster records"
        />

        <MetricCard
          icon={Shield}
          label="Normal"
          value={
            statistics.normal
          }
          description="Regular monsters"
        />

        <MetricCard
          icon={Crown}
          label="Mini Boss"
          value={
            statistics.miniBoss
          }
          description="Mini boss records"
        />

        <MetricCard
          icon={Crown}
          label="Boss"
          value={
            statistics.boss
          }
          description="Boss records"
        />

        <MetricCard
          icon={CircleAlert}
          label="Draft"
          value={
            statistics.draft
          }
          description="Not published yet"
        />
      </section>

      {/* ================================================================== */}
      {/* TABLE                                                              */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* TOOLBAR                                                          */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-5 border-b border-border px-5 py-4">
          {/* SEARCH */}

          <div className="relative w-full max-w-[380px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
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
              placeholder="Search monsters or locations..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </div>

          {/* FILTERS */}

          <div className="flex shrink-0 items-center gap-2.5">
            <select
              value={
                typeFilter
              }
              onChange={(
                event,
              ) =>
                handleTypeFilter(
                  event.target
                    .value,
                )
              }
              className="h-10 cursor-pointer rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary/40"
            >
              {typeOptions.map(
                (type) => (
                  <option
                    key={
                      type
                    }
                    value={
                      type
                    }
                  >
                    {type ===
                    "ALL"
                      ? "All Types"
                      : formatMonsterType(
                          type,
                        )}
                  </option>
                ),
              )}
            </select>

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                handleStatusFilter(
                  event.target
                    .value,
                )
              }
              className="h-10 cursor-pointer rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary/40"
            >
              {statusOptions.map(
                (status) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {status ===
                    "ALL"
                      ? "All Status"
                      : formatLabel(
                          status,
                        )}
                  </option>
                ),
              )}
            </select>

            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-10 cursor-pointer px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* HORIZONTAL TABLE                                                 */}
        {/* ================================================================= */}

        <div className="w-full overflow-x-auto">
          <div className="min-w-[960px]">
            {/* HEADER */}

            <div className="grid grid-cols-[minmax(320px,1.9fr)_170px_170px_190px_140px_52px] items-center border-b border-border bg-muted/20 px-5">
              <TableHeaderCell>
                Monster
              </TableHeaderCell>

              <TableHeaderCell>
                Type
              </TableHeaderCell>

              <TableHeaderCell>
                Level
              </TableHeaderCell>

              <TableHeaderCell>
                Locations
              </TableHeaderCell>

              <TableHeaderCell>
                Status
              </TableHeaderCell>

              <div />
            </div>

            {/* BODY */}

            {visibleMonsters.length >
            0 ? (
              visibleMonsters.map(
                (monster) => (
                  <MonsterRow
                    key={
                      monster.id
                    }
                    monster={
                      monster
                    }
                    onOpen={() =>
                      navigate(
                        `/data/monsters/${monster.id}`,
                      )
                    }
                    onEdit={() =>
                      navigate(
                        `/data/monsters/${monster.id}/edit`,
                      )
                    }
                  />
                ),
              )
            ) : (
              <EmptyState
                hasFilters={
                  hasFilters
                }
                onClear={
                  clearFilters
                }
              />
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
              {firstRow}
            </span>{" "}

            –{" "}

            <span className="font-medium text-foreground">
              {lastRow}
            </span>{" "}

            of{" "}

            <span className="font-medium text-foreground">
              {
                filteredMonsters.length
              }
            </span>{" "}

            monsters
          </p>

          <div className="flex items-center gap-2">
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
                      current -
                        1,
                    ),
                )
              }
              className="size-9 cursor-pointer rounded-lg"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex min-w-[100px] items-center justify-center px-2">
              <span className="text-xs text-muted-foreground">
                Page{" "}

                <span className="font-medium text-foreground">
                  {currentPage}
                </span>{" "}

                of{" "}

                <span className="font-medium text-foreground">
                  {totalPages}
                </span>
              </span>
            </div>

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
                      current +
                        1,
                    ),
                )
              }
              className="size-9 cursor-pointer rounded-lg"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="h-8" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MONSTER ROW                                                                */
/* -------------------------------------------------------------------------- */

function MonsterRow({
  monster,
  onOpen,
  onEdit,
}) {
  const level =
    getMonsterLevelRange(
      monster,
    )

  const locations =
    getMonsterLocations(
      monster,
    )

  return (
    <div className="grid grid-cols-[minmax(320px,1.9fr)_170px_170px_190px_140px_52px] items-center border-b border-border px-5 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* MONSTER */}

      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={
            onOpen
          }
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted"
        >
          <MonsterIcon
            type={
              monster.type
            }
          />
        </button>

        <button
          type="button"
          onClick={
            onOpen
          }
          className="min-w-0 cursor-pointer truncate text-left text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          {
            monster.name
          }
        </button>
      </div>

      {/* TYPE */}

      <MonsterTypeBadge
        type={
          monster.type
        }
      />

      {/* LEVEL */}

      <p className="text-sm font-medium text-foreground">
        {level}
      </p>

      {/* LOCATIONS */}

      <div className="flex items-center gap-2">
        <MapPinned className="size-3.5 shrink-0 text-muted-foreground" />

        <p className="text-sm font-medium text-foreground">
          {
            locations.length
          }{" "}

          {locations.length ===
          1
            ? "Location"
            : "Locations"}
        </p>
      </div>

      {/* STATUS */}

      <StatusBadge
        status={
          monster.status
        }
      />

      {/* ACTION */}

      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 cursor-pointer rounded-lg text-muted-foreground"
              />
            }
          >
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-44"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={
                  onOpen
                }
              >
                <Eye className="size-4" />

                View Monster
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={
                  onEdit
                }
              >
                <Pencil className="size-4" />

                Edit Monster
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  /*
                    TODO:
                    delete confirmation
                  */
                }}
              >
                <Trash2 className="size-4" />

                Delete Monster
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MONSTER ICON                                                               */
/* -------------------------------------------------------------------------- */

function MonsterIcon({
  type,
}) {
  if (
    type === "BOSS"
  ) {
    return (
      <Crown className="size-4" />
    )
  }

  if (
    type ===
    "MINI_BOSS"
  ) {
    return (
      <Shield className="size-4" />
    )
  }

  return (
    <Skull className="size-4" />
  )
}

/* -------------------------------------------------------------------------- */
/* TYPE BADGE                                                                 */
/* -------------------------------------------------------------------------- */

function MonsterTypeBadge({
  type,
}) {
  if (
    type === "BOSS"
  ) {
    return (
      <Badge className="h-6 w-fit border-red-500/15 bg-red-500/10 px-2.5 text-xs font-medium text-red-700 hover:bg-red-500/10">
        Boss
      </Badge>
    )
  }

  if (
    type ===
    "MINI_BOSS"
  ) {
    return (
      <Badge className="h-6 w-fit border-orange-500/15 bg-orange-500/10 px-2.5 text-xs font-medium text-orange-700 hover:bg-orange-500/10">
        Mini Boss
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="h-6 w-fit px-2.5 text-xs font-medium"
    >
      Normal
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
}) {
  if (
    status ===
    "PUBLISHED"
  ) {
    return (
      <Badge className="h-6 w-fit border-emerald-500/15 bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/10">
        Published
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className="h-6 w-fit px-2.5 text-xs font-medium"
    >
      Draft
    </Badge>
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
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-foreground">
            {formatNumber(
              value,
            )}
          </p>
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
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
    <div className="py-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Skull className="size-4" />
      </div>

      <p className="mt-4 text-sm font-semibold text-foreground">
        No monsters found
      </p>

      <p className="mt-1 max-w-[340px] text-xs leading-5 text-muted-foreground">
        {hasFilters
          ? "Tidak ada monster yang sesuai dengan filter yang sedang digunakan."
          : "Belum ada data monster yang tersedia."}
      </p>

      {hasFilters && (
        <Button
          type="button"
          variant="outline"
          onClick={
            onClear
          }
          className="mt-4 h-9 cursor-pointer rounded-lg px-4 text-xs"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* LEVEL                                                                      */
/* -------------------------------------------------------------------------- */

function getMonsterLevelRange(
  monster,
) {
  /* MINI BOSS */

  if (
    monster.type ===
    "MINI_BOSS"
  ) {
    const level =
      Number(
        monster.stats
          ?.level,
      )

    if (
      !Number.isFinite(
        level,
      )
    ) {
      return "—"
    }

    return `Lv. ${formatNumber(
      level,
    )}`
  }

  /* BOSS */

  if (
    monster.type ===
    "BOSS"
  ) {
    const levels =
      (
        monster.difficulties ||
        []
      )
        .map(
          (difficulty) =>
            Number(
              difficulty.level,
            ),
        )
        .filter(
          Number.isFinite,
        )

    if (
      levels.length === 0
    ) {
      const level =
        Number(
          monster.baseStats
            ?.level,
        )

      if (
        !Number.isFinite(
          level,
        )
      ) {
        return "—"
      }

      return `Lv. ${formatNumber(
        level,
      )}`
    }

    return formatLevelRange(
      levels,
    )
  }

  /* NORMAL */

  const levels =
    (
      monster.variants ||
      []
    )
      .map(
        (variant) =>
          Number(
            variant.level,
          ),
      )
      .filter(
        Number.isFinite,
      )

  if (
    levels.length === 0
  ) {
    return "—"
  }

  return formatLevelRange(
    levels,
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT LEVEL RANGE                                                         */
/* -------------------------------------------------------------------------- */

function formatLevelRange(
  levels,
) {
  const min =
    Math.min(
      ...levels,
    )

  const max =
    Math.max(
      ...levels,
    )

  if (
    min === max
  ) {
    return `Lv. ${formatNumber(
      min,
    )}`
  }

  return `Lv. ${formatNumber(
    min,
  )}–${formatNumber(
    max,
  )}`
}

/* -------------------------------------------------------------------------- */
/* LOCATIONS                                                                  */
/* -------------------------------------------------------------------------- */

function getMonsterLocations(
  monster,
) {
  if (
    monster.type ===
    "NORMAL"
  ) {
    const locations =
      new Map()

    ;(
      monster.variants ||
      []
    ).forEach(
      (variant) => {
        if (
          !variant.map?.id
        ) {
          return
        }

        locations.set(
          variant.map.id,
          variant.map,
        )
      },
    )

    return Array.from(
      locations.values(),
    )
  }

  if (
    monster.map?.id
  ) {
    return [
      monster.map,
    ]
  }

  return []
}

/* -------------------------------------------------------------------------- */
/* MONSTER TYPE                                                               */
/* -------------------------------------------------------------------------- */

function formatMonsterType(
  type,
) {
  const labels = {
    NORMAL:
      "Normal",

    MINI_BOSS:
      "Mini Boss",

    BOSS:
      "Boss",
  }

  return (
    labels[type] ||
    formatLabel(type)
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatNumber(
  value,
) {
  return Number(
    value || 0,
  ).toLocaleString(
    "id-ID",
  )
}

function formatLabel(
  value,
) {
  if (!value) {
    return "—"
  }

  return value
    .toLowerCase()
    .replace(
      /_/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    )
}
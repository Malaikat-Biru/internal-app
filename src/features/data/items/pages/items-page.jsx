import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Send,
} from "lucide-react"

import {
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const items = [
  {
    id: "ITEM-001",
    name: "Gladius",
    category: "WEAPON",
    type: "ONE_HANDED_SWORD",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-002",
    name: "Iron Blade",
    category: "WEAPON",
    type: "TWO_HANDED_SWORD",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-003",
    name: "Forest Wolf Bow",
    category: "WEAPON",
    type: "BOW",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-004",
    name: "Adventurer's Garb",
    category: "ARMOR",
    type: null,
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-005",
    name: "Killer Coat",
    category: "ARMOR",
    type: null,
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "ITEM-006",
    name: "Scholar's Glasses",
    category: "ADDITIONAL",
    type: null,
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-007",
    name: "War Helmet",
    category: "ADDITIONAL",
    type: null,
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "ITEM-008",
    name: "Magic Talisman",
    category: "SPECIAL_GEAR",
    type: null,
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-009",
    name: "Dark Talisman",
    category: "SPECIAL_GEAR",
    type: null,
    availability: "EVENT_LIMITED",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-010",
    name: "Round Shield",
    category: "SUB_WEAPON",
    type: "SHIELD",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-011",
    name: "Throwing Knife",
    category: "SUB_WEAPON",
    type: "DAGGER",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-012",
    name: "Iron Arrow",
    category: "SUB_WEAPON",
    type: "ARROW",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-013",
    name: "Minotaur Horn",
    category: "MATERIAL",
    type: "BEAST",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-014",
    name: "Nightmare Crystal",
    category: "MATERIAL",
    type: "MANA",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-015",
    name: "Hard Wood",
    category: "MATERIAL",
    type: "WOOD",
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "ITEM-016",
    name: "Revita III",
    category: "CONSUMABLE",
    type: "RECOVERY",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-017",
    name: "Vita Plus III",
    category: "CONSUMABLE",
    type: "BUFF",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "ITEM-018",
    name: "MagiAdd III",
    category: "CONSUMABLE",
    type: "BUFF",
    availability: "PERMANENT",
    status: "PUBLISHED",
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
    value: "WEAPON",
    label: "Weapon",
  },
  {
    value: "ARMOR",
    label: "Armor",
  },
  {
    value: "ADDITIONAL",
    label: "Additional",
  },
  {
    value: "SPECIAL_GEAR",
    label: "Special Gear",
  },
  {
    value: "SUB_WEAPON",
    label: "Sub Weapon",
  },
  {
    value: "MATERIAL",
    label: "Material",
  },
  {
    value: "CONSUMABLE",
    label: "Consumable",
  },
]

const availabilityOptions = [
  {
    value: "ALL",
    label: "All Availability",
  },
  {
    value: "PERMANENT",
    label: "Permanent",
  },
  {
    value: "EVENT_LIMITED",
    label: "Event Limited",
  },
  {
    value: "SEASONAL",
    label: "Seasonal",
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

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function ItemsPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    category,
    setCategory,
  ] = useState("ALL")

  const [
    availability,
    setAvailability,
  ] = useState("ALL")

  const [
    status,
    setStatus,
  ] = useState("ALL")

  const [
    page,
    setPage,
  ] = useState(1)

  const pageSize = 10

  /* ---------------------------------------------------------------------- */
  /* STATISTICS                                                             */
  /* ---------------------------------------------------------------------- */

  const statistics =
    useMemo(() => {
      const total =
        items.length

      const published =
        items.filter(
          (item) =>
            item.status ===
            "PUBLISHED",
        ).length

      const draft =
        items.filter(
          (item) =>
            item.status ===
            "DRAFT",
        ).length

      return {
        total,
        published,
        draft,
      }
    }, [])

  /* ---------------------------------------------------------------------- */
  /* FILTER                                                                 */
  /* ---------------------------------------------------------------------- */

  const filteredItems =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return items.filter(
        (item) => {
          const categoryLabel =
            formatLabel(
              item.category,
            ).toLowerCase()

          const typeLabel =
            formatLabel(
              item.type,
            ).toLowerCase()

          const matchSearch =
            !keyword ||
            item.name
              .toLowerCase()
              .includes(keyword) ||
            categoryLabel.includes(
              keyword,
            ) ||
            typeLabel.includes(
              keyword,
            )

          const matchCategory =
            category === "ALL" ||
            item.category ===
              category

          const matchAvailability =
            availability === "ALL" ||
            item.availability ===
              availability

          const matchStatus =
            status === "ALL" ||
            item.status ===
              status

          return (
            matchSearch &&
            matchCategory &&
            matchAvailability &&
            matchStatus
          )
        },
      )
    }, [
      search,
      category,
      availability,
      status,
    ])

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredItems.length /
          pageSize,
      ),
    )

  const safePage =
    Math.min(
      page,
      totalPages,
    )

  const paginatedItems =
    filteredItems.slice(
      (safePage - 1) *
        pageSize,
      safePage * pageSize,
    )

  function changeSearch(
    value,
  ) {
    setSearch(value)
    setPage(1)
  }

  function changeCategory(
    value,
  ) {
    setCategory(value)
    setPage(1)
  }

  function changeAvailability(
    value,
  ) {
    setAvailability(value)
    setPage(1)
  }

  function changeStatus(
    value,
  ) {
    setStatus(value)
    setPage(1)
  }

  /* ---------------------------------------------------------------------- */
  /* NAVIGATION                                                             */
  /* ---------------------------------------------------------------------- */

  function openItem(
    itemId,
  ) {
    navigate(
      `/data/items/${itemId}/edit`,
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-7 xl:px-8">
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

            <span className="text-primary">
              Items
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Items
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Kelola weapon, armor, additional, special gear, sub weapon,
            material, dan consumable Toram.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/items/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Plus className="size-4" />

          Create Item
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Total Items"
          value={
            statistics.total
          }
          description="All item records"
        />

        <StatCard
          icon={Send}
          label="Published"
          value={
            statistics.published
          }
          description="Available in Aoi"
        />

        <StatCard
          icon={FileText}
          label="Draft"
          value={
            statistics.draft
          }
          description="Not published yet"
        />
      </div>

      {/* ================================================================== */}
      {/* FILTER                                                             */}
      {/* ================================================================== */}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* SEARCH */}

        <div className="relative min-w-[280px] flex-1">
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
                event.target
                  .value,
              )
            }
            placeholder="Search items..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
          />
        </div>

        {/* CATEGORY */}

        <FilterSelect
          value={
            category
          }
          options={
            categoryOptions
          }
          onChange={
            changeCategory
          }
        />

        {/* AVAILABILITY */}

        <FilterSelect
          value={
            availability
          }
          options={
            availabilityOptions
          }
          onChange={
            changeAvailability
          }
        />

        {/* STATUS */}

        <FilterSelect
          value={
            status
          }
          options={
            statusOptions
          }
          onChange={
            changeStatus
          }
        />
      </div>

      {/* ================================================================== */}
      {/* TABLE                                                              */}
      {/* ================================================================== */}

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-background">
        {/* TABLE HEADER */}

        <div className="grid grid-cols-[minmax(280px,1.5fr)_180px_220px_170px_140px_60px] border-b border-border bg-muted/20 px-5">
          <TableHeader>
            Item
          </TableHeader>

          <TableHeader>
            Category
          </TableHeader>

          <TableHeader>
            Type
          </TableHeader>

          <TableHeader>
            Availability
          </TableHeader>

          <TableHeader>
            Status
          </TableHeader>

          <div />
        </div>

        {/* ROWS */}

        {paginatedItems.length >
        0 ? (
          paginatedItems.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="grid min-h-[64px] grid-cols-[minmax(280px,1.5fr)_180px_220px_170px_140px_60px] items-center border-b border-border px-5 transition-colors last:border-b-0 hover:bg-muted/[0.18]"
              >
                {/* ITEM */}

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Package className="size-4" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openItem(
                        item.id,
                      )
                    }
                    className="min-w-0 cursor-pointer truncate text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {
                      item.name
                    }
                  </button>
                </div>

                {/* CATEGORY */}

                <div>
                  <CategoryBadge
                    category={
                      item.category
                    }
                  />
                </div>

                {/* TYPE */}

                <span
                  className={[
                    "truncate pr-4 text-sm",

                    item.type
                      ? "text-foreground"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {item.type
                    ? formatLabel(
                        item.type,
                      )
                    : "—"}
                </span>

                {/* AVAILABILITY */}

                <span className="text-sm text-muted-foreground">
                  {formatAvailability(
                    item.availability,
                  )}
                </span>

                {/* STATUS */}

                <div>
                  <StatusBadge
                    status={
                      item.status
                    }
                  />
                </div>

                {/* ACTION */}

                <div className="flex justify-end">
                  <ItemAction
                    onEdit={() =>
                      openItem(
                        item.id,
                      )
                    }
                  />
                </div>
              </div>
            ),
          )
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Package className="size-5" />
            </div>

            <p className="mt-4 text-sm font-medium text-foreground">
              No items found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Coba ubah search atau filter yang digunakan.
            </p>
          </div>
        )}
      </section>

      {/* ================================================================== */}
      {/* PAGINATION                                                         */}
      {/* ================================================================== */}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          {filteredItems.length ===
          0
            ? 0
            : (safePage - 1) *
                pageSize +
              1}
          {" – "}
          {Math.min(
            safePage *
              pageSize,
            filteredItems.length,
          )}
          {" of "}
          {
            filteredItems.length
          }
          {" items"}
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
                    current -
                      1,
                  ),
              )
            }
            className="size-9 cursor-pointer rounded-lg"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex h-9 min-w-20 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground">
            {safePage}
            {" / "}
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
    <div className="rounded-xl border border-border bg-background px-5 py-4">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">
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
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-10 min-w-[170px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <span className="truncate text-sm font-medium text-foreground">
          {
            selected?.label
          }
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
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
                className="cursor-pointer text-sm"
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
/* ITEM ACTION                                                                */
/* -------------------------------------------------------------------------- */

function ItemAction({
  onEdit,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[150px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={
              onEdit
            }
            className="cursor-pointer gap-2 text-sm"
          >
            <Pencil className="size-4" />

            Edit
          </DropdownMenuItem>
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
    <span className="inline-flex rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {formatLabel(
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
  if (
    status ===
    "PUBLISHED"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-current" />

        Published
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-current" />

      Draft
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* TABLE HEADER                                                               */
/* -------------------------------------------------------------------------- */

function TableHeader({
  children,
}) {
  return (
    <div className="py-3 text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatAvailability(
  value,
) {
  const labels = {
    PERMANENT:
      "Permanent",

    EVENT_LIMITED:
      "Event Limited",

    SEASONAL:
      "Seasonal",
  }

  return (
    labels[value] ||
    formatLabel(value)
  )
}

function formatLabel(
  value,
) {
  if (!value) {
    return "—"
  }

  const labels = {
    /* CATEGORY */

    WEAPON:
      "Weapon",

    ARMOR:
      "Armor",

    ADDITIONAL:
      "Additional",

    SPECIAL_GEAR:
      "Special Gear",

    SUB_WEAPON:
      "Sub Weapon",

    MATERIAL:
      "Material",

    CONSUMABLE:
      "Consumable",

    /* WEAPON */

    ONE_HANDED_SWORD:
      "One-Handed Sword",

    TWO_HANDED_SWORD:
      "Two-Handed Sword",

    BOW:
      "Bow",

    BOWGUN:
      "Bowgun",

    STAFF:
      "Staff",

    MAGIC_DEVICE:
      "Magic Device",

    KNUCKLES:
      "Knuckles",

    HALBERD:
      "Halberd",

    KATANA:
      "Katana",

    /* SUB WEAPON */

    SHIELD:
      "Shield",

    DAGGER:
      "Dagger",

    ARROW:
      "Arrow",

    NINJUTSU_SCROLL:
      "Ninjutsu Scroll",

    /* MATERIAL */

    METAL:
      "Metal",

    CLOTH:
      "Cloth",

    BEAST:
      "Beast",

    WOOD:
      "Wood",

    MEDICINE:
      "Medicine",

    MANA:
      "Mana",

    /* CONSUMABLE */

    RECOVERY:
      "Recovery",

    MP:
      "MP",

    BUFF:
      "Buff",

    SUPPORT:
      "Support",

    UTILITY:
      "Utility",
  }

  if (
    labels[value]
  ) {
    return labels[value]
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    )
}
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Gem,
  MoreHorizontal,
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

const crystas = [
  {
    id: "CRYSTA-001",
    name: "STR+3",
    type: "NORMAL",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-002",
    name: "Critical Rate+3",
    type: "NORMAL",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-003",
    name: "Nightmare Potum",
    type: "WEAPON",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-004",
    name: "Blancanine the White Fang",
    type: "WEAPON",
    availability: "EVENT_LIMITED",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-005",
    name: "Cerberus",
    type: "ARMOR",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-006",
    name: "Gopherga",
    type: "ARMOR",
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "CRYSTA-007",
    name: "Baratok",
    type: "ADDITIONAL",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-008",
    name: "Mega Alpoca",
    type: "ADDITIONAL",
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "CRYSTA-009",
    name: "Don Yeti",
    type: "SPECIAL",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-010",
    name: "Abyssal Crystal Monster",
    type: "SPECIAL",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-011",
    name: "Finstern the Dark Dragon",
    type: "ENHANCER",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-012",
    name: "Black Peach Ninja",
    type: "ENHANCER",
    availability: "PERMANENT",
    status: "PUBLISHED",
  },
  {
    id: "CRYSTA-013",
    name: "Burning Dragon Igneus",
    type: "ENHANCER",
    availability: "PERMANENT",
    status: "DRAFT",
  },
  {
    id: "CRYSTA-014",
    name: "Wild Beast Lixi",
    type: "ENHANCER",
    availability: "SEASONAL",
    status: "PUBLISHED",
  },
]

/* -------------------------------------------------------------------------- */
/* TYPE OPTIONS                                                               */
/* -------------------------------------------------------------------------- */

const typeOptions = [
  {
    value: "ALL",
    label: "All Types",
  },
  {
    value: "NORMAL",
    label: "Normal",
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
    value: "SPECIAL",
    label: "Special",
  },
  {
    value: "ENHANCER",
    label: "Enhancer",
  },
]

/* -------------------------------------------------------------------------- */
/* AVAILABILITY OPTIONS                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* STATUS OPTIONS                                                             */
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

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CrystasPage() {
  const navigate =
    useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    type,
    setType,
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
        crystas.length

      const published =
        crystas.filter(
          (crysta) =>
            crysta.status ===
            "PUBLISHED",
        ).length

      const draft =
        crystas.filter(
          (crysta) =>
            crysta.status ===
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

  const filteredCrystas =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return crystas.filter(
        (crysta) => {
          const typeLabel =
            formatType(
              crysta.type,
            ).toLowerCase()

          const availabilityLabel =
            formatAvailability(
              crysta.availability,
            ).toLowerCase()

          const statusLabel =
            formatStatus(
              crysta.status,
            ).toLowerCase()

          const matchSearch =
            !keyword ||
            crysta.name
              .toLowerCase()
              .includes(
                keyword,
              ) ||
            typeLabel.includes(
              keyword,
            ) ||
            availabilityLabel.includes(
              keyword,
            ) ||
            statusLabel.includes(
              keyword,
            )

          const matchType =
            type === "ALL" ||
            crysta.type ===
              type

          const matchAvailability =
            availability ===
              "ALL" ||
            crysta.availability ===
              availability

          const matchStatus =
            status === "ALL" ||
            crysta.status ===
              status

          return (
            matchSearch &&
            matchType &&
            matchAvailability &&
            matchStatus
          )
        },
      )
    }, [
      search,
      type,
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
        filteredCrystas.length /
          pageSize,
      ),
    )

  const safePage =
    Math.min(
      page,
      totalPages,
    )

  const paginatedCrystas =
    filteredCrystas.slice(
      (safePage - 1) *
        pageSize,

      safePage *
        pageSize,
    )

  /* ---------------------------------------------------------------------- */
  /* FILTER HANDLERS                                                        */
  /* ---------------------------------------------------------------------- */

  function changeSearch(
    value,
  ) {
    setSearch(value)
    setPage(1)
  }

  function changeType(
    value,
  ) {
    setType(value)
    setPage(1)
  }

  function changeAvailability(
    value,
  ) {
    setAvailability(
      value,
    )

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

  function viewCrysta(
    crystaId,
  ) {
    navigate(
      `/data/crystas/${crystaId}`,
    )
  }

  function editCrysta(
    crystaId,
  ) {
    navigate(
      `/data/crystas/${crystaId}/edit`,
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
          {/* BREADCRUMB */}

          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-muted-foreground">
              Data
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Crystas
            </span>
          </div>

          {/* TITLE */}

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Crystas
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Kelola Normal, Weapon, Armor, Additional, Special,
            dan Enhancer Crysta Toram.
          </p>
        </div>

        {/* CREATE */}

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/crystas/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Plus className="size-4" />

          Create Crysta
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          icon={Gem}
          label="Total Crystas"
          value={
            statistics.total
          }
          description="All crysta records"
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
            placeholder="Search crystas..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
          />
        </div>

        {/* TYPE */}

        <FilterSelect
          value={
            type
          }
          options={
            typeOptions
          }
          onChange={
            changeType
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

        <div className="grid grid-cols-[minmax(320px,1.7fr)_240px_220px_180px_60px] border-b border-border bg-muted/20 px-5">
          <TableHeader>
            Crysta
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

        {paginatedCrystas.length >
        0 ? (
          paginatedCrystas.map(
            (crysta) => (
              <div
                key={
                  crysta.id
                }
                className="grid min-h-[68px] grid-cols-[minmax(320px,1.7fr)_240px_220px_180px_60px] items-center border-b border-border px-5 transition-colors last:border-b-0 hover:bg-muted/[0.18]"
              >
                {/* ======================================================= */}
                {/* CRYSTA                                                 */}
                {/* ======================================================= */}

                <div className="flex min-w-0 items-center gap-3 pr-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Gem className="size-4" />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      viewCrysta(
                        crysta.id,
                      )
                    }
                    className="min-w-0 cursor-pointer truncate text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {
                      crysta.name
                    }
                  </button>
                </div>

                {/* ======================================================= */}
                {/* TYPE                                                   */}
                {/* ======================================================= */}

                <div>
                  <TypeBadge
                    type={
                      crysta.type
                    }
                  />
                </div>

                {/* ======================================================= */}
                {/* AVAILABILITY                                           */}
                {/* ======================================================= */}

                <span className="text-sm text-muted-foreground">
                  {formatAvailability(
                    crysta.availability,
                  )}
                </span>

                {/* ======================================================= */}
                {/* STATUS                                                 */}
                {/* ======================================================= */}

                <div>
                  <StatusBadge
                    status={
                      crysta.status
                    }
                  />
                </div>

                {/* ======================================================= */}
                {/* ACTION                                                 */}
                {/* ======================================================= */}

                <div className="flex justify-end">
                  <CrystaAction
                    onView={() =>
                      viewCrysta(
                        crysta.id,
                      )
                    }
                    onEdit={() =>
                      editCrysta(
                        crysta.id,
                      )
                    }
                  />
                </div>
              </div>
            ),
          )
        ) : (
          <EmptyState />
        )}
      </section>

      {/* ================================================================== */}
      {/* PAGINATION                                                         */}
      {/* ================================================================== */}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          {filteredCrystas.length ===
          0
            ? 0
            : (safePage - 1) *
                pageSize +
              1}
          {" – "}
          {Math.min(
            safePage *
              pageSize,
            filteredCrystas.length,
          )}
          {" of "}
          {
            filteredCrystas.length
          }
          {" crystas"}
        </p>

        <div className="flex items-center gap-2">
          {/* PREVIOUS */}

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
            className="size-9 cursor-pointer rounded-lg"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* PAGE */}

          <div className="flex h-9 min-w-20 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground">
            {safePage}
            {" / "}
            {totalPages}
          </div>

          {/* NEXT */}

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
            className="flex h-10 min-w-[175px] cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
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
/* ACTION                                                                     */
/* -------------------------------------------------------------------------- */

function CrystaAction({
  onView,
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
        className="min-w-[165px]"
      >
        <DropdownMenuGroup>
          {/* VIEW */}

          <DropdownMenuItem
            onClick={
              onView
            }
            className="cursor-pointer gap-2 text-sm"
          >
            <Eye className="size-4" />

            View Detail
          </DropdownMenuItem>

          {/* EDIT */}

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
/* TYPE BADGE                                                                 */
/* -------------------------------------------------------------------------- */

function TypeBadge({
  type,
}) {
  return (
    <span className="inline-flex rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
      {formatType(
        type,
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
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Gem className="size-5" />
      </div>

      <p className="mt-4 text-sm font-medium text-foreground">
        No crystas found
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Coba ubah search atau filter yang digunakan.
      </p>
    </div>
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
/* FORMAT TYPE                                                                */
/* -------------------------------------------------------------------------- */

function formatType(
  type,
) {
  const labels = {
    NORMAL:
      "Normal",

    WEAPON:
      "Weapon",

    ARMOR:
      "Armor",

    ADDITIONAL:
      "Additional",

    SPECIAL:
      "Special",

    ENHANCER:
      "Enhancer",
  }

  return (
    labels[type] ||
    formatLabel(type)
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT AVAILABILITY                                                        */
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

/* -------------------------------------------------------------------------- */
/* FORMAT STATUS                                                              */
/* -------------------------------------------------------------------------- */

function formatStatus(
  value,
) {
  const labels = {
    PUBLISHED:
      "Published",

    DRAFT:
      "Draft",
  }

  return (
    labels[value] ||
    formatLabel(value)
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT LABEL                                                               */
/* -------------------------------------------------------------------------- */

function formatLabel(
  value,
) {
  if (!value) {
    return "—"
  }

  return String(value)
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
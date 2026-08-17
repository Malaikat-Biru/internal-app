import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Disc3,
  Eye,
  MoreHorizontal,
  Music2,
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

const bgms = [
  {
    id: "BGM-001",
    title: "Sofya City",
    duration: 143,
    status: "PUBLISHED",
  },
  {
    id: "BGM-002",
    title: "Rakau Plains",
    duration: 167,
    status: "PUBLISHED",
  },
  {
    id: "BGM-003",
    title: "Battle Theme",
    duration: 128,
    status: "PUBLISHED",
  },
  {
    id: "BGM-004",
    title: "Boss Battle",
    duration: 176,
    status: "PUBLISHED",
  },
  {
    id: "BGM-005",
    title: "El Scaro",
    duration: 155,
    status: "PUBLISHED",
  },
  {
    id: "BGM-006",
    title: "Hora Diomedea",
    duration: 181,
    status: "DRAFT",
  },
  {
    id: "BGM-007",
    title: "Ancient Ruins",
    duration: 149,
    status: "PUBLISHED",
  },
  {
    id: "BGM-008",
    title: "Iruna World",
    duration: 195,
    status: "DRAFT",
  },
  {
    id: "BGM-009",
    title: "Guild Bar",
    duration: 136,
    status: "PUBLISHED",
  },
  {
    id: "BGM-010",
    title: "Dark Realm",
    duration: 204,
    status: "PUBLISHED",
  },
  {
    id: "BGM-011",
    title: "Unknown Territory",
    duration: 160,
    status: "DRAFT",
  },
  {
    id: "BGM-012",
    title: "Final Battle",
    duration: 218,
    status: "PUBLISHED",
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

export default function BgmsPage() {
  const navigate = useNavigate()

  const [
    search,
    setSearch,
  ] = useState("")

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

  const totalBgms =
    bgms.length

  const totalPublished =
    bgms.filter(
      (bgm) =>
        bgm.status ===
        "PUBLISHED",
    ).length

  const totalDraft =
    bgms.filter(
      (bgm) =>
        bgm.status ===
        "DRAFT",
    ).length

  /* ---------------------------------------------------------------------- */
  /* FILTER                                                                 */
  /* ---------------------------------------------------------------------- */

  const filteredBgms =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      return bgms.filter(
        (bgm) => {
          const matchesSearch =
            !keyword ||
            bgm.title
              .toLowerCase()
              .includes(
                keyword,
              )

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            bgm.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        },
      )
    }, [
      search,
      statusFilter,
    ])

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredBgms.length /
          pageSize,
      ),
    )

  const safePage =
    Math.min(
      currentPage,
      totalPages,
    )

  const paginatedBgms =
    useMemo(() => {
      const start =
        (safePage - 1) *
        pageSize

      return filteredBgms.slice(
        start,
        start +
          pageSize,
      )
    }, [
      filteredBgms,
      safePage,
    ])

  const startItem =
    filteredBgms.length ===
    0
      ? 0
      : (safePage - 1) *
          pageSize +
        1

  const endItem =
    Math.min(
      safePage *
        pageSize,
      filteredBgms.length,
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

  function handleStatusFilter(
    value,
  ) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  function clearFilters() {
    setSearch("")
    setStatusFilter("ALL")
    setCurrentPage(1)
  }

  function handleDelete(
    bgm,
  ) {
    console.log(
      "Delete BGM:",
      bgm,
    )

    /*
      TODO:
      open delete confirmation
    */
  }

  const hasActiveFilter =
    Boolean(search) ||
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
              Worlds
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              BGM
            </span>
          </div>

          {/* Title */}

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            BGM
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Kelola data background music yang digunakan dalam
            informasi dunia Toram.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              "/data/worlds/bgms/create",
            )
          }
          className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <CirclePlus className="size-4" />

          Add BGM
        </Button>
      </header>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-3 gap-4">
        <StatCard
          label="Total BGM"
          value={
            totalBgms
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
              placeholder="Search BGM..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </div>

          {/* Filters */}

          <div className="flex items-center gap-2">
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
          <div className="min-w-[760px]">
            {/* TABLE HEAD */}

            <div className="grid grid-cols-[minmax(420px,1.8fr)_180px_160px_64px] items-center border-b border-border bg-muted/15 px-5 py-3">
              <TableHead>
                BGM
              </TableHead>

              <TableHead>
                Duration
              </TableHead>

              <TableHead>
                Status
              </TableHead>

              <span />
            </div>

            {/* TABLE BODY */}

            {paginatedBgms.length >
            0 ? (
              paginatedBgms.map(
                (bgm) => (
                  <BgmRow
                    key={
                      bgm.id
                    }
                    bgm={
                      bgm
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
                    <Music2 className="size-5" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No BGM found
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
                filteredBgms.length
              }
            </span>

            {" BGM"}
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
/* BGM ROW                                                                    */
/* -------------------------------------------------------------------------- */

function BgmRow({
  bgm,
  navigate,
  onDelete,
}) {
  return (
    <div className="grid grid-cols-[minmax(420px,1.8fr)_180px_160px_64px] items-center border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-muted/[0.08]">
      {/* BGM */}

      <button
        type="button"
        onClick={() =>
          navigate(
            `/data/worlds/bgms/${bgm.id}`,
          )
        }
        className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Disc3 className="size-4" />
        </div>

        <p className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary">
          {bgm.title}
        </p>
      </button>

      {/* DURATION */}

      <p className="text-sm font-medium text-foreground">
        {formatDuration(
          bgm.duration,
        )}
      </p>

      {/* STATUS */}

      <StatusBadge
        status={
          bgm.status
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
                  `/data/worlds/bgms/${bgm.id}`,
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
                  `/data/worlds/bgms/${bgm.id}/edit`,
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
                  bgm,
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

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatDuration(
  seconds,
) {
  if (
    seconds == null
  ) {
    return "—"
  }

  const minutes =
    Math.floor(
      seconds / 60,
    )

  const remainingSeconds =
    seconds % 60

  return `${minutes}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`
}
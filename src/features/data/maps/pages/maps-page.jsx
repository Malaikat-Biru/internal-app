import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Ellipsis,
  Eye,
  FileMusic,
  LoaderCircle,
  Map,
  MapPinned,
  Network,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useDeleteMap,
  useMaps,
  useMapStatistics,
} from "@/features/data/maps/api/maps.query";

import {
  useCurrentUser,
} from "@/features/auth/api/auth.query";

import {
  useDebounce,
} from "@/hooks/use-debounce";

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
/* -------------------------------------------------------------------------- */

const worldOptions = [
  {
    value: "",
    label: "All Worlds",
  },

  {
    value: "TORAM",
    label: "Toram",
  },

  {
    value: "IRUNA",
    label: "Iruna",
  },
];

const PAGE_SIZE = 20;

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function MapsPage() {
  const navigate =
    useNavigate();

  /* ---------------------------------------------------------------------- */
  /* CURRENT USER                                                           */
  /* ---------------------------------------------------------------------- */

  const {
    data:
      currentUserResponse,
  } = useCurrentUser();

  const currentUser =
    currentUserResponse
      ?.data ?? null;

  const isOwner =
    currentUser?.role ===
    "OWNER";

  /* ---------------------------------------------------------------------- */
  /* DELETE MUTATION                                                        */
  /* ---------------------------------------------------------------------- */

  const deleteMap =
    useDeleteMap();

  /* ---------------------------------------------------------------------- */
  /* DELETE DIALOG STATE                                                    */
  /* ---------------------------------------------------------------------- */

  const [
    mapToDelete,
    setMapToDelete,
  ] = useState(null);

  /* ---------------------------------------------------------------------- */
  /* FILTER STATE                                                           */
  /* ---------------------------------------------------------------------- */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    worldFilter,
    setWorldFilter,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const debouncedSearch =
    useDebounce(
      search,
      400,
    );

  /* ---------------------------------------------------------------------- */
  /* MAP LIST QUERY                                                         */
  /* ---------------------------------------------------------------------- */

  const {
    data: mapsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMaps({
    page,
    limit: PAGE_SIZE,
    world:
      worldFilter,
    search:
      debouncedSearch.trim(),
  });

  /* ---------------------------------------------------------------------- */
  /* STATISTICS QUERY                                                       */
  /* ---------------------------------------------------------------------- */

  const {
    data:
      statisticsResponse,

    isLoading:
      isStatisticsLoading,
  } =
    useMapStatistics();

  /* ---------------------------------------------------------------------- */
  /* RESPONSE DATA                                                          */
  /* ---------------------------------------------------------------------- */

  const maps =
    mapsResponse?.data ??
    [];

  const pagination =
    mapsResponse
      ?.pagination ?? {
      page: 1,

      limit:
        PAGE_SIZE,

      total: 0,

      totalPages: 1,
    };

  const statistics =
    statisticsResponse
      ?.data ?? {
      totalMaps: 0,

      publishedMaps: 0,

      draftMaps: 0,
    };

  /* ---------------------------------------------------------------------- */
  /* RESET PAGE                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    worldFilter,
  ]);

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  const currentPage =
    pagination.page ??
    page;

  const totalPages =
    Math.max(
      1,
      pagination.totalPages ??
        1,
    );

  const total =
    pagination.total ?? 0;

  const limit =
    pagination.limit ??
    PAGE_SIZE;

  const firstRow =
    total === 0
      ? 0
      : (currentPage - 1) *
          limit +
        1;

  const lastRow =
    total === 0
      ? 0
      : Math.min(
          currentPage *
            limit,

          total,
        );

  const hasFilters =
    Boolean(
      search.trim(),
    ) ||
    Boolean(
      worldFilter,
    );

  /* ---------------------------------------------------------------------- */
  /* SEARCH                                                                 */
  /* ---------------------------------------------------------------------- */

  function handleSearch(
    value,
  ) {
    setSearch(value);
  }

  /* ---------------------------------------------------------------------- */
  /* WORLD FILTER                                                           */
  /* ---------------------------------------------------------------------- */

  function handleWorldFilter(
    value,
  ) {
    setWorldFilter(
      value,
    );

    setPage(1);
  }

  /* ---------------------------------------------------------------------- */
  /* CLEAR FILTER                                                           */
  /* ---------------------------------------------------------------------- */

  function clearFilters() {
    setSearch("");

    setWorldFilter("");

    setPage(1);
  }

  /* ---------------------------------------------------------------------- */
  /* PAGINATION                                                             */
  /* ---------------------------------------------------------------------- */

  function goToPreviousPage() {
    if (
      isFetching ||
      currentPage <= 1
    ) {
      return;
    }

    setPage(
      Math.max(
        1,
        currentPage - 1,
      ),
    );
  }

  function goToNextPage() {
    if (
      isFetching ||
      currentPage >=
        totalPages
    ) {
      return;
    }

    setPage(
      Math.min(
        totalPages,
        currentPage + 1,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* OPEN DELETE DIALOG                                                     */
  /* ---------------------------------------------------------------------- */

  function requestDeleteMap(
    map,
  ) {
    if (!isOwner) {
      return;
    }

    setMapToDelete(
      map,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* CLOSE DELETE DIALOG                                                    */
  /* ---------------------------------------------------------------------- */

  function closeDeleteDialog() {
    if (
      deleteMap.isPending
    ) {
      return;
    }

    setMapToDelete(
      null,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE MAP                                                             */
  /* ---------------------------------------------------------------------- */

  async function confirmDeleteMap() {
    if (
      !isOwner ||
      !mapToDelete ||
      deleteMap.isPending
    ) {
      return;
    }

    try {
      await deleteMap.mutateAsync(
        mapToDelete.id,
      );

      toast.success(
        "Map berhasil dihapus",
        {
          description:
            `${formatMapName(
              mapToDelete.name,
            )} telah dihapus dari data maps.`,
        },
      );

      setMapToDelete(
        null,
      );

      /*
       * Jika item terakhir pada page > 1
       * terhapus, pindah satu page ke belakang.
       *
       * Contoh:
       *
       * page 3 cuma punya 1 record
       * → delete
       * → kembali ke page 2
       */
      if (
        maps.length === 1 &&
        currentPage > 1
      ) {
        setPage(
          currentPage -
            1,
        );
      }
    } catch (
      deleteError
    ) {
      toast.error(
        "Gagal menghapus map",
        {
          description:
            deleteError?.message ||
            "Terjadi kesalahan ketika menghapus map.",
        },
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="mx-auto w-full max-w-[1600px] px-6 py-7 xl:px-8">
        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-muted-foreground">
                Data
              </span>

              <span className="text-muted-foreground/50">
                /
              </span>

              <span className="text-muted-foreground">
                Worlds
              </span>

              <span className="text-muted-foreground/50">
                /
              </span>

              <span className="text-primary">
                Maps
              </span>
            </div>

            <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              Maps
            </h1>

            <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
              Kelola map, area induk, world,
              connections, monster, NPC, dan BGM.
            </p>
          </div>

          <Button
            type="button"
            onClick={() =>
              navigate(
                "/data/worlds/maps/create",
              )
            }
            className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
          >
            <Plus className="size-4" />

            Add Map
          </Button>
        </div>

        {/* ================================================================= */}
        {/* STATISTICS                                                        */}
        {/* ================================================================= */}

        <section className="mt-7 grid grid-cols-3 gap-4">
          <MetricCard
            icon={
              MapPinned
            }
            label="Total Maps"
            value={
              statistics.totalMaps
            }
            description="All map records"
            loading={
              isStatisticsLoading
            }
          />

          <MetricCard
            icon={Map}
            label="Published"
            value={
              statistics.publishedMaps
            }
            description="Available in Aoi"
            loading={
              isStatisticsLoading
            }
          />

          <MetricCard
            icon={
              CircleAlert
            }
            label="Draft"
            value={
              statistics.draftMaps
            }
            description="Not published yet"
            loading={
              isStatisticsLoading
            }
          />
        </section>

        {/* ================================================================= */}
        {/* RECORDS                                                           */}
        {/* ================================================================= */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          {/* =============================================================== */}
          {/* TOOLBAR                                                         */}
          {/* =============================================================== */}

          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              {/* SEARCH */}

              <div className="relative w-full max-w-[360px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={search}
                  onChange={(
                    event,
                  ) =>
                    handleSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search maps..."
                  aria-label="Search maps"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
                />

                {isFetching &&
                  !isLoading && (
                    <LoaderCircle className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
              </div>

              {/* WORLD FILTER */}

              <select
                value={
                  worldFilter
                }
                onChange={(
                  event,
                ) =>
                  handleWorldFilter(
                    event.target.value,
                  )
                }
                aria-label="Filter world"
                className="h-10 cursor-pointer rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors hover:bg-muted/30 focus:border-primary/40"
              >
                {worldOptions.map(
                  (world) => (
                    <option
                      key={
                        world.value
                      }
                      value={
                        world.value
                      }
                    >
                      {
                        world.label
                      }
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

            <p className="shrink-0 text-xs text-muted-foreground">
              {formatNumber(
                total,
              )}{" "}
              maps
            </p>
          </div>

          {/* =============================================================== */}
          {/* TABLE                                                           */}
          {/* =============================================================== */}

          <div className="w-full overflow-x-auto">
            <div className="min-w-[1180px]">
              {/* TABLE HEADER */}

              <div className="grid grid-cols-[minmax(250px,1.6fr)_185px_155px_120px_105px_95px_120px_120px_52px] items-center border-b border-border bg-muted/20 px-5">
                <TableHeaderCell>
                  Map
                </TableHeaderCell>

                <TableHeaderCell>
                  Parent Area
                </TableHeaderCell>

                <TableHeaderCell>
                  World
                </TableHeaderCell>

                <TableHeaderCell>
                  Connections
                </TableHeaderCell>

                <TableHeaderCell>
                  Monsters
                </TableHeaderCell>

                <TableHeaderCell>
                  NPCs
                </TableHeaderCell>

                <TableHeaderCell>
                  BGM
                </TableHeaderCell>

                <TableHeaderCell>
                  Status
                </TableHeaderCell>

                <div />
              </div>

              {/* TABLE BODY */}

              {isLoading ? (
                <TableLoadingState />
              ) : isError ? (
                <ErrorState
                  error={error}
                  onRetry={
                    refetch
                  }
                />
              ) : maps.length >
                0 ? (
                maps.map(
                  (map) => (
                    <MapRow
                      key={
                        map.id
                      }
                      map={map}
                      canDelete={
                        isOwner
                      }
                      deleting={
                        deleteMap.isPending &&
                        mapToDelete?.id ===
                          map.id
                      }
                      onOpen={() =>
                        navigate(
                          `/data/worlds/maps/${map.id}`,
                        )
                      }
                      onEdit={() =>
                        navigate(
                          `/data/worlds/maps/${map.id}/edit`,
                        )
                      }
                      onOpenParent={(
                        parentId,
                      ) =>
                        navigate(
                          `/data/worlds/maps/${parentId}`,
                        )
                      }
                      onDelete={() =>
                        requestDeleteMap(
                          map,
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

          {/* =============================================================== */}
          {/* PAGINATION                                                      */}
          {/* =============================================================== */}

          {!isLoading &&
            !isError && (
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
                    {formatNumber(
                      total,
                    )}
                  </span>{" "}

                  maps
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={
                      currentPage <=
                        1 ||
                      isFetching
                    }
                    onClick={
                      goToPreviousPage
                    }
                    className="size-9 cursor-pointer rounded-lg disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  <div className="flex min-w-[100px] items-center justify-center px-2">
                    <span className="text-xs text-muted-foreground">
                      Page{" "}

                      <span className="font-medium text-foreground">
                        {
                          currentPage
                        }
                      </span>{" "}

                      of{" "}

                      <span className="font-medium text-foreground">
                        {
                          totalPages
                        }
                      </span>
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={
                      currentPage >=
                        totalPages ||
                      isFetching
                    }
                    onClick={
                      goToNextPage
                    }
                    className="size-9 cursor-pointer rounded-lg disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
        </section>

        <div className="h-8" />
      </div>

      {/* =================================================================== */}
      {/* DELETE CONFIRMATION                                                 */}
      {/* =================================================================== */}

      {mapToDelete && (
        <DeleteMapDialog
          map={
            mapToDelete
          }
          isDeleting={
            deleteMap.isPending
          }
          onCancel={
            closeDeleteDialog
          }
          onConfirm={
            confirmDeleteMap
          }
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MAP ROW                                                                    */
/* -------------------------------------------------------------------------- */

function MapRow({
  map,
  canDelete,
  deleting,
  onOpen,
  onEdit,
  onOpenParent,
  onDelete,
}) {
  const hasParent =
    Boolean(
      map.parent?.id,
    ) &&
    Boolean(
      map.parent?.name,
    );

  return (
    <div className="grid grid-cols-[minmax(250px,1.6fr)_185px_155px_120px_105px_95px_120px_120px_52px] items-center border-b border-border px-5 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20">
      {/* MAP */}

      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={
            onOpen
          }
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted"
        >
          <MapPinned className="size-4" />
        </button>

        <div className="min-w-0">
          <button
            type="button"
            onClick={
              onOpen
            }
            className="block max-w-full cursor-pointer truncate text-left text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {formatMapName(
              map.name,
            )}
          </button>
        </div>
      </div>

      {/* PARENT */}

      <div className="min-w-0 pr-4">
        {hasParent ? (
          <button
            type="button"
            onClick={() =>
              onOpenParent(
                map.parent.id,
              )
            }
            className="block max-w-full cursor-pointer truncate text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {formatMapName(
              map.parent.name,
            )}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">
            —
          </span>
        )}
      </div>

      {/* WORLD */}

      <p className="truncate pr-4 text-sm font-medium text-foreground">
        {formatWorld(
          map.world,
        )}
      </p>

      {/* CONNECTION */}

      <RelationCount
        icon={Network}
        value={
          map.connectionCount
        }
      />

      {/* MONSTER */}

      <RelationCount
        icon={Users}
        value={
          map.monsterCount
        }
      />

      {/* NPC */}

      <RelationCount
        icon={
          UserRound
        }
        value={
          map.npcCount
        }
      />

      {/* BGM */}

      {map.bgm ? (
        <div className="flex min-w-0 items-center gap-2">
          <FileMusic className="size-3.5 shrink-0 text-muted-foreground" />

          <span
            className="truncate text-xs font-medium text-foreground"
            title={
              typeof map.bgm ===
              "string"
                ? map.bgm
                : map.bgm?.name
            }
          >
            Assigned
          </span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">
          —
        </span>
      )}

      {/* STATUS */}

      <StatusBadge
        status={
          map.status
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
                disabled={
                  deleting
                }
                className="size-9 cursor-pointer rounded-lg text-muted-foreground"
              />
            }
          >
            {deleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Ellipsis className="size-4" />
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="w-40"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={
                  onOpen
                }
              >
                <Eye className="size-4" />

                View Map
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={
                  onEdit
                }
              >
                <Pencil className="size-4" />

                Edit Map
              </DropdownMenuItem>
            </DropdownMenuGroup>

            {canDelete && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={
                      onDelete
                    }
                  >
                    <Trash2 className="size-4" />

                    Delete Map
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DELETE MAP DIALOG                                                          */
/* -------------------------------------------------------------------------- */

function DeleteMapDialog({
  map,
  isDeleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6 py-8">
      <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-4.5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Delete Map
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Tindakan ini akan menghapus data map secara permanen.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={
              isDeleting
            }
            onClick={
              onCancel
            }
            className="size-8 shrink-0 cursor-pointer rounded-lg"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* CONTENT */}

        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Kamu akan menghapus map{" "}

            <span className="font-semibold text-foreground">
              {formatMapName(
                map.name,
              )}
            </span>
            . Pastikan map ini memang sudah tidak dibutuhkan.
          </p>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/15 bg-destructive/[0.04] p-4">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />

            <p className="text-xs leading-5 text-muted-foreground">
              Penghapusan dapat memengaruhi parent area, map
              connection, monster, NPC, atau data lain yang memiliki
              relasi dengan map ini.
            </p>
          </div>
        </div>

        {/* ACTION */}

        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            disabled={
              isDeleting
            }
            onClick={
              onCancel
            }
            className="h-10 cursor-pointer px-4 text-sm"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              isDeleting
            }
            onClick={
              onConfirm
            }
            className="h-10 cursor-pointer gap-2 rounded-lg bg-destructive px-5 text-sm text-destructive-foreground text-white hover:bg-destructive/90"
          >
            {isDeleting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}

            {isDeleting
              ? "Deleting..."
              : "Delete Map"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RELATION COUNT                                                             */
/* -------------------------------------------------------------------------- */

function RelationCount({
  icon: Icon,
  value,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />

      <span className="text-sm font-medium text-foreground">
        {formatNumber(
          value,
        )}
      </span>
    </div>
  );
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
      <Badge className="h-6 border-emerald-500/15 bg-emerald-500/10 px-2.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/10">
        Published
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="h-6 px-2.5 text-xs font-medium"
    >
      Draft
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* METRIC CARD                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  loading = false,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-14 animate-pulse rounded-md bg-muted" />
          ) : (
            <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em] text-foreground">
              {formatNumber(
                value,
              )}
            </p>
          )}
        </div>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4.5" />
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
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
  );
}

/* -------------------------------------------------------------------------- */
/* LOADING                                                                    */
/* -------------------------------------------------------------------------- */

function TableLoadingState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <LoaderCircle className="size-5 animate-spin text-muted-foreground" />

      <p className="mt-3 text-sm font-medium text-foreground">
        Loading maps
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Mengambil data map dari server.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ERROR                                                                      */
/* -------------------------------------------------------------------------- */

function ErrorState({
  error,
  onRetry,
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <CircleAlert className="size-4" />
      </div>

      <p className="mt-4 text-sm font-semibold text-foreground">
        Failed to load maps
      </p>

      <p className="mt-1 max-w-[360px] text-xs leading-5 text-muted-foreground">
        {error?.message ||
          "Tidak dapat mengambil data maps dari server."}
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onRetry()
        }
        className="mt-4 h-9 cursor-pointer rounded-lg px-4 text-xs"
      >
        Try Again
      </Button>
    </div>
  );
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
        <MapPinned className="size-4" />
      </div>

      <p className="mt-4 text-sm font-semibold text-foreground">
        No maps found
      </p>

      <p className="mt-1 max-w-[340px] text-xs leading-5 text-muted-foreground">
        {hasFilters
          ? "Tidak ada map yang sesuai dengan filter yang sedang digunakan."
          : "Belum ada data map yang tersedia."}
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
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(
  value,
) {
  return Number(
    value || 0,
  ).toLocaleString(
    "id-ID",
  );
}

function formatWorld(
  world,
) {
  if (!world) {
    return "—";
  }

  if (
    world === "TORAM"
  ) {
    return "Toram";
  }

  if (
    world === "IRUNA"
  ) {
    return "Iruna";
  }

  return formatLabel(
    world,
  );
}

function formatMapName(
  value,
) {
  if (!value) {
    return "—";
  }

  return String(value)
    .replace(
      /[-_]/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatLabel(
  value,
) {
  if (!value) {
    return "—";
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
    );
}
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CircleAlert,
  ExternalLink,
  FileMusic,
  Landmark,
  Link2,
  LoaderCircle,
  Map,
  MapPinned,
  Mountain,
  Pencil,
  RefreshCw,
  Ship,
  TentTree,
  Trees,
  UserRound,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  useMapDetail,
} from "@/features/data/maps/api/maps.query";

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function MapDetailPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMapDetail(id);

  const map =
    response?.data ?? null;

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <MapDetailLoading />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                  */
  /* ---------------------------------------------------------------------- */

  if (
    isError ||
    !map
  ) {
    return (
      <MapDetailError
        error={error}
        onRetry={refetch}
        onBack={() =>
          navigate(
            "/data/worlds/maps",
          )
        }
      />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      {/* ================================================================== */}
      {/* BACK                                                               */}
      {/* ================================================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/data/worlds/maps",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Maps
      </button>

      {/* ================================================================== */}
      {/* PAGE HEADER                                                        */}
      {/* ================================================================== */}

      <header className="mt-5 flex items-end justify-between gap-8">
        <div className="min-w-0">
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

            <span className="text-muted-foreground">
              Maps
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="truncate text-primary">
              {formatMapName(
                map.name,
              )}
            </span>
          </div>

          {/* Title */}

          <div className="mt-2 flex items-center gap-3">
            <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              {formatMapName(
                map.name,
              )}
            </h1>

            <StatusBadge
              status={
                map.status
              }
            />

            {isFetching && (
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
            Informasi map, hubungan antar area, serta data monster
            dan NPC yang berada di map ini.
          </p>

          {/* Record Metadata */}

          <div className="mt-3 flex items-center gap-5">
            <HeaderMeta
              icon={
                CalendarDays
              }
              label="Created"
              value={formatDateTime(
                map.createdAt,
              )}
            />

            <div className="h-4 w-px bg-border" />

            <HeaderMeta
              icon={
                RefreshCw
              }
              label="Last updated"
              value={formatDateTime(
                map.updatedAt,
              )}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate(
              `/data/worlds/maps/${map.id}/edit`,
            )
          }
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-5 text-sm"
        >
          <Pencil className="size-4" />

          Edit Map
        </Button>
      </header>

      {/* ================================================================== */}
      {/* MAIN CARD                                                          */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 MAP OVERVIEW                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="Map Overview"
            description="Identitas utama dan klasifikasi area."
          />

          <div className="mt-6 grid grid-cols-[400px_minmax(0,1fr)] gap-8">
            {/* =========================================================== */}
            {/* MAP IMAGE                                                   */}
            {/* =========================================================== */}

            <div className="overflow-hidden rounded-2xl border border-border bg-muted/15">
              <div className="flex aspect-[16/10] items-center justify-center">
                {map.image ? (
                  <img
                    src={
                      map.image
                    }
                    alt={formatMapName(
                      map.name,
                    )}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="px-6 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground">
                      <MapPinned className="size-6" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-foreground">
                      No map image
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      Gambar utama belum tersedia untuk map ini.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================== */}
            {/* MAP INFORMATION                                             */}
            {/* =========================================================== */}

            <div className="min-w-0">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.09em] text-muted-foreground">
                  Map Information
                </p>

                <h2 className="mt-2 truncate text-[24px] font-semibold tracking-[-0.035em] text-foreground">
                  {formatMapName(
                    map.name,
                  )}
                </h2>

                <p className="mt-1.5 text-sm text-muted-foreground">
                  /{map.slug}
                </p>
              </div>

              {/* Fields */}

              <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6">
                <DetailField
                  icon={getMapTypeIcon(
                    map.type,
                  )}
                  label="Map Type"
                  value={formatMapType(
                    map.type,
                  )}
                />

                <DetailField
                  icon={Map}
                  label="World"
                  value={formatWorld(
                    map.world,
                  )}
                />

                <DetailField
                  icon={
                    MapPinned
                  }
                  label="Parent Area"
                  value={
                    map.parentArea
                      ?.name
                      ? formatMapName(
                          map.parentArea
                            .name,
                        )
                      : "—"
                  }
                  interactive={
                    Boolean(
                      map.parentArea
                        ?.id,
                    )
                  }
                  onClick={
                    map.parentArea
                      ?.id
                      ? () =>
                          navigate(
                            `/data/worlds/maps/${map.parentArea.id}`,
                          )
                      : undefined
                  }
                />

                <DetailField
                  icon={
                    FileMusic
                  }
                  label="BGM"
                  value={
                    map.bgm?.name ||
                    "—"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* DIVIDER                                                           */}
        {/* ================================================================= */}

        <div className="border-t border-border" />

        {/* ================================================================= */}
        {/* 02 MAP CONNECTIONS                                                */}
        {/* ================================================================= */}

        <div className="p-6">
          <div className="flex items-start justify-between gap-8">
            <SectionTitle
              number="02"
              title="Map Connections"
              description="Map lain yang dapat diakses langsung dari area ini."
            />

            <CountBadge
              value={
                map.connections
                  ?.length ?? 0
              }
              singular="connection"
              plural="connections"
            />
          </div>

          {map.connections?.length >
          0 ? (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {map.connections.map(
                (connection) => (
                  <button
                    key={
                      connection.id
                    }
                    type="button"
                    onClick={() =>
                      navigate(
                        `/data/worlds/maps/${connection.id}`,
                      )
                    }
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/10 p-4 text-left transition-all hover:border-primary/25 hover:bg-primary/[0.025]"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {renderMapTypeIcon(
                        connection.type,
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {formatMapName(
                          connection.name,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {connection.type
                          ? formatMapType(
                              connection.type,
                            )
                          : "Map"}
                      </p>
                    </div>

                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                  </button>
                ),
              )}
            </div>
          ) : (
            <EmptyState
              icon={Link2}
              title="No map connections"
              description="Belum ada map lain yang terhubung langsung dengan area ini."
            />
          )}
        </div>

        {/* ================================================================= */}
        {/* DIVIDER                                                           */}
        {/* ================================================================= */}

        <div className="border-t border-border" />

        {/* ================================================================= */}
        {/* 03 RELATED DATA                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="03"
            title="Related Data"
            description="Monster dan NPC yang tercatat berada pada area ini."
          />

          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* =========================================================== */}
            {/* MONSTERS                                                    */}
            {/* =========================================================== */}

            <RelatedDataSection
              icon={Users}
              title="Monsters"
              description="Monster yang berada pada map ini."
              count={
                map.monsters
                  ?.length ?? 0
              }
            >
              {map.monsters?.length >
              0 ? (
                <div>
                  {map.monsters.map(
                    (monster) => (
                      <button
                        key={
                          monster.id
                        }
                        type="button"
                        onClick={() =>
                          navigate(
                            `/data/monsters/${monster.id}`,
                          )
                        }
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                            <Users className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {formatEntityName(
                                monster.name,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatLabel(
                                monster.type,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {monster.level !=
                            null && (
                            <span className="text-xs font-medium text-muted-foreground">
                              Lv.{" "}
                              {
                                monster.level
                              }
                            </span>
                          )}

                          <ExternalLink className="size-3.5 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                        </div>
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <MiniEmptyState
                  icon={Users}
                  title="No monsters"
                  description="Belum ada monster yang tercatat pada map ini."
                />
              )}
            </RelatedDataSection>

            {/* =========================================================== */}
            {/* NPCS                                                        */}
            {/* =========================================================== */}

            <RelatedDataSection
              icon={UserRound}
              title="NPCs"
              description="NPC yang berada pada map ini."
              count={
                map.npcs
                  ?.length ?? 0
              }
            >
              {map.npcs?.length >
              0 ? (
                <div>
                  {map.npcs.map(
                    (npc) => (
                      <button
                        key={
                          npc.id
                        }
                        type="button"
                        onClick={() =>
                          navigate(
                            `/data/worlds/npcs/${npc.id}`,
                          )
                        }
                        className="group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-border px-4 py-3.5 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                            <UserRound className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {formatEntityName(
                                npc.name,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatLabel(
                                npc.type,
                              )}
                            </p>
                          </div>
                        </div>

                        <ExternalLink className="size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <MiniEmptyState
                  icon={UserRound}
                  title="No NPCs"
                  description="Belum ada NPC yang tercatat pada map ini."
                />
              )}
            </RelatedDataSection>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOOTER                                                            */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Manage informasi map melalui halaman edit.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                `/data/worlds/maps/${map.id}/edit`,
              )
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-4 text-sm"
          >
            <Pencil className="size-4" />

            Edit Map
          </Button>
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE LOADING                                                               */
/* -------------------------------------------------------------------------- */

function MapDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-border bg-background">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-6 animate-spin text-muted-foreground" />

          <p className="mt-4 text-sm font-medium text-foreground">
            Loading map
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Mengambil detail map dari server.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE ERROR                                                                 */
/* -------------------------------------------------------------------------- */

function MapDetailError({
  error,
  onRetry,
  onBack,
}) {
  const isNotFound =
    error?.status === 404;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <button
        type="button"
        onClick={
          onBack
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Maps
      </button>

      <div className="mt-7 flex min-h-[460px] items-center justify-center rounded-2xl border border-border bg-background px-6 text-center">
        <div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </div>

          <h1 className="mt-4 text-base font-semibold text-foreground">
            {isNotFound
              ? "Map not found"
              : "Failed to load map"}
          </h1>

          <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-muted-foreground">
            {isNotFound
              ? "Map yang kamu cari tidak ditemukan atau mungkin sudah dihapus."
              : error?.message ||
                "Tidak dapat mengambil detail map dari server."}
          </p>

          {!isNotFound && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onRetry()
              }
              className="mt-5 h-9 cursor-pointer rounded-lg px-4 text-sm"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER META                                                                */
/* -------------------------------------------------------------------------- */

function HeaderMeta({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />

      <p className="text-xs text-muted-foreground">
        {label}

        <span className="ml-1.5 font-medium text-foreground">
          {value}
        </span>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION TITLE                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  number,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-xs font-semibold text-primary">
        {number}
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DETAIL FIELD                                                               */
/* -------------------------------------------------------------------------- */

function DetailField({
  icon: Icon,
  label,
  value,
  interactive = false,
  onClick,
}) {
  const content = (
    <>
      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",

          interactive
            ? "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p
          className={[
            "mt-1 truncate text-sm font-medium",

            interactive
              ? "text-foreground transition-colors group-hover:text-primary"
              : "text-foreground",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
    </>
  );

  if (
    interactive &&
    onClick
  ) {
    return (
      <button
        type="button"
        onClick={
          onClick
        }
        className="group flex min-w-0 cursor-pointer items-center gap-3 text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      {content}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RELATED DATA SECTION                                                       */
/* -------------------------------------------------------------------------- */

function RelatedDataSection({
  icon: Icon,
  title,
  description,
  count,
  children,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between gap-5 bg-muted/10 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <span className="flex min-w-8 items-center justify-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          {count}
        </span>
      </div>

      <div className="border-t border-border">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COUNT BADGE                                                                */
/* -------------------------------------------------------------------------- */

function CountBadge({
  value,
  singular,
  plural,
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">
        {value}
      </span>

      <span>
        {value === 1
          ? singular
          : plural}
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
      <Badge className="border-emerald-500/15 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-500/10">
        Published
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="px-2.5 py-1 text-xs font-medium"
    >
      Draft
    </Badge>
  );
}

/* -------------------------------------------------------------------------- */
/* EMPTY STATE                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mt-6 flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 px-6 text-center">
      <div>
        <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <p className="mt-3 text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MINI EMPTY STATE                                                           */
/* -------------------------------------------------------------------------- */

function MiniEmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex min-h-[180px] items-center justify-center px-6 text-center">
      <div>
        <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <p className="mt-3 text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAP TYPE                                                                   */
/* -------------------------------------------------------------------------- */

function formatMapType(
  type,
) {
  const labels = {
    FIELD: "Field",
    TOWN: "Town",
    RUINS: "Ruins",
    TOWN_RUINS:
      "Town Ruins",
    MOUNTAIN:
      "Mountain",
    SHIP: "Ship",
    FOREST: "Forest",
  };

  return (
    labels[type] ||
    formatLabel(type)
  );
}

function getMapTypeIcon(
  type,
) {
  switch (type) {
    case "FIELD":
      return TentTree;

    case "TOWN":
      return Building2;

    case "RUINS":
    case "TOWN_RUINS":
      return Landmark;

    case "MOUNTAIN":
      return Mountain;

    case "SHIP":
      return Ship;

    case "FOREST":
      return Trees;

    default:
      return MapPinned;
  }
}

function renderMapTypeIcon(
  type,
) {
  const Icon =
    getMapTypeIcon(type);

  return (
    <Icon className="size-4" />
  );
}

/* -------------------------------------------------------------------------- */
/* FORMATTERS                                                                 */
/* -------------------------------------------------------------------------- */

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

function formatEntityName(
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

function formatWorld(
  world,
) {
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

/* -------------------------------------------------------------------------- */
/* DATE                                                                       */
/* -------------------------------------------------------------------------- */

function formatDateTime(
  value,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone:
        "Asia/Jakarta",
    },
  ).format(date);
}
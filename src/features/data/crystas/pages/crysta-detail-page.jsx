import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Gem,
  GitBranch,
  MapPin,
  Package,
  Pencil,
  Sparkles,
  Store,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* MOCK CRYSTA DETAIL                                                         */
/* -------------------------------------------------------------------------- */

const mockCrystaDetail = {
  id: "CRYSTA-001",

  name: "Minotaur",

  slug: "minotaur",

  type: "WEAPON",

  availability: "PERMANENT",

  description:
    "Weapon Crysta dengan bonus offensive stat yang diperoleh dari Minotaur.",

  stats: [
    {
      stat: "STR",
      value: "+3",
    },
    {
      stat: "ATK",
      value: "+2%",
    },
  ],

  conditionalStats: [],

  enhancerTargetType: null,

  upgradeFor: [],

  acquisitionSources: [
    {
      type: "MONSTER_DROP",

      monster: {
        id: "MONSTER-001",

        name: "Minotaur",

        type: "BOSS",

        map: {
          id: "MAP-010",

          name: "Ruined Temple: Forbidden Hall",
        },
      },
    },
  ],

  process: {
    materialType: "MANA",

    points: 100,
  },

  sellPrice: 100,

  notes:
    "Crysta ini memiliki beberapa jalur upgrade melalui Enhancer Crysta.",

  status: "PUBLISHED",

  createdAt:
    "2026-07-20T14:24:00+07:00",

  updatedAt:
    "2026-08-13T23:42:00+07:00",
}

/* -------------------------------------------------------------------------- */
/* MOCK UPGRADE FLOW                                                          */
/* -------------------------------------------------------------------------- */

const mockUpgradeTree = {
  id: "CRYSTA-001",

  name: "Minotaur",

  type: "WEAPON",

  current: true,

  upgrades: [
    {
      id: "CRYSTA-101",

      name: "Dark General",

      type: "ENHANCER",

      enhancerTargetType:
        "WEAPON",

      current: false,

      upgrades: [
        {
          id: "CRYSTA-103",

          name: "Dark General II",

          type: "ENHANCER",

          enhancerTargetType:
            "WEAPON",

          current: false,

          upgrades: [],
        },

        {
          id: "CRYSTA-104",

          name: "Bloody Warrior",

          type: "ENHANCER",

          enhancerTargetType:
            "WEAPON",

          current: false,

          upgrades: [],
        },
      ],
    },

    {
      id: "CRYSTA-102",

      name: "Ancient Minotaur",

      type: "ENHANCER",

      enhancerTargetType:
        "WEAPON",

      current: false,

      upgrades: [
        {
          id: "CRYSTA-105",

          name: "Ancient Minotaur II",

          type: "ENHANCER",

          enhancerTargetType:
            "WEAPON",

          current: false,

          upgrades: [
            {
              id: "CRYSTA-106",

              name: "Ancient Minotaur III",

              type: "ENHANCER",

              enhancerTargetType:
                "WEAPON",

              current: false,

              upgrades: [],
            },
          ],
        },
      ],
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CrystaDetailPage() {
  const navigate =
    useNavigate()

  const { id } =
    useParams()

  const [
    crysta,
    setCrysta,
  ] = useState(null)

  const [
    upgradeTree,
    setUpgradeTree,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  /* ---------------------------------------------------------------------- */
  /* LOAD                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true

    async function loadCrysta() {
      setLoading(true)

      /*
        TODO API

        const [
          crystaResponse,
          treeResponse,
        ] = await Promise.all([
          getCrystaById(id),
          getCrystaUpgradeTree(id),
        ])
      */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      )

      if (!active) {
        return
      }

      const crystaResponse =
        mockCrystaDetail

      const treeResponse =
        mockUpgradeTree

      if (!crystaResponse) {
        navigate(
          "/data/crystas",
        )

        return
      }

      setCrysta(
        crystaResponse,
      )

      setUpgradeTree(
        treeResponse,
      )

      setLoading(false)
    }

    loadCrysta()

    return () => {
      active = false
    }
  }, [
    id,
    navigate,
  ])

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const totalUpgradeNodes =
    useMemo(() => {
      if (!upgradeTree) {
        return 0
      }

      return countTreeChildren(
        upgradeTree,
      )
    }, [
      upgradeTree,
    ])

  const maxUpgradeDepth =
    useMemo(() => {
      if (!upgradeTree) {
        return 0
      }

      return getTreeDepth(
        upgradeTree,
      )
    }, [
      upgradeTree,
    ])

  const finalUpgradeCount =
    useMemo(() => {
      if (!upgradeTree) {
        return 0
      }

      return countFinalNodes(
        upgradeTree,
      )
    }, [
      upgradeTree,
    ])

  const isEnhancer =
    crysta?.type ===
    "ENHANCER"

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <CrystaDetailLoading />
    )
  }

  if (!crysta) {
    return null
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
            "/data/crystas",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Crystas
      </button>

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header className="mt-5">
        {/* BREADCRUMB */}

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="text-muted-foreground">
            Data
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-muted-foreground">
            Crystas
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-primary">
            {crysta.name}
          </span>
        </div>

        {/* TITLE */}

        <div className="mt-2 flex items-start justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
                {crysta.name}
              </h1>

              <StatusBadge
                status={
                  crysta.status
                }
              />
            </div>

            <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
              Detail informasi Crysta, stat, source, dan jalur upgrade.
            </p>
          </div>

          {/* EDIT */}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                `/data/crystas/${crysta.id}/edit`,
              )
            }
            className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm"
          >
            <Pencil className="size-4" />

            Edit Crysta
          </Button>
        </div>

        {/* META */}

        <div className="mt-5 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />

            <span>
              Created
            </span>

            <span className="font-medium text-foreground">
              {formatDateTime(
                crysta.createdAt,
              )}
            </span>
          </div>

          <div className="h-3 w-px bg-border" />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />

            <span>
              Last Updated
            </span>

            <span className="font-medium text-foreground">
              {formatDateTime(
                crysta.updatedAt,
              )}
            </span>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 01 GENERAL                                                        */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="01"
            title="General Information"
            description="Informasi dasar Crysta."
          />

          <div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-6">
            <InfoField
              label="Crysta Name"
              value={
                crysta.name
              }
            />

            <InfoField
              label="Crysta Type"
            >
              <TypeBadge
                type={
                  crysta.type
                }
              />
            </InfoField>

            <InfoField
              label="Availability"
              value={formatAvailability(
                crysta.availability,
              )}
            />

            <InfoField
              label="Slug"
              value={
                crysta.slug
              }
            />

            <InfoField
              label="Status"
            >
              <StatusBadge
                status={
                  crysta.status
                }
              />
            </InfoField>

            {isEnhancer && (
              <InfoField
                label="Enhancer Target Type"
                value={`${formatLabel(
                  crysta.enhancerTargetType,
                )} Crysta`}
              />
            )}
          </div>

          {/* DESCRIPTION */}

          <div className="mt-7 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              Description
            </p>

            <p className="mt-3 max-w-[900px] text-sm leading-7 text-foreground">
              {crysta.description ||
                "No description."}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 02 CRYSTA DATA                                                    */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="02"
            title="Crysta Data"
            description="Stat dan informasi gameplay Crysta."
          />

          {/* ============================================================= */}
          {/* STATS                                                        */}
          {/* ============================================================= */}

          <DetailSection
            title="Stats / Effects"
            description="Stat utama yang diberikan oleh Crysta."
          >
            {crysta.stats?.length >
            0 ? (
              <div className="grid grid-cols-2 gap-3">
                {crysta.stats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <StatRow
                      key={`${stat.stat}-${index}`}
                      stat={
                        stat.stat
                      }
                      value={
                        stat.value
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyData
                title="No stats"
                description="Crysta ini belum memiliki stat."
              />
            )}
          </DetailSection>

          {/* ============================================================= */}
          {/* CONDITIONAL STATS                                            */}
          {/* ============================================================= */}

          <DetailSection
            title="Conditional Stats"
            description="Stat yang aktif pada kondisi tertentu."
          >
            {crysta
              .conditionalStats
              ?.length > 0 ? (
              <div className="space-y-3">
                {crysta.conditionalStats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <div
                      key={`${stat.stat}-${index}`}
                      className="rounded-xl border border-border bg-muted/[0.04] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Condition
                          </p>

                          <p className="mt-1.5 text-sm font-medium text-foreground">
                            {stat.condition ===
                            "OTHER"
                              ? stat.customCondition ||
                                "Other"
                              : formatLabel(
                                  stat.condition,
                                )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground">
                            Effect
                          </p>

                          <p className="mt-1.5 text-sm font-semibold text-foreground">
                            {stat.stat}{" "}
                            <span className="text-primary">
                              {stat.value}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyData
                title="No conditional stats"
                description="Tidak ada stat dengan kondisi khusus."
              />
            )}
          </DetailSection>

          {/* ============================================================= */}
          {/* ENHANCER UPGRADE FOR                                         */}
          {/* ============================================================= */}

          {isEnhancer && (
            <DetailSection
              title="Upgrade For"
              description="Crysta yang dapat di-upgrade menggunakan Enhancer ini."
            >
              {crysta.upgradeFor
                ?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {crysta.upgradeFor.map(
                    (
                      target,
                      index,
                    ) => (
                      <button
                        key={`${target.crystaId}-${index}`}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/data/crystas/${target.crystaId}`,
                          )
                        }
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:bg-muted/30"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Gem className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {target.name ||
                              target.crystaId}
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Upgrade target
                          </p>
                        </div>

                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <EmptyData
                  title="No upgrade target"
                  description="Enhancer ini belum memiliki target upgrade."
                />
              )}
            </DetailSection>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 03 UPGRADE PATH                                                   */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="03"
            title="Crysta Upgrade Path"
            description="Lihat perjalanan upgrade Crysta dari kiri ke kanan hingga mencapai upgrade terakhir."
          />

          {/* SUMMARY */}

          <div className="mt-6 grid grid-cols-3 gap-4">
            <MiniStat
              label="Total Upgrades"
              value={
                totalUpgradeNodes
              }
            />

            <MiniStat
              label="Upgrade Levels"
              value={
                maxUpgradeDepth
              }
            />

            <MiniStat
              label="Final Options"
              value={
                finalUpgradeCount
              }
            />
          </div>

          {/* LEGEND */}

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" />

              Current Crysta
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-foreground/30" />

              Next Upgrade
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GitBranch className="size-3.5" />

              Multiple upgrade paths
            </div>
          </div>

          {/* FLOW */}

          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-muted/[0.025]">
            {upgradeTree ? (
              <div className="min-w-max px-8 py-10">
                <UpgradeFlow
                  root={
                    upgradeTree
                  }
                  navigate={
                    navigate
                  }
                />
              </div>
            ) : (
              <div className="p-5">
                <EmptyData
                  title="No upgrade path"
                  description="Belum ada hubungan upgrade untuk Crysta ini."
                />
              </div>
            )}
          </div>

          {/* HELP */}

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.025] px-4 py-3.5">
            <GitBranch className="mt-0.5 size-4 shrink-0 text-primary" />

            <p className="text-xs leading-5 text-muted-foreground">
              Alur dibaca dari kiri ke kanan. Jika satu Crysta mempunyai
              beberapa kemungkinan upgrade, garis akan bercabang menuju
              masing-masing pilihan. Node dengan label Final menandakan
              ujung dari jalur upgrade tersebut.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 04 ACQUISITION                                                    */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="04"
            title="Acquisition Sources"
            description="Sumber pemain mendapatkan Crysta."
          />

          <div className="mt-6">
            {crysta
              .acquisitionSources
              ?.length > 0 ? (
              <div className="space-y-3">
                {crysta.acquisitionSources.map(
                  (
                    source,
                    index,
                  ) => (
                    <SourceCard
                      key={
                        index
                      }
                      source={
                        source
                      }
                      navigate={
                        navigate
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyData
                title="No acquisition sources"
                description="Belum ada informasi source untuk Crysta ini."
              />
            )}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 05 PROCESS                                                        */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="05"
            title="Process & General Store"
            description="Informasi process material dan nilai jual Crysta."
          />

          <div className="mt-6 grid grid-cols-3 gap-5">
            <InfoBox
              icon={
                Sparkles
              }
              label="Process Material"
              value={formatLabel(
                crysta.process
                  ?.materialType,
              )}
            />

            <InfoBox
              icon={
                Package
              }
              label="Process Points"
              value={
                crysta.process
                  ?.points ??
                "—"
              }
            />

            <InfoBox
              icon={
                Store
              }
              label="Sell Price"
              value={
                crysta.sellPrice
                  ? `${formatNumber(
                      crysta.sellPrice,
                    )} Spina`
                  : "—"
              }
            />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 06 NOTES                                                          */}
      {/* ================================================================== */}

      <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        <div className="p-6">
          <SectionTitle
            number="06"
            title="Crysta Notes"
            description="Catatan tambahan mengenai data Crysta."
          />

          <div className="mt-6 rounded-xl border border-border bg-muted/[0.04] px-4 py-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {crysta.notes ||
                "No notes."}
            </p>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* UPGRADE FLOW                                                               */
/* -------------------------------------------------------------------------- */

function UpgradeFlow({
  root,
  navigate,
}) {
  return (
    <div className="flex items-center">
      <UpgradeNode
        node={
          root
        }
        navigate={
          navigate
        }
      />

      {root.upgrades?.length >
        0 && (
        <>
          <HorizontalConnector />

          <UpgradeBranches
            nodes={
              root.upgrades
            }
            navigate={
              navigate
            }
          />
        </>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* UPGRADE BRANCHES                                                           */
/* -------------------------------------------------------------------------- */

function UpgradeBranches({
  nodes,
  navigate,
}) {
  if (
    !nodes?.length
  ) {
    return null
  }

  /* ---------------------------------------------------------------------- */
  /* SINGLE PATH                                                            */
  /* ---------------------------------------------------------------------- */

  if (
    nodes.length === 1
  ) {
    const node =
      nodes[0]

    return (
      <div className="flex items-center">
        <UpgradeNode
          node={
            node
          }
          navigate={
            navigate
          }
        />

        {node.upgrades
          ?.length >
          0 && (
          <>
            <HorizontalConnector />

            <UpgradeBranches
              nodes={
                node.upgrades
              }
              navigate={
                navigate
              }
            />
          </>
        )}
      </div>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* MULTIPLE PATH                                                          */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="relative flex flex-col justify-center gap-8">
      {/* VERTICAL BRANCH LINE */}

      <div className="absolute bottom-[28px] left-0 top-[28px] w-px bg-border" />

      {nodes.map(
        (
          node,
          index,
        ) => (
          <div
            key={
              node.id
            }
            className="flex items-center"
          >
            {/* BRANCH CONNECTOR */}

            <div className="relative h-px w-11 shrink-0 bg-border">
              <span className="absolute -left-[3px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-border" />

              <span
                className={[
                  "absolute left-0 w-px bg-border",

                  index === 0
                    ? "top-1/2 h-[calc(50%+32px)]"
                    : index ===
                        nodes.length -
                          1
                      ? "bottom-1/2 h-[calc(50%+32px)]"
                      : "bottom-[-32px] top-[-32px]",
                ].join(
                  " ",
                )}
              />
            </div>

            {/* NODE */}

            <UpgradeNode
              node={
                node
              }
              navigate={
                navigate
              }
            />

            {/* NEXT */}

            {node.upgrades
              ?.length >
              0 && (
              <>
                <HorizontalConnector />

                <UpgradeBranches
                  nodes={
                    node.upgrades
                  }
                  navigate={
                    navigate
                  }
                />
              </>
            )}
          </div>
        ),
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* UPGRADE NODE                                                               */
/* -------------------------------------------------------------------------- */

function UpgradeNode({
  node,
  navigate,
}) {
  const hasNext =
    node.upgrades?.length >
    0

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/data/crystas/${node.id}`,
        )
      }
      className={[
        "group relative flex w-[230px] shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all",

        node.current
          ? "border-primary/35 bg-primary/[0.06] shadow-sm"
          : "border-border bg-background hover:border-primary/25 hover:bg-muted/30",
      ].join(" ")}
    >
      {/* ICON */}

      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-xl",

          node.current
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Gem className="size-4" />
      </div>

      {/* INFO */}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {node.name}
        </p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {node.current
            ? formatLabel(
                node.type,
              )
            : node.enhancerTargetType
              ? `${formatLabel(
                  node.enhancerTargetType,
                )} Enhancer`
              : formatLabel(
                  node.type,
                )}
        </p>
      </div>

      {/* CURRENT */}

      {node.current && (
        <span className="absolute -top-2.5 left-4 rounded-full border border-primary/15 bg-background px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm">
          Current
        </span>
      )}

      {/* FINAL */}

      {!hasNext &&
        !node.current && (
          <span className="absolute -bottom-2.5 right-3 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Final
          </span>
        )}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* HORIZONTAL CONNECTOR                                                       */
/* -------------------------------------------------------------------------- */

function HorizontalConnector() {
  return (
    <div className="relative h-px w-12 shrink-0 bg-border">
      {/* START DOT */}

      <span className="absolute -left-[3px] top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-border" />

      {/* ARROW */}

      <span className="absolute -right-[1px] top-1/2 size-2 -translate-y-1/2 rotate-45 border-r border-t border-border" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SOURCE CARD                                                                */
/* -------------------------------------------------------------------------- */

function SourceCard({
  source,
  navigate,
}) {
  if (
    source.type ===
    "MONSTER_DROP"
  ) {
    return (
      <div className="flex items-center justify-between gap-6 rounded-xl border border-border bg-muted/[0.025] px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Package className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Monster Drop
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/data/monsters/${source.monster?.id}/edit`,
                )
              }
              className="mt-1 cursor-pointer text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {source.monster
                ?.name ||
                "Unknown Monster"}
            </button>

            {source.monster
              ?.map && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />

                {
                  source.monster
                    .map.name
                }
              </div>
            )}
          </div>
        </div>

        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          {formatLabel(
            source.monster
              ?.type,
          )}
        </span>
      </div>
    )
  }

  if (
    source.type ===
    "EVENT_POINT_EXCHANGE"
  ) {
    return (
      <div className="rounded-xl border border-border bg-muted/[0.025] px-4 py-4">
        <p className="text-xs font-medium text-muted-foreground">
          Event Point Exchange
        </p>

        <p className="mt-1.5 text-sm font-semibold text-foreground">
          {source.eventName ||
            "Unknown Event"}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {source.requiredPoints ||
            "—"}{" "}
          {source.pointName ||
            "Points"}
        </p>
      </div>
    )
  }

  if (
    source.type ===
    "REWARD"
  ) {
    return (
      <div className="rounded-xl border border-border bg-muted/[0.025] px-4 py-4">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {formatLabel(
                source.rewardType,
              )}{" "}
              Reward
            </p>

            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {source.name ||
                "Unnamed Reward"}
            </p>

            {source.description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {
                  source.description
                }
              </p>
            )}
          </div>

          <span className="text-xs font-medium text-muted-foreground">
            ×
            {source.quantity ||
              1}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-muted/[0.025] px-4 py-4 text-sm text-muted-foreground">
      {formatLabel(
        source.type,
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* STAT ROW                                                                   */
/* -------------------------------------------------------------------------- */

function StatRow({
  stat,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-border bg-muted/[0.025] px-4 py-3.5">
      <span className="text-sm text-foreground">
        {stat}
      </span>

      <span className="text-sm font-semibold text-primary">
        {value}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INFO FIELD                                                                 */
/* -------------------------------------------------------------------------- */

function InfoField({
  label,
  value,
  children,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <div className="mt-2">
        {children || (
          <p className="text-sm font-medium text-foreground">
            {value ||
              "—"}
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INFO BOX                                                                   */
/* -------------------------------------------------------------------------- */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/[0.025] px-4 py-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-foreground">
          {value ||
            "—"}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MINI STAT                                                                  */
/* -------------------------------------------------------------------------- */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.025] px-4 py-4">
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1.5 truncate text-xl font-semibold tracking-[-0.03em] text-foreground">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DETAIL SECTION                                                             */
/* -------------------------------------------------------------------------- */

function DetailSection({
  title,
  description,
  children,
}) {
  return (
    <div className="mt-7 border-t border-border pt-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </div>
  )
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
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY DATA                                                                 */
/* -------------------------------------------------------------------------- */

function EmptyData({
  title,
  description,
}) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.02] px-6 text-center">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Gem className="size-4" />
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        {title}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
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
      {formatLabel(
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
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-current" />

        Published
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-semibold text-muted-foreground">
      <span className="size-1.5 rounded-full bg-current" />

      Draft
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* TREE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function countTreeChildren(
  node,
) {
  if (
    !node?.upgrades?.length
  ) {
    return 0
  }

  return node.upgrades.reduce(
    (
      total,
      child,
    ) =>
      total +
      1 +
      countTreeChildren(
        child,
      ),

    0,
  )
}

function getTreeDepth(
  node,
) {
  if (
    !node?.upgrades?.length
  ) {
    return 0
  }

  return (
    1 +
    Math.max(
      ...node.upgrades.map(
        (child) =>
          getTreeDepth(
            child,
          ),
      ),
    )
  )
}

function countFinalNodes(
  node,
) {
  if (
    !node?.upgrades?.length
  ) {
    return 1
  }

  return node.upgrades.reduce(
    (
      total,
      child,
    ) =>
      total +
      countFinalNodes(
        child,
      ),

    0,
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT DATE                                                                */
/* -------------------------------------------------------------------------- */

function formatDateTime(
  value,
) {
  if (!value) {
    return "—"
  }

  const date =
    new Date(
      value,
    )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      hour12:
        false,
    },
  ).format(
    date,
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
/* FORMAT NUMBER                                                              */
/* -------------------------------------------------------------------------- */

function formatNumber(
  value,
) {
  const number =
    Number(value)

  if (
    Number.isNaN(
      number,
    )
  ) {
    return value
  }

  return new Intl.NumberFormat(
    "id-ID",
  ).format(
    number,
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

    BOSS:
      "Boss",

    MINI_BOSS:
      "Mini Boss",

    PERMANENT:
      "Permanent",

    EVENT_LIMITED:
      "Event Limited",

    SEASONAL:
      "Seasonal",

    MAIN_WEAPON_ONLY:
      "Main Weapon Only",

    SUB_WEAPON_ONLY:
      "Sub Weapon Only",

    SHIELD_ONLY:
      "Shield Only",

    HEAVY_ARMOR_ONLY:
      "Heavy Armor Only",

    LIGHT_ARMOR_ONLY:
      "Light Armor Only",
  }

  return (
    labels[value] ||
    String(value)
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
  )
}

/* -------------------------------------------------------------------------- */
/* LOADING                                                                    */
/* -------------------------------------------------------------------------- */

function CrystaDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-36 rounded bg-muted" />

        <div className="mt-6 flex items-center justify-between gap-10">
          <div>
            <div className="h-9 w-72 rounded bg-muted" />

            <div className="mt-3 h-4 w-[440px] rounded bg-muted" />
          </div>

          <div className="h-10 w-32 rounded-lg bg-muted" />
        </div>

        <div className="mt-6 h-4 w-[400px] rounded bg-muted" />

        <div className="mt-8 h-[320px] rounded-2xl border border-border bg-muted/[0.1]" />

        <div className="mt-5 h-[460px] rounded-2xl border border-border bg-muted/[0.1]" />

        <div className="mt-5 h-[420px] rounded-2xl border border-border bg-muted/[0.1]" />
      </div>
    </div>
  )
}
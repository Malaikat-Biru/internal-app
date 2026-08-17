import {
  ArrowLeft,
  Coins,
  Edit3,
  Package,
  ScrollText,
  Swords,
  UserRound,
} from "lucide-react"

import { useMemo } from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* NPC                                                                        */
/* -------------------------------------------------------------------------- */

const npcOptions = [
  {
    id: "NPC-001",
    name: "Lefina",
  },
  {
    id: "NPC-005",
    name: "Forf",
  },
  {
    id: "NPC-006",
    name: "Yunis",
  },
  {
    id: "NPC-009",
    name: "Zaldo",
  },
  {
    id: "NPC-011",
    name: "Ravagne",
  },
  {
    id: "NPC-012",
    name: "Talia",
  },
]

/* -------------------------------------------------------------------------- */
/* ITEMS                                                                      */
/* -------------------------------------------------------------------------- */

const itemOptions = [
  {
    id: "ITEM-001",
    name: "Revita I",
    category: "Usable",
  },
  {
    id: "ITEM-002",
    name: "Revita II",
    category: "Usable",
  },
  {
    id: "ITEM-003",
    name: "Nightmare Crystal",
    category: "Material",
  },
  {
    id: "ITEM-004",
    name: "Iron",
    category: "Material",
  },
  {
    id: "ITEM-005",
    name: "Damascus Ore",
    category: "Material",
  },
]

/* -------------------------------------------------------------------------- */
/* MONSTERS                                                                   */
/* -------------------------------------------------------------------------- */

const monsterOptions = [
  {
    id: "MONSTER-001",
    name: "Goblin",
    type: "Normal",
  },
  {
    id: "MONSTER-002",
    name: "Colon",
    type: "Normal",
  },
  {
    id: "MONSTER-003",
    name: "Shell Mask",
    type: "Normal",
  },
  {
    id: "MONSTER-004",
    name: "Minotaur",
    type: "Boss",
  },
  {
    id: "MONSTER-005",
    name: "Forest Wolf",
    type: "Boss",
  },
]

/* -------------------------------------------------------------------------- */
/* SIDE QUESTS                                                                */
/* -------------------------------------------------------------------------- */

const sideQuestRecords = [
  {
    id: "QUEST-001",

    name: "Proof of Courage?",
    slug: "proof-of-courage",

    requiredLevel: 25,

    npcId: "NPC-001",

    repeatable: true,

    objectives: [
      {
        id: "OBJECTIVE-001",

        type: "TALK_NPC",

        npcId: "NPC-001",
      },
      {
        id: "OBJECTIVE-002",

        type: "COLLECT_ITEM",

        itemId: "ITEM-003",

        quantity: 10,
      },
      {
        id: "OBJECTIVE-003",

        type: "DEFEAT_MONSTER",

        monsterId: "MONSTER-004",

        quantity: 3,
      },
      {
        id: "OBJECTIVE-004",

        type: "OTHER",

        description:
          "Return to Lefina after completing the objectives.",
      },
    ],

    rewards: {
      exp: 10000,
      spina: 1000,

      items: [
        {
          id: "REWARD-001",

          itemId: "ITEM-001",

          quantity: 3,
        },
      ],
    },

    notes:
      "Side quest yang diberikan oleh Lefina. Pemain perlu menyelesaikan seluruh objective sebelum mendapatkan reward.",

    status: "PUBLISHED",

    createdAt: "2026-07-20 14:24",
    updatedAt: "2026-08-09 18:42",
  },

  {
    id: "QUEST-002",

    name: "Timber Shortage",
    slug: "timber-shortage",

    requiredLevel: 15,

    npcId: null,

    repeatable: false,

    objectives: [
      {
        id: "OBJECTIVE-005",

        type: "COLLECT_ITEM",

        itemId: "ITEM-004",

        quantity: 20,
      },
    ],

    rewards: {
      exp: 5000,
      spina: null,
      items: [],
    },

    notes: "",

    status: "DRAFT",

    createdAt: "2026-07-21 10:20",
    updatedAt: "2026-08-08 16:10",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function SideQuestDetailPage() {
  const navigate = useNavigate()

  const { id } = useParams()

  const quest = useMemo(() => {
    return (
      sideQuestRecords.find(
        (record) =>
          record.id === id,
      ) || sideQuestRecords[0]
    )
  }, [id])

  const questGiver = useMemo(() => {
    if (!quest.npcId) {
      return null
    }

    return (
      npcOptions.find(
        (npc) =>
          npc.id ===
          quest.npcId,
      ) || null
    )
  }, [quest])

  const rewardItems = useMemo(() => {
    return (
      quest.rewards?.items ||
      []
    )
      .map((reward) => {
        const item =
          itemOptions.find(
            (item) =>
              item.id ===
              reward.itemId,
          )

        if (!item) {
          return null
        }

        return {
          ...item,

          quantity:
            reward.quantity,
        }
      })
      .filter(Boolean)
  }, [quest])

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      {/* ================================================================== */}
      {/* BACK                                                               */}
      {/* ================================================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/data/worlds/side-quests",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Side Quests
      </button>

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header className="mt-5 flex items-end justify-between gap-8">
        <div className="min-w-0">
          {/* BREADCRUMB */}

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
              Side Quests
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="truncate text-primary">
              {quest.name}
            </span>
          </div>

          {/* TITLE */}

          <div className="mt-2 flex items-center gap-3">
            <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              {quest.name}
            </h1>

            <StatusBadge
              status={
                quest.status
              }
            />
          </div>

          <p className="mt-2 max-w-[780px] text-sm leading-6 text-muted-foreground">
            Informasi utama side quest, NPC pemberi quest, objective yang
            harus diselesaikan, serta reward yang diterima pemain.
          </p>

          {/* META */}

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Created{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  quest.createdAt,
                )}
              </span>
            </span>

            <span className="size-1 rounded-full bg-border" />

            <span>
              Last updated{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  quest.updatedAt,
                )}
              </span>
            </span>
          </div>
        </div>

        {/* EDIT */}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(
              `/data/worlds/side-quests/${quest.id}/edit`,
            )
          }
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Edit3 className="size-4" />

          Edit Side Quest
        </Button>
      </header>

      {/* ================================================================== */}
      {/* LARGE CARD                                                         */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 INFORMATION                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="Side Quest Information"
            description="Informasi utama side quest."
          />

          <div className="mt-6 border-t border-border">
            <InformationRow
              label="Side Quest"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {quest.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  /{quest.slug}
                </p>
              </div>
            </InformationRow>

            <InformationRow
              label="Required Level"
            >
              <span className="text-sm font-medium text-foreground">
                Lv.{" "}
                {
                  quest.requiredLevel
                }
              </span>
            </InformationRow>

            <InformationRow
              label="Repeatable"
            >
              <RepeatableBadge
                repeatable={
                  quest.repeatable
                }
              />
            </InformationRow>

            <InformationRow
              label="NPC"
              last
            >
              {questGiver ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/data/worlds/npcs/${questGiver.id}`,
                    )
                  }
                  className="group flex cursor-pointer items-center gap-2"
                >
                  <UserRound className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />

                  <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    {
                      questGiver.name
                    }
                  </span>
                </button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  No NPC assigned
                </span>
              )}
            </InformationRow>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 OBJECTIVES                                                    */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <div className="flex items-start justify-between gap-8">
            <SectionTitle
              number="02"
              title="Objectives"
              description="Objective yang harus diselesaikan pemain."
            />

            <CountBadge
              value={
                quest.objectives.length
              }
              label={
                quest.objectives.length ===
                1
                  ? "Objective"
                  : "Objectives"
              }
            />
          </div>

          {quest.objectives.length >
          0 ? (
            <div className="mt-6 border-y border-border">
              {quest.objectives.map(
                (
                  objective,
                  index,
                ) => (
                  <ObjectiveViewRow
                    key={
                      objective.id
                    }
                    index={
                      index
                    }
                    objective={
                      objective
                    }
                    navigate={
                      navigate
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <EmptyContent
              icon={
                ScrollText
              }
              text="No objectives."
            />
          )}
        </div>

        {/* ================================================================= */}
        {/* 03 REWARDS                                                       */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="Rewards"
            description="Reward yang diterima setelah side quest selesai."
          />

          {/* EXP + SPINA */}

          <div className="mt-6 grid grid-cols-2 border-y border-border">
            <div className="border-r border-border px-4 py-4">
              <p className="text-xs font-medium text-muted-foreground">
                EXP
              </p>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {quest.rewards
                  ?.exp != null
                  ? formatNumber(
                      quest.rewards
                        .exp,
                    )
                  : "—"}
              </p>
            </div>

            <div className="px-4 py-4">
              <p className="text-xs font-medium text-muted-foreground">
                Spina
              </p>

              <div className="mt-2 flex items-center gap-2">
                {quest.rewards
                  ?.spina !=
                  null && (
                  <Coins className="size-4 text-muted-foreground" />
                )}

                <p className="text-sm font-semibold text-foreground">
                  {quest.rewards
                    ?.spina !=
                  null
                    ? `${formatNumber(
                        quest.rewards
                          .spina,
                      )} Spina`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ITEM REWARDS */}

          {rewardItems.length >
            0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-6">
                <p className="text-sm font-medium text-foreground">
                  Reward Items
                </p>

                <CountBadge
                  value={
                    rewardItems.length
                  }
                  label={
                    rewardItems.length ===
                    1
                      ? "Item"
                      : "Items"
                  }
                />
              </div>

              <div className="mt-4 border-y border-border">
                <div className="grid grid-cols-[minmax(0,1fr)_160px] bg-muted/15 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Item
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    Quantity
                  </span>
                </div>

                {rewardItems.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="grid grid-cols-[minmax(0,1fr)_160px] items-center border-t border-border px-4 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Package className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {
                              item.name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {
                              item.category
                            }
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-medium text-foreground">
                        ×{" "}
                        {
                          item.quantity
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 04 NOTES                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="04"
            title="Notes"
            description="Catatan tambahan side quest."
          />

          <div className="mt-6 pl-[46px]">
            {quest.notes ? (
              <p className="max-w-[900px] whitespace-pre-wrap text-sm leading-7 text-foreground">
                {quest.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No notes.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* OBJECTIVE                                                                  */
/* -------------------------------------------------------------------------- */

function ObjectiveViewRow({
  objective,
  index,
  navigate,
}) {
  const content =
    getObjectiveContent(
      objective,
    )

  const Icon =
    getObjectiveIcon(
      objective.type,
    )

  return (
    <div className="grid grid-cols-[54px_180px_minmax(0,1fr)_140px] items-center border-b border-border px-4 py-4 last:border-b-0">
      {/* NUMBER */}

      <span className="text-xs font-medium text-muted-foreground">
        {String(
          index + 1,
        ).padStart(
          2,
          "0",
        )}
      </span>

      {/* TYPE */}

      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <span className="text-xs font-medium text-muted-foreground">
          {formatObjectiveType(
            objective.type,
          )}
        </span>
      </div>

      {/* CONTENT */}

      <div className="min-w-0">
        {objective.type ===
          "TALK_NPC" &&
        content.entity ? (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/data/worlds/npcs/${content.entity.id}`,
              )
            }
            className="cursor-pointer text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {
              content.entity
                .name
            }
          </button>
        ) : (
          <p className="truncate text-sm font-medium text-foreground">
            {
              content.label
            }
          </p>
        )}
      </div>

      {/* QUANTITY */}

      <div>
        {content.quantity !=
        null ? (
          <span className="text-sm font-medium text-foreground">
            ×{" "}
            {
              content.quantity
            }
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">
            —
          </span>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INFORMATION ROW                                                            */
/* -------------------------------------------------------------------------- */

function InformationRow({
  label,
  children,
  last = false,
}) {
  return (
    <div
      className={[
        "grid grid-cols-[180px_minmax(0,1fr)] items-center gap-5 py-4",

        !last
          ? "border-b border-border"
          : "",
      ].join(" ")}
    >
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <div className="min-w-0">
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
/* REPEATABLE BADGE                                                           */
/* -------------------------------------------------------------------------- */

function RepeatableBadge({
  repeatable,
}) {
  return (
    <span
      className={[
        "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium",

        repeatable
          ? "bg-primary/[0.08] text-primary"
          : "bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {repeatable
        ? "Repeatable"
        : "Not Repeatable"}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* COUNT                                                                      */
/* -------------------------------------------------------------------------- */

function CountBadge({
  value,
  label,
}) {
  return (
    <span className="shrink-0 rounded-full border border-border bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground">
      {value} {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyContent({
  icon: Icon,
  text,
}) {
  return (
    <div className="mt-6 flex min-h-[100px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />

        {text}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* OBJECTIVE HELPERS                                                          */
/* -------------------------------------------------------------------------- */

function getObjectiveContent(
  objective,
) {
  if (
    objective.type ===
    "COLLECT_ITEM"
  ) {
    const item =
      itemOptions.find(
        (item) =>
          item.id ===
          objective.itemId,
      )

    return {
      label:
        item?.name ||
        "Unknown Item",

      entity:
        item,

      quantity:
        objective.quantity,
    }
  }

  if (
    objective.type ===
    "DEFEAT_MONSTER"
  ) {
    const monster =
      monsterOptions.find(
        (monster) =>
          monster.id ===
          objective.monsterId,
      )

    return {
      label:
        monster?.name ||
        "Unknown Monster",

      entity:
        monster,

      quantity:
        objective.quantity,
    }
  }

  if (
    objective.type ===
    "TALK_NPC"
  ) {
    const npc =
      npcOptions.find(
        (npc) =>
          npc.id ===
          objective.npcId,
      )

    return {
      label:
        npc?.name ||
        "Unknown NPC",

      entity:
        npc,

      quantity: null,
    }
  }

  return {
    label:
      objective.description ||
      "—",

    entity: null,

    quantity: null,
  }
}

function getObjectiveIcon(
  type,
) {
  if (
    type ===
    "COLLECT_ITEM"
  ) {
    return Package
  }

  if (
    type ===
    "DEFEAT_MONSTER"
  ) {
    return Swords
  }

  if (
    type ===
    "TALK_NPC"
  ) {
    return UserRound
  }

  return ScrollText
}

function formatObjectiveType(
  type,
) {
  const labels = {
    COLLECT_ITEM:
      "Collect Item",

    DEFEAT_MONSTER:
      "Defeat Monster",

    TALK_NPC:
      "Talk to NPC",

    OTHER:
      "Other",
  }

  return (
    labels[type] ||
    "Other"
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatNumber(
  value,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value)
}

function formatDateTime(
  value,
) {
  if (!value) {
    return "—"
  }

  const date =
    new Date(
      value.replace(
        " ",
        "T",
      ),
    )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
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
    },
  ).format(date)
}
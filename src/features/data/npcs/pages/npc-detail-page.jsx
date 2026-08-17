import {
  ArrowLeft,
  Coins,
  Edit3,
  Hammer,
  ImageIcon,
  MapPinned,
  Package,
  ScrollText,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react"

import { useMemo } from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* QUESTS                                                                     */
/* -------------------------------------------------------------------------- */

const quests = [
  {
    id: "QUEST-001",
    name: "Proof of Courage?",
    level: 25,
  },
  {
    id: "QUEST-002",
    name: "Timber Shortage",
    level: 15,
  },
  {
    id: "QUEST-003",
    name: "The Overlooked Snack",
    level: 10,
  },
  {
    id: "QUEST-004",
    name: "Nightmare Crystal",
    level: 50,
  },
  {
    id: "QUEST-005",
    name: "Pride of the Rich",
    level: 40,
  },
  {
    id: "QUEST-006",
    name: "A Drinking Pal at the Fortress",
    level: 30,
  },
]

/* -------------------------------------------------------------------------- */
/* ITEMS                                                                      */
/* -------------------------------------------------------------------------- */

const items = [
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
    name: "Vita Plus I",
    category: "Usable",
  },
  {
    id: "ITEM-004",
    name: "Magic Hammer",
    category: "Support",
  },
  {
    id: "ITEM-005",
    name: "Teleport Ticket",
    category: "Usable",
  },
  {
    id: "ITEM-006",
    name: "Iron",
    category: "Material",
  },
  {
    id: "ITEM-007",
    name: "Damascus Ore",
    category: "Material",
  },
]

/* -------------------------------------------------------------------------- */
/* SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

const synthesistServices = [
  {
    id: "ITEM_SYNTHESIS",
    name: "Item Synthesis",
  },
  {
    id: "EQUIPMENT_SYNTHESIS",
    name: "Equipment Synthesis",
  },
  {
    id: "APPEARANCE_LOCK",
    name: "Appearance Lock",
  },
  {
    id: "COLOR_SYNTHESIS",
    name: "Color Synthesis",
  },
]

const blacksmithServices = [
  {
    id: "REFINE_EQUIPMENT",
    name: "Refine Equipment",
  },
  {
    id: "CREATE_EQUIPMENT",
    name: "Create Equipment",
  },
  {
    id: "MODIFY_EQUIPMENT",
    name: "Modify Equipment",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK NPC                                                                   */
/* -------------------------------------------------------------------------- */

const npcRecords = [
  {
    id: "NPC-001",

    name: "Lefina",
    slug: "lefina",
    type: "QUEST",

    image:
      "https://placehold.co/900x1200?text=Lefina",

    imageRatio: "3:4",

    map: {
      id: "MAP-001",
      name: "Sofya City",

      world: {
        id: "WORLD-001",
        name: "Toram World",
      },
    },

    quests: [
      "QUEST-001",
      "QUEST-002",
      "QUEST-004",
    ],

    merchantItems: [],

    notes:
      "NPC yang berada di Sofya City dan memberikan berbagai side quest kepada pemain.",

    status: "PUBLISHED",

    createdAt: "2026-07-20 14:24",
    updatedAt: "2026-08-08 18:42",
  },

  {
    id: "NPC-002",

    name: "Sololo",
    slug: "sololo",
    type: "MERCHANT",

    image:
      "https://placehold.co/900x1200?text=Sololo",

    imageRatio: "3:4",

    map: {
      id: "MAP-001",
      name: "Sofya City",

      world: {
        id: "WORLD-001",
        name: "Toram World",
      },
    },

    quests: [],

    merchantItems: [
      {
        itemId: "ITEM-001",
        price: 100,
      },
      {
        itemId: "ITEM-002",
        price: 300,
      },
      {
        itemId: "ITEM-005",
        price: 1000,
      },
    ],

    notes:
      "Merchant yang menyediakan berbagai consumable dan kebutuhan dasar pemain.",

    status: "PUBLISHED",

    createdAt: "2026-07-21 10:20",
    updatedAt: "2026-08-07 16:10",
  },

  {
    id: "NPC-003",

    name: "Zono",
    slug: "zono",
    type: "BLACKSMITH",

    image:
      "https://placehold.co/900x1200?text=Zono",

    imageRatio: "3:4",

    map: {
      id: "MAP-001",
      name: "Sofya City",

      world: {
        id: "WORLD-001",
        name: "Toram World",
      },
    },

    quests: [],
    merchantItems: [],

    notes:
      "Blacksmith yang menyediakan berbagai layanan terkait equipment.",

    status: "PUBLISHED",

    createdAt: "2026-07-22 08:40",
    updatedAt: "2026-08-05 13:52",
  },

  {
    id: "NPC-008",

    name: "Synthesist Mubia",
    slug: "synthesist-mubia",
    type: "SYNTHESIST",

    image:
      "https://placehold.co/900x1200?text=Synthesist+Mubia",

    imageRatio: "3:4",

    map: {
      id: "MAP-001",
      name: "Sofya City",

      world: {
        id: "WORLD-001",
        name: "Toram World",
      },
    },

    quests: [],
    merchantItems: [],

    notes:
      "NPC Synthesist yang menyediakan berbagai layanan synthesis.",

    status: "PUBLISHED",

    createdAt: "2026-07-24 11:12",
    updatedAt: "2026-08-06 19:22",
  },

  {
    id: "NPC-015",

    name: "Unknown Traveler",
    slug: "unknown-traveler",
    type: "GENERAL",

    image: null,

    imageRatio: "3:4",

    map: null,

    quests: [],
    merchantItems: [],

    notes:
      "NPC ini belum terikat pada lokasi map tertentu.",

    status: "DRAFT",

    createdAt: "2026-08-08 12:30",
    updatedAt: "2026-08-08 12:30",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function NpcDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const npc = useMemo(() => {
    return (
      npcRecords.find(
        (record) =>
          record.id === id,
      ) || npcRecords[0]
    )
  }, [id])

  const npcQuests = useMemo(() => {
    if (
      npc.type !== "QUEST"
    ) {
      return []
    }

    return (
      npc.quests || []
    )
      .map((questId) =>
        quests.find(
          (quest) =>
            quest.id === questId,
        ),
      )
      .filter(Boolean)
  }, [npc])

  const npcMerchantItems = useMemo(() => {
    if (
      npc.type !== "MERCHANT"
    ) {
      return []
    }

    return (
      npc.merchantItems || []
    )
      .map((entry) => {
        const item =
          items.find(
            (item) =>
              item.id ===
              entry.itemId,
          )

        if (!item) {
          return null
        }

        return {
          ...item,
          price: entry.price,
        }
      })
      .filter(Boolean)
  }, [npc])

  const hasTypeContent = [
    "QUEST",
    "MERCHANT",
    "SYNTHESIST",
    "BLACKSMITH",
  ].includes(npc.type)

  const notesNumber =
    hasTypeContent
      ? "03"
      : "02"

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      {/* BACK */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/data/worlds/npcs",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to NPCs
      </button>

      {/* HEADER */}

      <header className="mt-5 flex items-end justify-between gap-8">
        <div className="min-w-0">
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
              NPCs
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="truncate text-primary">
              {npc.name}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              {npc.name}
            </h1>

            <StatusBadge
              status={
                npc.status
              }
            />
          </div>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Informasi utama NPC, lokasi tempat NPC berada, serta data yang terhubung
            seperti quest, item yang dijual, atau layanan yang tersedia sesuai tipe NPC.
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Created{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  npc.createdAt,
                )}
              </span>
            </span>

            <span className="size-1 rounded-full bg-border" />

            <span>
              Last updated{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  npc.updatedAt,
                )}
              </span>
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(
              `/data/worlds/npcs/${npc.id}/edit`,
            )
          }
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Edit3 className="size-4" />

          Edit NPC
        </Button>
      </header>

      {/* CARD */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        {/* 01 INFORMATION */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="NPC Information"
            description="Informasi utama dan lokasi NPC."
          />

          <div className="mt-6 grid grid-cols-[240px_minmax(0,1fr)] items-start gap-8">
            {/* IMAGE */}

            <NpcImage npc={npc} />

            {/* DETAIL */}

            <div className="min-w-0">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                    {npc.name}
                  </h2>

                  <NpcTypeBadge
                    type={
                      npc.type
                    }
                  />
                </div>

                <p className="mt-1.5 text-sm text-muted-foreground">
                  /{npc.slug}
                </p>
              </div>

              <div className="mt-6 border-t border-border">
                <InformationRow
                  label="NPC Type"
                >
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4 text-muted-foreground" />

                    <span className="text-sm font-medium text-foreground">
                      {formatNpcType(
                        npc.type,
                      )}
                    </span>
                  </div>
                </InformationRow>

                <InformationRow
                  label="Map"
                >
                  {npc.map ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/data/worlds/maps/${npc.map.id}`,
                        )
                      }
                      className="group flex cursor-pointer items-center gap-2"
                    >
                      <MapPinned className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />

                      <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {
                          npc.map.name
                        }
                      </span>
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No map assigned
                    </span>
                  )}
                </InformationRow>

                <InformationRow
                  label="World"
                >
                  <span
                    className={[
                      "text-sm",

                      npc.map?.world
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {npc.map?.world
                      ?.name ||
                      "No world"}
                  </span>
                </InformationRow>

                <InformationRow
                  label="Location"
                  last
                >
                  <span className="text-sm text-muted-foreground">
                    {npc.map
                      ? `${npc.map.name}, ${npc.map.world.name}`
                      : "Standalone NPC"}
                  </span>
                </InformationRow>
              </div>
            </div>
          </div>
        </div>

        {/* 02 DYNAMIC CONTENT */}

        <NpcTypeSection
          npc={
            npc
          }
          quests={
            npcQuests
          }
          merchantItems={
            npcMerchantItems
          }
        />

        {/* NOTES */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number={
              notesNumber
            }
            title="NPC Notes"
            description="Catatan tambahan NPC."
          />

          <div className="mt-6 pl-[46px]">
            {npc.notes ? (
              <p className="max-w-[900px] whitespace-pre-wrap text-sm leading-7 text-foreground">
                {npc.notes}
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
/* TYPE SECTION                                                               */
/* -------------------------------------------------------------------------- */

function NpcTypeSection({
  npc,
  quests,
  merchantItems,
}) {
  if (
    npc.type === "QUEST"
  ) {
    return (
      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-8">
          <SectionTitle
            number="02"
            title="NPC Quests"
            description="Quest dari NPC ini."
          />

          <CountBadge
            value={
              quests.length
            }
            label="Quests"
          />
        </div>

        {quests.length >
        0 ? (
          <div className="mt-6">
            <div className="grid grid-cols-[48px_minmax(0,1fr)_160px] items-center border-y border-border bg-muted/15 px-4 py-3">
              <span />

              <span className="text-xs font-medium text-muted-foreground">
                Quest
              </span>

              <span className="text-xs font-medium text-muted-foreground">
                Required Level
              </span>
            </div>

            {quests.map(
              (
                quest,
                index,
              ) => (
                <div
                  key={
                    quest.id
                  }
                  className="grid grid-cols-[48px_minmax(0,1fr)_160px] items-center border-b border-border px-4 py-4"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ScrollText className="size-4" />
                    </div>

                    <p className="truncate text-sm font-medium text-foreground">
                      {
                        quest.name
                      }
                    </p>
                  </div>

                  <p className="text-sm font-medium text-foreground">
                    Lv.{" "}
                    {
                      quest.level
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <EmptyContent
            icon={
              ScrollText
            }
            text="No quests."
          />
        )}
      </div>
    )
  }

  if (
    npc.type === "MERCHANT"
  ) {
    return (
      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-8">
          <SectionTitle
            number="02"
            title="Merchant Inventory"
            description="Item yang dijual NPC."
          />

          <CountBadge
            value={
              merchantItems.length
            }
            label="Items"
          />
        </div>

        {merchantItems.length >
        0 ? (
          <div className="mt-6">
            <div className="grid grid-cols-[minmax(0,1fr)_200px] items-center border-y border-border bg-muted/15 px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                Item
              </span>

              <span className="text-xs font-medium text-muted-foreground">
                Price
              </span>
            </div>

            {merchantItems.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="grid grid-cols-[minmax(0,1fr)_200px] items-center border-b border-border px-4 py-4"
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

                  <div className="flex items-center gap-2">
                    <Coins className="size-4 text-muted-foreground" />

                    <span className="text-sm font-medium text-foreground">
                      {item.price != null
                        ? `${formatNumber(
                            item.price,
                          )} Spina`
                        : "—"}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <EmptyContent
            icon={
              ShoppingBag
            }
            text="No items."
          />
        )}
      </div>
    )
  }

  if (
    npc.type === "SYNTHESIST"
  ) {
    return (
      <ServicesSection
        title="Synthesist Services"
        services={
          synthesistServices
        }
        icon={
          Sparkles
        }
      />
    )
  }

  if (
    npc.type === "BLACKSMITH"
  ) {
    return (
      <ServicesSection
        title="Blacksmith Services"
        services={
          blacksmithServices
        }
        icon={
          Hammer
        }
      />
    )
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

function ServicesSection({
  title,
  services,
  icon: Icon,
}) {
  return (
    <div className="border-t border-border p-6">
      <div className="flex items-start justify-between gap-8">
        <SectionTitle
          number="02"
          title={
            title
          }
          description="Layanan NPC."
        />

        <CountBadge
          value={
            services.length
          }
          label="Services"
        />
      </div>

      <div className="mt-6 border-y border-border">
        {services.map(
          (
            service,
            index,
          ) => (
            <div
              key={
                service.id
              }
              className="grid grid-cols-[48px_42px_minmax(0,1fr)] items-center border-b border-border px-4 py-4 last:border-b-0"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {String(
                  index + 1,
                ).padStart(
                  2,
                  "0",
                )}
              </span>

              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                <Icon className="size-4" />
              </div>

              <p className="pl-3 text-sm font-medium text-foreground">
                {
                  service.name
                }
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NPC IMAGE                                                                  */
/* -------------------------------------------------------------------------- */

function NpcImage({
  npc,
}) {
  if (!npc.image) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/15">
        <div className="text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-background text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>

          <p className="mt-3 text-sm font-medium text-foreground">
            No image
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-muted">
      <img
        src={
          npc.image
        }
        alt={
          npc.name
        }
        className="h-full w-full object-cover"
      />
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
        "grid grid-cols-[150px_minmax(0,1fr)] items-center gap-5 py-4",

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

        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* COUNT BADGE                                                                */
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
/* TYPE BADGE                                                                 */
/* -------------------------------------------------------------------------- */

function NpcTypeBadge({
  type,
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/20 px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <UserRound className="size-3" />

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
  const published =
    status === "PUBLISHED"

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",

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
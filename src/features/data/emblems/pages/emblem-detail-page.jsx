import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Gift,
  Package,
  Target,
} from "lucide-react"

import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* MOCK ITEMS                                                                 */
/* -------------------------------------------------------------------------- */

const itemOptions = [
  {
    id: "ITEM-001",
    name: "Teleport Ticket",
    category: "Consumable",
  },
  {
    id: "ITEM-002",
    name: "Revita IV",
    category: "Consumable",
  },
  {
    id: "ITEM-003",
    name: "Life Potion",
    category: "Consumable",
  },
  {
    id: "ITEM-004",
    name: "Mana Potion",
    category: "Consumable",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const emblemRecords = [
  {
    id: "EMBLEM-001",
    name: "Haven't Played Enough!",
    slug: "havent-played-enough",

    description:
      "Emblem harian yang diperoleh setelah bermain selama 30 menit dalam satu hari.",

    category: "PLAY_TIME",
    frequency: "DAILY",

    condition: {
      type: "PLAY_TIME",
      durationMinutes: 30,
    },

    reward: {
      type: "EXP_BONUS",
      value: 10,
      unit: "PERCENT",
    },

    eventPeriod: null,

    notes:
      "Reset mengikuti waktu reset emblem harian.",

    status: "PUBLISHED",

    createdAt: "2026-07-20 14:24",
    updatedAt: "2026-08-10 18:42",
  },

  {
    id: "EMBLEM-003",
    name: "Tune Up",
    slug: "tune-up",

    description:
      "Emblem harian yang memberikan bonus EXP setelah mengalahkan sejumlah monster yang memenuhi batas perbedaan level.",

    category: "BATTLE",
    frequency: "DAILY",

    condition: {
      type: "DEFEAT_MONSTER",
      quantity: 30,
      levelDifference: 30,
    },

    reward: {
      type: "EXP_BONUS",
      value: 10,
      unit: "PERCENT",
    },

    eventPeriod: null,

    notes: "",

    status: "PUBLISHED",

    createdAt: "2026-07-21 09:12",
    updatedAt: "2026-08-08 16:30",
  },

  {
    id: "EMBLEM-007",
    name: "Known Adventurer",
    slug: "known-adventurer",

    description:
      "Emblem perkembangan karakter yang diperoleh setelah mencapai level tertentu.",

    category: "CHARACTER",
    frequency: "ONE_TIME",

    condition: {
      type: "REACH_LEVEL",
      value: 185,
    },

    reward: {
      type: "STAT_POINT",
      value: 5,
    },

    eventPeriod: null,

    notes: "",

    status: "PUBLISHED",

    createdAt: "2026-07-24 11:45",
    updatedAt: "2026-08-06 13:15",
  },

  {
    id: "EMBLEM-009",
    name: "Production Beginner",
    slug: "production-beginner",

    description:
      "Emblem yang berkaitan dengan aktivitas produksi dan crafting.",

    category: "PRODUCTION",
    frequency: "ONE_TIME",

    condition: {
      type: "CRAFT_ITEM",
      quantity: 10,
    },

    reward: {
      type: "SKILL_POINT",
      value: 1,
    },

    eventPeriod: null,

    notes:
      "Data condition masih perlu diverifikasi.",

    status: "DRAFT",

    createdAt: "2026-08-02 10:20",
    updatedAt: "2026-08-09 15:48",
  },

  {
    id: "EMBLEM-011",
    name: "Anniversary Challenge",
    slug: "anniversary-challenge",

    description:
      "Emblem khusus yang tersedia selama periode Anniversary Event.",

    category: "EVENT",
    frequency: "EVENT",

    condition: {
      type: "DEFEAT_MONSTER",
      quantity: 100,
      levelDifference: null,
    },

    reward: {
      type: "ITEM",
      itemId: "ITEM-001",
      quantity: 10,
    },

    eventPeriod: {
      startAt: "2026-07-09T05:00",
      endAt: "2026-09-10T05:00",
    },

    notes:
      "Pastikan periode event diperbarui sesuai informasi event.",

    status: "PUBLISHED",

    createdAt: "2026-07-09 08:30",
    updatedAt: "2026-08-10 17:12",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EmblemDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const emblem = useMemo(() => {
    return (
      emblemRecords.find(
        (record) => record.id === id,
      ) || emblemRecords[0]
    )
  }, [id])

  const hasEventPeriod =
    emblem.frequency === "EVENT" &&
    Boolean(emblem.eventPeriod)

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      {/* ================================================================== */}
      {/* BACK                                                               */}
      {/* ================================================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(
            "/data/character-system/emblems",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Emblems
      </button>

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header className="mt-5">
        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-muted-foreground">
            Data
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-muted-foreground">
            Character System
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-muted-foreground">
            Emblems
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="truncate text-primary">
            {emblem.name}
          </span>
        </div>

        {/* HEADER CONTENT */}

        <div className="mt-3 flex items-start justify-between gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-foreground">
                {emblem.name}
              </h1>

              <StatusBadge
                status={emblem.status}
              />
            </div>

            <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
              Detail data prestasi, kondisi pencapaian, dan reward
              yang dapat diperoleh pemain.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                Created{" "}
                <span className="font-medium text-foreground">
                  {formatDateTime(
                    emblem.createdAt,
                  )}
                </span>
              </span>

              <span className="size-1 rounded-full bg-border" />

              <span>
                Last updated{" "}
                <span className="font-medium text-foreground">
                  {formatDateTime(
                    emblem.updatedAt,
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
                `/data/character-system/emblems/${emblem.id}/edit`,
              )
            }
            className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-4"
          >
            <Edit3 className="size-4" />

            Edit Emblem
          </Button>
        </div>
      </header>

      {/* ================================================================== */}
      {/* MAIN CARD                                                          */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 INFORMATION                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="Emblem Information"
            description="Informasi utama mengenai emblem."
          />

          {/* META */}

          <div className="mt-6 grid grid-cols-3 gap-x-10">
            <InfoValue
              label="Category"
              value={formatCategory(
                emblem.category,
              )}
            />

            <InfoValue
              label="Frequency"
              value={formatFrequency(
                emblem.frequency,
              )}
            />

            <InfoValue
              label="Slug"
              value={emblem.slug}
              muted
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-7 border-t border-border pt-6">
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>

            <p className="mt-2 max-w-[940px] whitespace-pre-wrap text-sm leading-7 text-foreground">
              {emblem.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 CONDITION & REWARD                                            */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="02"
            title="Achievement Details"
            description="Kondisi pencapaian dan reward dari emblem."
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* CONDITION */}

            <div className="rounded-xl border border-border bg-muted/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Target className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Condition
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Syarat mendapatkan emblem.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <ConditionDisplay
                  condition={emblem.condition}
                />
              </div>
            </div>

            {/* REWARD */}

            <div className="rounded-xl border border-border bg-muted/[0.04] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
                  <Gift className="size-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Reward
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Hadiah setelah kondisi terpenuhi.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <RewardDisplay
                  reward={emblem.reward}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 03 EVENT PERIOD                                                  */}
        {/* ================================================================= */}

        {hasEventPeriod && (
          <div className="border-t border-border p-6">
            <SectionTitle
              number="03"
              title="Event Period"
              description="Periode ketersediaan emblem event."
            />

            <div className="mt-6 grid grid-cols-2 gap-x-10">
              <DateValue
                label="Start Date"
                value={
                  emblem.eventPeriod
                    .startAt
                }
              />

              <DateValue
                label="End Date"
                value={
                  emblem.eventPeriod
                    .endAt
                }
              />
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* NOTES                                                            */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number={
              hasEventPeriod
                ? "04"
                : "03"
            }
            title="Emblem Notes"
            description="Informasi tambahan atau catatan internal mengenai emblem."
            optional
          />

          <div className="mt-5 pl-[46px]">
            {emblem.notes ? (
              <p className="max-w-[940px] whitespace-pre-wrap text-sm leading-7 text-foreground">
                {emblem.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional notes for this emblem.
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
/* CONDITION                                                                  */
/* -------------------------------------------------------------------------- */

function ConditionDisplay({
  condition,
}) {
  if (!condition) {
    return <EmptyValue />
  }

  if (
    condition.type ===
    "REACH_LEVEL"
  ) {
    return (
      <DetailValue
        label="Reach Level"
        value={`Lv. ${formatNumber(
          condition.value,
        )}`}
      />
    )
  }

  if (
    condition.type ===
    "PLAY_TIME"
  ) {
    return (
      <DetailValue
        label="Play Time"
        value={formatPlayTime(
          condition.durationMinutes,
        )}
      />
    )
  }

  if (
    condition.type ===
    "DEFEAT_MONSTER"
  ) {
    return (
      <div>
        <DetailValue
          label="Defeat Monster"
          value={`${formatNumber(
            condition.quantity,
          )} Monsters`}
        />

        {condition.levelDifference !=
          null && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Allowed level difference
            </p>

            <p className="mt-1.5 text-sm font-medium text-foreground">
              ±
              {
                condition.levelDifference
              }{" "}
              Levels
            </p>
          </div>
        )}
      </div>
    )
  }

  if (
    condition.type ===
    "COMPLETE_QUEST"
  ) {
    return (
      <DetailValue
        label="Complete Quest"
        value={`${formatNumber(
          condition.quantity,
        )} Quest${
          Number(
            condition.quantity,
          ) === 1
            ? ""
            : "s"
        }`}
      />
    )
  }

  if (
    condition.type ===
    "LEARN_SKILL"
  ) {
    return (
      <DetailValue
        label="Learn Skill"
        value={`${formatNumber(
          condition.quantity,
        )} Skill${
          Number(
            condition.quantity,
          ) === 1
            ? ""
            : "s"
        }`}
      />
    )
  }

  if (
    condition.type ===
    "CRAFT_ITEM"
  ) {
    return (
      <DetailValue
        label="Craft Item"
        value={`${formatNumber(
          condition.quantity,
        )} Item${
          Number(
            condition.quantity,
          ) === 1
            ? ""
            : "s"
        }`}
      />
    )
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        Other Condition
      </p>

      <p className="mt-2 text-sm leading-6 text-foreground">
        {condition.description ||
          "No condition information available."}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* REWARD                                                                     */
/* -------------------------------------------------------------------------- */

function RewardDisplay({
  reward,
}) {
  if (!reward) {
    return <EmptyValue />
  }

  if (
    reward.type ===
    "EXP_BONUS"
  ) {
    return (
      <DetailValue
        label="EXP Bonus"
        value={`+${formatNumber(
          reward.value,
        )}%`}
      />
    )
  }

  if (
    reward.type ===
    "SPINA"
  ) {
    return (
      <DetailValue
        label="Spina"
        value={`${formatNumber(
          reward.value,
        )} Spina`}
      />
    )
  }

  if (
    reward.type ===
    "STAT_POINT"
  ) {
    return (
      <DetailValue
        label="Stat Point"
        value={`${formatNumber(
          reward.value,
        )} Point${
          Number(
            reward.value,
          ) === 1
            ? ""
            : "s"
        }`}
      />
    )
  }

  if (
    reward.type ===
    "SKILL_POINT"
  ) {
    return (
      <DetailValue
        label="Skill Point"
        value={`${formatNumber(
          reward.value,
        )} Point${
          Number(
            reward.value,
          ) === 1
            ? ""
            : "s"
        }`}
      />
    )
  }

  if (
    reward.type ===
    "ITEM"
  ) {
    const item =
      itemOptions.find(
        (record) =>
          record.id ===
          reward.itemId,
      )

    return (
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Item
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
            <Package className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {item?.name ||
                reward.itemId ||
                "Unknown Item"}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {item?.id ||
                reward.itemId}
            </p>
          </div>

          <div className="shrink-0">
            <span className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold text-foreground ring-1 ring-border">
              ×
              {formatNumber(
                reward.quantity ||
                  1,
              )}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        Other Reward
      </p>

      <p className="mt-2 text-sm leading-6 text-foreground">
        {reward.description ||
          "No reward information available."}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DETAIL VALUE                                                               */
/* -------------------------------------------------------------------------- */

function DetailValue({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INFO VALUE                                                                 */
/* -------------------------------------------------------------------------- */

function InfoValue({
  label,
  value,
  muted = false,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p
        className={[
          "mt-1.5 text-sm",

          muted
            ? "text-muted-foreground"
            : "font-medium text-foreground",
        ].join(" ")}
      >
        {value || "—"}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DATE                                                                       */
/* -------------------------------------------------------------------------- */

function DateValue({
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <CalendarDays className="size-4" />
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-foreground">
          {formatDateTime(
            value,
          )}
        </p>
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
  optional = false,
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-xs font-semibold text-primary">
        {number}
      </div>

      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          {optional && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Optional
            </span>
          )}
        </div>

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
    status === "PUBLISHED"

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
/* EMPTY                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyValue() {
  return (
    <p className="text-sm text-muted-foreground">
      No information available.
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatCategory(
  category,
) {
  const labels = {
    CHARACTER: "Character",
    PLAY_TIME: "Play Time",
    BATTLE: "Battle",
    QUEST: "Quest",
    SKILL: "Skill",
    PRODUCTION: "Production",
    EVENT: "Event",
    OTHER: "Other",
  }

  return (
    labels[category] ||
    category ||
    "—"
  )
}

function formatFrequency(
  frequency,
) {
  const labels = {
    ONE_TIME: "One Time",
    DAILY: "Daily",
    WEEKLY: "Weekly",
    EVENT: "Event",
  }

  return (
    labels[frequency] ||
    frequency ||
    "—"
  )
}

function formatPlayTime(
  minutes,
) {
  const value =
    Number(minutes)

  if (
    !Number.isFinite(
      value,
    )
  ) {
    return "—"
  }

  if (value < 60) {
    return `${value} Minutes`
  }

  const hours =
    Math.floor(
      value / 60,
    )

  const remainingMinutes =
    value % 60

  if (
    remainingMinutes === 0
  ) {
    return `${hours} Hour${
      hours === 1
        ? ""
        : "s"
    }`
  }

  return `${hours}h ${remainingMinutes}m`
}

function formatNumber(
  value,
) {
  const numeric =
    Number(value)

  if (
    !Number.isFinite(
      numeric,
    )
  ) {
    return "—"
  }

  return new Intl.NumberFormat(
    "en-US",
  ).format(numeric)
}

function formatDateTime(
  value,
) {
  if (!value) {
    return "—"
  }

  const normalized =
    value.includes("T")
      ? value
      : value.replace(
          " ",
          "T",
        )

  const date =
    new Date(
      normalized,
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
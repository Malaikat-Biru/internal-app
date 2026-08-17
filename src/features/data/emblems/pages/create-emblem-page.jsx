import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  LockKeyhole,
  Package,
  Search,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
/* -------------------------------------------------------------------------- */

const categoryOptions = [
  {
    value: "CHARACTER",
    label: "Character",
  },
  {
    value: "PLAY_TIME",
    label: "Play Time",
  },
  {
    value: "BATTLE",
    label: "Battle",
  },
  {
    value: "QUEST",
    label: "Quest",
  },
  {
    value: "SKILL",
    label: "Skill",
  },
  {
    value: "PRODUCTION",
    label: "Production",
  },
  {
    value: "EVENT",
    label: "Event",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

const frequencyOptions = [
  {
    value: "ONE_TIME",
    label: "One Time",
  },
  {
    value: "DAILY",
    label: "Daily",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "EVENT",
    label: "Event",
  },
]

const conditionTypeOptions = [
  {
    value: "REACH_LEVEL",
    label: "Reach Level",
  },
  {
    value: "PLAY_TIME",
    label: "Play Time",
  },
  {
    value: "DEFEAT_MONSTER",
    label: "Defeat Monster",
  },
  {
    value: "COMPLETE_QUEST",
    label: "Complete Quest",
  },
  {
    value: "LEARN_SKILL",
    label: "Learn Skill",
  },
  {
    value: "CRAFT_ITEM",
    label: "Craft Item",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

const rewardTypeOptions = [
  {
    value: "EXP_BONUS",
    label: "EXP Bonus",
  },
  {
    value: "SPINA",
    label: "Spina",
  },
  {
    value: "STAT_POINT",
    label: "Stat Point",
  },
  {
    value: "SKILL_POINT",
    label: "Skill Point",
  },
  {
    value: "ITEM",
    label: "Item",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK ITEM DATA                                                             */
/* -------------------------------------------------------------------------- */

const itemOptions = [
  {
    id: "ITEM-001",
    name: "Teleport Ticket",
  },
  {
    id: "ITEM-002",
    name: "Revita IV",
  },
  {
    id: "ITEM-003",
    name: "Life Potion",
  },
  {
    id: "ITEM-004",
    name: "Mana Potion",
  },
  {
    id: "ITEM-005",
    name: "Fairy Sewing Tool",
  },
  {
    id: "ITEM-006",
    name: "Notebook of Oblivion",
  },
  {
    id: "ITEM-007",
    name: "Reset Book",
  },
  {
    id: "ITEM-008",
    name: "Libera's Book",
  },
  {
    id: "ITEM-009",
    name: "Virgo's Book",
  },
  {
    id: "ITEM-010",
    name: "Traveller Gem",
  },
  {
    id: "ITEM-011",
    name: "Piercer",
  },
  {
    id: "ITEM-012",
    name: "Extraction Crysta",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CreateEmblemPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    frequency: "",

    condition: {
      type: "",
      value: "",
      quantity: "",
      durationMinutes: "",
      levelDifference: "",
      description: "",
    },

    reward: {
      type: "",
      value: "",
      unit: null,
      itemId: "",
      quantity: "",
      description: "",
    },

    eventPeriod: {
      startAt: "",
      endAt: "",
    },

    notes: "",
  })

  const [errors, setErrors] =
    useState({})

  const [
    savingAction,
    setSavingAction,
  ] = useState(null)

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug = useMemo(() => {
    return createSlug(
      form.name,
    )
  }, [form.name])

  const isEvent =
    form.frequency === "EVENT"

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    clearError(field)
  }

  function updateCondition(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,

      condition: {
        ...current.condition,
        [field]: value,
      },
    }))

    clearError(
      `condition.${field}`,
    )
  }

  function updateReward(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,

      reward: {
        ...current.reward,
        [field]: value,
      },
    }))

    clearError(
      `reward.${field}`,
    )
  }

  function updateEventPeriod(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,

      eventPeriod: {
        ...current.eventPeriod,
        [field]: value,
      },
    }))

    clearError(
      `eventPeriod.${field}`,
    )
  }

  function clearError(
    field,
  ) {
    setErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = {
        ...current,
      }

      delete next[field]

      return next
    })
  }

  function clearNestedErrors(
    prefix,
  ) {
    setErrors((current) => {
      const next = {
        ...current,
      }

      Object.keys(
        next,
      ).forEach((key) => {
        if (
          key.startsWith(
            prefix,
          )
        ) {
          delete next[key]
        }
      })

      return next
    })
  }

  /* ---------------------------------------------------------------------- */
  /* CONDITION TYPE                                                         */
  /* ---------------------------------------------------------------------- */

  function handleConditionTypeChange(
    value,
  ) {
    setForm((current) => ({
      ...current,

      condition: {
        type: value,
        value: "",
        quantity: "",
        durationMinutes: "",
        levelDifference: "",
        description: "",
      },
    }))

    clearNestedErrors(
      "condition.",
    )
  }

  /* ---------------------------------------------------------------------- */
  /* REWARD TYPE                                                            */
  /* ---------------------------------------------------------------------- */

  function handleRewardTypeChange(
    value,
  ) {
    setForm((current) => ({
      ...current,

      reward: {
        type: value,

        value: "",

        unit:
          value === "EXP_BONUS"
            ? "PERCENT"
            : null,

        itemId: "",
        quantity: "",
        description: "",
      },
    }))

    clearNestedErrors(
      "reward.",
    )
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATION                                                             */
  /* ---------------------------------------------------------------------- */

  function validate(
    status,
  ) {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name =
        "Emblem name is required."
    }

    if (
      !form.description.trim()
    ) {
      nextErrors.description =
        "Emblem description is required."
    }

    if (!form.category) {
      nextErrors.category =
        "Category is required."
    }

    if (!form.frequency) {
      nextErrors.frequency =
        "Frequency is required."
    }

    if (!form.condition.type) {
      nextErrors[
        "condition.type"
      ] =
        "Condition type is required."
    }

    if (!form.reward.type) {
      nextErrors[
        "reward.type"
      ] =
        "Reward type is required."
    }

    /* CONDITION */

    if (
      form.condition.type ===
        "REACH_LEVEL" &&
      Number(
        form.condition.value,
      ) <= 0
    ) {
      nextErrors[
        "condition.value"
      ] =
        "Level must be greater than 0."
    }

    if (
      form.condition.type ===
        "PLAY_TIME" &&
      Number(
        form.condition
          .durationMinutes,
      ) <= 0
    ) {
      nextErrors[
        "condition.durationMinutes"
      ] =
        "Play time must be greater than 0."
    }

    if (
      form.condition.type ===
        "DEFEAT_MONSTER" &&
      Number(
        form.condition.quantity,
      ) <= 0
    ) {
      nextErrors[
        "condition.quantity"
      ] =
        "Quantity must be greater than 0."
    }

    if (
      [
        "COMPLETE_QUEST",
        "LEARN_SKILL",
        "CRAFT_ITEM",
      ].includes(
        form.condition.type,
      ) &&
      Number(
        form.condition.quantity,
      ) <= 0
    ) {
      nextErrors[
        "condition.quantity"
      ] =
        "Quantity must be greater than 0."
    }

    if (
      form.condition.type ===
        "OTHER" &&
      !form.condition.description.trim()
    ) {
      nextErrors[
        "condition.description"
      ] =
        "Condition description is required."
    }

    /* REWARD */

    if (
      [
        "EXP_BONUS",
        "SPINA",
        "STAT_POINT",
        "SKILL_POINT",
      ].includes(
        form.reward.type,
      ) &&
      Number(
        form.reward.value,
      ) <= 0
    ) {
      nextErrors[
        "reward.value"
      ] =
        "Reward value must be greater than 0."
    }

    if (
      form.reward.type ===
        "ITEM" &&
      !form.reward.itemId
    ) {
      nextErrors[
        "reward.itemId"
      ] =
        "Reward item is required."
    }

    if (
      form.reward.type ===
        "ITEM" &&
      Number(
        form.reward.quantity,
      ) <= 0
    ) {
      nextErrors[
        "reward.quantity"
      ] =
        "Quantity must be greater than 0."
    }

    if (
      form.reward.type ===
        "OTHER" &&
      !form.reward.description.trim()
    ) {
      nextErrors[
        "reward.description"
      ] =
        "Reward description is required."
    }

    /* EVENT */

    if (
      status ===
        "PUBLISHED" &&
      isEvent
    ) {
      if (
        !form.eventPeriod
          .startAt
      ) {
        nextErrors[
          "eventPeriod.startAt"
        ] =
          "Start date is required."
      }

      if (
        !form.eventPeriod
          .endAt
      ) {
        nextErrors[
          "eventPeriod.endAt"
        ] =
          "End date is required."
      }

      if (
        form.eventPeriod
          .startAt &&
        form.eventPeriod
          .endAt &&
        new Date(
          form.eventPeriod
            .endAt,
        ) <
          new Date(
            form.eventPeriod
              .startAt,
          )
      ) {
        nextErrors[
          "eventPeriod.endAt"
        ] =
          "End date must be after start date."
      }
    }

    setErrors(
      nextErrors,
    )

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    )
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  function handleSave(
    status,
  ) {
    if (!validate(status)) {
      return
    }

    setSavingAction(
      status,
    )

    const payload = {
      name:
        form.name.trim(),

      slug,

      description:
        form.description.trim(),

      category:
        form.category,

      frequency:
        form.frequency,

      condition:
        normalizeCondition(
          form.condition,
        ),

      reward:
        normalizeReward(
          form.reward,
        ),

      eventPeriod:
        isEvent
          ? {
              startAt:
                form.eventPeriod
                  .startAt ||
                null,

              endAt:
                form.eventPeriod
                  .endAt ||
                null,
            }
          : null,

      notes:
        form.notes.trim() ||
        null,

      status,
    }

    console.log(
      "Create Emblem:",
      payload,
    )

    /*
      const created =
        await createEmblem(
          payload,
        )

      navigate(
        `/data/character-system/emblems/${created.id}`,
      )
    */

    setTimeout(() => {
      setSavingAction(
        null,
      )
    }, 600)
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

          <span className="text-primary">
            Create
          </span>
        </div>

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
          Create Emblem
        </h1>

        <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
          Tambahkan informasi emblem, kondisi pencapaian, dan reward
          yang diterima pemain.
        </p>
      </header>

      {/* ================================================================== */}
      {/* FORM                                                               */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 INFORMATION                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="Emblem Information"
            description="Informasi utama mengenai emblem."
          />

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            {/* NAME */}

            <Field>
              <FieldLabel required>
                Emblem Name
              </FieldLabel>

              <input
                type="text"
                value={form.name}
                onChange={(
                  event,
                ) =>
                  updateField(
                    "name",
                    event.target
                      .value,
                  )
                }
                placeholder="Example: Known Adventurer"
                className={inputClass(
                  errors.name,
                )}
              />

              {errors.name ? (
                <FieldError>
                  {errors.name}
                </FieldError>
              ) : (
                <FieldHint>
                  Nama emblem yang akan ditampilkan kepada pengguna.
                </FieldHint>
              )}
            </Field>

            {/* SLUG */}

            <Field>
              <FieldLabel>
                Slug
              </FieldLabel>

              <DisabledValueField
                value={
                  slug ||
                  "generated-from-emblem-name"
                }
              />

              <FieldHint>
                Dibuat otomatis berdasarkan Emblem Name.
              </FieldHint>
            </Field>

            {/* CATEGORY */}

            <Field>
              <FieldLabel required>
                Category
              </FieldLabel>

              <SelectMenu
                value={form.category}
                options={
                  categoryOptions
                }
                placeholder="Select category"
                error={
                  Boolean(
                    errors.category,
                  )
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "category",
                    value,
                  )
                }
              />

              {errors.category ? (
                <FieldError>
                  {errors.category}
                </FieldError>
              ) : (
                <FieldHint>
                  Kelompok aktivitas atau progression dari emblem.
                </FieldHint>
              )}
            </Field>

            {/* FREQUENCY */}

            <Field>
              <FieldLabel required>
                Frequency
              </FieldLabel>

              <SelectMenu
                value={
                  form.frequency
                }
                options={
                  frequencyOptions
                }
                placeholder="Select frequency"
                error={
                  Boolean(
                    errors.frequency,
                  )
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "frequency",
                    value,
                  )
                }
              />

              {errors.frequency ? (
                <FieldError>
                  {errors.frequency}
                </FieldError>
              ) : (
                <FieldHint>
                  Tentukan apakah emblem berlaku sekali, harian,
                  mingguan, atau event.
                </FieldHint>
              )}
            </Field>

            {/* DESCRIPTION */}

            <div className="col-span-2">
              <Field>
                <FieldLabel required>
                  Emblem Description
                </FieldLabel>

                <textarea
                  value={
                    form.description
                  }
                  maxLength={1000}
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "description",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Describe what this emblem represents or how it is obtained..."
                  className={textareaClass(
                    errors.description,
                  )}
                />

                <div className="mt-2 flex items-start justify-between gap-4">
                  {errors.description ? (
                    <FieldError>
                      {
                        errors.description
                      }
                    </FieldError>
                  ) : (
                    <FieldHint>
                      Deskripsi utama emblem yang dapat ditampilkan kepada pengguna.
                    </FieldHint>
                  )}

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {
                      form
                        .description
                        .length
                    }
                    /1000
                  </span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 CONDITION                                                     */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="02"
            title="Condition"
            description="Kondisi yang harus dipenuhi untuk mendapatkan emblem."
          />

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            {/* TYPE */}

            <Field>
              <FieldLabel required>
                Condition Type
              </FieldLabel>

              <SelectMenu
                value={
                  form.condition
                    .type
                }
                options={
                  conditionTypeOptions
                }
                placeholder="Select condition type"
                error={
                  Boolean(
                    errors[
                      "condition.type"
                    ],
                  )
                }
                onChange={
                  handleConditionTypeChange
                }
              />

              {errors[
                "condition.type"
              ] ? (
                <FieldError>
                  {
                    errors[
                      "condition.type"
                    ]
                  }
                </FieldError>
              ) : (
                <FieldHint>
                  Pilih jenis kondisi yang digunakan untuk mendapatkan emblem.
                </FieldHint>
              )}
            </Field>

            <ConditionFields
              condition={
                form.condition
              }
              errors={errors}
              onChange={
                updateCondition
              }
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* 03 REWARD                                                        */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="Reward"
            description="Reward yang diterima setelah kondisi emblem terpenuhi."
          />

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            {/* REWARD TYPE */}

            <Field>
              <FieldLabel required>
                Reward Type
              </FieldLabel>

              <SelectMenu
                value={
                  form.reward
                    .type
                }
                options={
                  rewardTypeOptions
                }
                placeholder="Select reward type"
                error={
                  Boolean(
                    errors[
                      "reward.type"
                    ],
                  )
                }
                onChange={
                  handleRewardTypeChange
                }
              />

              {errors[
                "reward.type"
              ] ? (
                <FieldError>
                  {
                    errors[
                      "reward.type"
                    ]
                  }
                </FieldError>
              ) : (
                <FieldHint>
                  Pilih jenis reward yang diberikan oleh emblem.
                </FieldHint>
              )}
            </Field>

            <RewardFields
              reward={
                form.reward
              }
              errors={errors}
              onChange={
                updateReward
              }
            />
          </div>
        </div>

        {/* ================================================================= */}
        {/* EVENT PERIOD                                                     */}
        {/* ================================================================= */}

        {isEvent && (
          <div className="border-t border-border p-6">
            <SectionTitle
              number="04"
              title="Event Period"
              description="Periode ketersediaan emblem event."
            />

            <div className="mt-6 grid grid-cols-2 gap-6">
              <Field>
                <FieldLabel required>
                  Start Date
                </FieldLabel>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="datetime-local"
                    value={
                      form.eventPeriod
                        .startAt
                    }
                    onChange={(
                      event,
                    ) =>
                      updateEventPeriod(
                        "startAt",
                        event.target
                          .value,
                      )
                    }
                    className={`${inputClass(
                      errors[
                        "eventPeriod.startAt"
                      ],
                    )} pl-10`}
                  />
                </div>

                {errors[
                  "eventPeriod.startAt"
                ] && (
                  <FieldError>
                    {
                      errors[
                        "eventPeriod.startAt"
                      ]
                    }
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel required>
                  End Date
                </FieldLabel>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="datetime-local"
                    value={
                      form.eventPeriod
                        .endAt
                    }
                    onChange={(
                      event,
                    ) =>
                      updateEventPeriod(
                        "endAt",
                        event.target
                          .value,
                      )
                    }
                    className={`${inputClass(
                      errors[
                        "eventPeriod.endAt"
                      ],
                    )} pl-10`}
                  />
                </div>

                {errors[
                  "eventPeriod.endAt"
                ] && (
                  <FieldError>
                    {
                      errors[
                        "eventPeriod.endAt"
                      ]
                    }
                  </FieldError>
                )}
              </Field>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* NOTES                                                            */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number={
              isEvent
                ? "05"
                : "04"
            }
            title="Emblem Notes"
            description="Informasi tambahan atau catatan internal mengenai emblem."
            optional
          />

          <div className="mt-6">
            <textarea
              value={form.notes}
              maxLength={1000}
              onChange={(
                event,
              ) =>
                updateField(
                  "notes",
                  event.target
                    .value,
                )
              }
              placeholder="Add additional notes about this emblem..."
              className={textareaClass()}
            />

            <div className="mt-2 flex items-start justify-between gap-4">
              <FieldHint>
                Opsional. Gunakan untuk informasi internal atau detail tambahan.
              </FieldHint>

              <span className="shrink-0 text-xs text-muted-foreground">
                {form.notes.length}
                /1000
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOOTER                                                           */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-6 border-t border-border bg-muted/20 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-foreground">
              Ready to save?
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Simpan sebagai Draft atau publish setelah seluruh informasi
              sudah sesuai.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={
                Boolean(
                  savingAction,
                )
              }
              onClick={() =>
                navigate(
                  "/data/character-system/emblems",
                )
              }
              className="h-10 cursor-pointer px-4 text-sm text-muted-foreground"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={
                Boolean(
                  savingAction,
                )
              }
              onClick={() =>
                handleSave(
                  "DRAFT",
                )
              }
              className="h-10 cursor-pointer rounded-lg px-5 text-sm"
            >
              {savingAction ===
              "DRAFT"
                ? "Saving..."
                : "Save Draft"}
            </Button>

            <Button
              type="button"
              disabled={
                Boolean(
                  savingAction,
                )
              }
              onClick={() =>
                handleSave(
                  "PUBLISHED",
                )
              }
              className="h-10 cursor-pointer rounded-lg px-5 text-sm"
            >
              {savingAction ===
              "PUBLISHED"
                ? "Publishing..."
                : "Publish Emblem"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CONDITION FIELDS                                                           */
/* -------------------------------------------------------------------------- */

function ConditionFields({
  condition,
  errors,
  onChange,
}) {
  if (!condition.type) {
    return (
      <DisabledPlaceholderField
        label="Condition Value"
        value="Select condition type first"
      />
    )
  }

  if (
    condition.type ===
    "REACH_LEVEL"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Required Level
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            condition.value
          }
          onChange={(
            event,
          ) =>
            onChange(
              "value",
              event.target
                .value,
            )
          }
          placeholder="Example: 185"
          className={inputClass(
            errors[
              "condition.value"
            ],
          )}
        />

        {errors[
          "condition.value"
        ] && (
          <FieldError>
            {
              errors[
                "condition.value"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    condition.type ===
    "PLAY_TIME"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Play Time
        </FieldLabel>

        <div className="relative">
          <input
            type="number"
            min="1"
            value={
              condition.durationMinutes
            }
            onChange={(
              event,
            ) =>
              onChange(
                "durationMinutes",
                event.target
                  .value,
              )
            }
            placeholder="Example: 30"
            className={`${inputClass(
              errors[
                "condition.durationMinutes"
              ],
            )} pr-20`}
          />

          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            minutes
          </span>
        </div>

        {errors[
          "condition.durationMinutes"
        ] && (
          <FieldError>
            {
              errors[
                "condition.durationMinutes"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    condition.type ===
    "DEFEAT_MONSTER"
  ) {
    return (
      <>
        <Field>
          <FieldLabel required>
            Monster Quantity
          </FieldLabel>

          <input
            type="number"
            min="1"
            value={
              condition.quantity
            }
            onChange={(
              event,
            ) =>
              onChange(
                "quantity",
                event.target
                  .value,
              )
            }
            placeholder="Example: 30"
            className={inputClass(
              errors[
                "condition.quantity"
              ],
            )}
          />

          {errors[
            "condition.quantity"
          ] && (
            <FieldError>
              {
                errors[
                  "condition.quantity"
                ]
              }
            </FieldError>
          )}
        </Field>

        <div />

        <Field>
          <FieldLabel>
            Level Difference
          </FieldLabel>

          <input
            type="number"
            min="0"
            value={
              condition.levelDifference
            }
            onChange={(
              event,
            ) =>
              onChange(
                "levelDifference",
                event.target
                  .value,
              )
            }
            placeholder="Example: 30"
            className={inputClass()}
          />

          <FieldHint>
            Opsional. Batas perbedaan level pemain dan monster.
          </FieldHint>
        </Field>
      </>
    )
  }

  if (
    condition.type ===
    "COMPLETE_QUEST"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Quest Quantity
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            condition.quantity
          }
          onChange={(
            event,
          ) =>
              onChange(
                "quantity",
                event.target
                  .value,
              )
          }
          placeholder="Example: 1"
          className={inputClass(
            errors[
              "condition.quantity"
            ],
          )}
        />

        {errors[
          "condition.quantity"
        ] && (
          <FieldError>
            {
              errors[
                "condition.quantity"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    condition.type ===
    "LEARN_SKILL"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Skills Required
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            condition.quantity
          }
          onChange={(
            event,
          ) =>
              onChange(
                "quantity",
                event.target
                  .value,
              )
          }
          placeholder="Example: 5"
          className={inputClass(
            errors[
              "condition.quantity"
            ],
          )}
        />

        {errors[
          "condition.quantity"
        ] && (
          <FieldError>
            {
              errors[
                "condition.quantity"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    condition.type ===
    "CRAFT_ITEM"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Craft Quantity
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            condition.quantity
          }
          onChange={(
            event,
          ) =>
              onChange(
                "quantity",
                event.target
                  .value,
              )
          }
          placeholder="Example: 10"
          className={inputClass(
            errors[
              "condition.quantity"
            ],
          )}
        />

        {errors[
          "condition.quantity"
        ] && (
          <FieldError>
            {
              errors[
                "condition.quantity"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  return (
    <div className="col-span-2">
      <Field>
        <FieldLabel required>
          Condition Description
        </FieldLabel>

        <textarea
          value={
            condition.description
          }
          onChange={(
            event,
          ) =>
            onChange(
              "description",
              event.target
                .value,
            )
          }
          placeholder="Describe the condition required to obtain this emblem..."
          className={textareaClass(
            errors[
              "condition.description"
            ],
          )}
        />

        {errors[
          "condition.description"
        ] && (
          <FieldError>
            {
              errors[
                "condition.description"
              ]
            }
          </FieldError>
        )}
      </Field>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* REWARD FIELDS                                                              */
/* -------------------------------------------------------------------------- */

function RewardFields({
  reward,
  errors,
  onChange,
}) {
  if (!reward.type) {
    return (
      <DisabledPlaceholderField
        label="Reward Value"
        value="Select reward type first"
      />
    )
  }

  if (
    reward.type ===
    "EXP_BONUS"
  ) {
    return (
      <Field>
        <FieldLabel required>
          EXP Bonus
        </FieldLabel>

        <div className="relative">
          <input
            type="number"
            min="1"
            value={
              reward.value
            }
            onChange={(
              event,
            ) =>
              onChange(
                "value",
                event.target
                  .value,
              )
            }
            placeholder="Example: 10"
            className={`${inputClass(
              errors[
                "reward.value"
              ],
            )} pr-12`}
          />

          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>

        {errors[
          "reward.value"
        ] && (
          <FieldError>
            {
              errors[
                "reward.value"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    reward.type ===
    "SPINA"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Spina
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            reward.value
          }
          onChange={(
            event,
          ) =>
            onChange(
              "value",
              event.target
                .value,
            )
          }
          placeholder="Example: 1000"
          className={inputClass(
            errors[
              "reward.value"
            ],
          )}
        />

        {errors[
          "reward.value"
        ] && (
          <FieldError>
            {
              errors[
                "reward.value"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    reward.type ===
    "STAT_POINT"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Stat Point
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            reward.value
          }
          onChange={(
            event,
          ) =>
            onChange(
              "value",
              event.target
                .value,
            )
          }
          placeholder="Example: 5"
          className={inputClass(
            errors[
              "reward.value"
            ],
          )}
        />

        {errors[
          "reward.value"
        ] && (
          <FieldError>
            {
              errors[
                "reward.value"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    reward.type ===
    "SKILL_POINT"
  ) {
    return (
      <Field>
        <FieldLabel required>
          Skill Point
        </FieldLabel>

        <input
          type="number"
          min="1"
          value={
            reward.value
          }
          onChange={(
            event,
          ) =>
            onChange(
              "value",
              event.target
                .value,
            )
          }
          placeholder="Example: 1"
          className={inputClass(
            errors[
              "reward.value"
            ],
          )}
        />

        {errors[
          "reward.value"
        ] && (
          <FieldError>
            {
              errors[
                "reward.value"
              ]
            }
          </FieldError>
        )}
      </Field>
    )
  }

  if (
    reward.type === "ITEM"
  ) {
    return (
      <>
        <Field>
          <FieldLabel required>
            Reward Item
          </FieldLabel>

          <SearchableItemSelect
            value={
              reward.itemId
            }
            items={
              itemOptions
            }
            onChange={(
              itemId,
            ) =>
              onChange(
                "itemId",
                itemId,
              )
            }
            error={
              Boolean(
                errors[
                  "reward.itemId"
                ],
              )
            }
          />

          {errors[
            "reward.itemId"
          ] ? (
            <FieldError>
              {
                errors[
                  "reward.itemId"
                ]
              }
            </FieldError>
          ) : (
            <FieldHint>
              Cari item berdasarkan nama.
            </FieldHint>
          )}
        </Field>

        <Field>
          <FieldLabel required>
            Quantity
          </FieldLabel>

          <input
            type="number"
            min="1"
            value={
              reward.quantity
            }
            onChange={(
              event,
            ) =>
              onChange(
                "quantity",
                event.target
                  .value,
              )
            }
            placeholder="Example: 1"
            className={inputClass(
              errors[
                "reward.quantity"
              ],
            )}
          />

          {errors[
            "reward.quantity"
          ] && (
            <FieldError>
              {
                errors[
                  "reward.quantity"
                ]
              }
            </FieldError>
          )}
        </Field>
      </>
    )
  }

  return (
    <div className="col-span-2">
      <Field>
        <FieldLabel required>
          Reward Description
        </FieldLabel>

        <textarea
          value={
            reward.description
          }
          onChange={(
            event,
          ) =>
            onChange(
              "description",
              event.target
                .value,
            )
          }
          placeholder="Example: Unlock Combo feature"
          className={textareaClass(
            errors[
              "reward.description"
            ],
          )}
        />

        {errors[
          "reward.description"
        ] && (
          <FieldError>
            {
              errors[
                "reward.description"
              ]
            }
          </FieldError>
        )}
      </Field>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCHABLE ITEM SELECT                                                     */
/* -------------------------------------------------------------------------- */

function SearchableItemSelect({
  value,
  items,
  onChange,
  error = false,
}) {
  const rootRef =
    useRef(null)

  const inputRef =
    useRef(null)

  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    search,
    setSearch,
  ] = useState("")

  const selectedItem =
    items.find(
      (item) =>
        item.id === value,
    ) || null

  const filteredItems =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return items.slice(
          0,
          20,
        )
      }

      return items
        .filter((item) =>
          item.name
            .toLowerCase()
            .includes(
              keyword,
            ),
        )
        .slice(
          0,
          20,
        )
    }, [
      items,
      search,
    ])

  /* ---------------------------------------------------------------------- */
  /* OUTSIDE CLICK                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function handleOutsideClick(
      event,
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false)
        setSearch("")
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      )
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* AUTOFOCUS                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)

    return () =>
      clearTimeout(timeout)
  }, [open])

  /* ---------------------------------------------------------------------- */
  /* ACTIONS                                                                */
  /* ---------------------------------------------------------------------- */

  function selectItem(
    item,
  ) {
    onChange(item.id)

    setOpen(false)
    setSearch("")
  }

  function clearSelection(
    event,
  ) {
    event?.stopPropagation()

    onChange("")
    setOpen(false)
    setSearch("")
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      ref={rootRef}
      className="relative min-w-0"
    >
      {/* TRIGGER */}

      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
          className={[
            "flex h-11 w-full items-center gap-3 rounded-lg border px-3.5 text-left outline-none transition-all",

            selectedItem
              ? "bg-background"
              : "bg-muted/20",

            error
              ? "border-destructive/50 focus:border-destructive/60 focus:ring-3 focus:ring-destructive/10"
              : "border-border hover:bg-muted/30 focus:border-primary/40 focus:ring-3 focus:ring-primary/10",
          ].join(" ")}
        >
          <Package className="size-4 shrink-0 text-muted-foreground" />

          <span
            className={[
              "min-w-0 flex-1 truncate text-sm",

              selectedItem
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {selectedItem
              ? selectedItem.name
              : "Search reward item"}
          </span>

          <ChevronDown
            className={[
              "size-4 shrink-0 text-muted-foreground transition-transform",

              open
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {selectedItem && (
          <button
            type="button"
            aria-label="Clear item"
            onClick={
              clearSelection
            }
            className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* DROPDOWN */}

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {/* SEARCH */}

          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Escape"
                  ) {
                    setOpen(false)
                    setSearch("")
                  }
                }}
                placeholder="Search item..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:ring-3 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* RESULT */}

          <div className="max-h-[250px] overflow-y-auto p-1.5">
            {filteredItems.length >
            0 ? (
              filteredItems.map(
                (item) => {
                  const selected =
                    item.id === value

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        selectItem(
                          item,
                        )
                      }
                      className={[
                        "flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left transition-colors",

                        selected
                          ? "bg-primary/[0.08] text-primary"
                          : "text-foreground hover:bg-muted/60",
                      ].join(" ")}
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {item.name}
                      </span>
                    </button>
                  )
                },
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center px-5 text-center">
                <p className="text-xs text-muted-foreground">
                  No item found.
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <span className="text-xs text-muted-foreground">
              {filteredItems.length} result
              {filteredItems.length ===
              1
                ? ""
                : "s"}
            </span>

            {selectedItem && (
              <button
                type="button"
                onClick={
                  clearSelection
                }
                className="cursor-pointer text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DISABLED VALUE                                                             */
/* -------------------------------------------------------------------------- */

function DisabledValueField({
  value,
}) {
  return (
    <div className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg border border-border/90 bg-muted/85 px-3.5 shadow-inner">
      <LockKeyhole className="size-4 shrink-0 text-muted-foreground/85" />

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground/85">
        {value}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DISABLED PLACEHOLDER                                                       */
/* -------------------------------------------------------------------------- */

function DisabledPlaceholderField({
  label,
  value,
}) {
  return (
    <Field>
      <FieldLabel>
        {label}
      </FieldLabel>

      <div className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg border border-border/90 bg-muted/85 px-3.5 shadow-inner">
        <LockKeyhole className="size-4 shrink-0 text-muted-foreground/85" />

        <span className="truncate text-sm font-medium text-muted-foreground/75">
          {value}
        </span>
      </div>

      <DisabledHint>
        Pilih tipe terlebih dahulu untuk mengaktifkan field ini.
      </DisabledHint>
    </Field>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  children,
}) {
  return (
    <div className="min-w-0">
      {children}
    </div>
  )
}

function FieldLabel({
  children,
  required = false,
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}

      {required && (
        <span className="ml-1 text-destructive">
          *
        </span>
      )}
    </label>
  )
}

function FieldHint({
  children,
}) {
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      {children}
    </p>
  )
}

function DisabledHint({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <LockKeyhole className="size-3 shrink-0" />

      {children}
    </p>
  )
}

function FieldError({
  children,
}) {
  return (
    <p className="mt-2 text-xs font-medium text-destructive">
      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* SELECT MENU                                                                */
/* -------------------------------------------------------------------------- */

function SelectMenu({
  value,
  options,
  onChange,
  placeholder = "Select option",
  error = false,
}) {
  const selected =
    options.find(
      (option) =>
        option.value === value,
    ) || null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={[
              "flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-3.5 text-left outline-none transition-all",

              selected
                ? "bg-background"
                : "bg-muted/20",

              error
                ? "border-destructive/50 focus:border-destructive/60 focus:ring-3 focus:ring-destructive/10"
                : "border-border hover:bg-muted/30 focus:border-primary/40 focus:ring-3 focus:ring-primary/10",
            ].join(" ")}
          />
        }
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm",

            selected
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {selected
            ? selected.label
            : placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        <DropdownMenuGroup>
          {options.map(
            (option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  onChange(
                    option.value,
                  )
                }
                className={[
                  "cursor-pointer text-sm",

                  option.value ===
                  value
                    ? "font-medium text-primary"
                    : "",
                ].join(" ")}
              >
                <span className="truncate">
                  {option.label}
                </span>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass(
  error = false,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-3",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
}

function textareaClass(
  error = false,
) {
  return [
    "min-h-[110px] w-full resize-y rounded-xl border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-3",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE CONDITION                                                        */
/* -------------------------------------------------------------------------- */

function normalizeCondition(
  condition,
) {
  if (
    condition.type ===
    "REACH_LEVEL"
  ) {
    return {
      type:
        condition.type,

      value:
        Number(
          condition.value,
        ),
    }
  }

  if (
    condition.type ===
    "PLAY_TIME"
  ) {
    return {
      type:
        condition.type,

      durationMinutes:
        Number(
          condition
            .durationMinutes,
        ),
    }
  }

  if (
    condition.type ===
    "DEFEAT_MONSTER"
  ) {
    return {
      type:
        condition.type,

      quantity:
        Number(
          condition.quantity,
        ),

      levelDifference:
        condition
          .levelDifference !==
        ""
          ? Number(
              condition
                .levelDifference,
            )
          : null,
    }
  }

  if (
    [
      "COMPLETE_QUEST",
      "LEARN_SKILL",
      "CRAFT_ITEM",
    ].includes(
      condition.type,
    )
  ) {
    return {
      type:
        condition.type,

      quantity:
        Number(
          condition.quantity,
        ),
    }
  }

  return {
    type:
      "OTHER",

    description:
      condition.description.trim(),
  }
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE REWARD                                                           */
/* -------------------------------------------------------------------------- */

function normalizeReward(
  reward,
) {
  if (
    reward.type ===
    "EXP_BONUS"
  ) {
    return {
      type:
        reward.type,

      value:
        Number(
          reward.value,
        ),

      unit:
        "PERCENT",
    }
  }

  if (
    [
      "SPINA",
      "STAT_POINT",
      "SKILL_POINT",
    ].includes(
      reward.type,
    )
  ) {
    return {
      type:
        reward.type,

      value:
        Number(
          reward.value,
        ),
    }
  }

  if (
    reward.type ===
    "ITEM"
  ) {
    return {
      type:
        reward.type,

      itemId:
        reward.itemId,

      quantity:
        Number(
          reward.quantity,
        ),
    }
  }

  return {
    type:
      "OTHER",

    description:
      reward.description.trim(),
  }
}

/* -------------------------------------------------------------------------- */
/* SLUG                                                                       */
/* -------------------------------------------------------------------------- */

function createSlug(
  value,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
}
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CirclePlus,
  Coins,
  Package,
  Plus,
  Search,
  ScrollText,
  Trash2,
  UserRound,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
/* OBJECTIVE TYPES                                                            */
/* -------------------------------------------------------------------------- */

const objectiveTypes = [
  {
    value: "COLLECT_ITEM",
    label: "Collect Item",
  },
  {
    value: "DEFEAT_MONSTER",
    label: "Defeat Monster",
  },
  {
    value: "TALK_NPC",
    label: "Talk to NPC",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

/* -------------------------------------------------------------------------- */
/* REPEATABLE OPTIONS                                                         */
/* -------------------------------------------------------------------------- */

const repeatableOptions = [
  {
    value: "NO",
    label: "No",
  },
  {
    value: "YES",
    label: "Yes",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CreateSideQuestPage() {
  const navigate =
    useNavigate()

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    requiredLevel: "",
    npcId: "",
    repeatable: "NO",
    expReward: "",
    spinaReward: "",
    notes: "",
  })

  const [
    objectives,
    setObjectives,
  ] = useState([])

  const [
    rewardItems,
    setRewardItems,
  ] = useState([])

  const [
    errors,
    setErrors,
  ] = useState({})

  const [
    savingAction,
    setSavingAction,
  ] = useState(null)

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug =
    useMemo(() => {
      return createSlug(
        form.name,
      )
    }, [form.name])

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      }),
    )

    if (
      errors[field]
    ) {
      setErrors(
        (current) => ({
          ...current,

          [field]:
            undefined,
        }),
      )
    }
  }

  /* ---------------------------------------------------------------------- */
  /* OBJECTIVES                                                             */
  /* ---------------------------------------------------------------------- */

  function addObjective() {
    setObjectives(
      (current) => [
        ...current,

        {
          id:
            crypto.randomUUID(),

          type:
            "COLLECT_ITEM",

          itemId: "",

          monsterId: "",

          npcId: "",

          quantity: 1,

          description: "",
        },
      ],
    )
  }

  function changeObjectiveType(
    id,
    type,
  ) {
    setObjectives(
      (current) =>
        current.map(
          (objective) =>
            objective.id ===
            id
              ? {
                  ...objective,

                  type,

                  itemId: "",

                  monsterId:
                    "",

                  npcId: "",

                  quantity: 1,

                  description:
                    "",
                }
              : objective,
        ),
    )
  }

  function updateObjective(
    id,
    field,
    value,
  ) {
    setObjectives(
      (current) =>
        current.map(
          (objective) =>
            objective.id ===
            id
              ? {
                  ...objective,

                  [field]:
                    value,
                }
              : objective,
        ),
    )
  }

  function removeObjective(
    id,
  ) {
    setObjectives(
      (current) =>
        current.filter(
          (objective) =>
            objective.id !==
            id,
        ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* REWARD ITEMS                                                           */
  /* ---------------------------------------------------------------------- */

  function addRewardItem(
    item,
  ) {
    const exists =
      rewardItems.some(
        (reward) =>
          reward.itemId ===
          item.id,
      )

    if (exists) {
      return
    }

    setRewardItems(
      (current) => [
        ...current,

        {
          id:
            crypto.randomUUID(),

          itemId:
            item.id,

          name:
            item.name,

          category:
            item.category,

          quantity: 1,
        },
      ],
    )
  }

  function updateRewardItem(
    id,
    quantity,
  ) {
    setRewardItems(
      (current) =>
        current.map(
          (reward) =>
            reward.id ===
            id
              ? {
                  ...reward,

                  quantity,
                }
              : reward,
        ),
    )
  }

  function removeRewardItem(
    id,
  ) {
    setRewardItems(
      (current) =>
        current.filter(
          (reward) =>
            reward.id !==
            id,
        ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATE                                                               */
  /* ---------------------------------------------------------------------- */

  function validate() {
    const nextErrors =
      {}

    if (
      !form.name.trim()
    ) {
      nextErrors.name =
        "Side quest name is required."
    }

    if (
      form.requiredLevel ===
      ""
    ) {
      nextErrors.requiredLevel =
        "Required level is required."
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
    if (!validate()) {
      return
    }

    setSavingAction(
      status,
    )

    const payload = {
      name:
        form.name.trim(),

      slug,

      requiredLevel:
        Number(
          form.requiredLevel,
        ),

      npcId:
        form.npcId ||
        null,

      repeatable:
        form.repeatable ===
        "YES",

      objectives:
        objectives.map(
          (objective) => {
            if (
              objective.type ===
              "COLLECT_ITEM"
            ) {
              return {
                type:
                  objective.type,

                itemId:
                  objective.itemId ||
                  null,

                quantity:
                  Number(
                    objective.quantity,
                  ),
              }
            }

            if (
              objective.type ===
              "DEFEAT_MONSTER"
            ) {
              return {
                type:
                  objective.type,

                monsterId:
                  objective.monsterId ||
                  null,

                quantity:
                  Number(
                    objective.quantity,
                  ),
              }
            }

            if (
              objective.type ===
              "TALK_NPC"
            ) {
              return {
                type:
                  objective.type,

                npcId:
                  objective.npcId ||
                  null,
              }
            }

            return {
              type:
                "OTHER",

              description:
                objective.description
                  .trim(),
            }
          },
        ),

      rewards: {
        exp:
          form.expReward ===
          ""
            ? null
            : Number(
                form.expReward,
              ),

        spina:
          form.spinaReward ===
          ""
            ? null
            : Number(
                form.spinaReward,
              ),

        items:
          rewardItems.map(
            (reward) => ({
              itemId:
                reward.itemId,

              quantity:
                Number(
                  reward.quantity,
                ),
            }),
          ),
      },

      notes:
        form.notes.trim() ||
        null,

      status,
    }

    console.log(
      "Create side quest:",
      payload,
    )

    /*
      TODO:
      const created = await createSideQuest(payload)

      navigate(
        `/data/worlds/side-quests/${created.id}`,
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

      <header className="mt-5">
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

          <span className="text-primary">
            Create
          </span>
        </div>

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
          Create Side Quest
        </h1>

        <p className="mt-2 max-w-[780px] text-sm leading-6 text-muted-foreground">
          Tambahkan informasi side quest, objective, reward, dan
          NPC terkait jika quest diberikan oleh NPC tertentu.
        </p>
      </header>

      {/* ================================================================== */}
      {/* CARD                                                               */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 INFORMATION                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="Side Quest Information"
            description="Informasi utama side quest."
          />

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            {/* NAME */}

            <Field
              label="Side Quest Name"
              required
              error={
                errors.name
              }
            >
              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "name",
                    event.target
                      .value,
                  )
                }
                placeholder="Example: Proof of Courage?"
                className={inputClass(
                  Boolean(
                    errors.name,
                  ),
                )}
              />
            </Field>

            {/* SLUG */}

            <Field label="Slug">
              <input
                type="text"
                value={
                  slug
                }
                readOnly
                placeholder="side-quest-slug"
                className={`${inputClass()} cursor-default bg-muted/30 text-muted-foreground`}
              />
            </Field>

            {/* REQUIRED LEVEL */}

            <Field
              label="Required Level"
              required
              error={
                errors.requiredLevel
              }
            >
              <input
                type="number"
                min="1"
                value={
                  form.requiredLevel
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "requiredLevel",
                    event.target
                      .value,
                  )
                }
                placeholder="25"
                className={inputClass(
                  Boolean(
                    errors.requiredLevel,
                  ),
                )}
              />
            </Field>

            {/* REPEATABLE */}

            <Field label="Repeatable">
              <SimpleSelect
                value={
                  form.repeatable
                }
                options={
                  repeatableOptions
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "repeatable",
                    value,
                  )
                }
              />
            </Field>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 QUEST GIVER                                                   */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="02"
            title="Quest Giver"
            description="NPC yang memberikan side quest ini jika ada."
            optional
          />

          <div className="mt-6 max-w-[620px]">
            <Field label="NPC">
              <SearchableEntitySelect
                value={
                  form.npcId
                }
                options={
                  npcOptions
                }
                placeholder="No NPC selected"
                searchPlaceholder="Search NPC..."
                emptyLabel="No NPC"
                icon={
                  UserRound
                }
                onChange={(
                  value,
                ) =>
                  updateField(
                    "npcId",
                    value,
                  )
                }
                clearable
              />
            </Field>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 03 OBJECTIVES                                                    */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <div className="flex items-start justify-between gap-6">
            <SectionTitle
              number="03"
              title="Objectives"
              description="Tahapan yang harus diselesaikan pemain."
            />

            <Button
              type="button"
              variant="outline"
              onClick={
                addObjective
              }
              className="h-9 cursor-pointer gap-2 rounded-lg px-3 text-xs"
            >
              <Plus className="size-3.5" />

              Add Objective
            </Button>
          </div>

          {objectives.length >
          0 ? (
            <div className="mt-6 space-y-3">
              {objectives.map(
                (
                  objective,
                  index,
                ) => (
                  <ObjectiveRow
                    key={
                      objective.id
                    }
                    index={
                      index
                    }
                    objective={
                      objective
                    }
                    onTypeChange={(
                      type,
                    ) =>
                      changeObjectiveType(
                        objective.id,
                        type,
                      )
                    }
                    onChange={(
                      field,
                      value,
                    ) =>
                      updateObjective(
                        objective.id,
                        field,
                        value,
                      )
                    }
                    onRemove={() =>
                      removeObjective(
                        objective.id,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="mt-6 flex min-h-[110px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10">
              <div className="text-center">
                <ScrollText className="mx-auto size-5 text-muted-foreground" />

                <p className="mt-2 text-sm text-muted-foreground">
                  No objectives added.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 04 REWARDS                                                       */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="04"
            title="Rewards"
            description="Reward yang diterima pemain."
          />

          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* EXP */}

            <Field label="EXP">
              <input
                type="number"
                min="0"
                value={
                  form.expReward
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "expReward",
                    event.target
                      .value,
                  )
                }
                placeholder="0"
                className={inputClass()}
              />
            </Field>

            {/* SPINA */}

            <Field label="Spina">
              <div className="relative">
                <Coins className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="number"
                  min="0"
                  value={
                    form.spinaReward
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "spinaReward",
                      event.target
                        .value,
                    )
                  }
                  placeholder="0"
                  className={`${inputClass()} pl-10`}
                />
              </div>
            </Field>
          </div>

          {/* ITEM REWARDS */}

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Reward Items
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Item reward jika tersedia.
                </p>
              </div>

              <RewardItemSelect
                selectedItems={
                  rewardItems
                }
                onSelect={
                  addRewardItem
                }
              />
            </div>

            {rewardItems.length >
              0 && (
              <div className="mt-4 border-y border-border">
                <div className="grid grid-cols-[minmax(0,1fr)_150px_52px] gap-4 bg-muted/15 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Item
                  </span>

                  <span className="text-xs font-medium text-muted-foreground">
                    Quantity
                  </span>

                  <span />
                </div>

                {rewardItems.map(
                  (reward) => (
                    <div
                      key={
                        reward.id
                      }
                      className="grid grid-cols-[minmax(0,1fr)_150px_52px] items-center gap-4 border-t border-border px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Package className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {
                              reward.name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {
                              reward.category
                            }
                          </p>
                        </div>
                      </div>

                      <input
                        type="number"
                        min="1"
                        value={
                          reward.quantity
                        }
                        onChange={(
                          event,
                        ) =>
                          updateRewardItem(
                            reward.id,
                            event
                              .target
                              .value,
                          )
                        }
                        className={inputClass()}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeRewardItem(
                            reward.id,
                          )
                        }
                        className="size-9 cursor-pointer text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 05 NOTES                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="05"
            title="Notes"
            description="Catatan tambahan side quest."
            optional
          />

          <div className="mt-6">
            <textarea
              value={
                form.notes
              }
              maxLength={
                1000
              }
              onChange={(
                event,
              ) =>
                updateField(
                  "notes",
                  event.target
                    .value,
                )
              }
              placeholder="Add notes..."
              className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-muted-foreground">
                {
                  form.notes.length
                }
                /1000
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOOTER                                                           */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-6 border-t border-border bg-muted/[0.08] px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              navigate(
                "/data/worlds/side-quests",
              )
            }
            className="h-10 cursor-pointer px-4"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
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
              className="h-10 cursor-pointer px-4"
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
              className="h-10 cursor-pointer px-4"
            >
              {savingAction ===
              "PUBLISHED"
                ? "Publishing..."
                : "Publish Side Quest"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* OBJECTIVE ROW                                                              */
/* -------------------------------------------------------------------------- */

function ObjectiveRow({
  index,
  objective,
  onTypeChange,
  onChange,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-border">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          Objective{" "}
          {index + 1}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={
            onRemove
          }
          className="size-8 cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* CONTENT */}

      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-5 p-4">
        {/* TYPE */}

        <Field label="Objective Type">
          <SimpleSelect
            value={
              objective.type
            }
            options={
              objectiveTypes
            }
            onChange={
              onTypeChange
            }
          />
        </Field>

        {/* COLLECT ITEM */}

        {objective.type ===
          "COLLECT_ITEM" && (
          <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4">
            <Field label="Item">
              <SearchableEntitySelect
                value={
                  objective.itemId
                }
                options={
                  itemOptions
                }
                placeholder="Select item"
                searchPlaceholder="Search item..."
                icon={
                  Package
                }
                onChange={(
                  value,
                ) =>
                  onChange(
                    "itemId",
                    value,
                  )
                }
              />
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                min="1"
                value={
                  objective.quantity
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
                className={inputClass()}
              />
            </Field>
          </div>
        )}

        {/* DEFEAT MONSTER */}

        {objective.type ===
          "DEFEAT_MONSTER" && (
          <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4">
            <Field label="Monster">
              <SearchableEntitySelect
                value={
                  objective.monsterId
                }
                options={
                  monsterOptions
                }
                placeholder="Select monster"
                searchPlaceholder="Search monster..."
                onChange={(
                  value,
                ) =>
                  onChange(
                    "monsterId",
                    value,
                  )
                }
              />
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                min="1"
                value={
                  objective.quantity
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
                className={inputClass()}
              />
            </Field>
          </div>
        )}

        {/* TALK NPC */}

        {objective.type ===
          "TALK_NPC" && (
          <Field label="NPC">
            <SearchableEntitySelect
              value={
                objective.npcId
              }
              options={
                npcOptions
              }
              placeholder="Select NPC"
              searchPlaceholder="Search NPC..."
              icon={
                UserRound
              }
              onChange={(
                value,
              ) =>
                onChange(
                  "npcId",
                  value,
                )
              }
            />
          </Field>
        )}

        {/* OTHER */}

        {objective.type ===
          "OTHER" && (
          <Field label="Objective">
            <input
              type="text"
              value={
                objective.description
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
              placeholder="Describe objective"
              className={inputClass()}
            />
          </Field>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCHABLE ENTITY SELECT                                                   */
/* -------------------------------------------------------------------------- */

function SearchableEntitySelect({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  icon: Icon,
  onChange,
  clearable = false,
}) {
  const [
    search,
    setSearch,
  ] = useState("")

  const selected =
    options.find(
      (option) =>
        option.id === value,
    ) || null

  const filtered =
    options.filter(
      (option) =>
        option.name
          .toLowerCase()
          .includes(
            search
              .toLowerCase(),
          ),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full cursor-pointer justify-between rounded-lg px-3.5 font-normal"
          />
        }
      >
        <span
          className={[
            "truncate",

            selected
              ? "text-foreground"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {selected
            ? selected.name
            : placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[360px] p-1.5"
      >
        {/* SEARCH */}

        <div className="relative mb-1.5">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder={
              searchPlaceholder
            }
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <DropdownMenuGroup>
          {clearable && (
            <DropdownMenuItem
              onClick={() =>
                onChange("")
              }
              className="cursor-pointer"
            >
              <span className="text-muted-foreground">
                {emptyLabel ||
                  "None"}
              </span>

              {!value && (
                <Check className="ml-auto size-4 text-primary" />
              )}
            </DropdownMenuItem>
          )}

          {filtered.map(
            (option) => (
              <DropdownMenuItem
                key={
                  option.id
                }
                onClick={() =>
                  onChange(
                    option.id,
                  )
                }
                className="cursor-pointer"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  {Icon && (
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {
                        option.name
                      }
                    </p>

                    {option.category && (
                      <p className="text-xs text-muted-foreground">
                        {
                          option.category
                        }
                      </p>
                    )}

                    {option.type && (
                      <p className="text-xs text-muted-foreground">
                        {
                          option.type
                        }
                      </p>
                    )}
                  </div>
                </div>

                {value ===
                  option.id && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* REWARD ITEM SELECT                                                         */
/* -------------------------------------------------------------------------- */

function RewardItemSelect({
  selectedItems,
  onSelect,
}) {
  const [
    search,
    setSearch,
  ] = useState("")

  const filtered =
    itemOptions.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(
            search
              .toLowerCase(),
          ),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 cursor-pointer gap-2 px-3 text-xs"
          />
        }
      >
        <CirclePlus className="size-3.5" />

        Add Item
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[340px] p-1.5"
      >
        <div className="relative mb-1.5">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search item..."
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <DropdownMenuGroup>
          {filtered.map(
            (item) => {
              const selected =
                selectedItems.some(
                  (reward) =>
                    reward.itemId ===
                    item.id,
                )

              return (
                <DropdownMenuItem
                  key={
                    item.id
                  }
                  disabled={
                    selected
                  }
                  onClick={() =>
                    onSelect(
                      item,
                    )
                  }
                  className="cursor-pointer"
                >
                  <Package className="mr-2 size-4 text-muted-foreground" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {
                        item.name
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {
                        item.category
                      }
                    </p>
                  </div>

                  {selected && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              )
            },
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* SIMPLE SELECT                                                              */
/* -------------------------------------------------------------------------- */

function SimpleSelect({
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
            className="h-11 w-full cursor-pointer justify-between rounded-lg px-3.5 font-normal"
          />
        }
      >
        <span>
          {
            selected.label
          }
        </span>

        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-[200px]"
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
                className="cursor-pointer"
              >
                {
                  option.label
                }

                {value ===
                  option.value && (
                  <Check className="ml-auto size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
        {label}

        {required && (
          <span className="text-destructive">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
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
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function inputClass(
  error = false,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground",

    error
      ? "border-destructive focus:border-destructive focus:ring-3 focus:ring-destructive/10"
      : "border-border focus:border-primary/40 focus:ring-3 focus:ring-primary/10",
  ].join(" ")
}

function createSlug(
  value,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      "",
    )
    .replace(
      /\s+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    )
}
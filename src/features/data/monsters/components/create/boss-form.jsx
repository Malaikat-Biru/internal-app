import {
  Check,
  ChevronDown,
  LockKeyhole,
  MapPinned,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* INTERRUPT                                                                  */
/* -------------------------------------------------------------------------- */

const interruptStatusOptions = [
  {
    value: "ALLOWED",
    label: "Allowed",
  },
  {
    value: "AVOID",
    label: "Avoid",
  },
  {
    value: "IMMUNE",
    label: "Immune",
  },
  {
    value: "CONDITIONAL",
    label: "Conditional",
  },
]

const interruptOptions = [
  {
    value: "FLINCH",
    label: "Flinch",
  },
  {
    value: "TUMBLE",
    label: "Tumble",
  },
  {
    value: "STUN",
    label: "Stun",
  },
]

/* -------------------------------------------------------------------------- */
/* DIFFICULTY                                                                 */
/* -------------------------------------------------------------------------- */

const difficultyOptions = [
  {
    value: "EASY",
    label: "Easy",
  },
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "HARD",
    label: "Hard",
  },
  {
    value: "NIGHTMARE",
    label: "Nightmare",
  },
  {
    value: "ULTIMATE",
    label: "Ultimate",
  },
]

/* -------------------------------------------------------------------------- */
/* DROP RARITY                                                                */
/* -------------------------------------------------------------------------- */

const dropRarityOptions = [
  {
    value: "COMMON",
    label: "Common",
  },
  {
    value: "UNCOMMON",
    label: "Uncommon",
  },
  {
    value: "RARE",
    label: "Rare",
  },
  {
    value: "VERY_RARE",
    label: "Very Rare",
  },
]

/* -------------------------------------------------------------------------- */
/* BOSS FORM                                                                  */
/* -------------------------------------------------------------------------- */

export default function BossForm({
  data,
  setForm,
  elementOptions,
  mapOptions,
  itemOptions,
  createLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const bossDropOptions =
    useMemo(() => {
      return data.drops
        .map((drop) => {
          const item =
            itemOptions.find(
              (candidate) =>
                candidate.id ===
                drop.itemId,
            )

          if (!item) {
            return null
          }

          return {
            id: item.id,
            name: item.name,
            category:
              item.category,
            rarity:
              drop.rarity,
            minimumDifficulty:
              drop.minimumDifficulty,
          }
        })
        .filter(Boolean)
    }, [
      data.drops,
      itemOptions,
    ])

  /* ---------------------------------------------------------------------- */
  /* GENERAL UPDATE                                                         */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,
          [field]: value,
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* BASE STATS                                                             */
  /* ---------------------------------------------------------------------- */

  function updateBaseStats(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          baseStats: {
            ...current.boss
              .baseStats,

            [field]:
              value,
          },
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* DIFFICULTY                                                             */
  /* ---------------------------------------------------------------------- */

  function updateDifficulty(
    mode,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          difficulties:
            current.boss.difficulties.map(
              (difficulty) =>
                difficulty.mode ===
                mode
                  ? {
                      ...difficulty,
                      [field]:
                        value,
                    }
                  : difficulty,
            ),
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* INTERRUPT                                                              */
  /* ---------------------------------------------------------------------- */

  function updateInterrupt(
    interrupt,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          interruptRules:
            current.boss.interruptRules.map(
              (rule) =>
                rule.interrupt ===
                interrupt
                  ? {
                      ...rule,
                      [field]:
                        value,
                    }
                  : rule,
            ),
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* FIGHT FLOW                                                             */
  /* ---------------------------------------------------------------------- */

  function addFightStep() {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          fightFlow: [
            ...current.boss
              .fightFlow,

            {
              id:
                createLocalId(),

              title: "",
              description: "",
            },
          ],
        },
      }),
    )
  }

  function updateFightStep(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          fightFlow:
            current.boss.fightFlow.map(
              (step) =>
                step.id === id
                  ? {
                      ...step,
                      [field]:
                        value,
                    }
                  : step,
            ),
        },
      }),
    )
  }

  function removeFightStep(
    id,
  ) {
    setForm(
      (current) => {
        if (
          current.boss
            .fightFlow.length <=
          1
        ) {
          return current
        }

        return {
          ...current,

          boss: {
            ...current.boss,

            fightFlow:
              current.boss.fightFlow.filter(
                (step) =>
                  step.id !== id,
              ),
          },
        }
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* BREAK PART                                                             */
  /* ---------------------------------------------------------------------- */

  function addBreakPart() {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          breakParts: [
            ...current.boss
              .breakParts,

            {
              id:
                createLocalId(),

              part: "",
              interrupt: "",
              breakDropItemId: "",
            },
          ],
        },
      }),
    )
  }

  function updateBreakPart(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          breakParts:
            current.boss.breakParts.map(
              (part) =>
                part.id === id
                  ? {
                      ...part,
                      [field]:
                        value,
                    }
                  : part,
            ),
        },
      }),
    )
  }

  function removeBreakPart(
    id,
  ) {
    setForm(
      (current) => {
        if (
          current.boss
            .breakParts.length <=
          1
        ) {
          return current
        }

        return {
          ...current,

          boss: {
            ...current.boss,

            breakParts:
              current.boss.breakParts.filter(
                (part) =>
                  part.id !== id,
              ),
          },
        }
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* DROPS                                                                  */
  /* ---------------------------------------------------------------------- */

  function addDrop(
    itemId,
  ) {
    const exists =
      data.drops.some(
        (drop) =>
          drop.itemId ===
          itemId,
      )

    if (exists) {
      return
    }

    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          drops: [
            ...current.boss
              .drops,

            {
              id:
                createLocalId(),

              itemId,

              minimumDifficulty:
                "EASY",

              rarity:
                "COMMON",
            },
          ],
        },
      }),
    )
  }

  function updateDrop(
    dropId,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        boss: {
          ...current.boss,

          drops:
            current.boss.drops.map(
              (drop) =>
                drop.id ===
                dropId
                  ? {
                      ...drop,
                      [field]:
                        value,
                    }
                  : drop,
            ),
        },
      }),
    )
  }

  function removeDrop(
    dropId,
  ) {
    setForm(
      (current) => {
        const removedDrop =
          current.boss.drops.find(
            (drop) =>
              drop.id ===
              dropId,
          )

        if (!removedDrop) {
          return current
        }

        return {
          ...current,

          boss: {
            ...current.boss,

            drops:
              current.boss.drops.filter(
                (drop) =>
                  drop.id !==
                  dropId,
              ),

            breakParts:
              current.boss.breakParts.map(
                (part) =>
                  part.breakDropItemId ===
                  removedDrop.itemId
                    ? {
                        ...part,
                        breakDropItemId:
                          "",
                      }
                    : part,
              ),
          },
        }
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      {/* ================================================================== */}
      {/* 02 BOSS INFORMATION                                                */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="02"
          title="Boss Information"
          description="Base stats, element, dan lokasi utama boss."
        />

        <div className="mt-6 grid grid-cols-3 gap-5">
          <NumberField
            label="Base Level"
            required
            value={
              data.baseStats
                .level
            }
            placeholder="32"
            onChange={(
              value,
            ) =>
              updateBaseStats(
                "level",
                value,
              )
            }
          />

          <NumberField
            label="Base HP"
            required
            value={
              data.baseStats
                .hp
            }
            placeholder="18000"
            onChange={(
              value,
            ) =>
              updateBaseStats(
                "hp",
                value,
              )
            }
          />

          <NumberField
            label="Base EXP"
            value={
              data.baseStats
                .exp
            }
            placeholder="420"
            onChange={(
              value,
            ) =>
              updateBaseStats(
                "exp",
                value,
              )
            }
          />

          <Field>
            <FieldLabel required>
              Element
            </FieldLabel>

            <SelectMenu
              value={
                data.element
              }
              options={
                elementOptions
              }
              placeholder="Select element"
              onChange={(
                value,
              ) =>
                updateField(
                  "element",
                  value,
                )
              }
            />
          </Field>

          <div className="col-span-2">
            <Field>
              <FieldLabel required>
                Spawn Map
              </FieldLabel>

              <SearchableSelect
                value={
                  data.mapId
                }
                options={
                  mapOptions
                }
                icon={
                  MapPinned
                }
                placeholder="Search map..."
                onChange={(
                  value,
                ) =>
                  updateField(
                    "mapId",
                    value,
                  )
                }
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 03 DIFFICULTY                                                      */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="03"
          title="Boss Difficulty"
          description="Level, HP, dan EXP untuk setiap difficulty boss."
        />

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[180px_1fr_1fr_1fr] border-b border-border bg-muted/25 px-5">
            <TableHeader>
              Difficulty
            </TableHeader>

            <TableHeader>
              Level
            </TableHeader>

            <TableHeader>
              HP
            </TableHeader>

            <TableHeader>
              EXP
            </TableHeader>
          </div>

          {data.difficulties.map(
            (
              difficulty,
            ) => (
              <div
                key={
                  difficulty.mode
                }
                className="grid grid-cols-[180px_1fr_1fr_1fr] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
              >
                <span className="text-sm font-semibold text-foreground">
                  {formatLabel(
                    difficulty.mode,
                  )}
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    difficulty.level
                  }
                  onChange={(
                    event,
                  ) =>
                    updateDifficulty(
                      difficulty.mode,
                      "level",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Level"
                  className={inputClass()}
                />

                <input
                  type="number"
                  min="0"
                  value={
                    difficulty.hp
                  }
                  onChange={(
                    event,
                  ) =>
                    updateDifficulty(
                      difficulty.mode,
                      "hp",
                      event.target
                        .value,
                    )
                  }
                  placeholder="HP"
                  className={inputClass()}
                />

                <input
                  type="number"
                  min="0"
                  value={
                    difficulty.exp
                  }
                  onChange={(
                    event,
                  ) =>
                    updateDifficulty(
                      difficulty.mode,
                      "exp",
                      event.target
                        .value,
                    )
                  }
                  placeholder="EXP"
                  className={inputClass()}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 04 DEFENSE                                                         */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="04"
          title="Defense & Resistance"
          description="Stat pertahanan dan resistance yang dimiliki boss."
        />

        <div className="mt-6 grid grid-cols-4 gap-5">
          <NumberField
            label="DEF"
            value={
              data.def
            }
            placeholder="0"
            onChange={(
              value,
            ) =>
              updateField(
                "def",
                value,
              )
            }
          />

          <NumberField
            label="MDEF"
            value={
              data.mdef
            }
            placeholder="0"
            onChange={(
              value,
            ) =>
              updateField(
                "mdef",
                value,
              )
            }
          />

          <PercentageField
            label="Physical Resist"
            value={
              data.physicalResist
            }
            onChange={(
              value,
            ) =>
              updateField(
                "physicalResist",
                value,
              )
            }
          />

          <PercentageField
            label="Magic Resist"
            value={
              data.magicResist
            }
            onChange={(
              value,
            ) =>
              updateField(
                "magicResist",
                value,
              )
            }
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* 05 INTERRUPT                                                       */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="05"
          title="Interrupt Rules"
          description="Respons boss terhadap Flinch, Tumble, dan Stun."
        />

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[170px_190px_minmax(0,1fr)] border-b border-border bg-muted/25 px-5">
            <TableHeader>
              Interrupt
            </TableHeader>

            <TableHeader>
              Status
            </TableHeader>

            <TableHeader>
              Note
            </TableHeader>
          </div>

          {data.interruptRules.map(
            (rule) => (
              <div
                key={
                  rule.interrupt
                }
                className="grid grid-cols-[170px_190px_minmax(0,1fr)] items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
              >
                <span className="text-sm font-semibold text-foreground">
                  {formatLabel(
                    rule.interrupt,
                  )}
                </span>

                <SelectMenu
                  value={
                    rule.status
                  }
                  options={
                    interruptStatusOptions
                  }
                  onChange={(
                    value,
                  ) =>
                    updateInterrupt(
                      rule.interrupt,
                      "status",
                      value,
                    )
                  }
                />

                <input
                  type="text"
                  value={
                    rule.note
                  }
                  onChange={(
                    event,
                  ) =>
                    updateInterrupt(
                      rule.interrupt,
                      "note",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Example: Opens break timing..."
                  className={inputClass()}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 06 FIGHT FLOW                                                      */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-6">
          <SectionTitle
            number="06"
            title="Fight Flow"
            description="Urutan phase, pola serangan, dan mekanik boss selama pertarungan."
            optional
          />

          <Button
            type="button"
            variant="outline"
            onClick={
              addFightStep
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Step
          </Button>
        </div>

        <div className="mt-6">
          {data.fightFlow.map(
            (
              step,
              index,
            ) => (
              <FightFlowStep
                key={
                  step.id
                }
                step={
                  step
                }
                index={
                  index
                }
                total={
                  data.fightFlow
                    .length
                }
                onChange={(
                  field,
                  value,
                ) =>
                  updateFightStep(
                    step.id,
                    field,
                    value,
                  )
                }
                onRemove={() =>
                  removeFightStep(
                    step.id,
                  )
                }
              />
            ),
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 07 BREAK PARTS                                                     */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-6">
          <SectionTitle
            number="07"
            title="Break Parts"
            description="Bagian boss yang dapat di-break dan drop boss yang terkait dengan part tersebut."
            optional
          />

          <Button
            type="button"
            variant="outline"
            onClick={
              addBreakPart
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Part
          </Button>
        </div>

        <div className="mt-6 space-y-5">
          {data.breakParts.map(
            (
              part,
              index,
            ) => (
              <div
                key={
                  part.id
                }
              >
                {/* HEADER */}

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                    Break Part{" "}
                    {index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                      data.breakParts
                        .length <=
                      1
                    }
                    onClick={() =>
                      removeBreakPart(
                        part.id,
                      )
                    }
                    className="size-8 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* FIELDS */}

                <div className="grid grid-cols-[minmax(0,1fr)_220px_minmax(0,1.2fr)] gap-5">
                  {/* PART NAME */}

                  <Field>
                    <FieldLabel>
                      Part Name
                    </FieldLabel>

                    <input
                      type="text"
                      value={
                        part.part
                      }
                      onChange={(
                        event,
                      ) =>
                        updateBreakPart(
                          part.id,
                          "part",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Example: Head"
                      className={inputClass()}
                    />
                  </Field>

                  {/* INTERRUPT */}

                  <Field>
                    <FieldLabel>
                      Interrupt
                    </FieldLabel>

                    <SelectMenu
                      value={
                        part.interrupt
                      }
                      options={
                        interruptOptions
                      }
                      placeholder="Select interrupt"
                      onChange={(
                        value,
                      ) =>
                        updateBreakPart(
                          part.id,
                          "interrupt",
                          value,
                        )
                      }
                    />
                  </Field>

                  {/* BREAK DROP */}

                  <Field>
                    <FieldLabel>
                      Break Drop
                    </FieldLabel>

                    {bossDropOptions.length >
                    0 ? (
                      <BossDropSelect
                        value={
                          part.breakDropItemId
                        }
                        options={
                          bossDropOptions
                        }
                        placeholder="Select boss drop..."
                        onChange={(
                          value,
                        ) =>
                          updateBreakPart(
                            part.id,
                            "breakDropItemId",
                            value,
                          )
                        }
                      />
                    ) : (
                      <DisabledValueField
                        value="Add boss drop first"
                      />
                    )}
                  </Field>
                </div>

                {index <
                  data.breakParts
                    .length -
                    1 && (
                  <div className="mt-5 border-t border-border" />
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 08 ITEM DROPS                                                      */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="08"
          title="Item Drops"
          description="Item drop boss beserta minimum difficulty dan tingkat kelangkaan drop."
        />

        <div className="mt-6">
          <DropsEditor
            value={
              data.drops
            }
            itemOptions={
              itemOptions
            }
            onAdd={
              addDrop
            }
            onUpdate={
              updateDrop
            }
            onRemove={
              removeDrop
            }
          />
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* FIGHT FLOW STEP                                                            */
/* -------------------------------------------------------------------------- */

function FightFlowStep({
  step,
  index,
  total,
  onChange,
  onRemove,
}) {
  const isLast =
    index ===
    total - 1

  return (
    <div className="relative flex gap-5">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.08] text-xs font-semibold text-primary">
          {index + 1}
        </div>

        {!isLast && (
          <div className="my-2 w-px flex-1 bg-border" />
        )}
      </div>

      <div
        className={[
          "min-w-0 flex-1",

          !isLast
            ? "pb-6"
            : "",
        ].join(" ")}
      >
        <div className="flex items-start gap-4">
          <div className="grid min-w-0 flex-1 grid-cols-[280px_minmax(0,1fr)] gap-5">
            <Field>
              <FieldLabel>
                Step Title
              </FieldLabel>

              <input
                type="text"
                value={
                  step.title
                }
                onChange={(
                  event,
                ) =>
                  onChange(
                    "title",
                    event.target
                      .value,
                  )
                }
                maxLength={100}
                placeholder="Example: Opening Phase"
                className={inputClass()}
              />
            </Field>

            <Field>
              <FieldLabel>
                Fight Description
              </FieldLabel>

              <textarea
                value={
                  step.description
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
                rows={3}
                maxLength={1000}
                placeholder="Describe what happens during this step..."
                className={textareaClass()}
              />
            </Field>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={
              total <= 1
            }
            onClick={
              onRemove
            }
            className="mt-7 size-9 shrink-0 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DROP EDITOR                                                                */
/* -------------------------------------------------------------------------- */

function DropsEditor({
  value,
  itemOptions,
  onAdd,
  onUpdate,
  onRemove,
}) {
  const selectedItemIds =
    value.map(
      (drop) =>
        drop.itemId,
    )

  const availableItems =
    itemOptions.filter(
      (item) =>
        !selectedItemIds.includes(
          item.id,
        ),
    )

  return (
    <div>
      <ItemDropSelect
        options={
          availableItems
        }
        onChange={
          onAdd
        }
        placeholder="Search item to add..."
      />

      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map(
            (drop) => {
              const item =
                itemOptions.find(
                  (candidate) =>
                    candidate.id ===
                    drop.itemId,
                )

              if (!item) {
                return null
              }

              return (
                <div
                  key={
                    drop.id
                  }
                  className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_190px_180px_36px] items-center gap-4 rounded-xl border border-border bg-muted/[0.08] px-4 py-3"
                >
                  {/* ITEM */}

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
                        {formatItemCategory(
                          item.category,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* MINIMUM DIFFICULTY */}

                  <CompactSelect
                    label="Minimum Difficulty"
                    value={
                      drop.minimumDifficulty
                    }
                    options={
                      difficultyOptions
                    }
                    onChange={(
                      selectedValue,
                    ) =>
                      onUpdate(
                        drop.id,
                        "minimumDifficulty",
                        selectedValue,
                      )
                    }
                  />

                  {/* RARITY */}

                  <CompactSelect
                    label="Drop Rarity"
                    value={
                      drop.rarity
                    }
                    options={
                      dropRarityOptions
                    }
                    onChange={(
                      selectedValue,
                    ) =>
                      onUpdate(
                        drop.id,
                        "rarity",
                        selectedValue,
                      )
                    }
                  />

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        drop.id,
                      )
                    }
                    className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* BOSS DROP SELECT                                                           */
/* -------------------------------------------------------------------------- */

function BossDropSelect({
  value,
  options,
  onChange,
  placeholder,
}) {
  const rootRef =
    useRef(null)

  const [
    open,
    setOpen,
  ] = useState(false)

  const selected =
    options.find(
      (option) =>
        option.id ===
        value,
    ) || null

  useEffect(() => {
    function handleOutside(
      event,
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
    }
  }, [])

  function selectOption(
    option,
  ) {
    onChange(
      option.id,
    )

    setOpen(false)
  }

  function clearSelection(
    event,
  ) {
    event.stopPropagation()

    onChange("")
    setOpen(false)
  }

  return (
    <div
      ref={
        rootRef
      }
      className="relative"
    >
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
            "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border px-3.5 text-left outline-none transition-all",

            selected
              ? "bg-background"
              : "bg-muted/20",

            open
              ? "border-primary/40 ring-3 ring-primary/10"
              : "hover:bg-muted/30",
          ].join(" ")}
        >
          <Package className="size-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0 flex-1">
            {selected ? (
              <>
                <p className="truncate text-sm font-medium text-foreground">
                  {
                    selected.name
                  }
                </p>

                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {formatItemCategory(
                    selected.category,
                  )}
                  {" • "}
                  {formatLabel(
                    selected.minimumDifficulty,
                  )}
                  {" • "}
                  {formatLabel(
                    selected.rarity,
                  )}
                </p>
              </>
            ) : (
              <p className="truncate text-sm text-muted-foreground">
                {
                  placeholder
                }
              </p>
            )}
          </div>

          <ChevronDown
            className={[
              "size-4 shrink-0 text-muted-foreground transition-transform",

              open
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {selected && (
          <button
            type="button"
            onClick={
              clearSelection
            }
            className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="max-h-[260px] overflow-y-auto p-1.5">
            {options.map(
              (option) => (
                <button
                  key={
                    option.id
                  }
                  type="button"
                  onClick={() =>
                    selectOption(
                      option,
                    )
                  }
                  className={[
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",

                    option.id ===
                    value
                      ? "bg-primary/[0.07] text-primary"
                      : "text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Package className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {
                        option.name
                      }
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {formatItemCategory(
                        option.category,
                      )}
                      {" • "}
                      Min.{" "}
                      {formatLabel(
                        option.minimumDifficulty,
                      )}
                      {" • "}
                      {formatLabel(
                        option.rarity,
                      )}
                    </p>
                  </div>

                  {option.id ===
                    value && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ITEM DROP SELECT                                                           */
/* -------------------------------------------------------------------------- */

function ItemDropSelect({
  options,
  onChange,
  placeholder,
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

  const filtered =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return options.slice(
          0,
          20,
        )
      }

      return options
        .filter(
          (item) => {
            const itemName =
              item.name
                ?.toLowerCase() ||
              ""

            const category =
              formatItemCategory(
                item.category,
              ).toLowerCase()

            return (
              itemName.includes(
                keyword,
              ) ||
              category.includes(
                keyword,
              )
            )
          },
        )
        .slice(
          0,
          20,
        )
    }, [
      options,
      search,
    ])

  useEffect(() => {
    function handleOutside(
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
      handleOutside,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)

    return () =>
      clearTimeout(
        timeout,
      )
  }, [open])

  function selectItem(
    item,
  ) {
    onChange(
      item.id,
    )

    setOpen(false)
    setSearch("")
  }

  return (
    <div
      ref={
        rootRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className={[
          "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/20 px-3.5 text-left outline-none transition-all",

          open
            ? "border-primary/40 bg-background ring-3 ring-primary/10"
            : "hover:bg-muted/30",
        ].join(" ")}
      >
        <Package className="size-4 shrink-0 text-muted-foreground" />

        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          {placeholder}
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

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                ref={
                  inputRef
                }
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
                placeholder="Search item or category..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1.5">
            {filtered.length >
            0 ? (
              filtered.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() =>
                      selectItem(
                        item,
                      )
                    }
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Package className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatItemCategory(
                          item.category,
                        )}
                      </p>
                    </div>
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center px-4">
                <p className="text-xs text-muted-foreground">
                  No items found.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCHABLE SELECT                                                          */
/* -------------------------------------------------------------------------- */

function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
  icon: Icon = Search,
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

  const selected =
    options.find(
      (option) =>
        option.id ===
        value,
    ) || null

  const filtered =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return options.slice(
          0,
          20,
        )
      }

      return options
        .filter(
          (option) =>
            option.name
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
      options,
      search,
    ])

  useEffect(() => {
    function handleOutside(
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
      handleOutside,
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
    }
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)

    return () =>
      clearTimeout(
        timeout,
      )
  }, [open])

  function selectOption(
    option,
  ) {
    onChange(
      option.id,
    )

    setOpen(false)
    setSearch("")
  }

  function clearSelection(
    event,
  ) {
    event.stopPropagation()

    onChange("")
    setOpen(false)
    setSearch("")
  }

  return (
    <div
      ref={
        rootRef
      }
      className="relative min-w-0"
    >
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
            "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border px-3.5 text-left outline-none transition-all",

            selected
              ? "bg-background"
              : "bg-muted/20",

            open
              ? "border-primary/40 ring-3 ring-primary/10"
              : "hover:bg-muted/30",
          ].join(" ")}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />

          <span
            className={[
              "min-w-0 flex-1 truncate text-sm",

              selected
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {selected
              ? selected.name
              : placeholder}
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

        {selected && (
          <button
            type="button"
            onClick={
              clearSelection
            }
            className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                ref={
                  inputRef
                }
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
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
              />
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto p-1.5">
            {filtered.length >
            0 ? (
              filtered.map(
                (option) => (
                  <button
                    key={
                      option.id
                    }
                    type="button"
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                    className={[
                      "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",

                      option.id ===
                      value
                        ? "bg-primary/[0.07] text-primary"
                        : "text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {
                        option.name
                      }
                    </span>

                    {option.id ===
                      value && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center px-4">
                <p className="text-xs text-muted-foreground">
                  No data found.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* COMPACT SELECT                                                             */
/* -------------------------------------------------------------------------- */

function CompactSelect({
  label,
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
            className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-0.5 truncate text-xs font-medium text-foreground">
            {selected?.label ||
              "Select"}
          </p>
        </div>

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
                className="flex cursor-pointer items-center justify-between gap-4 text-sm"
              >
                <span>
                  {
                    option.label
                  }
                </span>

                {option.value ===
                  value && (
                  <Check className="size-4 text-primary" />
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
/* SIMPLE SELECT                                                              */
/* -------------------------------------------------------------------------- */

function SelectMenu({
  value,
  options,
  onChange,
  placeholder,
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
            className={[
              "flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-3.5 text-left outline-none transition-colors",

              selected
                ? "bg-background"
                : "bg-muted/20",

              "hover:bg-muted/30",
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
                className="flex cursor-pointer items-center justify-between gap-4 text-sm"
              >
                <span>
                  {
                    option.label
                  }
                </span>

                {option.value ===
                  value && (
                  <Check className="size-4 text-primary" />
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
/* DISABLED FIELD                                                             */
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
/* SECTION TITLE                                                              */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  number,
  title,
  description,
  optional = false,
}) {
  return (
    <div className="flex items-start justify-between gap-6">
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
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Optional
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
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
    <div className="py-3 text-xs font-semibold uppercase tracking-[0.05em] text-muted-foreground">
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NUMBER FIELD                                                               */
/* -------------------------------------------------------------------------- */

function NumberField({
  label,
  required = false,
  value,
  placeholder,
  onChange,
}) {
  return (
    <Field>
      <FieldLabel
        required={
          required
        }
      >
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className={inputClass()}
      />
    </Field>
  )
}

/* -------------------------------------------------------------------------- */
/* PERCENTAGE FIELD                                                           */
/* -------------------------------------------------------------------------- */

function PercentageField({
  label,
  value,
  onChange,
}) {
  return (
    <Field>
      <FieldLabel>
        {label}
      </FieldLabel>

      <div className="relative">
        <input
          type="number"
          value={
            value
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder="0"
          className={`${inputClass()} pr-10`}
        />

        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
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

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass() {
  return "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

/* -------------------------------------------------------------------------- */
/* TEXTAREA                                                                   */
/* -------------------------------------------------------------------------- */

function textareaClass() {
  return "min-h-[96px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

/* -------------------------------------------------------------------------- */
/* ITEM CATEGORY                                                              */
/* -------------------------------------------------------------------------- */

function formatItemCategory(
  category,
) {
  const labels = {
    MATERIAL:
      "Material",

    EQUIPMENT:
      "Equipment",

    WEAPON:
      "Weapon",

    ARMOR:
      "Armor",

    ADDITIONAL:
      "Additional",

    SPECIAL:
      "Special Gear",

    CRYSTA:
      "Crysta",

    CONSUMABLE:
      "Consumable",

    USABLE:
      "Usable",

    COLLECTIBLE:
      "Collectible",

    OTHER:
      "Other",
  }

  return (
    labels[category] ||
    category ||
    "Unknown"
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatLabel(
  value,
) {
  if (!value) {
    return "—"
  }

  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    )
}
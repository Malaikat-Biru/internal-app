import {
  Check,
  ChevronDown,
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
/* MINI BOSS FORM                                                             */
/* -------------------------------------------------------------------------- */

export default function MiniBossForm({
  data,
  setForm,
  elementOptions,
  mapOptions,
  itemOptions,
  createLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,
          [field]: value,
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* DROPS                                                                  */
  /* ---------------------------------------------------------------------- */

  function addDrop(
    itemId,
  ) {
    const alreadyExists =
      data.drops.some(
        (drop) =>
          drop.itemId ===
          itemId,
      )

    if (alreadyExists) {
      return
    }

    setForm(
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,

          drops: [
            ...current.miniBoss
              .drops,

            {
              id:
                createLocalId(),

              itemId,

              rarity:
                "COMMON",
            },
          ],
        },
      }),
    )
  }

  function updateDropRarity(
    dropId,
    rarity,
  ) {
    setForm(
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,

          drops:
            current.miniBoss.drops.map(
              (drop) =>
                drop.id ===
                dropId
                  ? {
                      ...drop,
                      rarity,
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
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,

          drops:
            current.miniBoss.drops.filter(
              (drop) =>
                drop.id !==
                dropId,
            ),
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* COMBAT FLOW                                                            */
  /* ---------------------------------------------------------------------- */

  function addCombatStep() {
    setForm(
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,

          combatFlow: [
            ...current.miniBoss
              .combatFlow,

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

  function updateCombatStep(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        miniBoss: {
          ...current.miniBoss,

          combatFlow:
            current.miniBoss.combatFlow.map(
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

  function removeCombatStep(
    id,
  ) {
    setForm(
      (current) => {
        if (
          current.miniBoss
            .combatFlow.length <=
          1
        ) {
          return current
        }

        return {
          ...current,

          miniBoss: {
            ...current.miniBoss,

            combatFlow:
              current.miniBoss.combatFlow.filter(
                (step) =>
                  step.id !== id,
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
      {/* 02 MINI BOSS INFORMATION                                           */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="02"
          title="Mini Boss Information"
          description="Informasi utama mini boss seperti level, HP, EXP, element, lokasi spawn, dan item drop."
        />

        <div className="mt-6 grid grid-cols-3 gap-5">
          {/* LEVEL */}

          <NumberField
            label="Level"
            required
            value={
              data.level
            }
            placeholder="35"
            onChange={(
              value,
            ) =>
              updateField(
                "level",
                value,
              )
            }
          />

          {/* HP */}

          <NumberField
            label="HP"
            required
            value={
              data.hp
            }
            placeholder="15000"
            onChange={(
              value,
            ) =>
              updateField(
                "hp",
                value,
              )
            }
          />

          {/* EXP */}

          <NumberField
            label="EXP"
            value={
              data.exp
            }
            placeholder="540"
            onChange={(
              value,
            ) =>
              updateField(
                "exp",
                value,
              )
            }
          />

          {/* ELEMENT */}

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

          {/* SPAWN MAP */}

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

        {/* ================================================================= */}
        {/* ITEM DROPS                                                        */}
        {/* ================================================================= */}

        <div className="mt-6 border-t border-border pt-5">
          <FieldLabel>
            Item Drops
          </FieldLabel>

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
            onRarityChange={
              updateDropRarity
            }
            onRemove={
              removeDrop
            }
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* 03 DEFENSE & RESISTANCE                                            */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <SectionTitle
          number="03"
          title="Defense & Resistance"
          description="Stat pertahanan dan resistance yang dimiliki mini boss."
        />

        <div className="mt-6 grid grid-cols-4 gap-5">
          {/* DEF */}

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

          {/* MDEF */}

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

          {/* PHYSICAL RESIST */}

          <PercentageField
            label="Physical Resist"
            value={
              data.physicalResist
            }
            placeholder="0"
            onChange={(
              value,
            ) =>
              updateField(
                "physicalResist",
                value,
              )
            }
          />

          {/* MAGIC RESIST */}

          <PercentageField
            label="Magic Resist"
            value={
              data.magicResist
            }
            placeholder="0"
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
      {/* 04 COMBAT FLOW                                                     */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-6">
          <SectionTitle
            number="04"
            title="Combat Flow"
            description="Urutan pola serangan, mekanik, dan perubahan perilaku mini boss selama pertarungan."
            optional
          />

          <Button
            type="button"
            variant="outline"
            onClick={
              addCombatStep
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Step
          </Button>
        </div>

        <div className="mt-6">
          {data.combatFlow.map(
            (
              step,
              index,
            ) => (
              <CombatFlowStep
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
                  data.combatFlow
                    .length
                }
                onChange={(
                  field,
                  value,
                ) =>
                  updateCombatStep(
                    step.id,
                    field,
                    value,
                  )
                }
                onRemove={() =>
                  removeCombatStep(
                    step.id,
                  )
                }
              />
            ),
          )}
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* COMBAT FLOW STEP                                                           */
/* -------------------------------------------------------------------------- */

function CombatFlowStep({
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
      {/* TIMELINE */}

      <div className="flex w-8 shrink-0 flex-col items-center">
        <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.08] text-xs font-semibold text-primary">
          {index + 1}
        </div>

        {!isLast && (
          <div className="my-2 w-px flex-1 bg-border" />
        )}
      </div>

      {/* CONTENT */}

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
            {/* TITLE */}

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

            {/* DESCRIPTION */}

            <Field>
              <FieldLabel>
                Combat Description
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
/* DROPS                                                                      */
/* -------------------------------------------------------------------------- */

function DropsEditor({
  value,
  itemOptions,
  onAdd,
  onRarityChange,
  onRemove,
}) {
  const selectedItemIds =
    value.map(
      (drop) =>
        drop.itemId,
    )

  const available =
    itemOptions.filter(
      (item) =>
        !selectedItemIds.includes(
          item.id,
        ),
    )

  return (
    <div>
      {/* SEARCH ITEM */}

      <ItemDropSelect
        options={
          available
        }
        placeholder="Search item to add..."
        onChange={
          onAdd
        }
      />

      {/* SELECTED DROPS */}

      {value.length > 0 && (
        <div className="mt-3 space-y-2">
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
                  className="grid min-h-[62px] grid-cols-[minmax(0,1fr)_200px_36px] items-center gap-4 rounded-xl border border-border bg-muted/[0.08] px-3.5 py-2.5"
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

                  {/* DROP RARITY */}

                  <DropRaritySelect
                    value={
                      drop.rarity
                    }
                    onChange={(
                      rarity,
                    ) =>
                      onRarityChange(
                        drop.id,
                        rarity,
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
/* DROP RARITY SELECT                                                         */
/* -------------------------------------------------------------------------- */

function DropRaritySelect({
  value,
  onChange,
}) {
  const selected =
    dropRarityOptions.find(
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
            className="flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Drop Rarity
          </p>

          <p className="mt-0.5 truncate text-xs font-medium text-foreground">
            {selected?.label ||
              "Select rarity"}
          </p>
        </div>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[180px]"
      >
        <DropdownMenuGroup>
          {dropRarityOptions.map(
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
/* ITEM DROP SELECT                                                           */
/* -------------------------------------------------------------------------- */

function ItemDropSelect({
  options,
  onChange,
  placeholder = "Search item...",
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
            const name =
              item.name
                ?.toLowerCase() ||
              ""

            const category =
              formatItemCategory(
                item.category,
              ).toLowerCase()

            return (
              name.includes(
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

  /* ---------------------------------------------------------------------- */
  /* OUTSIDE CLICK                                                          */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* AUTO FOCUS                                                             */
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
      clearTimeout(
        timeout,
      )
  }, [open])

  /* ---------------------------------------------------------------------- */
  /* SELECT                                                                 */
  /* ---------------------------------------------------------------------- */

  function selectItem(
    item,
  ) {
    onChange(
      item.id,
    )

    setOpen(false)
    setSearch("")
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

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
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {/* SEARCH */}

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

          {/* OPTIONS */}

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
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
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

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {formatItemCategory(
                          item.category,
                        )}
                      </p>
                    </div>
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center px-4 text-center">
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

  /* ---------------------------------------------------------------------- */
  /* OUTSIDE CLICK                                                          */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* AUTO FOCUS                                                             */
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
      clearTimeout(
        timeout,
      )
  }, [open])

  /* ---------------------------------------------------------------------- */
  /* SELECT                                                                 */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

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
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {/* SEARCH */}

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

          {/* OPTIONS */}

          <div className="max-h-[240px] overflow-y-auto p-1.5">
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
/* SELECT                                                                     */
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
        className="min-w-[220px]"
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
                className="cursor-pointer text-sm"
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
  placeholder = "0",
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
          placeholder={
            placeholder
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
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
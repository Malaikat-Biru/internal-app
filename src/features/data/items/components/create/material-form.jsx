import {
  Award,
  Check,
  ChevronDown,
  Gift,
  Package,
  Plus,
  Search,
  Trash2,
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
/* MATERIAL TYPE                                                              */
/* -------------------------------------------------------------------------- */

const materialTypeOptions = [
  {
    value: "METAL",
    label: "Metal",
  },
  {
    value: "CLOTH",
    label: "Cloth",
  },
  {
    value: "BEAST",
    label: "Beast",
  },
  {
    value: "WOOD",
    label: "Wood",
  },
  {
    value: "MEDICINE",
    label: "Medicine",
  },
  {
    value: "MANA",
    label: "Mana",
  },
]

/* -------------------------------------------------------------------------- */
/* OTHER USE TYPE                                                             */
/* -------------------------------------------------------------------------- */

const otherUseTypeOptions = [
  {
    value: "FURNITURE",
    label: "Furniture",
  },
  {
    value: "HOUSING",
    label: "Housing",
  },
  {
    value: "ALCHEMY",
    label: "Alchemy",
  },
  {
    value: "QUEST",
    label: "Quest",
  },
  {
    value: "EXCHANGE",
    label: "Exchange",
  },
  {
    value: "SYSTEM",
    label: "Game System",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

/* -------------------------------------------------------------------------- */
/* REWARD                                                                     */
/* -------------------------------------------------------------------------- */

const rewardTypeOptions = [
  {
    value: "QUEST",
    label: "Quest Reward",
  },
  {
    value: "EMBLEM",
    label: "Emblem Reward",
  },
  {
    value: "EVENT",
    label: "Event Reward",
  },
  {
    value: "ACHIEVEMENT",
    label: "Achievement Reward",
  },
  {
    value: "LOGIN",
    label: "Login Reward",
  },
  {
    value: "MISSION",
    label: "Mission Reward",
  },
  {
    value: "OTHER",
    label: "Other Reward",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK MONSTERS                                                              */
/* -------------------------------------------------------------------------- */

const defaultMonsterOptions = [
  {
    id: "MONSTER-001",
    name: "Minotaur",
    type: "BOSS",
    level: 42,
  },
  {
    id: "MONSTER-002",
    name: "Forest Wolf",
    type: "BOSS",
    level: 30,
  },
  {
    id: "MONSTER-003",
    name: "Warmonger",
    type: "MINI_BOSS",
    level: 54,
  },
  {
    id: "MONSTER-004",
    name: "Goblin",
    type: "NORMAL",
    level: 20,
  },
  {
    id: "MONSTER-005",
    name: "Colon",
    type: "NORMAL",
    level: 1,
  },
]

/* -------------------------------------------------------------------------- */
/* LOCAL ID                                                                   */
/* -------------------------------------------------------------------------- */

function generateLocalId() {
  return `LOCAL-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

/* -------------------------------------------------------------------------- */
/* ACQUISITION FACTORY                                                        */
/* -------------------------------------------------------------------------- */

function createMonsterDropSource(
  createLocalId,
) {
  return {
    id:
      createLocalId(),

    type: "MONSTER_DROP",

    monsterId: "",
  }
}

function createEventExchangeSource(
  createLocalId,
) {
  return {
    id:
      createLocalId(),

    type:
      "EVENT_POINT_EXCHANGE",

    eventName: "",

    pointName: "",

    requiredPoints: "",
  }
}

function createRewardSource(
  createLocalId,
) {
  return {
    id:
      createLocalId(),

    type: "REWARD",

    rewardType: "QUEST",

    name: "",

    description: "",

    quantity: 1,
  }
}

/* -------------------------------------------------------------------------- */
/* OTHER USE FACTORY                                                          */
/* -------------------------------------------------------------------------- */

function createOtherUse(
  createLocalId,
) {
  return {
    id:
      createLocalId(),

    type: "OTHER",

    name: "",

    quantity: "",

    notes: "",
  }
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function MaterialForm({
  data,
  setForm,
  monsterOptions = defaultMonsterOptions,
  createLocalId = generateLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* SAFE DATA                                                              */
  /* ---------------------------------------------------------------------- */

  const acquisitionSources =
    Array.isArray(
      data?.acquisitionSources,
    )
      ? data.acquisitionSources
      : []

  const otherUses =
    Array.isArray(
      data?.otherUses,
    )
      ? data.otherUses
      : []

  const process =
    data?.process || {
      materialType: "",
      points: "",
    }

  /* ---------------------------------------------------------------------- */
  /* ROOT UPDATE                                                            */
  /* ---------------------------------------------------------------------- */

  function updateMaterialField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        material: {
          ...current.material,

          [field]:
            value,
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* MATERIAL TYPE                                                          */
  /* ---------------------------------------------------------------------- */

  function updateMaterialType(
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        material: {
          ...current.material,

          type:
            value,

          process: {
            ...current.material
              .process,

            /*
              Default process material type dibuat
              sama dengan material type.

              Admin masih bisa mengubahnya kalau
              ternyata data item membutuhkan value lain.
            */
            materialType:
              value,
          },
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* ACQUISITION SOURCE                                                     */
  /* ---------------------------------------------------------------------- */

  function addAcquisitionSource(
    type,
  ) {
    let source = null

    switch (type) {
      case "MONSTER_DROP":
        source =
          createMonsterDropSource(
            createLocalId,
          )
        break

      case "EVENT_POINT_EXCHANGE":
        source =
          createEventExchangeSource(
            createLocalId,
          )
        break

      case "REWARD":
        source =
          createRewardSource(
            createLocalId,
          )
        break

      default:
        return
    }

    updateMaterialField(
      "acquisitionSources",
      [
        ...acquisitionSources,
        source,
      ],
    )
  }

  function updateAcquisitionSource(
    sourceId,
    field,
    value,
  ) {
    updateMaterialField(
      "acquisitionSources",
      acquisitionSources.map(
        (source) =>
          source.id ===
          sourceId
            ? {
                ...source,

                [field]:
                  value,
              }
            : source,
      ),
    )
  }

  function removeAcquisitionSource(
    sourceId,
  ) {
    updateMaterialField(
      "acquisitionSources",
      acquisitionSources.filter(
        (source) =>
          source.id !==
          sourceId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* PROCESS                                                                */
  /* ---------------------------------------------------------------------- */

  function updateProcess(
    field,
    value,
  ) {
    updateMaterialField(
      "process",
      {
        ...process,

        [field]:
          value,
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* OTHER USES                                                             */
  /* ---------------------------------------------------------------------- */

  function addOtherUse() {
    updateMaterialField(
      "otherUses",
      [
        ...otherUses,

        createOtherUse(
          createLocalId,
        ),
      ],
    )
  }

  function updateOtherUse(
    useId,
    field,
    value,
  ) {
    updateMaterialField(
      "otherUses",
      otherUses.map(
        (use) =>
          use.id ===
          useId
            ? {
                ...use,

                [field]:
                  value,
              }
            : use,
      ),
    )
  }

  function removeOtherUse(
    useId,
  ) {
    updateMaterialField(
      "otherUses",
      otherUses.filter(
        (use) =>
          use.id !==
          useId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="border-t border-border p-6">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <SectionTitle
        number="02"
        title="Material Data"
        description="Kelola jenis material, sumber perolehan, process result, dan penggunaan lainnya."
      />

      {/* ================================================================== */}
      {/* MATERIAL TYPE                                                      */}
      {/* ================================================================== */}

      <div className="mt-6 max-w-[420px]">
        <Field>
          <FieldLabel required>
            Material Type
          </FieldLabel>

          <SelectMenu
            value={
              data?.type || ""
            }
            options={
              materialTypeOptions
            }
            placeholder="Select material type"
            onChange={
              updateMaterialType
            }
          />
        </Field>
      </div>

      {/* ================================================================== */}
      {/* ACQUISITION SOURCES                                                */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div>
          <SubsectionTitle
            title="Acquisition Sources"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Tambahkan semua sumber yang dapat memberikan material ini.
          </p>
        </div>

        {/* =============================================================== */}
        {/* SOURCE BUTTONS                                                  */}
        {/* =============================================================== */}

        <div className="mt-4 grid grid-cols-3 gap-3">
          <AddSourceButton
            icon={Package}
            title="Monster Drop"
            description="Material yang dijatuhkan oleh monster."
            onClick={() =>
              addAcquisitionSource(
                "MONSTER_DROP",
              )
            }
          />

          <AddSourceButton
            icon={Gift}
            title="Event Point Exchange"
            description="Ditukar menggunakan point event."
            onClick={() =>
              addAcquisitionSource(
                "EVENT_POINT_EXCHANGE",
              )
            }
          />

          <AddSourceButton
            icon={Award}
            title="Reward"
            description="Quest, event, login, atau reward lainnya."
            onClick={() =>
              addAcquisitionSource(
                "REWARD",
              )
            }
          />
        </div>

        {/* =============================================================== */}
        {/* EMPTY                                                           */}
        {/* =============================================================== */}

        {acquisitionSources.length ===
          0 && (
          <div className="mt-5 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
            <p className="text-xs text-muted-foreground">
              Belum ada acquisition source.
            </p>
          </div>
        )}

        {/* =============================================================== */}
        {/* LIST                                                            */}
        {/* =============================================================== */}

        {acquisitionSources.length >
          0 && (
          <div className="mt-5 space-y-4">
            {acquisitionSources.map(
              (
                source,
              ) => (
                <AcquisitionSourceRow
                  key={
                    source.id
                  }
                  source={
                    source
                  }
                  monsterOptions={
                    monsterOptions
                  }
                  updateAcquisitionSource={
                    updateAcquisitionSource
                  }
                  removeAcquisitionSource={
                    removeAcquisitionSource
                  }
                />
              ),
            )}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* PROCESS + STORE                                                    */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-2 gap-10 border-t border-border pt-6">
        {/* =============================================================== */}
        {/* PROCESS                                                         */}
        {/* =============================================================== */}

        <div>
          <SubsectionTitle
            title="Process Result"
            optional
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                Material Type
              </FieldLabel>

              <SelectMenu
                value={
                  process
                    .materialType ||
                  ""
                }
                options={
                  materialTypeOptions
                }
                placeholder="Select material"
                onChange={(
                  value,
                ) =>
                  updateProcess(
                    "materialType",
                    value,
                  )
                }
              />
            </Field>

            <NumberField
              label="Points"
              value={
                process.points ||
                ""
              }
              placeholder="8"
              onChange={(
                value,
              ) =>
                updateProcess(
                  "points",
                  value,
                )
              }
            />
          </div>
        </div>

        {/* =============================================================== */}
        {/* STORE                                                           */}
        {/* =============================================================== */}

        <div>
          <SubsectionTitle
            title="General Store"
            optional
          />

          <div className="mt-4">
            <Field>
              <FieldLabel>
                Sell Price
              </FieldLabel>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={
                    data?.sellPrice ||
                    ""
                  }
                  onChange={(
                    event,
                  ) =>
                    updateMaterialField(
                      "sellPrice",
                      event.target
                        .value,
                    )
                  }
                  placeholder="0"
                  className={`${inputClass()} pr-20`}
                />

                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  Spina
                </span>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* OTHER USES                                                         */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SubsectionTitle
              title="Other Uses"
              optional
            />

            <p className="mt-1 max-w-[720px] text-xs leading-5 text-muted-foreground">
              Gunakan untuk pemakaian material di luar recipe item. Recipe Weapon,
              Armor, Additional, dan equipment lainnya akan direferensikan otomatis
              dari data recipe masing-masing.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={
              addOtherUse
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Other Use
          </Button>
        </div>

        {/* =============================================================== */}
        {/* EMPTY                                                           */}
        {/* =============================================================== */}

        {otherUses.length ===
          0 && (
          <div className="mt-4 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
            <p className="text-xs text-muted-foreground">
              Belum ada penggunaan lain untuk material ini.
            </p>
          </div>
        )}

        {/* =============================================================== */}
        {/* USE LIST                                                        */}
        {/* =============================================================== */}

        {otherUses.length >
          0 && (
          <div className="mt-5 space-y-4">
            {otherUses.map(
              (
                use,
                index,
              ) => (
                <OtherUseRow
                  key={
                    use.id
                  }
                  use={
                    use
                  }
                  index={
                    index
                  }
                  updateOtherUse={
                    updateOtherUse
                  }
                  removeOtherUse={
                    removeOtherUse
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ACQUISITION SOURCE                                                         */
/* -------------------------------------------------------------------------- */

function AcquisitionSourceRow({
  source,
  monsterOptions,
  updateAcquisitionSource,
  removeAcquisitionSource,
}) {
  /* ---------------------------------------------------------------------- */
  /* MONSTER DROP                                                          */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "MONSTER_DROP"
  ) {
    return (
      <SourceBlock
        icon={Package}
        title="Monster Drop"
        badge="MONSTER"
        onRemove={() =>
          removeAcquisitionSource(
            source.id,
          )
        }
      >
        <Field>
          <FieldLabel>
            Monster
          </FieldLabel>

          <SearchEntitySelect
            value={
              source.monsterId
            }
            options={
              monsterOptions
            }
            placeholder="Search monster..."
            emptyText="No monster found."
            getLabel={(
              monster,
            ) =>
              monster.name
            }
            getMeta={(
              monster,
            ) => {
              const type =
                formatMonsterType(
                  monster.type,
                )

              if (
                monster.level
              ) {
                return `${type} • Lv ${monster.level}`
              }

              return type
            }}
            onChange={(
              monsterId,
            ) =>
              updateAcquisitionSource(
                source.id,
                "monsterId",
                monsterId,
              )
            }
          />
        </Field>
      </SourceBlock>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* EVENT POINT EXCHANGE                                                   */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "EVENT_POINT_EXCHANGE"
  ) {
    return (
      <SourceBlock
        icon={Gift}
        title="Event Point Exchange"
        badge="EVENT EXCHANGE"
        onRemove={() =>
          removeAcquisitionSource(
            source.id,
          )
        }
      >
        <div className="grid grid-cols-3 gap-5">
          <Field>
            <FieldLabel>
              Event Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.eventName
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  source.id,
                  "eventName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Anniversary Event"
              className={inputClass()}
            />
          </Field>

          <Field>
            <FieldLabel>
              Point Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.pointName
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  source.id,
                  "pointName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Anniversary Medal"
              className={inputClass()}
            />
          </Field>

          <NumberField
            label="Required Points"
            value={
              source.requiredPoints
            }
            placeholder="5000"
            onChange={(
              value,
            ) =>
              updateAcquisitionSource(
                source.id,
                "requiredPoints",
                value,
              )
            }
          />
        </div>
      </SourceBlock>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* REWARD                                                                 */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "REWARD"
  ) {
    return (
      <SourceBlock
        icon={Award}
        title="Reward"
        badge="REWARD"
        onRemove={() =>
          removeAcquisitionSource(
            source.id,
          )
        }
      >
        <div className="grid grid-cols-[280px_minmax(0,1fr)_180px] gap-5">
          {/* REWARD TYPE */}

          <Field>
            <FieldLabel>
              Reward Type
            </FieldLabel>

            <SelectMenu
              value={
                source.rewardType
              }
              options={
                rewardTypeOptions
              }
              placeholder="Select reward type"
              onChange={(
                value,
              ) =>
                updateAcquisitionSource(
                  source.id,
                  "rewardType",
                  value,
                )
              }
            />
          </Field>

          {/* NAME */}

          <Field>
            <FieldLabel>
              Reward Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.name
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  source.id,
                  "name",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Main Quest Reward"
              className={inputClass()}
            />
          </Field>

          {/* QUANTITY */}

          <NumberField
            label="Quantity"
            value={
              source.quantity
            }
            placeholder="1"
            onChange={(
              value,
            ) =>
              updateAcquisitionSource(
                source.id,
                "quantity",
                value,
              )
            }
          />
        </div>

        {/* DESCRIPTION */}

        <div className="mt-4">
          <Field>
            <FieldLabel>
              Reward Description
            </FieldLabel>

            <textarea
              value={
                source.description
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  source.id,
                  "description",
                  event.target
                    .value,
                )
              }
              maxLength={500}
              rows={3}
              placeholder="Jelaskan bagaimana reward ini diperoleh..."
              className={textareaClass()}
            />
          </Field>
        </div>
      </SourceBlock>
    )
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* OTHER USE                                                                  */
/* -------------------------------------------------------------------------- */

function OtherUseRow({
  use,
  index,
  updateOtherUse,
  removeOtherUse,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.04] p-4">
      {/* HEADER */}

      <div className="mb-4 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Other Use{" "}
            {index + 1}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Penggunaan material yang tidak berasal dari recipe item.
          </p>
        </div>

        <DeleteButton
          onClick={() =>
            removeOtherUse(
              use.id,
            )
          }
        />
      </div>

      {/* BASIC */}

      <div className="grid grid-cols-[260px_minmax(0,1fr)_180px] gap-5">
        {/* TYPE */}

        <Field>
          <FieldLabel>
            Use Type
          </FieldLabel>

          <SelectMenu
            value={
              use.type
            }
            options={
              otherUseTypeOptions
            }
            placeholder="Select use type"
            onChange={(
              value,
            ) =>
              updateOtherUse(
                use.id,
                "type",
                value,
              )
            }
          />
        </Field>

        {/* NAME */}

        <Field>
          <FieldLabel>
            Name
          </FieldLabel>

          <input
            type="text"
            value={
              use.name
            }
            onChange={(
              event,
            ) =>
              updateOtherUse(
                use.id,
                "name",
                event.target
                  .value,
              )
            }
            placeholder="Example: Grand Piano"
            className={inputClass()}
          />
        </Field>

        {/* QUANTITY */}

        <NumberField
          label="Required Quantity"
          value={
            use.quantity
          }
          placeholder="10"
          onChange={(
            value,
          ) =>
            updateOtherUse(
              use.id,
              "quantity",
              value,
            )
          }
        />
      </div>

      {/* NOTES */}

      <div className="mt-4">
        <Field>
          <FieldLabel>
            Notes
          </FieldLabel>

          <textarea
            value={
              use.notes
            }
            onChange={(
              event,
            ) =>
              updateOtherUse(
                use.id,
                "notes",
                event.target
                  .value,
              )
            }
            maxLength={500}
            rows={3}
            placeholder="Tambahkan informasi tambahan..."
            className={textareaClass()}
          />
        </Field>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SOURCE BLOCK                                                               */
/* -------------------------------------------------------------------------- */

function SourceBlock({
  icon: Icon,
  title,
  badge,
  children,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.04] p-4">
      <div className="mb-4 flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>

            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-muted-foreground">
              {badge}
            </span>
          </div>
        </div>

        <DeleteButton
          onClick={
            onRemove
          }
        />
      </div>

      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ADD SOURCE                                                                 */
/* -------------------------------------------------------------------------- */

function AddSourceButton({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group flex min-h-[88px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:border-primary/25 hover:bg-primary/[0.025]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Plus className="size-4" />
      </div>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCH ENTITY                                                              */
/* -------------------------------------------------------------------------- */

function SearchEntitySelect({
  value,
  options,
  placeholder,
  emptyText,
  getLabel,
  getMeta,
  onChange,
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
    )

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
          (option) => {
            const label =
              getLabel(
                option,
              )
                ?.toLowerCase() ||
              ""

            const meta =
              getMeta?.(
                option,
              )
                ?.toLowerCase() ||
              ""

            return (
              label.includes(
                keyword,
              ) ||
              meta.includes(
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
      getLabel,
      getMeta,
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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(
        () => {
          inputRef.current?.focus()
        },
        0,
      )

    return () =>
      clearTimeout(
        timeout,
      )
  }, [open])

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
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
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
            ? getLabel(
                selected,
              )
            : placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
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
                placeholder={
                  placeholder
                }
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
              />
            </div>
          </div>

          {/* OPTIONS */}

          <div className="max-h-[280px] overflow-y-auto p-1.5">
            {filtered.length >
            0 ? (
              filtered.map(
                (
                  option,
                ) => (
                  <button
                    key={
                      option.id
                    }
                    type="button"
                    onClick={() => {
                      onChange(
                        option.id,
                      )

                      setOpen(false)
                      setSearch("")
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {getLabel(
                          option,
                        )}
                      </p>

                      {getMeta && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {getMeta(
                            option,
                          )}
                        </p>
                      )}
                    </div>

                    {value ===
                      option.id && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[80px] items-center justify-center px-4">
                <p className="text-xs text-muted-foreground">
                  {
                    emptyText
                  }
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
            className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
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
          {selected?.label ||
            placeholder}
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
                className="flex cursor-pointer items-center justify-between gap-4"
              >
                {
                  option.label
                }

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
/* TITLES                                                                     */
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

function SubsectionTitle({
  title,
  optional = false,
}) {
  return (
    <div className="flex items-center gap-2.5">
      <h4 className="text-sm font-semibold text-foreground">
        {title}
      </h4>

      {optional && (
        <span className="text-xs text-muted-foreground">
          Optional
        </span>
      )}
    </div>
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
/* NUMBER                                                                     */
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
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

function DeleteButton({
  onClick,
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={
        onClick
      }
      className="size-9 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass() {
  return "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

function textareaClass() {
  return "min-h-[90px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatMonsterType(
  value,
) {
  const labels = {
    NORMAL:
      "Normal Monster",

    MINI_BOSS:
      "Mini Boss",

    BOSS:
      "Boss",
  }

  return (
    labels[value] ||
    value ||
    "Monster"
  )
}
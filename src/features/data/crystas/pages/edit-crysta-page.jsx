import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Gem,
  GitBranch,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/* -------------------------------------------------------------------------- */
/* CRYSTA TYPES                                                               */
/* -------------------------------------------------------------------------- */

const crystaTypeOptions = [
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "WEAPON",
    label: "Weapon",
  },
  {
    value: "ARMOR",
    label: "Armor",
  },
  {
    value: "ADDITIONAL",
    label: "Additional",
  },
  {
    value: "SPECIAL",
    label: "Special",
  },
  {
    value: "ENHANCER",
    label: "Enhancer",
  },
]

/* -------------------------------------------------------------------------- */
/* ENHANCER TARGET TYPE                                                       */
/* -------------------------------------------------------------------------- */

const enhancerTargetTypeOptions = [
  {
    value: "NORMAL",
    label: "Normal Crysta",
  },
  {
    value: "WEAPON",
    label: "Weapon Crysta",
  },
  {
    value: "ARMOR",
    label: "Armor Crysta",
  },
  {
    value: "ADDITIONAL",
    label: "Additional Crysta",
  },
  {
    value: "SPECIAL",
    label: "Special Crysta",
  },
]

/* -------------------------------------------------------------------------- */
/* AVAILABILITY                                                               */
/* -------------------------------------------------------------------------- */

const availabilityOptions = [
  {
    value: "PERMANENT",
    label: "Permanent",
  },
  {
    value: "EVENT_LIMITED",
    label: "Event Limited",
  },
  {
    value: "SEASONAL",
    label: "Seasonal",
  },
]

/* -------------------------------------------------------------------------- */
/* PROCESS MATERIAL                                                           */
/* -------------------------------------------------------------------------- */

const processMaterialOptions = [
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
/* SOURCE TYPES                                                               */
/* -------------------------------------------------------------------------- */

const sourceTypeOptions = [
  {
    value: "MONSTER_DROP",
    label: "Monster Drop",
  },
  {
    value: "EVENT_POINT_EXCHANGE",
    label: "Event Point Exchange",
  },
  {
    value: "REWARD",
    label: "Reward",
  },
]

const rewardTypeOptions = [
  {
    value: "QUEST",
    label: "Quest",
  },
  {
    value: "EVENT",
    label: "Event",
  },
  {
    value: "EMBLEM",
    label: "Emblem",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

/* -------------------------------------------------------------------------- */
/* CONDITIONS                                                                 */
/* -------------------------------------------------------------------------- */

const conditionOptions = [
  {
    value: "SHIELD_ONLY",
    label: "Shield Only",
  },
  {
    value: "HEAVY_ARMOR_ONLY",
    label: "Heavy Armor Only",
  },
  {
    value: "LIGHT_ARMOR_ONLY",
    label: "Light Armor Only",
  },
  {
    value: "MAIN_WEAPON_ONLY",
    label: "Main Weapon Only",
  },
  {
    value: "SUB_WEAPON_ONLY",
    label: "Sub Weapon Only",
  },
  {
    value: "OTHER",
    label: "Other",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK MONSTERS                                                              */
/* -------------------------------------------------------------------------- */

const monsterOptions = [
  {
    id: "MONSTER-001",
    name: "Minotaur",
    type: "BOSS",
  },
  {
    id: "MONSTER-002",
    name: "Forest Wolf",
    type: "BOSS",
  },
  {
    id: "MONSTER-003",
    name: "Warmonger",
    type: "MINI_BOSS",
  },
  {
    id: "MONSTER-004",
    name: "Goblin",
    type: "NORMAL",
  },
  {
    id: "MONSTER-005",
    name: "Boss Roga",
    type: "BOSS",
  },
]

/* -------------------------------------------------------------------------- */
/* EXISTING CRYSTAS                                                           */
/* -------------------------------------------------------------------------- */

const crystaOptions = [
  {
    id: "CRYSTA-001",
    name: "Minotaur",
    type: "WEAPON",
  },
  {
    id: "CRYSTA-002",
    name: "Flare Volg",
    type: "WEAPON",
  },
  {
    id: "CRYSTA-003",
    name: "Imitacia",
    type: "WEAPON",
  },
  {
    id: "CRYSTA-004",
    name: "Baavgai",
    type: "ARMOR",
  },
  {
    id: "CRYSTA-005",
    name: "King Piton",
    type: "ADDITIONAL",
  },
  {
    id: "CRYSTA-006",
    name: "Giant Boar",
    type: "ADDITIONAL",
  },
  {
    id: "CRYSTA-007",
    name: "Zeagrysta",
    type: "SPECIAL",
  },
  {
    id: "CRYSTA-008",
    name: "Zega VIII",
    type: "SPECIAL",
  },
  {
    id: "CRYSTA-009",
    name: "STR+3",
    type: "NORMAL",
  },
]

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function createLocalId() {
  return `LOCAL-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

function createStat() {
  return {
    id: createLocalId(),
    stat: "",
    value: "",
  }
}

function createConditionalStat() {
  return {
    id: createLocalId(),

    condition: "",

    customCondition: "",

    stat: "",

    value: "",
  }
}

function createUpgradeTarget() {
  return {
    id: createLocalId(),

    crystaId: "",
  }
}

function createSource(
  type = "MONSTER_DROP",
) {
  if (
    type ===
    "EVENT_POINT_EXCHANGE"
  ) {
    return {
      id: createLocalId(),

      type,

      eventName: "",

      pointName: "",

      requiredPoints: "",
    }
  }

  if (
    type === "REWARD"
  ) {
    return {
      id: createLocalId(),

      type,

      rewardType: "QUEST",

      name: "",

      description: "",

      quantity: 1,
    }
  }

  return {
    id: createLocalId(),

    type: "MONSTER_DROP",

    monsterId: "",
  }
}

/* -------------------------------------------------------------------------- */
/* INITIAL FORM                                                               */
/* -------------------------------------------------------------------------- */

function createInitialForm() {
  return {
    name: "",

    type: "NORMAL",

    availability: "PERMANENT",

    description: "",

    stats: [
      createStat(),
    ],

    conditionalStats: [],

    enhancerTargetType: "",

    upgradeFor: [],

    acquisitionSources: [],

    process: {
      materialType: "MANA",

      points: "",
    },

    sellPrice: "",

    notes: "",

    status: "DRAFT",

    createdAt: null,

    updatedAt: null,
  }
}

/* -------------------------------------------------------------------------- */
/* MOCK DETAIL                                                                */
/* -------------------------------------------------------------------------- */

const mockCrystaDetail = {
  id: "CRYSTA-1001",

  name: "Finstern the Dark Dragon",

  slug: "finstern-the-dark-dragon",

  type: "ENHANCER",

  availability: "PERMANENT",

  description:
    "Enhancer Crysta untuk Weapon Crysta dengan bonus offensive stat.",

  stats: [
    {
      stat: "ATK",
      value: "+8%",
    },
    {
      stat: "Critical Damage",
      value: "+5%",
    },
    {
      stat: "MaxMP",
      value: "-200",
    },
  ],

  conditionalStats: [
    {
      condition: "MAIN_WEAPON_ONLY",
      customCondition: "",
      stat: "Physical Pierce",
      value: "+5%",
    },
  ],

  enhancerTargetType: "WEAPON",

  upgradeFor: [
    {
      crystaId: "CRYSTA-001",
    },
    {
      crystaId: "CRYSTA-003",
    },
  ],

  acquisitionSources: [
    {
      type: "MONSTER_DROP",
      monsterId: "MONSTER-005",
    },
  ],

  process: {
    materialType: "MANA",
    points: "100",
  },

  sellPrice: "100",

  notes:
    "Pastikan relasi upgrade diperiksa ketika ada Enhancer baru.",

  status: "PUBLISHED",

  createdAt:
    "2026-07-20T14:24:00+07:00",

  updatedAt:
    "2026-08-13T23:42:00+07:00",
}

/* -------------------------------------------------------------------------- */
/* MAP DETAIL TO FORM                                                         */
/* -------------------------------------------------------------------------- */

function mapCrystaToForm(
  crysta,
) {
  const initial =
    createInitialForm()

  return {
    ...initial,

    name:
      crysta.name || "",

    type:
      crysta.type ||
      "NORMAL",

    availability:
      crysta.availability ||
      "PERMANENT",

    description:
      crysta.description ||
      "",

    stats:
      crysta.stats?.length
        ? crysta.stats.map(
            (stat) => ({
              id: createLocalId(),

              stat:
                stat.stat ||
                "",

              value:
                stat.value ||
                "",
            }),
          )
        : [
            createStat(),
          ],

    conditionalStats:
      crysta.conditionalStats?.map(
        (stat) => ({
          id: createLocalId(),

          condition:
            stat.condition ||
            "",

          customCondition:
            stat.customCondition ||
            "",

          stat:
            stat.stat ||
            "",

          value:
            stat.value ||
            "",
        }),
      ) || [],

    enhancerTargetType:
      crysta.enhancerTargetType ||
      "",

    upgradeFor:
      crysta.upgradeFor?.map(
        (target) => ({
          id: createLocalId(),

          crystaId:
            target.crystaId ||
            "",
        }),
      ) || [],

    acquisitionSources:
      crysta.acquisitionSources?.map(
        (source) => ({
          id: createLocalId(),

          ...source,
        }),
      ) || [],

    process: {
      materialType:
        crysta.process
          ?.materialType ||
        "MANA",

      points:
        crysta.process
          ?.points ??
        "",
    },

    sellPrice:
      crysta.sellPrice ??
      "",

    notes:
      crysta.notes || "",

    status:
      crysta.status ||
      "DRAFT",

    createdAt:
      crysta.createdAt ||
      null,

    updatedAt:
      crysta.updatedAt ||
      null,
  }
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditCrystaPage() {
  const navigate =
    useNavigate()

  const { id } =
    useParams()

  const [
    form,
    setForm,
  ] = useState(
    createInitialForm,
  )

  const [
    errors,
    setErrors,
  ] = useState({})

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    savingAction,
    setSavingAction,
  ] = useState(null)

  const isSaving =
    savingAction !== null

  /* ---------------------------------------------------------------------- */
  /* LOAD                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true

    async function loadCrysta() {
      setLoading(true)

      /*
        TODO API

        const crysta =
          await getCrystaById(id)
      */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      )

      const crysta =
        mockCrystaDetail

      if (!active) {
        return
      }

      if (!crysta) {
        navigate(
          "/data/crystas",
        )

        return
      }

      setForm(
        mapCrystaToForm(
          crysta,
        ),
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

  const slug =
    useMemo(() => {
      return createSlug(
        form.name,
      )
    }, [
      form.name,
    ])

  const isEnhancer =
    form.type ===
    "ENHANCER"

  const filteredCrystaOptions =
    useMemo(() => {
      if (
        !isEnhancer ||
        !form.enhancerTargetType
      ) {
        return []
      }

      return crystaOptions.filter(
        (crysta) =>
          crysta.type ===
          form.enhancerTargetType &&
          crysta.id !== id,
      )
    }, [
      isEnhancer,
      form.enhancerTargetType,
      id,
    ])

  /* ---------------------------------------------------------------------- */
  /* FIELD                                                                  */
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

    setErrors(
      (current) => ({
        ...current,

        [field]:
          undefined,
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* TYPE                                                                   */
  /* ---------------------------------------------------------------------- */

  function changeCrystaType(
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        type:
          value,

        enhancerTargetType:
          value ===
          "ENHANCER"
            ? current.enhancerTargetType
            : "",

        upgradeFor:
          value ===
          "ENHANCER"
            ? current.upgradeFor
            : [],
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        type:
          undefined,

        enhancerTargetType:
          undefined,

        upgradeFor:
          undefined,
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* ENHANCER TARGET                                                        */
  /* ---------------------------------------------------------------------- */

  function changeEnhancerTargetType(
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        enhancerTargetType:
          value,

        /*
          Ketika jenis target berubah,
          relation lama dibuang karena target
          bisa berasal dari tipe berbeda.
        */

        upgradeFor: [],
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        enhancerTargetType:
          undefined,

        upgradeFor:
          undefined,
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* STATS                                                                  */
  /* ---------------------------------------------------------------------- */

  function addStat() {
    setForm(
      (current) => ({
        ...current,

        stats: [
          ...current.stats,

          createStat(),
        ],
      }),
    )
  }

  function updateStat(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        stats:
          current.stats.map(
            (stat) =>
              stat.id === id
                ? {
                    ...stat,

                    [field]:
                      value,
                  }
                : stat,
          ),
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        stats:
          undefined,
      }),
    )
  }

  function removeStat(
    id,
  ) {
    setForm(
      (current) => ({
        ...current,

        stats:
          current.stats.filter(
            (stat) =>
              stat.id !== id,
          ),
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* CONDITIONAL                                                            */
  /* ---------------------------------------------------------------------- */

  function addConditionalStat() {
    setForm(
      (current) => ({
        ...current,

        conditionalStats: [
          ...current.conditionalStats,

          createConditionalStat(),
        ],
      }),
    )
  }

  function updateConditionalStat(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        conditionalStats:
          current.conditionalStats.map(
            (stat) =>
              stat.id === id
                ? {
                    ...stat,

                    [field]:
                      value,
                  }
                : stat,
          ),
      }),
    )
  }

  function removeConditionalStat(
    id,
  ) {
    setForm(
      (current) => ({
        ...current,

        conditionalStats:
          current.conditionalStats.filter(
            (stat) =>
              stat.id !== id,
          ),
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* UPGRADE                                                                */
  /* ---------------------------------------------------------------------- */

  function addUpgradeTarget() {
    setForm(
      (current) => ({
        ...current,

        upgradeFor: [
          ...current.upgradeFor,

          createUpgradeTarget(),
        ],
      }),
    )
  }

  function updateUpgradeTarget(
    targetId,
    crystaId,
  ) {
    setForm(
      (current) => ({
        ...current,

        upgradeFor:
          current.upgradeFor.map(
            (target) =>
              target.id ===
              targetId
                ? {
                    ...target,

                    crystaId,
                  }
                : target,
          ),
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        upgradeFor:
          undefined,
      }),
    )
  }

  function removeUpgradeTarget(
    targetId,
  ) {
    setForm(
      (current) => ({
        ...current,

        upgradeFor:
          current.upgradeFor.filter(
            (target) =>
              target.id !==
              targetId,
          ),
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* SOURCE                                                                 */
  /* ---------------------------------------------------------------------- */

  function addSource() {
    setForm(
      (current) => ({
        ...current,

        acquisitionSources: [
          ...current.acquisitionSources,

          createSource(),
        ],
      }),
    )
  }

  function changeSourceType(
    sourceId,
    type,
  ) {
    setForm(
      (current) => ({
        ...current,

        acquisitionSources:
          current.acquisitionSources.map(
            (source) =>
              source.id ===
              sourceId
                ? {
                    ...createSource(
                      type,
                    ),

                    id:
                      sourceId,
                  }
                : source,
          ),
      }),
    )
  }

  function updateSource(
    sourceId,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        acquisitionSources:
          current.acquisitionSources.map(
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
      }),
    )
  }

  function removeSource(
    sourceId,
  ) {
    setForm(
      (current) => ({
        ...current,

        acquisitionSources:
          current.acquisitionSources.filter(
            (source) =>
              source.id !==
              sourceId,
          ),
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* PROCESS                                                                */
  /* ---------------------------------------------------------------------- */

  function updateProcess(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        process: {
          ...current.process,

          [field]:
            value,
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATION                                                             */
  /* ---------------------------------------------------------------------- */

  function validateForm(
    status,
  ) {
    const nextErrors = {}

    if (
      !form.name.trim()
    ) {
      nextErrors.name =
        "Crysta name is required."
    }

    if (!form.type) {
      nextErrors.type =
        "Crysta type is required."
    }

    if (
      !form.availability
    ) {
      nextErrors.availability =
        "Availability is required."
    }

    if (
      status ===
      "PUBLISHED"
    ) {
      const validStats =
        form.stats.filter(
          (stat) =>
            stat.stat.trim() &&
            stat.value.trim(),
        )

      if (
        validStats.length ===
        0
      ) {
        nextErrors.stats =
          "Add at least one crysta stat."
      }

      if (isEnhancer) {
        if (
          !form.enhancerTargetType
        ) {
          nextErrors.enhancerTargetType =
            "Enhancer target type is required."
        }

        const validTargets =
          form.upgradeFor.filter(
            (target) =>
              target.crystaId,
          )

        if (
          validTargets.length ===
          0
        ) {
          nextErrors.upgradeFor =
            "Add at least one upgrade target."
        }

        const targetIds =
          validTargets.map(
            (target) =>
              target.crystaId,
          )

        if (
          new Set(
            targetIds,
          ).size !==
          targetIds.length
        ) {
          nextErrors.upgradeFor =
            "The same Crysta cannot be added more than once."
        }
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
  /* PAYLOAD                                                                */
  /* ---------------------------------------------------------------------- */

  function buildPayload(
    status,
  ) {
    const stats =
      form.stats
        .filter(
          (stat) =>
            stat.stat.trim() ||
            stat.value.trim(),
        )
        .map(
          ({
            id,
            ...stat
          }) => stat,
        )

    const conditionalStats =
      form.conditionalStats
        .filter(
          (stat) =>
            stat.condition ||
            stat.stat.trim() ||
            stat.value.trim(),
        )
        .map(
          ({
            id,
            ...stat
          }) => stat,
        )

    const upgradeFor =
      isEnhancer
        ? form.upgradeFor
            .filter(
              (target) =>
                target.crystaId,
            )
            .map(
              (target) => ({
                crystaId:
                  target.crystaId,
              }),
            )
        : []

    const acquisitionSources =
      form.acquisitionSources.map(
        ({
          id,
          ...source
        }) => source,
      )

    return {
      id,

      name:
        form.name.trim(),

      slug,

      type:
        form.type,

      availability:
        form.availability,

      description:
        form.description.trim() ||
        null,

      stats,

      conditionalStats,

      enhancerTargetType:
        isEnhancer
          ? form.enhancerTargetType
          : null,

      upgradeFor,

      acquisitionSources,

      process: {
        materialType:
          form.process
            .materialType ||
          null,

        points:
          form.process
            .points ||
          null,
      },

      sellPrice:
        form.sellPrice ||
        null,

      notes:
        form.notes.trim() ||
        null,

      status,
    }
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  async function saveCrysta(
    status,
  ) {
    if (
      !validateForm(
        status,
      )
    ) {
      return
    }

    setSavingAction(
      status,
    )

    const payload =
      buildPayload(
        status,
      )

    console.log(
      "Update Crysta Payload:",
      payload,
    )

    /*
      TODO API

      await updateCrysta(
        id,
        payload,
      )
    */

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          500,
        ),
    )

    setSavingAction(
      null,
    )

    navigate(
      "/data/crystas",
    )
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <EditCrystaLoading />
    )
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
        <div className="flex items-center gap-2 text-xs font-medium">
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

          <span className="text-muted-foreground">
            {form.name}
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-primary">
            Edit
          </span>
        </div>

        <div className="mt-2 flex items-start justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
                Edit Crysta
              </h1>

              <StatusBadge
                status={
                  form.status
                }
              />
            </div>

            <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
              Perbarui informasi Crysta, stat, source, dan hubungan
              upgrade yang tersedia.
            </p>
          </div>
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
                form.createdAt,
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
                form.updatedAt,
              )}
            </span>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* MAIN CARD                                                          */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
        {/* =============================================================== */}
        {/* 01 GENERAL                                                     */}
        {/* =============================================================== */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="General Information"
            description="Informasi utama yang digunakan untuk mengidentifikasi Crysta."
          />

          <div className="mt-6 space-y-6">
            {/* NAME */}

            <Field>
              <FieldLabel required>
                Crysta Name
              </FieldLabel>

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
                placeholder="Example: Minotaur"
                className={inputClass(
                  errors.name,
                )}
              />

              {errors.name && (
                <FieldError>
                  {
                    errors.name
                  }
                </FieldError>
              )}
            </Field>

            {/* SLUG + TYPE */}

            <div className="grid grid-cols-2 gap-5">
              <Field>
                <FieldLabel>
                  Slug
                </FieldLabel>

                <DisabledValueField
                  value={
                    slug ||
                    "generated-from-crysta-name"
                  }
                />
              </Field>

              <Field>
                <FieldLabel required>
                  Crysta Type
                </FieldLabel>

                <SimpleSelect
                  value={
                    form.type
                  }
                  options={
                    crystaTypeOptions
                  }
                  placeholder="Select crysta type"
                  error={
                    Boolean(
                      errors.type,
                    )
                  }
                  onChange={
                    changeCrystaType
                  }
                />

                {errors.type && (
                  <FieldError>
                    {
                      errors.type
                    }
                  </FieldError>
                )}
              </Field>
            </div>

            {/* AVAILABILITY */}

            <div className="grid grid-cols-2 gap-5">
              <Field>
                <FieldLabel required>
                  Availability
                </FieldLabel>

                <SimpleSelect
                  value={
                    form.availability
                  }
                  options={
                    availabilityOptions
                  }
                  placeholder="Select availability"
                  error={
                    Boolean(
                      errors.availability,
                    )
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "availability",
                      value,
                    )
                  }
                />

                {errors.availability && (
                  <FieldError>
                    {
                      errors.availability
                    }
                  </FieldError>
                )}
              </Field>

              <div />
            </div>

            {/* DESCRIPTION */}

            <Field>
              <FieldLabel>
                Description
              </FieldLabel>

              <textarea
                value={
                  form.description
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    "description",
                    event.target
                      .value,
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Tambahkan deskripsi Crysta..."
                className="min-h-[140px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {
                    form.description
                      .length
                  }
                  /1000
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 02 CRYSTA DATA                                                 */}
        {/* =============================================================== */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="02"
            title="Crysta Data"
            description="Stat, hubungan upgrade, source, dan informasi gameplay Crysta."
          />

          {/* ============================================================= */}
          {/* STATS                                                        */}
          {/* ============================================================= */}

          <DataSection
            title="Stats / Effects"
            description="Stat atau effect utama yang diberikan oleh Crysta."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={
                  addStat
                }
                className="h-9 cursor-pointer gap-2 px-3 text-xs"
              >
                <Plus className="size-3.5" />

                Add Stat
              </Button>
            }
          >
            {form.stats.length >
            0 ? (
              <div className="space-y-3">
                {form.stats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <div
                      key={
                        stat.id
                      }
                      className="grid grid-cols-[40px_minmax(0,1fr)_300px_40px] items-center gap-3"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                        {index +
                          1}
                      </div>

                      <input
                        type="text"
                        value={
                          stat.stat
                        }
                        onChange={(
                          event,
                        ) =>
                          updateStat(
                            stat.id,
                            "stat",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Example: ATK, STR, Critical Rate"
                        className={inputClass(
                          false,
                        )}
                      />

                      <input
                        type="text"
                        value={
                          stat.value
                        }
                        onChange={(
                          event,
                        ) =>
                          updateStat(
                            stat.id,
                            "value",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Example: +6%, +100, -10%"
                        className={inputClass(
                          false,
                        )}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeStat(
                            stat.id,
                          )
                        }
                        className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={Gem}
                title="No stats"
                description="Tambahkan stat atau effect Crysta."
              />
            )}

            {errors.stats && (
              <FieldError>
                {
                  errors.stats
                }
              </FieldError>
            )}
          </DataSection>

          {/* ============================================================= */}
          {/* CONDITIONAL STATS                                            */}
          {/* ============================================================= */}

          <DataSection
            title="Conditional Stats"
            description="Stat yang hanya aktif pada kondisi tertentu."
            optional
            action={
              <Button
                type="button"
                variant="outline"
                onClick={
                  addConditionalStat
                }
                className="h-9 cursor-pointer gap-2 px-3 text-xs"
              >
                <Plus className="size-3.5" />

                Add Conditional Stat
              </Button>
            }
          >
            {form.conditionalStats
              .length > 0 ? (
              <div className="space-y-4">
                {form.conditionalStats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <div
                      key={
                        stat.id
                      }
                      className="rounded-xl border border-border bg-muted/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
                          Conditional{" "}
                          {index +
                            1}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeConditionalStat(
                              stat.id,
                            )
                          }
                          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <Field>
                          <FieldLabel>
                            Condition
                          </FieldLabel>

                          <SimpleSelect
                            value={
                              stat.condition
                            }
                            options={
                              conditionOptions
                            }
                            placeholder="Select condition"
                            onChange={(
                              value,
                            ) =>
                              updateConditionalStat(
                                stat.id,
                                "condition",
                                value,
                              )
                            }
                          />
                        </Field>

                        <Field>
                          <FieldLabel>
                            Stat
                          </FieldLabel>

                          <input
                            type="text"
                            value={
                              stat.stat
                            }
                            onChange={(
                              event,
                            ) =>
                              updateConditionalStat(
                                stat.id,
                                "stat",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Example: Physical Pierce"
                            className={inputClass(
                              false,
                            )}
                          />
                        </Field>

                        <Field>
                          <FieldLabel>
                            Value
                          </FieldLabel>

                          <input
                            type="text"
                            value={
                              stat.value
                            }
                            onChange={(
                              event,
                            ) =>
                              updateConditionalStat(
                                stat.id,
                                "value",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="+10%"
                            className={inputClass(
                              false,
                            )}
                          />
                        </Field>
                      </div>

                      {stat.condition ===
                        "OTHER" && (
                        <div className="mt-4">
                          <FieldLabel>
                            Custom Condition
                          </FieldLabel>

                          <input
                            type="text"
                            value={
                              stat.customCondition
                            }
                            onChange={(
                              event,
                            ) =>
                              updateConditionalStat(
                                stat.id,
                                "customCondition",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Describe the condition..."
                            className={inputClass(
                              false,
                            )}
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={Gem}
                title="No conditional stats"
                description="Tidak ada stat dengan kondisi khusus."
              />
            )}
          </DataSection>

          {/* ============================================================= */}
          {/* ENHANCER INFORMATION                                         */}
          {/* ============================================================= */}

          {isEnhancer && (
            <DataSection
              title="Enhancer Information"
              description="Tentukan jenis Crysta yang menggunakan Enhancer ini."
            >
              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel required>
                    Enhancer Target Type
                  </FieldLabel>

                  <SimpleSelect
                    value={
                      form.enhancerTargetType
                    }
                    options={
                      enhancerTargetTypeOptions
                    }
                    placeholder="Select target type"
                    error={
                      Boolean(
                        errors.enhancerTargetType,
                      )
                    }
                    onChange={
                      changeEnhancerTargetType
                    }
                  />

                  {errors.enhancerTargetType && (
                    <FieldError>
                      {
                        errors.enhancerTargetType
                      }
                    </FieldError>
                  )}

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Menentukan apakah Enhancer ini digunakan untuk Normal,
                    Weapon, Armor, Additional, atau Special Crysta.
                  </p>
                </Field>

                <div />
              </div>
            </DataSection>
          )}

          {/* ============================================================= */}
          {/* UPGRADE FOR                                                  */}
          {/* ============================================================= */}

          {isEnhancer && (
            <DataSection
              title="Upgrade For"
              description="Crysta spesifik yang dapat di-upgrade menggunakan Enhancer ini."
              action={
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    !form.enhancerTargetType
                  }
                  onClick={
                    addUpgradeTarget
                  }
                  className="h-9 cursor-pointer gap-2 px-3 text-xs"
                >
                  <Plus className="size-3.5" />

                  Add Upgrade Target
                </Button>
              }
            >
              {!form.enhancerTargetType ? (
                <EmptyState
                  icon={GitBranch}
                  title="Select enhancer target type first"
                  description="Pilih jenis target Crysta terlebih dahulu."
                />
              ) : form.upgradeFor
                  .length > 0 ? (
                <>
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.025] px-4 py-3.5">
                    <GitBranch className="mt-0.5 size-4 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Upgrade relation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Relation ini digunakan untuk membentuk upgrade tree
                        Crysta secara otomatis. Satu Crysta dapat memiliki
                        beberapa jalur upgrade.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {form.upgradeFor.map(
                      (
                        target,
                        index,
                      ) => (
                        <div
                          key={
                            target.id
                          }
                          className="grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-3"
                        >
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                            {index +
                              1}
                          </div>

                          <CrystaSearchSelect
                            value={
                              target.crystaId
                            }
                            options={
                              filteredCrystaOptions
                            }
                            selectedIds={
                              form.upgradeFor
                                .filter(
                                  (item) =>
                                    item.id !==
                                    target.id,
                                )
                                .map(
                                  (item) =>
                                    item.crystaId,
                                )
                                .filter(
                                  Boolean,
                                )
                            }
                            placeholder={`Search ${formatLabel(
                              form.enhancerTargetType,
                            )} Crysta...`}
                            onChange={(
                              value,
                            ) =>
                              updateUpgradeTarget(
                                target.id,
                                value,
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeUpgradeTarget(
                                target.id,
                              )
                            }
                            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={GitBranch}
                  title="No upgrade targets"
                  description="Tambahkan Crysta yang dapat menggunakan Enhancer ini."
                />
              )}

              {errors.upgradeFor && (
                <FieldError>
                  {
                    errors.upgradeFor
                  }
                </FieldError>
              )}
            </DataSection>
          )}

          {/* ============================================================= */}
          {/* ACQUISITION                                                  */}
          {/* ============================================================= */}

          <DataSection
            title="Acquisition Sources"
            description="Sumber pemain mendapatkan Crysta."
            optional
            action={
              <Button
                type="button"
                variant="outline"
                onClick={
                  addSource
                }
                className="h-9 cursor-pointer gap-2 px-3 text-xs"
              >
                <Plus className="size-3.5" />

                Add Source
              </Button>
            }
          >
            {form.acquisitionSources
              .length > 0 ? (
              <div className="space-y-4">
                {form.acquisitionSources.map(
                  (
                    source,
                    index,
                  ) => (
                    <SourceEditor
                      key={
                        source.id
                      }
                      source={
                        source
                      }
                      index={
                        index
                      }
                      onTypeChange={(
                        value,
                      ) =>
                        changeSourceType(
                          source.id,
                          value,
                        )
                      }
                      onChange={(
                        field,
                        value,
                      ) =>
                        updateSource(
                          source.id,
                          field,
                          value,
                        )
                      }
                      onRemove={() =>
                        removeSource(
                          source.id,
                        )
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No acquisition sources"
                description="Tambahkan Monster Drop, Event Point Exchange, atau Reward."
              />
            )}
          </DataSection>

          {/* ============================================================= */}
          {/* PROCESS                                                       */}
          {/* ============================================================= */}

          <DataSection
            title="Process & General Store"
            description="Nilai material ketika diprocess dan harga jual Crysta."
          >
            <div className="grid grid-cols-3 gap-5">
              <Field>
                <FieldLabel>
                  Process Material
                </FieldLabel>

                <SimpleSelect
                  value={
                    form.process
                      .materialType
                  }
                  options={
                    processMaterialOptions
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

              <Field>
                <FieldLabel>
                  Process Points
                </FieldLabel>

                <input
                  type="number"
                  min="0"
                  value={
                    form.process
                      .points
                  }
                  onChange={(
                    event,
                  ) =>
                    updateProcess(
                      "points",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Example: 100"
                  className={inputClass(
                    false,
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Sell Price
                </FieldLabel>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={
                      form.sellPrice
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "sellPrice",
                        event.target
                          .value,
                      )
                    }
                    placeholder="0"
                    className={`${inputClass(
                      false,
                    )} pr-16`}
                  />

                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    Spina
                  </span>
                </div>
              </Field>
            </div>
          </DataSection>
        </div>

        {/* =============================================================== */}
        {/* 03 NOTES                                                       */}
        {/* =============================================================== */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="Crysta Notes"
            description="Informasi tambahan mengenai Crysta."
            optional
          />

          <textarea
            value={
              form.notes
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
            rows={6}
            maxLength={1000}
            placeholder="Tambahkan catatan Crysta..."
            className="mt-6 min-h-[150px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
          />

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-muted-foreground">
              {
                form.notes
                  .length
              }
              /1000
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* FOOTER                                                         */}
        {/* =============================================================== */}

        <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                Crysta Status
              </p>

              <StatusBadge
                status={
                  form.status
                }
              />
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Simpan perubahan dan tentukan status Crysta.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={
                isSaving
              }
              onClick={() =>
                navigate(
                  "/data/crystas",
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
                isSaving
              }
              onClick={() =>
                saveCrysta(
                  "DRAFT",
                )
              }
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
            >
              <Save className="size-4" />

              {savingAction ===
              "DRAFT"
                ? "Saving..."
                : form.status ===
                    "PUBLISHED"
                  ? "Move to Draft"
                  : "Save Draft"}
            </Button>

            <Button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                saveCrysta(
                  "PUBLISHED",
                )
              }
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
            >
              <CheckCircle2 className="size-4" />

              {savingAction ===
              "PUBLISHED"
                ? "Saving..."
                : form.status ===
                    "PUBLISHED"
                  ? "Save Changes"
                  : "Publish Crysta"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
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
/* SOURCE EDITOR                                                              */
/* -------------------------------------------------------------------------- */

function SourceEditor({
  source,
  index,
  onTypeChange,
  onChange,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.04] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          Source{" "}
          {index + 1}
        </p>

        <button
          type="button"
          onClick={
            onRemove
          }
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-4">
        <FieldLabel>
          Source Type
        </FieldLabel>

        <SimpleSelect
          value={
            source.type
          }
          options={
            sourceTypeOptions
          }
          onChange={
            onTypeChange
          }
        />
      </div>

      {source.type ===
        "MONSTER_DROP" && (
        <div className="mt-4">
          <FieldLabel>
            Monster
          </FieldLabel>

          <SearchSelect
            value={
              source.monsterId
            }
            options={
              monsterOptions
            }
            placeholder="Search monster..."
            onChange={(
              value,
            ) =>
              onChange(
                "monsterId",
                value,
              )
            }
          />
        </div>
      )}

      {source.type ===
        "EVENT_POINT_EXCHANGE" && (
        <div className="mt-4 grid grid-cols-3 gap-4">
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
                onChange(
                  "eventName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Summer Event"
              className={inputClass(
                false,
              )}
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
                onChange(
                  "pointName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Summer Point"
              className={inputClass(
                false,
              )}
            />
          </Field>

          <Field>
            <FieldLabel>
              Required Points
            </FieldLabel>

            <input
              type="number"
              min="0"
              value={
                source.requiredPoints
              }
              onChange={(
                event,
              ) =>
                onChange(
                  "requiredPoints",
                  event.target
                    .value,
                )
              }
              placeholder="100"
              className={inputClass(
                false,
              )}
            />
          </Field>
        </div>
      )}

      {source.type ===
        "REWARD" && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>
                Reward Type
              </FieldLabel>

              <SimpleSelect
                value={
                  source.rewardType
                }
                options={
                  rewardTypeOptions
                }
                onChange={(
                  value,
                ) =>
                  onChange(
                    "rewardType",
                    value,
                  )
                }
              />
            </Field>

            <Field>
              <FieldLabel>
                Quantity
              </FieldLabel>

              <input
                type="number"
                min="1"
                value={
                  source.quantity
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
                className={inputClass(
                  false,
                )}
              />
            </Field>
          </div>

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
                onChange(
                  "name",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Event Quest Reward"
              className={inputClass(
                false,
              )}
            />
          </Field>

          <Field>
            <FieldLabel>
              Description
            </FieldLabel>

            <textarea
              value={
                source.description
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
              placeholder="Additional reward information..."
              className="min-h-[90px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />
          </Field>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CRYSTA SEARCH                                                              */
/* -------------------------------------------------------------------------- */

function CrystaSearchSelect({
  value,
  options,
  selectedIds = [],
  onChange,
  placeholder = "Search Crysta...",
}) {
  const [
    query,
    setQuery,
  ] = useState("")

  const selected =
    options.find(
      (option) =>
        option.id ===
        value,
    )

  const filtered =
    options.filter(
      (option) => {
        const matchSearch =
          option.name
            .toLowerCase()
            .includes(
              query
                .trim()
                .toLowerCase(),
            )

        const alreadyUsed =
          selectedIds.includes(
            option.id,
          )

        return (
          matchSearch &&
          !alreadyUsed
        )
      },
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <GitBranch className="size-4 shrink-0 text-muted-foreground" />

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

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[400px] p-2"
      >
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={
              query
            }
            onChange={(
              event,
            ) =>
              setQuery(
                event.target
                  .value,
              )
            }
            placeholder="Search Crysta..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="max-h-[260px] overflow-y-auto">
          {selected && (
            <DropdownMenuItem
              onClick={() => {
                onChange("")

                setQuery("")
              }}
              className="cursor-pointer text-xs text-muted-foreground"
            >
              Clear selection
            </DropdownMenuItem>
          )}

          {filtered.length >
          0 ? (
            filtered.map(
              (option) => (
                <DropdownMenuItem
                  key={
                    option.id
                  }
                  onClick={() => {
                    onChange(
                      option.id,
                    )

                    setQuery("")
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Gem className="size-3.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {
                          option.name
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatLabel(
                          option.type,
                        )}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ),
            )
          ) : (
            <div className="px-3 py-5 text-center text-xs text-muted-foreground">
              No Crysta found.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCH SELECT                                                              */
/* -------------------------------------------------------------------------- */

function SearchSelect({
  value,
  options,
  onChange,
  placeholder = "Search...",
}) {
  const [
    query,
    setQuery,
  ] = useState("")

  const selected =
    options.find(
      (option) =>
        option.id ===
        value,
    )

  const filtered =
    options.filter(
      (option) =>
        option.name
          .toLowerCase()
          .includes(
            query
              .trim()
              .toLowerCase(),
          ),
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />

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

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[380px] p-2"
      >
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={
              query
            }
            onChange={(
              event,
            ) =>
              setQuery(
                event.target
                  .value,
              )
            }
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="max-h-[240px] overflow-y-auto">
          {selected && (
            <DropdownMenuItem
              onClick={() => {
                onChange("")

                setQuery("")
              }}
              className="cursor-pointer text-xs text-muted-foreground"
            >
              Clear selection
            </DropdownMenuItem>
          )}

          {filtered.length >
          0 ? (
            filtered.map(
              (option) => (
                <DropdownMenuItem
                  key={
                    option.id
                  }
                  onClick={() => {
                    onChange(
                      option.id,
                    )

                    setQuery("")
                  }}
                  className="cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {
                        option.name
                      }
                    </p>

                    {option.type && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatLabel(
                          option.type,
                        )}
                      </p>
                    )}
                  </div>
                </DropdownMenuItem>
              ),
            )
          ) : (
            <div className="px-3 py-5 text-center text-xs text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
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
  placeholder = "Select option",
  error = false,
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
              "flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-background px-3.5 text-left outline-none transition-all",

              error
                ? "border-destructive/50"
                : "border-border hover:bg-muted/20",
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
          <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {optional && (
        <span className="mt-0.5 shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Optional
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* DATA SECTION                                                               */
/* -------------------------------------------------------------------------- */

function DataSection({
  title,
  description,
  optional = false,
  action,
  children,
}) {
  return (
    <div className="mt-7 border-t border-border pt-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>

            {optional && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Optional
              </span>
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        {action}
      </div>

      <div className="mt-4">
        {children}
      </div>
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
    <div>
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

function FieldError({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <CircleAlert className="size-3.5 shrink-0" />

      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* DISABLED VALUE                                                             */
/* -------------------------------------------------------------------------- */

function DisabledValueField({
  value,
}) {
  return (
    <div className="flex h-11 cursor-not-allowed items-center rounded-lg border border-border/90 bg-muted/80 px-3.5">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
        {value}
      </span>
    </div>
  )
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
    <div className="flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.04] px-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" />
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
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass(
  error,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-3",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
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
    .replace(
      /['"]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
}

/* -------------------------------------------------------------------------- */
/* DATE                                                                       */
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
/* FORMAT                                                                     */
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

    MINI_BOSS:
      "Mini Boss",

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

    EVENT_LIMITED:
      "Event Limited",

    SHIELD_ONLY:
      "Shield Only",

    HEAVY_ARMOR_ONLY:
      "Heavy Armor Only",

    LIGHT_ARMOR_ONLY:
      "Light Armor Only",

    MAIN_WEAPON_ONLY:
      "Main Weapon Only",

    SUB_WEAPON_ONLY:
      "Sub Weapon Only",
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

function EditCrystaLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-36 rounded bg-muted" />

        <div className="mt-6 h-9 w-56 rounded bg-muted" />

        <div className="mt-3 h-4 w-[430px] rounded bg-muted" />

        <div className="mt-5 h-4 w-[360px] rounded bg-muted" />

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="p-6">
            <div className="h-12 w-[340px] rounded-xl bg-muted/50" />

            <div className="mt-7 space-y-5">
              <div className="h-16 rounded-xl bg-muted/50" />

              <div className="grid grid-cols-2 gap-5">
                <div className="h-16 rounded-xl bg-muted/50" />

                <div className="h-16 rounded-xl bg-muted/50" />
              </div>

              <div className="h-16 w-1/2 rounded-xl bg-muted/50" />

              <div className="h-40 rounded-xl bg-muted/50" />
            </div>
          </div>

          <div className="h-[620px] border-t border-border bg-muted/[0.06]" />
        </div>
      </div>
    </div>
  )
}
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import Cropper from "react-easy-crop"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Crop,
  ImageIcon,
  ImagePlus,
  LockKeyhole,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NormalMonsterForm from "@/features/data/monsters/components/create/normal-monster-form"
import MiniBossForm from "@/features/data/monsters/components/create/mini-boss-form"
import BossForm from "@/features/data/monsters/components/create/boss-form"

/* -------------------------------------------------------------------------- */
/* MONSTER TYPES                                                              */
/* -------------------------------------------------------------------------- */

const monsterTypes = [
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "MINI_BOSS",
    label: "Mini Boss",
  },
  {
    value: "BOSS",
    label: "Boss",
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
/* ELEMENTS                                                                   */
/* -------------------------------------------------------------------------- */

const elementOptions = [
  {
    value: "NEUTRAL",
    label: "Neutral",
  },
  {
    value: "FIRE",
    label: "Fire",
  },
  {
    value: "WATER",
    label: "Water",
  },
  {
    value: "WIND",
    label: "Wind",
  },
  {
    value: "EARTH",
    label: "Earth",
  },
  {
    value: "LIGHT",
    label: "Light",
  },
  {
    value: "DARK",
    label: "Dark",
  },
]

/* -------------------------------------------------------------------------- */
/* MAPS                                                                       */
/* -------------------------------------------------------------------------- */

const mapOptions = [
  {
    id: "MAP-001",
    name: "Rakau Plains",
  },
  {
    id: "MAP-002",
    name: "Land Under Cultivation",
  },
  {
    id: "MAP-003",
    name: "Ribisco Cave",
  },
  {
    id: "MAP-004",
    name: "Underground Channel",
  },
  {
    id: "MAP-005",
    name: "Nisel Mountain",
  },
  {
    id: "MAP-006",
    name: "Nisel Mountain: Mountainside",
  },
  {
    id: "MAP-007",
    name: "Nisel Mountain: Summit",
  },
  {
    id: "MAP-008",
    name: "Ancient Empress Tomb",
  },
  {
    id: "MAP-009",
    name: "Zoktzda Ruins",
  },
  {
    id: "MAP-010",
    name: "Ruined Temple: Forbidden Hall",
  },
  {
    id: "MAP-011",
    name: "Saham Underground Cave: Deepest Part",
  },
]

/* -------------------------------------------------------------------------- */
/* ITEMS                                                                      */
/* -------------------------------------------------------------------------- */

const itemOptions = [
  {
    id: "ITEM-001",
    name: "Minotaur Horn",
  },
  {
    id: "ITEM-002",
    name: "Minotaur Hoof",
  },
  {
    id: "ITEM-003",
    name: "Minotaur Crysta",
  },
  {
    id: "ITEM-004",
    name: "Goblin Claw",
  },
  {
    id: "ITEM-005",
    name: "Nisel Wood",
  },
  {
    id: "ITEM-006",
    name: "Nightmare Crystal",
  },
  {
    id: "ITEM-007",
    name: "Golden Skeleton Crysta",
  },
  {
    id: "ITEM-008",
    name: "Boss Roga Crysta",
  },
]

/* -------------------------------------------------------------------------- */
/* IMAGE RATIOS                                                               */
/* -------------------------------------------------------------------------- */

const imageRatios = [
  {
    id: "4:3",
    label: "4:3",
    aspect: 4 / 3,
    width: 1200,
    height: 900,
  },
  {
    id: "1:1",
    label: "1:1",
    aspect: 1,
    width: 1000,
    height: 1000,
  },
  {
    id: "16:9",
    label: "16:9",
    aspect: 16 / 9,
    width: 1600,
    height: 900,
  },
  {
    id: "3:4",
    label: "3:4",
    aspect: 3 / 4,
    width: 900,
    height: 1200,
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

function createVariant() {
  return {
    id: createLocalId(),

    level: "",
    hp: "",
    exp: "",

    element: "",
    mapId: "",

    drops: [],
  }
}

/* -------------------------------------------------------------------------- */
/* EMPTY DATA                                                                 */
/* -------------------------------------------------------------------------- */

function createEmptyNormal() {
  return {
    tamable: false,

    requirement: "",
    petUse: "",

    variants: [
      createVariant(),
    ],
  }
}

function createEmptyMiniBoss() {
  return {
    level: "",
    hp: "",
    exp: "",

    element: "",
    mapId: "",

    def: "",
    mdef: "",

    physicalResist: "",
    magicResist: "",

    drops: [],

    combatFlow: [
      {
        id: createLocalId(),
        title: "",
        description: "",
      },
    ],
  }
}

function createEmptyBoss() {
  return {
    baseStats: {
      level: "",
      hp: "",
      exp: "",
    },

    element: "",
    mapId: "",

    def: "",
    mdef: "",

    physicalResist: "",
    magicResist: "",

    difficulties: [
      {
        mode: "EASY",
        level: "",
        hp: "",
        exp: "",
      },
      {
        mode: "NORMAL",
        level: "",
        hp: "",
        exp: "",
      },
      {
        mode: "HARD",
        level: "",
        hp: "",
        exp: "",
      },
      {
        mode: "NIGHTMARE",
        level: "",
        hp: "",
        exp: "",
      },
      {
        mode: "ULTIMATE",
        level: "",
        hp: "",
        exp: "",
      },
    ],

    interruptRules: [
      {
        interrupt: "FLINCH",
        status: "ALLOWED",
        note: "",
      },
      {
        interrupt: "TUMBLE",
        status: "ALLOWED",
        note: "",
      },
      {
        interrupt: "STUN",
        status: "ALLOWED",
        note: "",
      },
    ],

    fightFlow: [
      {
        id: createLocalId(),
        title: "",
        description: "",
      },
    ],

    breakParts: [
      {
        id: createLocalId(),
        part: "",
        interrupt: "",
        breakDropItemId: "",
      },
    ],

    drops: [],
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

    image: null,

    normal:
      createEmptyNormal(),

    miniBoss:
      createEmptyMiniBoss(),

    boss:
      createEmptyBoss(),

    notes: "",

    status: "DRAFT",

    createdAt: null,

    updatedAt: null,
  }
}

/* -------------------------------------------------------------------------- */
/* MOCK MONSTER DETAIL                                                        */
/* -------------------------------------------------------------------------- */

const mockMonsterDetail = {
  id: "MONSTER-001",

  name: "Minotaur",

  slug: "minotaur",

  type: "BOSS",

  availability: "PERMANENT",

  description:
    "Boss berbentuk Minotaur yang berada di Ruined Temple: Forbidden Hall.",

  image: {
    url: "/images/monsters/minotaur.jpg",

    name: "minotaur.jpg",

    ratio: "4:3",

    width: 1200,

    height: 900,
  },

  status: "PUBLISHED",

  createdAt:
    "2026-07-20T14:24:00+07:00",

  updatedAt:
    "2026-08-13T22:15:00+07:00",

  data: {
    baseStats: {
      level: "42",

      hp: "49000",

      exp: "410",
    },

    element:
      "EARTH",

    mapId:
      "MAP-010",

    def:
      "120",

    mdef:
      "90",

    physicalResist:
      "5",

    magicResist:
      "5",

    difficulties: [
      {
        mode: "EASY",

        level: "32",

        hp: "24500",

        exp: "205",
      },

      {
        mode: "NORMAL",

        level: "42",

        hp: "49000",

        exp: "410",
      },

      {
        mode: "HARD",

        level: "52",

        hp: "73500",

        exp: "615",
      },

      {
        mode:
          "NIGHTMARE",

        level: "62",

        hp: "98000",

        exp: "820",
      },

      {
        mode:
          "ULTIMATE",

        level: "82",

        hp: "196000",

        exp: "1640",
      },
    ],

    interruptRules: [
      {
        interrupt:
          "FLINCH",

        status:
          "ALLOWED",

        note: "",
      },

      {
        interrupt:
          "TUMBLE",

        status:
          "ALLOWED",

        note: "",
      },

      {
        interrupt:
          "STUN",

        status:
          "ALLOWED",

        note: "",
      },
    ],

    fightFlow: [
      {
        id:
          "FLOW-001",

        title:
          "Opening",

        description:
          "Minotaur biasanya memulai pertarungan dengan serangan jarak dekat.",
      },
    ],

    breakParts: [
      {
        id:
          "BREAK-001",

        part:
          "Head",

        interrupt:
          "FLINCH",

        breakDropItemId:
          "ITEM-002",
      },
    ],

    drops: [
      {
        id:
          "DROP-001",

        itemId:
          "ITEM-001",

        dropType:
          "NORMAL",

        note: "",
      },

      {
        id:
          "DROP-002",

        itemId:
          "ITEM-003",

        dropType:
          "CRYSTA",

        note: "",
      },
    ],
  },

  notes:
    "Pastikan data difficulty dan drop diperbarui jika ada perubahan dari game.",
}

/* -------------------------------------------------------------------------- */
/* MAP API TO FORM                                                            */
/* -------------------------------------------------------------------------- */

function mapMonsterToForm(
  monster,
) {
  const initial =
    createInitialForm()

  const next = {
    ...initial,

    name:
      monster.name || "",

    type:
      monster.type ||
      "NORMAL",

    availability:
      monster.availability ||
      "PERMANENT",

    description:
      monster.description ||
      "",

    image:
      monster.image
        ? {
            existing: true,

            url:
              monster.image.url,

            name:
              monster.image.name ||
              "monster-image",

            ratio:
              monster.image.ratio ||
              "4:3",

            width:
              monster.image.width ||
              1200,

            height:
              monster.image.height ||
              900,
          }
        : null,

    notes:
      monster.notes ||
      "",

    status:
      monster.status ||
      "DRAFT",

    createdAt:
      monster.createdAt ||
      null,

    updatedAt:
      monster.updatedAt ||
      null,
  }

  if (
    monster.type ===
    "NORMAL"
  ) {
    next.normal = {
      ...initial.normal,
      ...(monster.data || {}),
    }
  }

  if (
    monster.type ===
    "MINI_BOSS"
  ) {
    next.miniBoss = {
      ...initial.miniBoss,
      ...(monster.data || {}),
    }
  }

  if (
    monster.type ===
    "BOSS"
  ) {
    next.boss = {
      ...initial.boss,
      ...(monster.data || {}),
    }
  }

  return next
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditMonsterPage() {
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

  const [
    cropSource,
    setCropSource,
  ] = useState(null)

  const [
    cropModalOpen,
    setCropModalOpen,
  ] = useState(false)

  const isSaving =
    savingAction !== null

  /* ---------------------------------------------------------------------- */
  /* LOAD                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true

    async function loadMonster() {
      setLoading(true)

      /*
        TODO API:

        const monster =
          await getMonsterById(id)
      */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      )

      const monster =
        mockMonsterDetail

      if (!active) {
        return
      }

      if (!monster) {
        navigate(
          "/data/monsters",
        )

        return
      }

      setForm(
        mapMonsterToForm(
          monster,
        ),
      )

      setLoading(false)
    }

    loadMonster()

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

  const notesNumber =
    useMemo(() => {
      return getNotesNumber(
        form.type,
      )
    }, [
      form.type,
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

  function handleTypeChange(
    type,
  ) {
    setForm(
      (current) => ({
        ...current,

        type,
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        type:
          undefined,
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* IMAGE                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleImageSelect(
    event,
  ) {
    const file =
      event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      return
    }

    const objectUrl =
      URL.createObjectURL(
        file,
      )

    setCropSource(
      (current) => {
        if (
          current?.url
        ) {
          URL.revokeObjectURL(
            current.url,
          )
        }

        return {
          file,

          url:
            objectUrl,
        }
      },
    )

    setCropModalOpen(
      true,
    )
  }

  function handleCropApply(
    image,
  ) {
    setForm(
      (current) => {
        if (
          current.image
            ?.previewUrl
        ) {
          URL.revokeObjectURL(
            current.image
              .previewUrl,
          )
        }

        return {
          ...current,

          image: {
            ...image,

            existing:
              false,
          },
        }
      },
    )

    closeCropModal()
  }

  function closeCropModal() {
    setCropModalOpen(
      false,
    )

    setCropSource(
      (current) => {
        if (
          current?.url
        ) {
          URL.revokeObjectURL(
            current.url,
          )
        }

        return null
      },
    )
  }

  function removeImage() {
    setForm(
      (current) => {
        if (
          current.image
            ?.previewUrl
        ) {
          URL.revokeObjectURL(
            current.image
              .previewUrl,
          )
        }

        return {
          ...current,

          image: null,
        }
      },
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
        "Monster name is required."
    }

    if (!form.type) {
      nextErrors.type =
        "Monster type is required."
    }

    if (
      !form.availability
    ) {
      nextErrors.availability =
        "Availability is required."
    }

    /*
      Untuk sekarang requirement specialized
      tetap longgar supaya admin bisa simpan Draft.

      Nanti kalau memang dibutuhkan, validation
      per Normal / Mini Boss / Boss bisa ditambahkan
      khusus status PUBLISHED.
    */

    if (
      status ===
      "PUBLISHED"
    ) {
      if (
        form.type ===
          "NORMAL" &&
        (!form.normal
          ?.variants ||
          form.normal
            .variants
            .length === 0)
      ) {
        nextErrors.monsterData =
          "Normal monster requires at least one variant."
      }

      if (
        form.type ===
          "MINI_BOSS" &&
        !form.miniBoss
      ) {
        nextErrors.monsterData =
          "Mini Boss data is required."
      }

      if (
        form.type ===
          "BOSS" &&
        !form.boss
      ) {
        nextErrors.monsterData =
          "Boss data is required."
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
  /* MONSTER DATA                                                           */
  /* ---------------------------------------------------------------------- */

  function getMonsterData() {
    switch (
      form.type
    ) {
      case "NORMAL":
        return form.normal

      case "MINI_BOSS":
        return form.miniBoss

      case "BOSS":
        return form.boss

      default:
        return null
    }
  }

  /* ---------------------------------------------------------------------- */
  /* PAYLOAD                                                                */
  /* ---------------------------------------------------------------------- */

  function buildPayload(
    status,
  ) {
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

      image:
        form.image?.file ||
        null,

      keepExistingImage:
        Boolean(
          form.image
            ?.existing,
        ),

      removeImage:
        !form.image,

      imageRatio:
        form.image?.ratio ||
        null,

      imageWidth:
        form.image?.width ||
        null,

      imageHeight:
        form.image?.height ||
        null,

      data:
        getMonsterData(),

      notes:
        form.notes.trim() ||
        null,

      status,
    }
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  async function saveMonster(
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
      "Update Monster Payload:",
      payload,
    )

    /*
      TODO API:

      await updateMonster(
        id,
        payload,
      )

      Untuk image:
      - existing image -> tidak perlu upload ulang
      - new cropped image -> payload.image berisi File
      - remove image -> removeImage = true

      Kalau backend pakai multipart/form-data:

      const formData =
        new FormData()

      formData.append(
        "name",
        payload.name,
      )

      formData.append(
        "slug",
        payload.slug,
      )

      formData.append(
        "type",
        payload.type,
      )

      formData.append(
        "availability",
        payload.availability,
      )

      formData.append(
        "status",
        payload.status,
      )

      formData.append(
        "description",
        payload.description || "",
      )

      formData.append(
        "notes",
        payload.notes || "",
      )

      formData.append(
        "data",
        JSON.stringify(
          payload.data,
        ),
      )

      if (
        payload.image
      ) {
        formData.append(
          "image",
          payload.image,
        )
      }

      formData.append(
        "removeImage",
        String(
          payload.removeImage,
        ),
      )

      formData.append(
        "imageRatio",
        payload.imageRatio || "",
      )
    */

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          500,
        ),
    )

    setForm(
      (current) => ({
        ...current,

        status,

        updatedAt:
          new Date().toISOString(),

        image:
          current.image
            ? {
                ...current.image,

                existing:
                  current.image
                    .existing ||
                  !current.image
                    .file,
              }
            : null,
      }),
    )

    setSavingAction(
      null,
    )

    navigate(
      "/data/monsters",
    )
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <EditMonsterLoading />
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
        {/* ================================================================= */}
        {/* BACK                                                             */}
        {/* ================================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/data/monsters",
            )
          }
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />

          Back to Monsters
        </button>

        {/* ================================================================= */}
        {/* HEADER                                                           */}
        {/* ================================================================= */}

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
              Monsters
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

          {/* TITLE */}

          <div className="mt-2 flex items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
                  Edit Monster
                </h1>

                <StatusBadge
                  status={
                    form.status
                  }
                />
              </div>

              <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
                Perbarui data monster dan informasi gameplay yang tersedia.
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

        {/* ================================================================= */}
        {/* MAIN CARD                                                        */}
        {/* ================================================================= */}

        <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
          {/* =============================================================== */}
          {/* 01 GENERAL                                                     */}
          {/* =============================================================== */}

          <div className="p-6">
            <SectionTitle
              number="01"
              title="General Information"
              description="Informasi utama yang digunakan untuk mengidentifikasi monster."
            />

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] gap-10">
              {/* =========================================================== */}
              {/* LEFT                                                       */}
              {/* =========================================================== */}

              <div className="space-y-6">
                {/* NAME */}

                <Field>
                  <FieldLabel required>
                    Monster Name
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
                  {/* SLUG */}

                  <Field>
                    <FieldLabel>
                      Slug
                    </FieldLabel>

                    <DisabledValueField
                      value={
                        slug ||
                        "generated-from-monster-name"
                      }
                    />
                  </Field>

                  {/* TYPE */}

                  <Field>
                    <FieldLabel required>
                      Monster Type
                    </FieldLabel>

                    <SimpleSelect
                      value={
                        form.type
                      }
                      options={
                        monsterTypes
                      }
                      placeholder="Select monster type"
                      error={
                        Boolean(
                          errors.type,
                        )
                      }
                      onChange={
                        handleTypeChange
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
                    placeholder="Tambahkan deskripsi monster..."
                    className="min-h-[140px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
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

              {/* =========================================================== */}
              {/* IMAGE                                                      */}
              {/* =========================================================== */}

              <div>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel>
                    Monster Image
                  </FieldLabel>

                  {form.image && (
                    <span className="mb-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {
                        form.image
                          .ratio
                      }
                    </span>
                  )}
                </div>

                {!form.image ? (
                  <label className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/10 px-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.025]">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-primary">
                      <ImagePlus className="size-5" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-foreground">
                      Add Monster Image
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      JPG, PNG atau WEBP
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                      <Upload className="size-3.5" />

                      Choose image
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleImageSelect
                      }
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-border">
                    {/* IMAGE PREVIEW */}

                    <div
                      className="relative overflow-hidden bg-muted/20"
                      style={{
                        aspectRatio:
                          getRatioAspect(
                            form.image
                              .ratio,
                          ),
                      }}
                    >
                      <img
                        src={
                          form.image
                            .existing
                            ? form.image
                                .url
                            : form.image
                                .previewUrl
                        }
                        alt={
                          form.name ||
                          "Monster"
                        }
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute right-3 top-3 flex gap-2">
                        {/* CHANGE */}

                        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/75">
                          <Crop className="size-3.5" />

                          Change

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                              handleImageSelect
                            }
                            className="hidden"
                          />
                        </label>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={
                            removeImage
                          }
                          className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/75"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>

                    {/* IMAGE INFO */}

                    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <ImageIcon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground">
                            {form.image
                              .existing
                              ? form.image
                                  .name
                              : form.image
                                  .file
                                  ?.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {form.image
                              .existing
                              ? "Existing image"
                              : formatFileSize(
                                  form.image
                                    .file
                                    ?.size,
                                )}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-medium text-foreground">
                          {
                            form.image
                              .ratio
                          }
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {
                            form.image
                              .width
                          }
                          {" × "}
                          {
                            form.image
                              .height
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  4:3 direkomendasikan untuk tampilan monster.
                </p>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* NORMAL MONSTER                                                 */}
          {/* =============================================================== */}

          {form.type ===
            "NORMAL" && (
            <NormalMonsterForm
              data={
                form.normal
              }
              setForm={
                setForm
              }
              elementOptions={
                elementOptions
              }
              mapOptions={
                mapOptions
              }
              itemOptions={
                itemOptions
              }
              createLocalId={
                createLocalId
              }
            />
          )}

          {/* =============================================================== */}
          {/* MINI BOSS                                                      */}
          {/* =============================================================== */}

          {form.type ===
            "MINI_BOSS" && (
            <MiniBossForm
              data={
                form.miniBoss
              }
              setForm={
                setForm
              }
              elementOptions={
                elementOptions
              }
              mapOptions={
                mapOptions
              }
              itemOptions={
                itemOptions
              }
              createLocalId={
                createLocalId
              }
            />
          )}

          {/* =============================================================== */}
          {/* BOSS                                                           */}
          {/* =============================================================== */}

          {form.type ===
            "BOSS" && (
            <BossForm
              data={
                form.boss
              }
              setForm={
                setForm
              }
              elementOptions={
                elementOptions
              }
              mapOptions={
                mapOptions
              }
              itemOptions={
                itemOptions
              }
              createLocalId={
                createLocalId
              }
            />
          )}

          {/* =============================================================== */}
          {/* VALIDATION                                                     */}
          {/* =============================================================== */}

          {errors.monsterData && (
            <div className="border-t border-border px-6 py-4">
              <FieldError>
                {
                  errors.monsterData
                }
              </FieldError>
            </div>
          )}

          {/* =============================================================== */}
          {/* NOTES                                                          */}
          {/* =============================================================== */}

          <div className="border-t border-border p-6">
            <SectionTitle
              number={
                notesNumber
              }
              title="Monster Notes"
              description="Informasi tambahan mengenai monster."
              optional
            />

            <Field>
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
                placeholder="Tambahkan catatan monster..."
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
            </Field>
          </div>

          {/* =============================================================== */}
          {/* FOOTER                                                        */}
          {/* =============================================================== */}

          <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
            {/* STATUS */}

            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  Monster Status
                </p>

                <StatusBadge
                  status={
                    form.status
                  }
                />
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Simpan perubahan dan tentukan status monster.
              </p>
            </div>

            {/* ACTION */}

            <div className="flex items-center gap-3">
              {/* CANCEL */}

              <Button
                type="button"
                variant="ghost"
                disabled={
                  isSaving
                }
                onClick={() =>
                  navigate(
                    "/data/monsters",
                  )
                }
                className="h-10 cursor-pointer px-4 text-sm text-muted-foreground"
              >
                Cancel
              </Button>

              {/* DRAFT */}

              <Button
                type="button"
                variant="outline"
                disabled={
                  isSaving
                }
                onClick={() =>
                  saveMonster(
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

              {/* PUBLISH */}

              <Button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  saveMonster(
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
                    : "Publish Monster"}
              </Button>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>

      {/* =================================================================== */}
      {/* CROP EDITOR                                                       */}
      {/* =================================================================== */}

      {cropModalOpen &&
        cropSource && (
          <ImageCropEditor
            imageUrl={
              cropSource.url
            }
            originalFile={
              cropSource.file
            }
            onCancel={
              closeCropModal
            }
            onApply={
              handleCropApply
            }
          />
        )}
    </>
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
/* IMAGE CROP EDITOR                                                          */
/* -------------------------------------------------------------------------- */

function ImageCropEditor({
  imageUrl,
  originalFile,
  onCancel,
  onApply,
}) {
  const [
    crop,
    setCrop,
  ] = useState({
    x: 0,
    y: 0,
  })

  const [
    zoom,
    setZoom,
  ] = useState(1)

  const [
    ratioId,
    setRatioId,
  ] = useState(
    "4:3",
  )

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState(null)

  const [
    isApplying,
    setIsApplying,
  ] = useState(false)

  const selectedRatio =
    useMemo(() => {
      return (
        imageRatios.find(
          (ratio) =>
            ratio.id ===
            ratioId,
        ) ||
        imageRatios[0]
      )
    }, [
      ratioId,
    ])

  const handleCropComplete =
    useCallback(
      (
        _,
        pixels,
      ) => {
        setCroppedAreaPixels(
          pixels,
        )
      },
      [],
    )

  function changeRatio(
    ratio,
  ) {
    setRatioId(
      ratio,
    )

    setCrop({
      x: 0,
      y: 0,
    })

    setZoom(1)
  }

  function decreaseZoom() {
    setZoom(
      (current) =>
        Math.max(
          1,
          Number(
            (
              current -
              0.1
            ).toFixed(2),
          ),
        ),
    )
  }

  function increaseZoom() {
    setZoom(
      (current) =>
        Math.min(
          3,
          Number(
            (
              current +
              0.1
            ).toFixed(2),
          ),
        ),
    )
  }

  function resetCrop() {
    setCrop({
      x: 0,
      y: 0,
    })

    setZoom(1)
  }

  async function applyCrop() {
    if (
      !croppedAreaPixels
    ) {
      return
    }

    setIsApplying(
      true,
    )

    try {
      const result =
        await createCroppedImage({
          imageSrc:
            imageUrl,

          pixelCrop:
            croppedAreaPixels,

          outputWidth:
            selectedRatio.width,

          outputHeight:
            selectedRatio.height,

          originalFile,
        })

      onApply({
        ...result,

        ratio:
          selectedRatio.id,

        width:
          selectedRatio.width,

        height:
          selectedRatio.height,
      })
    } catch (error) {
      console.error(
        "Crop failed:",
        error,
      )

      setIsApplying(
        false,
      )
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* HEADER */}

        <header className="flex items-start justify-between gap-6 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
              Edit image
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Adjust how the image will appear.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={
              isApplying
            }
            onClick={
              onCancel
            }
            className="size-9 cursor-pointer rounded-lg"
          >
            <X className="size-4" />
          </Button>
        </header>

        {/* CONTENT */}

        <div className="overflow-y-auto px-6 py-5">
          <div className="relative mx-auto h-[430px] max-w-[700px] overflow-hidden rounded-xl bg-[#09090b]">
            <Cropper
              image={
                imageUrl
              }
              crop={
                crop
              }
              zoom={
                zoom
              }
              aspect={
                selectedRatio.aspect
              }
              minZoom={1}
              maxZoom={3}
              zoomSpeed={0.1}
              objectFit="contain"
              showGrid
              restrictPosition
              onCropChange={
                setCrop
              }
              onZoomChange={
                setZoom
              }
              onCropComplete={
                handleCropComplete
              }
            />
          </div>

          {/* ZOOM */}

          <div className="mx-auto mt-5 flex max-w-[520px] items-center gap-3">
            <button
              type="button"
              onClick={
                decreaseZoom
              }
              disabled={
                zoom <= 1
              }
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={
                zoom
              }
              onChange={(
                event,
              ) =>
                setZoom(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="min-w-0 flex-1 cursor-pointer accent-primary"
            />

            <button
              type="button"
              onClick={
                increaseZoom
              }
              disabled={
                zoom >= 3
              }
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>

            <span className="w-12 shrink-0 text-right text-xs font-medium text-muted-foreground">
              {Math.round(
                zoom * 100,
              )}
              %
            </span>
          </div>

          {/* RATIOS */}

          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center rounded-xl bg-muted/70 p-1">
              {imageRatios.map(
                (ratio) => {
                  const active =
                    ratio.id ===
                    ratioId

                  return (
                    <button
                      key={
                        ratio.id
                      }
                      type="button"
                      onClick={() =>
                        changeRatio(
                          ratio.id,
                        )
                      }
                      className={[
                        "h-9 min-w-[70px] cursor-pointer rounded-lg px-4 text-xs font-medium transition-all",

                        active
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(
                        " ",
                      )}
                    >
                      {
                        ratio.label
                      }
                    </button>
                  )
                },
              )}
            </div>
          </div>

          {/* RESET */}

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={
                resetCrop
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />

              Reset
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <footer className="flex items-center justify-between gap-6 border-t border-border bg-muted/20 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <div>
              <p className="text-xs font-medium text-foreground">
                {
                  selectedRatio
                    .width
                }
                {" × "}
                {
                  selectedRatio
                    .height
                }{" "}
                px
              </p>

              <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted-foreground">
                {
                  originalFile.name
                }
              </p>
            </div>

            <span className="h-7 w-px bg-border" />

            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {
                selectedRatio.id
              }
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={
                isApplying
              }
              onClick={
                onCancel
              }
              className="h-10 cursor-pointer px-4 text-sm"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                isApplying ||
                !croppedAreaPixels
              }
              onClick={
                applyCrop
              }
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
            >
              <CheckCircle2 className="size-4" />

              {isApplying
                ? "Applying..."
                : "Apply Image"}
            </Button>
          </div>
        </footer>
      </div>
    </div>
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
            ].join(
              " ",
            )}
          />
        }
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm",

            selected
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          ].join(
            " ",
          )}
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
    <div className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg border border-border/90 bg-muted/80 px-3.5">
      <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
        {value}
      </span>
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
/* CROPPED IMAGE                                                              */
/* -------------------------------------------------------------------------- */

async function createCroppedImage({
  imageSrc,
  pixelCrop,
  outputWidth,
  outputHeight,
  originalFile,
}) {
  const image =
    await loadImage(
      imageSrc,
    )

  const canvas =
    document.createElement(
      "canvas",
    )

  const context =
    canvas.getContext(
      "2d",
    )

  if (!context) {
    throw new Error(
      "Canvas is not supported.",
    )
  }

  canvas.width =
    outputWidth

  canvas.height =
    outputHeight

  context.drawImage(
    image,

    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,

    0,
    0,
    outputWidth,
    outputHeight,
  )

  const blob =
    await canvasToBlob(
      canvas,
      "image/jpeg",
      0.92,
    )

  const baseName =
    originalFile.name.replace(
      /\.[^/.]+$/,
      "",
    )

  const croppedFile =
    new File(
      [
        blob,
      ],
      `${baseName}-cropped.jpg`,
      {
        type:
          "image/jpeg",
      },
    )

  return {
    file:
      croppedFile,

    previewUrl:
      URL.createObjectURL(
        blob,
      ),
  }
}

/* -------------------------------------------------------------------------- */
/* LOAD IMAGE                                                                 */
/* -------------------------------------------------------------------------- */

function loadImage(
  src,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image()

      image.onload =
        () =>
          resolve(
            image,
          )

      image.onerror =
        reject

      image.src =
        src
    },
  )
}

/* -------------------------------------------------------------------------- */
/* CANVAS                                                                     */
/* -------------------------------------------------------------------------- */

function canvasToBlob(
  canvas,
  type,
  quality,
) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "Failed to create image.",
              ),
            )

            return
          }

          resolve(
            blob,
          )
        },

        type,

        quality,
      )
    },
  )
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
/* NOTES NUMBER                                                               */
/* -------------------------------------------------------------------------- */

function getNotesNumber(
  type,
) {
  const sectionNumberByType = {
    NORMAL: "04",

    MINI_BOSS: "06",

    BOSS: "10",
  }

  return (
    sectionNumberByType[
      type
    ] || "04"
  )
}

/* -------------------------------------------------------------------------- */
/* RATIO                                                                      */
/* -------------------------------------------------------------------------- */

function getRatioAspect(
  ratioId,
) {
  return (
    imageRatios.find(
      (ratio) =>
        ratio.id ===
        ratioId,
    )?.aspect ||
    4 / 3
  )
}

/* -------------------------------------------------------------------------- */
/* FILE SIZE                                                                  */
/* -------------------------------------------------------------------------- */

function formatFileSize(
  bytes,
) {
  if (!bytes) {
    return "0 KB"
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`
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
/* LOADING                                                                    */
/* -------------------------------------------------------------------------- */

function EditMonsterLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-36 rounded bg-muted" />

        <div className="mt-6 h-9 w-64 rounded bg-muted" />

        <div className="mt-3 h-4 w-[420px] rounded bg-muted" />

        <div className="mt-5 h-4 w-96 rounded bg-muted" />

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-10 p-6">
            <div className="space-y-5">
              <div className="h-16 rounded-xl bg-muted/50" />

              <div className="grid grid-cols-2 gap-5">
                <div className="h-16 rounded-xl bg-muted/50" />

                <div className="h-16 rounded-xl bg-muted/50" />
              </div>

              <div className="h-16 rounded-xl bg-muted/50" />

              <div className="h-40 rounded-xl bg-muted/50" />
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-muted/50" />
          </div>

          <div className="h-[520px] border-t border-border bg-muted/[0.08]" />
        </div>
      </div>
    </div>
  )
}
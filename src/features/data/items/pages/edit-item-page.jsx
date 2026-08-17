import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ImageIcon,
  ImagePlus,
  LockKeyhole,
  Save,
  Upload,
  X,
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

import WeaponForm from "@/features/data/items/components/create/weapon-form"
import SubWeaponForm from "@/features/data/items/components/create/sub-weapon-form"
import ArmorForm from "@/features/data/items/components/create/armor-form"
import AdditionalForm from "@/features/data/items/components/create/additional-form"
import SpecialGearForm from "@/features/data/items/components/create/special-gear-form"
import MaterialForm from "@/features/data/items/components/create/material-form"
import ConsumableForm from "@/features/data/items/components/create/consumable-form"

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
/* -------------------------------------------------------------------------- */

const categoryOptions = [
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
    value: "SPECIAL_GEAR",
    label: "Special Gear",
  },
  {
    value: "SUB_WEAPON",
    label: "Sub Weapon",
  },
  {
    value: "MATERIAL",
    label: "Material",
  },
  {
    value: "CONSUMABLE",
    label: "Consumable",
  },
]

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
/* MOCK ITEM OPTIONS                                                          */
/* -------------------------------------------------------------------------- */

const itemOptions = [
  {
    id: "ITEM-001",
    name: "Minotaur Horn",
    category: "MATERIAL",
  },
  {
    id: "ITEM-002",
    name: "Minotaur Hoof",
    category: "MATERIAL",
  },
  {
    id: "ITEM-003",
    name: "Iron",
    category: "MATERIAL",
  },
  {
    id: "ITEM-004",
    name: "Hard Wood",
    category: "MATERIAL",
  },
  {
    id: "ITEM-005",
    name: "Beast Fang",
    category: "MATERIAL",
  },
  {
    id: "ITEM-006",
    name: "Fine Cloth",
    category: "MATERIAL",
  },
  {
    id: "ITEM-007",
    name: "Mana Stone",
    category: "MATERIAL",
  },
  {
    id: "ITEM-008",
    name: "Ancient Cloth",
    category: "MATERIAL",
  },
  {
    id: "ITEM-009",
    name: "Magic Crystal",
    category: "MATERIAL",
  },
  {
    id: "ITEM-010",
    name: "Dragon Bone",
    category: "MATERIAL",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK MONSTER OPTIONS                                                       */
/* -------------------------------------------------------------------------- */

const monsterOptions = [
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
  {
    id: "MONSTER-006",
    name: "Brutal Dragon Decel",
    type: "BOSS",
    level: 40,
  },
  {
    id: "MONSTER-007",
    name: "Boss Roga",
    type: "BOSS",
    level: 50,
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK ITEM DETAIL                                                           */
/* -------------------------------------------------------------------------- */

const mockItemDetail = {
  id: "ITEM-1001",

  name: "Vita Plus IV",

  slug: "vita-plus-iv",

  category: "CONSUMABLE",

  availability: "PERMANENT",

  description:
    "Consumable yang meningkatkan MaxHP untuk sementara waktu.",

  image: {
    url: "/images/items/vita-plus-iv.png",
    name: "vita-plus-iv.png",
  },

  status: "PUBLISHED",

  createdAt:
    "2026-07-20T14:24:00+07:00",

  updatedAt:
    "2026-08-13T18:42:00+07:00",

  data: {
    type: "BUFF",

    visualType: "POTION",

    mainEffect:
      "Meningkatkan MaxHP untuk sementara waktu.",

    duration: {
      value: 30,
      unit: "MINUTE",
    },

    effects: [
      {
        id: "EFFECT-001",
        stat: "MaxHP",
        value: "+2000",
        intervalSeconds: "",
      },
    ],

    useScope: [
      "FIELD",
      "BATTLE",
      "BOSS_BATTLE",
    ],

    bestUsedFor: [
      {
        id: "BEST-001",
        text: "Boss battle dengan incoming damage tinggi.",
      },
      {
        id: "BEST-002",
        text: "Build dengan MaxHP rendah.",
      },
    ],

    acquisitionSources: [
      {
        id: "SOURCE-001",
        type: "MONSTER_DROP",
        monsterId: "MONSTER-004",
      },
    ],

    craftMethods: [
      {
        id: "CRAFT-001",
        type: "NPC_SYNTHESIST",

        recipe: {
          materials: [
            {
              id: "MAT-001",
              itemId: "ITEM-006",
              quantity: 2,
            },
            {
              id: "MAT-002",
              itemId: "ITEM-007",
              quantity: 1,
            },
          ],

          setQuantity: 1,

          level: 80,

          difficulty: 90,

          craftFee: 500,
        },
      },
    ],

    process: {
      materialType: "MEDICINE",
      points: 12,
    },

    sellPrice: 20,
  },

  notes:
    "Gunakan data effect sesuai informasi terbaru dari game.",
}

/* -------------------------------------------------------------------------- */
/* LOCAL ID                                                                   */
/* -------------------------------------------------------------------------- */

function createLocalId() {
  return `LOCAL-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

/* -------------------------------------------------------------------------- */
/* EMPTY CATEGORY DATA                                                        */
/* -------------------------------------------------------------------------- */

function createEmptyCategoryData(
  category,
) {
  switch (category) {
    case "WEAPON":
      return {
        type: "",
        versions: [],
      }

    case "SUB_WEAPON":
      return {
        type: "",
        mainWeaponPairings: [],
        versions: [],
      }

    case "ARMOR":
      return {
        appearances: {
          male: {
            normal: null,
            light: null,
            heavy: null,
          },

          female: {
            normal: null,
            light: null,
            heavy: null,
          },
        },

        versions: [],
      }

    case "ADDITIONAL":
      return {
        versions: [],
      }

    case "SPECIAL_GEAR":
      return {
        versions: [],
      }

    case "MATERIAL":
      return {
        type: "",

        acquisitionSources: [],

        process: {
          materialType: "",
          points: "",
        },

        sellPrice: "",

        otherUses: [],
      }

    case "CONSUMABLE":
      return {
        type: "",

        visualType: "",

        mainEffect: "",

        duration: null,

        effects: [],

        useScope: [],

        bestUsedFor: [],

        acquisitionSources: [],

        craftMethods: [],

        process: {
          materialType: "MEDICINE",
          points: "",
        },

        sellPrice: "",
      }

    default:
      return null
  }
}

/* -------------------------------------------------------------------------- */
/* INITIAL FORM                                                               */
/* -------------------------------------------------------------------------- */

function createInitialForm() {
  return {
    name: "",

    slug: "",

    category: "WEAPON",

    availability: "PERMANENT",

    description: "",

    image: null,

    weapon:
      createEmptyCategoryData(
        "WEAPON",
      ),

    subWeapon:
      createEmptyCategoryData(
        "SUB_WEAPON",
      ),

    armor:
      createEmptyCategoryData(
        "ARMOR",
      ),

    additional:
      createEmptyCategoryData(
        "ADDITIONAL",
      ),

    specialGear:
      createEmptyCategoryData(
        "SPECIAL_GEAR",
      ),

    material:
      createEmptyCategoryData(
        "MATERIAL",
      ),

    consumable:
      createEmptyCategoryData(
        "CONSUMABLE",
      ),

    notes: "",

    status: "DRAFT",

    createdAt: null,

    updatedAt: null,
  }
}

/* -------------------------------------------------------------------------- */
/* MAP API ITEM TO FORM                                                       */
/* -------------------------------------------------------------------------- */

function mapItemToForm(
  item,
) {
  const base =
    createInitialForm()

  const categoryKey =
    getCategoryStateKey(
      item.category,
    )

  return {
    ...base,

    name:
      item.name || "",

    slug:
      item.slug || "",

    category:
      item.category ||
      "WEAPON",

    availability:
      item.availability ||
      "PERMANENT",

    description:
      item.description ||
      "",

    image:
      item.image
        ? {
            existing: true,
            url:
              item.image.url,
            name:
              item.image.name ||
              "item-image",
          }
        : null,

    notes:
      item.notes || "",

    status:
      item.status ||
      "DRAFT",

    createdAt:
      item.createdAt ||
      null,

    updatedAt:
      item.updatedAt ||
      null,

    ...(categoryKey
      ? {
          [categoryKey]: {
            ...base[
              categoryKey
            ],

            ...(item.data ||
              {}),
          },
        }
      : {}),
  }
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditItemPage() {
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

  /* ---------------------------------------------------------------------- */
  /* LOAD ITEM                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true

    async function loadItem() {
      setLoading(true)

      /*
        TODO API

        const item =
          await getItemById(id)
      */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      )

      const item =
        mockItemDetail

      if (!active) {
        return
      }

      setForm(
        mapItemToForm(
          item,
        ),
      )

      setLoading(false)
    }

    loadItem()

    return () => {
      active = false
    }
  }, [id])

  /* ---------------------------------------------------------------------- */
  /* SLUG                                                                   */
  /* ---------------------------------------------------------------------- */

  const slug =
    useMemo(
      () =>
        createSlug(
          form.name,
        ),
      [form.name],
    )

  const isSaving =
    savingAction !== null

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
  /* CATEGORY CHANGE                                                        */
  /* ---------------------------------------------------------------------- */

  function handleCategoryChange(
    category,
  ) {
    const nextKey =
      getCategoryStateKey(
        category,
      )

    setForm(
      (current) => ({
        ...current,

        category,

        /*
          Data category lama tetap berada di state
          supaya kalau admin salah memilih category
          lalu balik lagi datanya tidak langsung hilang.

          Hanya category aktif yang nanti dikirim
          melalui getCategoryData().
        */

        ...(nextKey &&
        !current[nextKey]
          ? {
              [nextKey]:
                createEmptyCategoryData(
                  category,
                ),
            }
          : {}),
      }),
    )

    setErrors({})
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

    const previewUrl =
      URL.createObjectURL(
        file,
      )

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
            existing: false,

            file,

            previewUrl,

            name:
              file.name,
          },
        }
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

    /* -------------------------------------------------------------------- */
    /* GENERAL                                                              */
    /* -------------------------------------------------------------------- */

    if (
      !form.name.trim()
    ) {
      nextErrors.name =
        "Item name is required."
    }

    if (
      !form.category
    ) {
      nextErrors.category =
        "Category is required."
    }

    if (
      !form.availability
    ) {
      nextErrors.availability =
        "Availability is required."
    }

    /*
      Draft boleh memiliki data category yang belum lengkap.

      Published harus memenuhi requirement category.
    */

    if (
      status ===
      "PUBLISHED"
    ) {
      /* ------------------------------------------------------------------ */
      /* WEAPON                                                             */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "WEAPON"
      ) {
        if (
          !form.weapon?.type
        ) {
          nextErrors.weaponType =
            "Weapon type is required."
        }

        if (
          !Array.isArray(
            form.weapon
              ?.versions,
          ) ||
          form.weapon
            .versions
            .length === 0
        ) {
          nextErrors.weaponVersions =
            "Add at least one weapon version."
        }
      }

      /* ------------------------------------------------------------------ */
      /* SUB WEAPON                                                         */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "SUB_WEAPON"
      ) {
        if (
          !form.subWeapon
            ?.type
        ) {
          nextErrors.subWeaponType =
            "Sub-weapon type is required."
        }

        if (
          !Array.isArray(
            form.subWeapon
              ?.versions,
          ) ||
          form.subWeapon
            .versions
            .length === 0
        ) {
          nextErrors.subWeaponVersions =
            "Add at least one sub-weapon version."
        }
      }

      /* ------------------------------------------------------------------ */
      /* ARMOR                                                              */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "ARMOR"
      ) {
        if (
          !Array.isArray(
            form.armor
              ?.versions,
          ) ||
          form.armor
            .versions
            .length === 0
        ) {
          nextErrors.armorVersions =
            "Add at least one armor version."
        }
      }

      /* ------------------------------------------------------------------ */
      /* ADDITIONAL                                                         */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "ADDITIONAL"
      ) {
        if (
          !Array.isArray(
            form.additional
              ?.versions,
          ) ||
          form.additional
            .versions
            .length === 0
        ) {
          nextErrors.additionalVersions =
            "Add at least one Additional Gear version."
        }
      }

      /* ------------------------------------------------------------------ */
      /* SPECIAL GEAR                                                       */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "SPECIAL_GEAR"
      ) {
        if (
          !Array.isArray(
            form.specialGear
              ?.versions,
          ) ||
          form.specialGear
            .versions
            .length === 0
        ) {
          nextErrors.specialGearVersions =
            "Add at least one Special Gear version."
        }
      }

      /* ------------------------------------------------------------------ */
      /* MATERIAL                                                           */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "MATERIAL"
      ) {
        if (
          !form.material
            ?.type
        ) {
          nextErrors.materialType =
            "Material type is required."
        }
      }

      /* ------------------------------------------------------------------ */
      /* CONSUMABLE                                                         */
      /* ------------------------------------------------------------------ */

      if (
        form.category ===
        "CONSUMABLE"
      ) {
        if (
          !form.consumable
            ?.type
        ) {
          nextErrors.consumableType =
            "Consumable type is required."
        }

        if (
          !form.consumable
            ?.visualType
        ) {
          nextErrors.consumableVisualType =
            "Visual type is required."
        }

        if (
          !form.consumable
            ?.mainEffect
            ?.trim()
        ) {
          nextErrors.consumableMainEffect =
            "Main effect is required."
        }

        if (
          !Array.isArray(
            form.consumable
              ?.effects,
          ) ||
          form.consumable
            .effects
            .length === 0
        ) {
          nextErrors.consumableEffects =
            "Add at least one effect."
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
  /* CATEGORY DATA                                                          */
  /* ---------------------------------------------------------------------- */

  function getCategoryData() {
    switch (
      form.category
    ) {
      case "WEAPON":
        return form.weapon

      case "SUB_WEAPON":
        return form.subWeapon

      case "ARMOR":
        return form.armor

      case "ADDITIONAL":
        return form.additional

      case "SPECIAL_GEAR":
        return form.specialGear

      case "MATERIAL":
        return form.material

      case "CONSUMABLE":
        return form.consumable

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

      category:
        form.category,

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

      data:
        getCategoryData(),

      notes:
        form.notes.trim() ||
        null,

      status,
    }
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  async function saveItem(
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
      "Update Item Payload:",
      payload,
    )

    /*
      TODO API

      await updateItem(
        id,
        payload,
      )

      Untuk multipart:

      - image baru -> upload file
      - image existing -> tidak perlu upload ulang
      - image null -> backend bisa menerima removeImage = true
      - Armor appearance image tetap dikirim sebagai file terpisah

      Contoh:

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
        "category",
        payload.category,
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
        "data",
        JSON.stringify(
          sanitizedData,
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

      if (
        !form.image
      ) {
        formData.append(
          "removeImage",
          "true",
        )
      }

      await updateItem(
        id,
        formData,
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
      }),
    )

    setSavingAction(
      null,
    )

    navigate(
      `/data/items/${id}`,
    )
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
        <div className="animate-pulse">
          <div className="h-5 w-32 rounded bg-muted" />

          <div className="mt-6 h-9 w-64 rounded bg-muted" />

          <div className="mt-3 h-4 w-96 rounded bg-muted" />

          <div className="mt-8 h-[520px] rounded-2xl border border-border bg-muted/20" />
        </div>
      </div>
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
            `/data/items/${id}`,
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Item
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
            Items
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
            <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              Edit Item
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Perbarui informasi dan data item.
            </p>
          </div>

          <StatusBadge
            status={
              form.status
            }
          />
        </div>

        {/* META */}

        <div className="mt-5 flex items-center gap-6 text-xs text-muted-foreground">
          <div>
            <span>
              Created
            </span>

            <span className="ml-2 font-medium text-foreground">
              {formatDateTime(
                form.createdAt,
              )}
            </span>
          </div>

          <div className="h-3 w-px bg-border" />

          <div>
            <span>
              Last Updated
            </span>

            <span className="ml-2 font-medium text-foreground">
              {formatDateTime(
                form.updatedAt,
              )}
            </span>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* CARD                                                               */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
        {/* =============================================================== */}
        {/* 01 GENERAL                                                      */}
        {/* =============================================================== */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="General Information"
            description="Informasi utama yang digunakan untuk mengidentifikasi item."
          />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] gap-10">
            {/* =========================================================== */}
            {/* LEFT                                                       */}
            {/* =========================================================== */}

            <div className="space-y-6">
              {/* NAME */}

              <Field>
                <FieldLabel required>
                  Item Name
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
                  placeholder="Item name"
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

              {/* SLUG + CATEGORY */}

              <div className="grid grid-cols-2 gap-5">
                {/* SLUG */}

                <Field>
                  <FieldLabel>
                    Slug
                  </FieldLabel>

                  <DisabledValueField
                    value={
                      slug
                    }
                  />
                </Field>

                {/* CATEGORY */}

                <Field>
                  <FieldLabel required>
                    Category
                  </FieldLabel>

                  <SelectMenu
                    value={
                      form.category
                    }
                    options={
                      categoryOptions
                    }
                    placeholder="Select category"
                    onChange={
                      handleCategoryChange
                    }
                  />

                  {errors.category && (
                    <FieldError>
                      {
                        errors.category
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

                  <SelectMenu
                    value={
                      form.availability
                    }
                    options={
                      availabilityOptions
                    }
                    placeholder="Select availability"
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
                  maxLength={1000}
                  rows={5}
                  placeholder="Tambahkan deskripsi item..."
                  className={textareaClass()}
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
              <FieldLabel>
                Item Image
              </FieldLabel>

              {!form.image ? (
                <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 px-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.025]">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-primary">
                    <ImagePlus className="size-5" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-foreground">
                    Add Item Image
                  </p>

                  <p className="mt-1.5 text-xs text-muted-foreground">
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
                  {/* IMAGE */}

                  <div className="relative aspect-square overflow-hidden bg-muted/20">
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
                        form.name
                      }
                      className="h-full w-full object-contain p-4"
                    />

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      className="absolute right-3 top-3 flex size-9 cursor-pointer items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/75"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* INFO */}

                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <ImageIcon className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {
                            form.image
                              .name
                          }
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

                    {/* REPLACE */}

                    <label className="cursor-pointer text-xs font-medium text-primary hover:underline">
                      Replace

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={
                          handleImageSelect
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-muted-foreground">
                Gambar utama item yang ditampilkan di database Aoi.
              </p>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* WEAPON                                                          */}
        {/* =============================================================== */}

        {form.category ===
          "WEAPON" && (
          <>
            <WeaponForm
              data={
                form.weapon
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {(errors.weaponType ||
              errors.weaponVersions) && (
              <CategoryValidation>
                {errors.weaponType && (
                  <FieldError>
                    {
                      errors.weaponType
                    }
                  </FieldError>
                )}

                {errors.weaponVersions && (
                  <FieldError>
                    {
                      errors.weaponVersions
                    }
                  </FieldError>
                )}
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* SUB WEAPON                                                       */}
        {/* =============================================================== */}

        {form.category ===
          "SUB_WEAPON" && (
          <>
            <SubWeaponForm
              data={
                form.subWeapon
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {(errors.subWeaponType ||
              errors.subWeaponVersions) && (
              <CategoryValidation>
                {errors.subWeaponType && (
                  <FieldError>
                    {
                      errors.subWeaponType
                    }
                  </FieldError>
                )}

                {errors.subWeaponVersions && (
                  <FieldError>
                    {
                      errors.subWeaponVersions
                    }
                  </FieldError>
                )}
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* ARMOR                                                           */}
        {/* =============================================================== */}

        {form.category ===
          "ARMOR" && (
          <>
            <ArmorForm
              data={
                form.armor
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {errors.armorVersions && (
              <CategoryValidation>
                <FieldError>
                  {
                    errors.armorVersions
                  }
                </FieldError>
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* ADDITIONAL                                                      */}
        {/* =============================================================== */}

        {form.category ===
          "ADDITIONAL" && (
          <>
            <AdditionalForm
              data={
                form.additional
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {errors.additionalVersions && (
              <CategoryValidation>
                <FieldError>
                  {
                    errors.additionalVersions
                  }
                </FieldError>
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* SPECIAL GEAR                                                    */}
        {/* =============================================================== */}

        {form.category ===
          "SPECIAL_GEAR" && (
          <>
            <SpecialGearForm
              data={
                form.specialGear
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {errors.specialGearVersions && (
              <CategoryValidation>
                <FieldError>
                  {
                    errors.specialGearVersions
                  }
                </FieldError>
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* MATERIAL                                                        */}
        {/* =============================================================== */}

        {form.category ===
          "MATERIAL" && (
          <>
            <MaterialForm
              data={
                form.material
              }
              setForm={
                setForm
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {errors.materialType && (
              <CategoryValidation>
                <FieldError>
                  {
                    errors.materialType
                  }
                </FieldError>
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* CONSUMABLE                                                      */}
        {/* =============================================================== */}

        {form.category ===
          "CONSUMABLE" && (
          <>
            <ConsumableForm
              data={
                form.consumable
              }
              setForm={
                setForm
              }
              itemOptions={
                itemOptions
              }
              monsterOptions={
                monsterOptions
              }
              createLocalId={
                createLocalId
              }
            />

            {(errors.consumableType ||
              errors.consumableVisualType ||
              errors.consumableMainEffect ||
              errors.consumableEffects) && (
              <CategoryValidation>
                {errors.consumableType && (
                  <FieldError>
                    {
                      errors.consumableType
                    }
                  </FieldError>
                )}

                {errors.consumableVisualType && (
                  <FieldError>
                    {
                      errors.consumableVisualType
                    }
                  </FieldError>
                )}

                {errors.consumableMainEffect && (
                  <FieldError>
                    {
                      errors.consumableMainEffect
                    }
                  </FieldError>
                )}

                {errors.consumableEffects && (
                  <FieldError>
                    {
                      errors.consumableEffects
                    }
                  </FieldError>
                )}
              </CategoryValidation>
            )}
          </>
        )}

        {/* =============================================================== */}
        {/* NOTES                                                           */}
        {/* =============================================================== */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="Item Notes"
            description="Informasi tambahan mengenai item."
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
            maxLength={1000}
            placeholder="Tambahkan catatan item..."
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
        {/* FOOTER                                                          */}
        {/* =============================================================== */}

        <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
          {/* CURRENT STATUS */}

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                Item Status
              </p>

              <StatusBadge
                status={
                  form.status
                }
              />
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Simpan perubahan dan tentukan status item.
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
                  `/data/items/${id}`,
                )
              }
              className="h-10 cursor-pointer px-4"
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
                saveItem(
                  "DRAFT",
                )
              }
              className="h-10 cursor-pointer gap-2 px-5"
            >
              <Save className="size-4" />

              {savingAction ===
              "DRAFT"
                ? "Saving..."
                : form.status ===
                    "DRAFT"
                  ? "Save Draft"
                  : "Move to Draft"}
            </Button>

            {/* PUBLISHED */}

            <Button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                saveItem(
                  "PUBLISHED",
                )
              }
              className="h-10 cursor-pointer gap-2 px-5"
            >
              <CheckCircle2 className="size-4" />

              {savingAction ===
              "PUBLISHED"
                ? "Saving..."
                : form.status ===
                    "PUBLISHED"
                  ? "Save Changes"
                  : "Publish Item"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY STATE KEY                                                         */
/* -------------------------------------------------------------------------- */

function getCategoryStateKey(
  category,
) {
  const keys = {
    WEAPON:
      "weapon",

    SUB_WEAPON:
      "subWeapon",

    ARMOR:
      "armor",

    ADDITIONAL:
      "additional",

    SPECIAL_GEAR:
      "specialGear",

    MATERIAL:
      "material",

    CONSUMABLE:
      "consumable",
  }

  return (
    keys[category] ||
    null
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
      <span className="inline-flex h-7 items-center rounded-full bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600">
        Published
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 items-center rounded-full bg-amber-500/10 px-3 text-xs font-semibold text-amber-600">
      Draft
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY VALIDATION                                                        */
/* -------------------------------------------------------------------------- */

function CategoryValidation({
  children,
}) {
  return (
    <div className="border-t border-border px-6 py-4">
      <div className="space-y-2">
        {children}
      </div>
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

function FieldError({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
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
    <div className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg border border-border/90 bg-muted/85 px-3.5 shadow-inner">
      <LockKeyhole className="size-4 shrink-0 text-muted-foreground/85" />

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground/85">
        {value}
      </span>
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
      ? "border-destructive/50 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
}

function textareaClass() {
  return "min-h-[130px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
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
    new Date(value)

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
      day: "2-digit",
      month: "short",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(date)
}
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  ImageIcon,
  Package,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import { Button } from "@/components/ui/button"

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
]

/* -------------------------------------------------------------------------- */
/* MOCK MONSTERS                                                              */
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

    weapon: {
      type: "",
      versions: [],
    },

    subWeapon: {
      type: "",
      mainWeaponPairings: [],
      versions: [],
    },

    armor: {
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
    },

    additional: {
      versions: [],
    },

    specialGear: {
      versions: [],
    },

    material: {
      type: "",

      acquisitionSources: [],

      process: {
        materialType: "",
        points: "",
      },

      sellPrice: "",

      otherUses: [],
    },

    consumable: {
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
    },

    notes: "",

    status: "DRAFT",

    createdAt: null,

    updatedAt: null,
  }
}

/* -------------------------------------------------------------------------- */
/* MAP ITEM                                                                   */
/* -------------------------------------------------------------------------- */

function mapItemToForm(
  item,
) {
  const initial =
    createInitialForm()

  const categoryKey =
    getCategoryStateKey(
      item.category,
    )

  return {
    ...initial,

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
      item.image || null,

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
            ...initial[
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

export default function ItemDetailPage() {
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
    loading,
    setLoading,
  ] = useState(true)

  const [
    notFound,
    setNotFound,
  ] = useState(false)

  /* ---------------------------------------------------------------------- */
  /* LOAD                                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let active = true

    async function loadItem() {
      setLoading(true)
      setNotFound(false)

      /*
        TODO API

        try {
          const item =
            await getItemById(id)

          if (!active) {
            return
          }

          if (!item) {
            setNotFound(true)
            setLoading(false)
            return
          }

          setForm(
            mapItemToForm(
              item,
            ),
          )
        } catch (error) {
          setNotFound(true)
        } finally {
          setLoading(false)
        }
      */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300,
          ),
      )

      if (!active) {
        return
      }

      const item =
        mockItemDetail

      if (!item) {
        setNotFound(true)
        setLoading(false)
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
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <DetailLoading />
    )
  }

  /* ---------------------------------------------------------------------- */
  /* NOT FOUND                                                              */
  /* ---------------------------------------------------------------------- */

  if (notFound) {
    return (
      <NotFoundState
        onBack={() =>
          navigate(
            "/data/items",
          )
        }
      />
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
            "/data/items",
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Items
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
            Items
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-primary">
            {form.name}
          </span>
        </div>

        {/* TITLE + ACTION */}

        <div className="mt-2 flex items-start justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
                {form.name}
              </h1>

              <StatusBadge
                status={
                  form.status
                }
              />
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              View item data.
            </p>
          </div>

          <Button
            type="button"
            onClick={() =>
              navigate(
                `/data/items/${id}/edit`,
              )
            }
            className="h-10 cursor-pointer gap-2 px-5"
          >
            <Edit3 className="size-4" />

            Edit Item
          </Button>
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
        {/* 01 GENERAL INFORMATION                                          */}
        {/* =============================================================== */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="General Information"
            description="Informasi utama item."
          />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] gap-10">
            {/* =========================================================== */}
            {/* LEFT                                                       */}
            {/* =========================================================== */}

            <div className="space-y-6">
              {/* NAME */}

              <ReadOnlyField
                label="Item Name"
                value={
                  form.name
                }
              />

              {/* SLUG + CATEGORY */}

              <div className="grid grid-cols-2 gap-5">
                <ReadOnlyField
                  label="Slug"
                  value={
                    form.slug
                  }
                  mono
                />

                <ReadOnlyField
                  label="Category"
                  value={getOptionLabel(
                    categoryOptions,
                    form.category,
                  )}
                />
              </div>

              {/* AVAILABILITY */}

              <div className="grid grid-cols-2 gap-5">
                <ReadOnlyField
                  label="Availability"
                  value={getOptionLabel(
                    availabilityOptions,
                    form.availability,
                  )}
                />

                <div />
              </div>

              {/* DESCRIPTION */}

              <div>
                <FieldLabel>
                  Description
                </FieldLabel>

                <div className="min-h-[130px] rounded-xl border border-border bg-muted/20 px-3.5 py-3">
                  <p className="whitespace-pre-line text-sm leading-6 text-foreground">
                    {form.description ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================== */}
            {/* IMAGE                                                      */}
            {/* =========================================================== */}

            <div>
              <FieldLabel>
                Item Image
              </FieldLabel>

              {form.image?.url ? (
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="aspect-square overflow-hidden bg-muted/20">
                    <img
                      src={
                        form.image
                          .url
                      }
                      alt={
                        form.name
                      }
                      className="h-full w-full object-contain p-4"
                    />
                  </div>

                  <div className="flex items-center gap-3 border-t border-border px-4 py-3.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <ImageIcon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {form.image
                          .name ||
                          "Item Image"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Existing image
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border bg-muted/[0.05]">
                  <div className="text-center">
                    <ImageIcon className="mx-auto size-5 text-muted-foreground/60" />

                    <p className="mt-2 text-xs text-muted-foreground">
                      No image
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 02 CATEGORY                                                     */}
        {/* =============================================================== */}

        <CategoryForm
          form={
            form
          }
          setForm={
            setForm
          }
        />

        {/* =============================================================== */}
        {/* 03 NOTES                                                        */}
        {/* =============================================================== */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="Item Notes"
            description="Informasi tambahan mengenai item."
          />

          <div className="mt-6 min-h-[130px] rounded-xl border border-border bg-muted/20 px-3.5 py-3">
            <p className="whitespace-pre-line text-sm leading-6 text-foreground">
              {form.notes ||
                "—"}
            </p>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY FORM                                                              */
/* -------------------------------------------------------------------------- */

function CategoryForm({
  form,
  setForm,
}) {
  const commonProps = {
    setForm,

    itemOptions,

    monsterOptions,

    createLocalId,

    mode: "view",

    readOnly: true,
  }

  switch (
    form.category
  ) {
    case "WEAPON":
      return (
        <WeaponForm
          {...commonProps}
          data={
            form.weapon
          }
        />
      )

    case "SUB_WEAPON":
      return (
        <SubWeaponForm
          {...commonProps}
          data={
            form.subWeapon
          }
        />
      )

    case "ARMOR":
      return (
        <ArmorForm
          {...commonProps}
          data={
            form.armor
          }
        />
      )

    case "ADDITIONAL":
      return (
        <AdditionalForm
          {...commonProps}
          data={
            form.additional
          }
        />
      )

    case "SPECIAL_GEAR":
      return (
        <SpecialGearForm
          {...commonProps}
          data={
            form.specialGear
          }
        />
      )

    case "MATERIAL":
      return (
        <MaterialForm
          {...commonProps}
          data={
            form.material
          }
        />
      )

    case "CONSUMABLE":
      return (
        <ConsumableForm
          {...commonProps}
          data={
            form.consumable
          }
        />
      )

    default:
      return null
  }
}

/* -------------------------------------------------------------------------- */
/* READ ONLY FIELD                                                            */
/* -------------------------------------------------------------------------- */

function ReadOnlyField({
  label,
  value,
  mono = false,
}) {
  return (
    <div>
      <FieldLabel>
        {label}
      </FieldLabel>

      <div className="flex min-h-11 items-center rounded-lg border border-border bg-muted/20 px-3.5">
        <span
          className={[
            "min-w-0 break-words text-sm font-medium text-foreground",

            mono
              ? "font-mono text-[13px]"
              : "",
          ].join(" ")}
        >
          {value ||
            "—"}
        </span>
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
  if (
    status ===
    "PUBLISHED"
  ) {
    return (
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-600">
        <span className="size-1.5 rounded-full bg-emerald-500" />

        Published
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-amber-500/10 px-3 text-xs font-semibold text-amber-600">
      <span className="size-1.5 rounded-full bg-amber-500" />

      Draft
    </span>
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

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD LABEL                                                                */
/* -------------------------------------------------------------------------- */

function FieldLabel({
  children,
}) {
  return (
    <p className="mb-2 block text-sm font-medium text-foreground">
      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* LOADING                                                                    */
/* -------------------------------------------------------------------------- */

function DetailLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="animate-pulse">
        <div className="h-5 w-32 rounded bg-muted" />

        <div className="mt-6 flex items-center justify-between gap-6">
          <div>
            <div className="h-9 w-72 rounded bg-muted" />

            <div className="mt-3 h-4 w-48 rounded bg-muted" />
          </div>

          <div className="h-10 w-28 rounded-lg bg-muted" />
        </div>

        <div className="mt-5 h-4 w-96 rounded bg-muted" />

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background">
          <div className="p-6">
            <div className="h-8 w-52 rounded bg-muted" />

            <div className="mt-7 grid grid-cols-[minmax(0,1fr)_360px] gap-10">
              <div className="space-y-5">
                <div className="h-16 rounded-xl bg-muted/50" />

                <div className="grid grid-cols-2 gap-5">
                  <div className="h-16 rounded-xl bg-muted/50" />
                  <div className="h-16 rounded-xl bg-muted/50" />
                </div>

                <div className="h-16 rounded-xl bg-muted/50" />

                <div className="h-36 rounded-xl bg-muted/50" />
              </div>

              <div className="aspect-square rounded-2xl bg-muted/50" />
            </div>
          </div>

          <div className="h-[480px] border-t border-border bg-muted/[0.08]" />

          <div className="h-[200px] border-t border-border bg-muted/[0.04]" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NOT FOUND                                                                  */
/* -------------------------------------------------------------------------- */

function NotFoundState({
  onBack,
}) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <button
        type="button"
        onClick={
          onBack
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Items
      </button>

      <div className="mt-8 rounded-2xl border border-border bg-background px-8 py-14 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Package className="size-5" />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-foreground">
          Item not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Data item tidak ditemukan.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CATEGORY KEY                                                               */
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
/* OPTION LABEL                                                               */
/* -------------------------------------------------------------------------- */

function getOptionLabel(
  options,
  value,
) {
  const option =
    options.find(
      (item) =>
        item.value ===
        value,
    )

  return (
    option?.label ||
    formatLabel(
      value,
    )
  )
}

/* -------------------------------------------------------------------------- */
/* FORMAT LABEL                                                               */
/* -------------------------------------------------------------------------- */

function formatLabel(
  value,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—"
  }

  return String(value)
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
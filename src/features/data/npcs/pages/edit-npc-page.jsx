import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useNavigate, useParams } from "react-router-dom"
import Cropper from "react-easy-crop"

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Coins,
  Crop,
  Hammer,
  ImageIcon,
  ImagePlus,
  LockKeyhole,
  MapPinned,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* NPC TYPES                                                                  */
/* -------------------------------------------------------------------------- */

const npcTypes = [
  {
    value: "GENERAL",
    label: "General NPC",
  },
  {
    value: "STORY",
    label: "Story NPC",
  },
  {
    value: "QUEST",
    label: "Quest NPC",
  },
  {
    value: "MERCHANT",
    label: "Merchant",
  },
  {
    value: "BLACKSMITH",
    label: "Blacksmith",
  },
  {
    value: "SYNTHESIST",
    label: "Synthesist",
  },
]

/* -------------------------------------------------------------------------- */
/* MAPS                                                                       */
/* -------------------------------------------------------------------------- */

const maps = [
  {
    id: "MAP-001",
    name: "Sofya City",
    type: "CITY",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-002",
    name: "Rakau Plains",
    type: "FIELD",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-003",
    name: "Government Office",
    type: "BUILDING",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-007",
    name: "El Scaro",
    type: "CITY",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-010",
    name: "Hora Diomedea",
    type: "CITY",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-014",
    name: "Erva Tronc",
    type: "FOREST",
    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },
  },
  {
    id: "MAP-015",
    name: "Nov Saterica",
    type: "CITY",
    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },
  },
]

/* -------------------------------------------------------------------------- */
/* QUESTS                                                                     */
/* -------------------------------------------------------------------------- */

const quests = [
  {
    id: "QUEST-001",
    name: "Proof of Courage?",
    level: 25,
  },
  {
    id: "QUEST-002",
    name: "Timber Shortage",
    level: 15,
  },
  {
    id: "QUEST-003",
    name: "The Overlooked Snack",
    level: 10,
  },
  {
    id: "QUEST-004",
    name: "Nightmare Crystal",
    level: 50,
  },
  {
    id: "QUEST-005",
    name: "Pride of the Rich",
    level: 40,
  },
  {
    id: "QUEST-006",
    name: "A Drinking Pal at the Fortress",
    level: 30,
  },
]

/* -------------------------------------------------------------------------- */
/* ITEMS                                                                      */
/* -------------------------------------------------------------------------- */

const items = [
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
    name: "Vita Plus I",
    category: "Usable",
  },
  {
    id: "ITEM-004",
    name: "Magic Hammer",
    category: "Support",
  },
  {
    id: "ITEM-005",
    name: "Teleport Ticket",
    category: "Usable",
  },
  {
    id: "ITEM-006",
    name: "Iron",
    category: "Material",
  },
  {
    id: "ITEM-007",
    name: "Damascus Ore",
    category: "Material",
  },
]

/* -------------------------------------------------------------------------- */
/* DEFAULT CAPABILITIES                                                       */
/* -------------------------------------------------------------------------- */

const synthesistCapabilities = [
  {
    id: "ITEM_SYNTHESIS",
    name: "Item Synthesis",
    description: "Membuat item melalui fitur synthesis.",
  },
  {
    id: "EQUIPMENT_SYNTHESIS",
    name: "Equipment Synthesis",
    description: "Menggabungkan equipment dan appearance.",
  },
  {
    id: "APPEARANCE_LOCK",
    name: "Appearance Lock",
    description: "Mengunci appearance saat melakukan synthesis.",
  },
  {
    id: "COLOR_SYNTHESIS",
    name: "Color Synthesis",
    description: "Mengatur kombinasi warna equipment.",
  },
]

const blacksmithCapabilities = [
  {
    id: "REFINE_EQUIPMENT",
    name: "Refine Equipment",
    description: "Melakukan refinement pada equipment.",
  },
  {
    id: "CREATE_EQUIPMENT",
    name: "Create Equipment",
    description: "Membuat equipment melalui blacksmith.",
  },
  {
    id: "MODIFY_EQUIPMENT",
    name: "Modify Equipment",
    description: "Layanan modifikasi equipment yang tersedia.",
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
/* MOCK NPC RECORDS                                                           */
/* -------------------------------------------------------------------------- */

const npcRecords = [
  {
    id: "NPC-001",

    name: "Lefina",
    slug: "lefina",
    type: "QUEST",

    mapId: "MAP-001",

    image: null,

    notes:
      "NPC di Sofya City yang memberikan berbagai side quest kepada pemain.",

    quests: [
      "QUEST-001",
      "QUEST-002",
      "QUEST-004",
    ],

    merchantItems: [],

    status: "PUBLISHED",
  },

  {
    id: "NPC-002",

    name: "Sololo",
    slug: "sololo",
    type: "MERCHANT",

    mapId: "MAP-001",

    image: null,

    notes:
      "Merchant yang menjual berbagai item dasar untuk pemain.",

    quests: [],

    merchantItems: [
      {
        itemId: "ITEM-001",
        price: 100,
      },
      {
        itemId: "ITEM-002",
        price: 300,
      },
      {
        itemId: "ITEM-005",
        price: 1000,
      },
    ],

    status: "PUBLISHED",
  },

  {
    id: "NPC-003",

    name: "Zono",
    slug: "zono",
    type: "BLACKSMITH",

    mapId: "MAP-001",

    image: null,

    notes:
      "Blacksmith yang menyediakan berbagai layanan equipment.",

    quests: [],
    merchantItems: [],

    status: "PUBLISHED",
  },

  {
    id: "NPC-008",

    name: "Synthesist Mubia",
    slug: "synthesist-mubia",
    type: "SYNTHESIST",

    mapId: "MAP-001",

    image: null,

    notes:
      "NPC Synthesist di Sofya City.",

    quests: [],
    merchantItems: [],

    status: "PUBLISHED",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditNpcPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  /* ---------------------------------------------------------------------- */
  /* RECORD                                                                 */
  /* ---------------------------------------------------------------------- */

  const npcRecord = useMemo(() => {
    return (
      npcRecords.find(
        (npc) => npc.id === id,
      ) || npcRecords[0]
    )
  }, [id])

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
  /* ---------------------------------------------------------------------- */

  const [form, setForm] = useState({
    name: npcRecord.name,
    type: npcRecord.type,
    mapId: npcRecord.mapId || "",
    image: npcRecord.image || null,
    notes: npcRecord.notes || "",
  })

  /* ---------------------------------------------------------------------- */
  /* QUEST STATE                                                            */
  /* ---------------------------------------------------------------------- */

  const [
    selectedQuests,
    setSelectedQuests,
  ] = useState(() => {
    return (
      npcRecord.quests || []
    )
      .map((questId) =>
        quests.find(
          (quest) =>
            quest.id === questId,
        ),
      )
      .filter(Boolean)
  })

  /* ---------------------------------------------------------------------- */
  /* MERCHANT STATE                                                         */
  /* ---------------------------------------------------------------------- */

  const [
    merchantItems,
    setMerchantItems,
  ] = useState(() => {
    return (
      npcRecord.merchantItems || []
    )
      .map((entry) => {
        const item =
          items.find(
            (item) =>
              item.id ===
              entry.itemId,
          )

        if (!item) return null

        return {
          ...item,
          price: entry.price,
        }
      })
      .filter(Boolean)
  })

  /* ---------------------------------------------------------------------- */
  /* OTHER STATE                                                            */
  /* ---------------------------------------------------------------------- */

  const [errors, setErrors] =
    useState({})

  const [
    savingAction,
    setSavingAction,
  ] = useState(null)

  const isSaving =
    savingAction !== null

  const [
    cropSource,
    setCropSource,
  ] = useState(null)

  const [
    cropModalOpen,
    setCropModalOpen,
  ] = useState(false)

  /* ---------------------------------------------------------------------- */
  /* SYNC RECORD                                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setForm({
      name: npcRecord.name,
      type: npcRecord.type,
      mapId: npcRecord.mapId || "",
      image: npcRecord.image || null,
      notes: npcRecord.notes || "",
    })

    setSelectedQuests(
      (
        npcRecord.quests || []
      )
        .map((questId) =>
          quests.find(
            (quest) =>
              quest.id === questId,
          ),
        )
        .filter(Boolean),
    )

    setMerchantItems(
      (
        npcRecord.merchantItems ||
        []
      )
        .map((entry) => {
          const item =
            items.find(
              (item) =>
                item.id ===
                entry.itemId,
            )

          if (!item) {
            return null
          }

          return {
            ...item,
            price: entry.price,
          }
        })
        .filter(Boolean),
    )

    setErrors({})
  }, [npcRecord])

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug = useMemo(() => {
    return createSlug(form.name)
  }, [form.name])

  const selectedMap =
    useMemo(() => {
      return (
        maps.find(
          (map) =>
            map.id ===
            form.mapId,
        ) || null
      )
    }, [form.mapId])

  const selectedWorld =
    selectedMap?.world || null

  const mapOptions =
    useMemo(() => {
      return maps.map(
        (map) => ({
          value: map.id,
          label: map.name,
          meta: `${map.world.name} · ${formatMapType(
            map.type,
          )}`,
        }),
      )
    }, [])

  /* ---------------------------------------------------------------------- */
  /* QUEST OPTIONS                                                          */
  /* ---------------------------------------------------------------------- */

  const questOptions =
    useMemo(() => {
      return quests
        .filter(
          (quest) =>
            !selectedQuests.some(
              (selected) =>
                selected.id ===
                quest.id,
            ),
        )
        .map((quest) => ({
          value: quest.id,
          label: quest.name,
          meta: `Lv. ${quest.level}`,
        }))
    }, [selectedQuests])

  /* ---------------------------------------------------------------------- */
  /* ITEM OPTIONS                                                           */
  /* ---------------------------------------------------------------------- */

  const itemOptions =
    useMemo(() => {
      return items
        .filter(
          (item) =>
            !merchantItems.some(
              (selected) =>
                selected.id ===
                item.id,
            ),
        )
        .map((item) => ({
          value: item.id,
          label: item.name,
          meta: item.category,
        }))
    }, [merchantItems])

  /* ---------------------------------------------------------------------- */
  /* UPDATE FIELD                                                           */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  /* ---------------------------------------------------------------------- */
  /* TYPE CHANGE                                                            */
  /* ---------------------------------------------------------------------- */

  function handleTypeChange(
    value,
  ) {
    setForm((current) => ({
      ...current,
      type: value,
    }))

    setErrors((current) => ({
      ...current,
      type: undefined,
    }))
  }

  /* ---------------------------------------------------------------------- */
  /* QUEST                                                                  */
  /* ---------------------------------------------------------------------- */

  function addQuest(
    questId,
  ) {
    const quest =
      quests.find(
        (item) =>
          item.id === questId,
      )

    if (!quest) return

    if (
      selectedQuests.some(
        (item) =>
          item.id === quest.id,
      )
    ) {
      return
    }

    setSelectedQuests(
      (current) => [
        ...current,
        quest,
      ],
    )
  }

  function removeQuest(
    questId,
  ) {
    setSelectedQuests(
      (current) =>
        current.filter(
          (quest) =>
            quest.id !==
            questId,
        ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* MERCHANT                                                               */
  /* ---------------------------------------------------------------------- */

  function addMerchantItem(
    itemId,
  ) {
    const item =
      items.find(
        (item) =>
          item.id === itemId,
      )

    if (!item) return

    setMerchantItems(
      (current) => [
        ...current,
        {
          ...item,
          price: "",
        },
      ],
    )
  }

  function removeMerchantItem(
    itemId,
  ) {
    setMerchantItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== itemId,
        ),
    )
  }

  function updateMerchantPrice(
    itemId,
    value,
  ) {
    const normalized =
      value.replace(
        /[^0-9]/g,
        "",
      )

    setMerchantItems(
      (current) =>
        current.map(
          (item) =>
            item.id === itemId
              ? {
                  ...item,
                  price:
                    normalized,
                }
              : item,
        ),
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

    if (!file) return

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      return
    }

    const url =
      URL.createObjectURL(file)

    setCropSource(
      (current) => {
        if (current?.url) {
          URL.revokeObjectURL(
            current.url,
          )
        }

        return {
          file,
          url,
        }
      },
    )

    setCropModalOpen(true)
  }

  function handleCropApply(
    image,
  ) {
    setForm((current) => {
      if (
        current.image
          ?.previewUrl
      ) {
        URL.revokeObjectURL(
          current.image.previewUrl,
        )
      }

      return {
        ...current,
        image,
      }
    })

    closeCropModal()
  }

  function closeCropModal() {
    setCropModalOpen(false)

    setCropSource(
      (current) => {
        if (current?.url) {
          URL.revokeObjectURL(
            current.url,
          )
        }

        return null
      },
    )
  }

  function removeImage() {
    setForm((current) => {
      if (
        current.image
          ?.previewUrl
      ) {
        URL.revokeObjectURL(
          current.image.previewUrl,
        )
      }

      return {
        ...current,
        image: null,
      }
    })
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATION                                                             */
  /* ---------------------------------------------------------------------- */

  function validateForm() {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name =
        "NPC name is required."
    }

    if (!form.type) {
      nextErrors.type =
        "NPC type is required."
    }

    setErrors(nextErrors)

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    )
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  async function saveChanges(
    status,
  ) {
    if (!validateForm()) {
      return
    }

    setSavingAction(status)

    const payload = {
      id: npcRecord.id,

      name:
        form.name.trim(),

      slug,

      type:
        form.type,

      map:
        selectedMap
          ? {
              id:
                selectedMap.id,
              name:
                selectedMap.name,
            }
          : null,

      image:
        form.image?.file ||
        form.image ||
        null,

      imageRatio:
        form.image?.ratio ||
        null,

      notes:
        form.notes.trim() ||
        null,

      quests:
        form.type === "QUEST"
          ? selectedQuests.map(
              (quest) => ({
                id:
                  quest.id,
                name:
                  quest.name,
              }),
            )
          : [],

      merchantItems:
        form.type === "MERCHANT"
          ? merchantItems.map(
              (item) => ({
                item: {
                  id:
                    item.id,
                  name:
                    item.name,
                },

                price:
                  item.price === ""
                    ? null
                    : Number(
                        item.price,
                      ),
              }),
            )
          : [],

      /*
        Synthesist dan Blacksmith
        tidak perlu capability disimpan per NPC.

        Capability ditentukan oleh NPC Type:
        SYNTHESIST -> synthesistCapabilities
        BLACKSMITH -> blacksmithCapabilities
      */

      status,
    }

    console.log(
      "Update NPC Payload:",
      payload,
    )

    /*
      TODO:
      await updateNpc(
        npcRecord.id,
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

    setSavingAction(null)

    navigate(
      `/data/worlds/npcs/${npcRecord.id}`,
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
        {/* ================================================================= */}
        {/* BACK                                                              */}
        {/* ================================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/data/worlds/npcs/${npcRecord.id}`,
            )
          }
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />

          Back to NPC
        </button>

        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

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
              NPCs
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-muted-foreground">
              {npcRecord.name}
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Edit
            </span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              Edit NPC
            </h1>

            <CurrentStatusBadge
              status={
                npcRecord.status
              }
            />
          </div>

          <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
            Perbarui informasi, lokasi, dan data yang berhubungan
            dengan fungsi NPC.
          </p>
        </header>

        {/* ================================================================= */}
        {/* CARD                                                              */}
        {/* ================================================================= */}

        <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
          {/* =============================================================== */}
          {/* 01 GENERAL                                                      */}
          {/* =============================================================== */}

          <div className="p-6">
            <SectionTitle
              number="01"
              title="General Information"
              description="Informasi utama yang digunakan untuk mengidentifikasi NPC."
            />

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_360px] gap-10">
              {/* =========================================================== */}
              {/* LEFT                                                        */}
              {/* =========================================================== */}

              <div className="space-y-6">
                {/* NAME */}
                <Field>
                  <FieldLabel required>
                    NPC Name
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
                        event.target.value,
                      )
                    }
                    placeholder="Example: Lefina"
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
                      Nama NPC yang akan ditampilkan di Aoi.
                    </FieldHint>
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
                        "generated-from-npc-name"
                      }
                    />

                    <FieldHint>
                      Dibuat otomatis berdasarkan NPC Name.
                    </FieldHint>
                  </Field>

                  <Field>
                    <FieldLabel required>
                      NPC Type
                    </FieldLabel>

                    <SearchableSelect
                      value={
                        form.type
                      }
                      options={
                        npcTypes
                      }
                      placeholder="Select NPC type"
                      searchPlaceholder="Search NPC type..."
                      emptyText="No NPC type found."
                      icon={
                        UserRound
                      }
                      error={
                        Boolean(
                          errors.type,
                        )
                      }
                      onChange={
                        handleTypeChange
                      }
                    />

                    {errors.type ? (
                      <FieldError>
                        {errors.type}
                      </FieldError>
                    ) : (
                      <FieldHint>
                        Mengubah type juga mengubah data khusus yang tersedia.
                      </FieldHint>
                    )}
                  </Field>
                </div>
              </div>

              {/* =========================================================== */}
              {/* IMAGE                                                       */}
              {/* =========================================================== */}

              <NpcImageField
                image={
                  form.image
                }
                onSelect={
                  handleImageSelect
                }
                onRemove={
                  removeImage
                }
              />
            </div>
          </div>

          {/* =============================================================== */}
          {/* 02 LOCATION                                                     */}
          {/* =============================================================== */}

          <div className="border-t border-border p-6">
            <SectionTitle
              number="02"
              title="Location"
              description="Hubungkan NPC dengan map jika NPC memiliki lokasi tertentu."
              optional
            />

            <div className="mt-6 grid grid-cols-2 gap-6">
              <Field>
                <FieldLabel>
                  Map
                </FieldLabel>

                <SearchableSelect
                  value={
                    form.mapId
                  }
                  options={
                    mapOptions
                  }
                  placeholder="No map selected"
                  searchPlaceholder="Search map or world..."
                  emptyText="No maps found."
                  icon={
                    MapPinned
                  }
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "mapId",
                      value,
                    )
                  }
                />

                <FieldHint>
                  Opsional. NPC tetap dapat berdiri sendiri tanpa map.
                </FieldHint>
              </Field>

              <Field>
                <FieldLabel>
                  World
                </FieldLabel>

                <DisabledValueField
                  value={
                    selectedWorld
                      ?.name ||
                    "No world"
                  }
                />

                <FieldHint>
                  Otomatis mengikuti Map yang dipilih.
                </FieldHint>
              </Field>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 03 TYPE CONTENT                                                 */}
          {/* =============================================================== */}

          <NpcTypeContent
            type={
              form.type
            }
            questOptions={
              questOptions
            }
            selectedQuests={
              selectedQuests
            }
            onAddQuest={
              addQuest
            }
            onRemoveQuest={
              removeQuest
            }
            itemOptions={
              itemOptions
            }
            merchantItems={
              merchantItems
            }
            onAddMerchantItem={
              addMerchantItem
            }
            onRemoveMerchantItem={
              removeMerchantItem
            }
            onMerchantPriceChange={
              updateMerchantPrice
            }
          />

          {/* =============================================================== */}
          {/* NOTES                                                           */}
          {/* =============================================================== */}

          <div className="border-t border-border p-6">
            <SectionTitle
              number="04"
              title="NPC Notes"
              description="Informasi tambahan mengenai NPC."
              optional
            />

            <div className="mt-6 grid grid-cols-[220px_minmax(0,1fr)] gap-8">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notes
                </p>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Informasi cerita, kondisi kemunculan,
                  fungsi tambahan, atau catatan lainnya.
                </p>
              </div>

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
                      event.target.value,
                    )
                  }
                  maxLength={
                    1000
                  }
                  rows={6}
                  placeholder="Tambahkan catatan tentang NPC..."
                  className="min-h-[150px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
                />

                <div className="mt-2 flex items-center justify-between gap-5">
                  <FieldHint>
                    Opsional dan dapat dikosongkan.
                  </FieldHint>

                  <span className="text-xs text-muted-foreground">
                    {
                      form.notes.length
                    }
                    /1000
                  </span>
                </div>
              </Field>
            </div>
          </div>

          {/* =============================================================== */}
          {/* ACTION BAR                                                      */}
          {/* =============================================================== */}

          <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Current Status
              </p>

              <div className="mt-1.5 flex items-center gap-2.5">
                <CurrentStatusBadge
                  status={
                    npcRecord.status
                  }
                />

                <span className="text-xs text-muted-foreground">
                  Pilih cara menyimpan perubahan.
                </span>
              </div>
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
                    `/data/worlds/npcs/${npcRecord.id}`,
                  )
                }
                className="h-10 cursor-pointer px-4 text-sm text-muted-foreground"
              >
                Cancel Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={
                  isSaving
                }
                onClick={() =>
                  saveChanges(
                    "DRAFT",
                  )
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                <Save className="size-4" />

                {savingAction ===
                "DRAFT"
                  ? "Saving..."
                  : "Save as Draft"}
              </Button>

              <Button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  saveChanges(
                    "PUBLISHED",
                  )
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                <CheckCircle2 className="size-4" />

                {savingAction ===
                "PUBLISHED"
                  ? "Publishing..."
                  : npcRecord.status ===
                      "PUBLISHED"
                    ? "Publish Changes"
                    : "Publish NPC"}
              </Button>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>

      {/* =================================================================== */}
      {/* CROP                                                               */}
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
/* TYPE CONTENT                                                               */
/* -------------------------------------------------------------------------- */

function NpcTypeContent({
  type,

  questOptions,
  selectedQuests,
  onAddQuest,
  onRemoveQuest,

  itemOptions,
  merchantItems,
  onAddMerchantItem,
  onRemoveMerchantItem,
  onMerchantPriceChange,
}) {
  if (
    type === "QUEST"
  ) {
    return (
      <div className="border-t border-border p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_420px] items-start gap-8">
          <SectionTitle
            number="03"
            title="NPC Quests"
            description="Kelola side quest yang diberikan oleh NPC ini."
            optional
          />

          <Field>
            <FieldLabel>
              Add Quest
            </FieldLabel>

            <SearchableSelect
              value=""
              options={
                questOptions
              }
              placeholder="Search and add quest"
              searchPlaceholder="Search quest..."
              emptyText="No available quests."
              icon={
                Sparkles
              }
              onChange={
                onAddQuest
              }
            />
          </Field>
        </div>

        {selectedQuests.length >
        0 ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            {selectedQuests.map(
              (quest) => (
                <div
                  key={
                    quest.id
                  }
                  className="flex items-center justify-between gap-5 border-b border-border px-4 py-3.5 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Sparkles className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {
                          quest.name
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Lv.{" "}
                        {
                          quest.level
                        }
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onRemoveQuest(
                        quest.id,
                      )
                    }
                    className="size-8 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            )}
          </div>
        ) : (
          <ContentEmpty
            icon={
              Sparkles
            }
            title="No quests"
            description="NPC ini belum memiliki quest."
          />
        )}
      </div>
    )
  }

  if (
    type === "MERCHANT"
  ) {
    return (
      <div className="border-t border-border p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_420px] items-start gap-8">
          <SectionTitle
            number="03"
            title="Merchant Inventory"
            description="Kelola item yang dijual oleh NPC ini."
            optional
          />

          <Field>
            <FieldLabel>
              Add Item
            </FieldLabel>

            <SearchableSelect
              value=""
              options={
                itemOptions
              }
              placeholder="Search and add item"
              searchPlaceholder="Search item..."
              emptyText="No available items."
              icon={
                ShoppingBag
              }
              onChange={
                onAddMerchantItem
              }
            />
          </Field>
        </div>

        {merchantItems.length >
        0 ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[minmax(0,1fr)_190px_48px] items-center border-b border-border bg-muted/20 px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                Item
              </span>

              <span className="text-xs font-medium text-muted-foreground">
                Price
              </span>

              <span />
            </div>

            {merchantItems.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="grid grid-cols-[minmax(0,1fr)_190px_48px] items-center border-b border-border px-4 py-3.5 last:border-b-0"
                >
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
                        {
                          item.category
                        }
                      </p>
                    </div>
                  </div>

                  <div className="relative pr-4">
                    <Coins className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        item.price
                      }
                      onChange={(
                        event,
                      ) =>
                        onMerchantPriceChange(
                          item.id,
                          event.target.value,
                        )
                      }
                      placeholder="0"
                      className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onRemoveMerchantItem(
                        item.id,
                      )
                    }
                    className="size-8 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            )}
          </div>
        ) : (
          <ContentEmpty
            icon={
              ShoppingBag
            }
            title="No items"
            description="Belum ada item yang dijual oleh merchant ini."
          />
        )}
      </div>
    )
  }

  if (
    type === "SYNTHESIST"
  ) {
    return (
      <CapabilitySection
        number="03"
        title="Synthesist Services"
        description="Layanan tersedia otomatis berdasarkan NPC Type."
        icon={
          Sparkles
        }
        capabilities={
          synthesistCapabilities
        }
      />
    )
  }

  if (
    type === "BLACKSMITH"
  ) {
    return (
      <CapabilitySection
        number="03"
        title="Blacksmith Services"
        description="Layanan tersedia otomatis berdasarkan NPC Type."
        icon={
          Hammer
        }
        capabilities={
          blacksmithCapabilities
        }
      />
    )
  }

  return (
    <div className="border-t border-border p-6">
      <SectionTitle
        number="03"
        title="NPC Content"
        description="NPC type ini tidak memerlukan data khusus tambahan."
        optional
      />

      <div className="mt-6 flex min-h-[105px] items-center rounded-xl border border-dashed border-border bg-muted/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <UserRound className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              No additional content required
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Informasi utama dan Notes sudah cukup untuk tipe NPC ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CAPABILITY SECTION                                                         */
/* -------------------------------------------------------------------------- */

function CapabilitySection({
  number,
  title,
  description,
  icon: Icon,
  capabilities,
}) {
  return (
    <div className="border-t border-border p-6">
      <SectionTitle
        number={
          number
        }
        title={
          title
        }
        description={
          description
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        {capabilities.map(
          (capability) => (
            <div
              key={
                capability.id
              }
              className="flex items-start gap-3 rounded-xl border border-border bg-muted/10 px-4 py-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary">
                <Icon className="size-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {
                      capability.name
                    }
                  </p>

                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Included
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {
                    capability.description
                  }
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3.5">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-5 text-muted-foreground">
          Service ini ditentukan otomatis oleh NPC Type dan tidak perlu
          diatur satu per satu pada NPC.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CONTENT EMPTY                                                              */
/* -------------------------------------------------------------------------- */

function ContentEmpty({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mt-6 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 px-5 text-center">
      <div>
        <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <p className="mt-3 text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NPC IMAGE FIELD                                                            */
/* -------------------------------------------------------------------------- */

function NpcImageField({
  image,
  onSelect,
  onRemove,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>
          NPC Image
        </FieldLabel>

        {image?.ratio && (
          <span className="mb-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {
              image.ratio
            }
          </span>
        )}
      </div>

      {!image ? (
        <label className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/10 px-6 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.025]">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors group-hover:text-primary">
            <ImagePlus className="size-5" />
          </div>

          <p className="mt-4 text-sm font-medium text-foreground">
            Add NPC image
          </p>

          <p className="mt-1.5 max-w-[245px] text-xs leading-5 text-muted-foreground">
            JPG, PNG atau WEBP. Crop tersedia setelah memilih gambar.
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            <Upload className="size-3.5" />

            Choose image
          </span>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={
              onSelect
            }
            className="hidden"
          />
        </label>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <div
            className="relative overflow-hidden bg-muted/20"
            style={{
              aspectRatio:
                getRatioAspect(
                  image.ratio ||
                    "4:3",
                ),
            }}
          >
            {image.previewUrl ||
            typeof image ===
              "string" ? (
              <img
                src={
                  image.previewUrl ||
                  image
                }
                alt="NPC"
                className="h-full w-full object-cover"
              />
            ) : null}

            <div className="absolute right-3 top-3 flex gap-2">
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-black/60 px-3 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/75">
                <Crop className="size-3.5" />

                Change

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    onSelect
                  }
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={
                  onRemove
                }
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/75"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {image.file && (
            <div className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ImageIcon className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {
                      image.file
                        .name
                    }
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatFileSize(
                      image.file
                        .size,
                    )}
                  </p>
                </div>
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {
                  image.ratio
                }
              </span>
            </div>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        4:3 direkomendasikan.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* CURRENT STATUS                                                             */
/* -------------------------------------------------------------------------- */

function CurrentStatusBadge({
  status,
}) {
  const published =
    status ===
    "PUBLISHED"

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
  ] = useState("4:3")

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
    }, [ratioId])

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
    setRatioId(ratio)

    setCrop({
      x: 0,
      y: 0,
    })

    setZoom(1)
  }

  function resetCrop() {
    setCrop({
      x: 0,
      y: 0,
    })

    setZoom(1)
  }

  async function applyCrop() {
    if (!croppedAreaPixels) {
      return
    }

    setIsApplying(true)

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

      setIsApplying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Edit image
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Adjust how the image will appear.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={
              onCancel
            }
            className="size-9 cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* BODY */}

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
            <Minus className="size-4 text-muted-foreground" />

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
                    event.target.value,
                  ),
                )
              }
              className="min-w-0 flex-1 cursor-pointer accent-primary"
            />

            <Plus className="size-4 text-muted-foreground" />

            <span className="w-12 text-right text-xs font-medium text-muted-foreground">
              {Math.round(
                zoom * 100,
              )}
              %
            </span>
          </div>

          {/* RATIOS */}

          <div className="mt-5 flex justify-center">
            <div className="inline-flex rounded-xl bg-muted/70 p-1">
              {imageRatios.map(
                (ratio) => (
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

                      ratioId ===
                      ratio.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {
                      ratio.label
                    }
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={
                resetCrop
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />

              Reset
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-foreground">
              {
                selectedRatio.width
              }
              {" × "}
              {
                selectedRatio.height
              }{" "}
              px
            </p>

            <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted-foreground">
              {
                originalFile.name
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={
                isApplying
              }
              onClick={
                onCancel
              }
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
              className="gap-2"
            >
              <CheckCircle2 className="size-4" />

              {isApplying
                ? "Applying..."
                : "Apply Image"}
            </Button>
          </div>
        </div>
      </div>
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
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  icon: Icon,
  error = false,
}) {
  const containerRef =
    useRef(null)

  const inputRef =
    useRef(null)

  const [open, setOpen] =
    useState(false)

  const [search, setSearch] =
    useState("")

  const selectedOption =
    options.find(
      (option) =>
        option.value ===
        value,
    ) || null

  const filteredOptions =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return options
      }

      return options.filter(
        (option) => {
          const label =
            option.label
              ?.toLowerCase() ||
            ""

          const meta =
            option.meta
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
    }, [
      options,
      search,
    ])

  useEffect(() => {
    function handleOutside(
      event,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
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
    if (!open) return

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)

    return () =>
      clearTimeout(timeout)
  }, [open])

  function handleSelect(
    option,
  ) {
    onChange(
      option.value,
    )

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

  return (
    <div
      ref={
        containerRef
      }
      className="relative"
    >
      <div className="relative">
        <button
          type="button"
          disabled={
            disabled
          }
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
          className={[
            "flex h-11 w-full items-center gap-3 rounded-lg border px-3.5 text-left outline-none transition-all",

            disabled
              ? "cursor-not-allowed bg-muted/80"
              : "cursor-pointer bg-background hover:bg-muted/20",

            error
              ? "border-destructive/50"
              : "border-border",

            open
              ? "border-primary/40 ring-3 ring-primary/10"
              : "",
          ].join(" ")}
        >
          {Icon && (
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          )}

          <span
            className={[
              "min-w-0 flex-1 truncate text-sm",

              selectedOption
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            ].join(" ")}
          >
            {selectedOption
              ? selectedOption.label
              : placeholder}
          </span>

          <ChevronDown
            className={[
              "size-4 text-muted-foreground transition-transform",

              open
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {selectedOption &&
          !disabled && (
            <button
              type="button"
              onClick={
                clearSelection
              }
              className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
          )}
      </div>

      {open &&
        !disabled && (
          <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
            <div className="border-b border-border p-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  ref={
                    inputRef
                  }
                  value={
                    search
                  }
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder={
                    searchPlaceholder
                  }
                  className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
                />
              </div>
            </div>

            <div className="max-h-[260px] overflow-y-auto p-1.5">
              {filteredOptions.length >
              0 ? (
                filteredOptions.map(
                  (option) => (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        handleSelect(
                          option,
                        )
                      }
                      className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left hover:bg-muted/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {
                            option.label
                          }
                        </p>

                        {option.meta && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {
                              option.meta
                            }
                          </p>
                        )}
                      </div>
                    </button>
                  ),
                )
              ) : (
                <div className="flex min-h-[90px] items-center justify-center">
                  <p className="text-xs text-muted-foreground">
                    {emptyText}
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
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {optional && (
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Optional
        </span>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELDS                                                                     */
/* -------------------------------------------------------------------------- */

function Field({
  children,
}) {
  return <div>{children}</div>
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

function FieldError({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <CircleAlert className="size-3.5" />

      {children}
    </p>
  )
}

function DisabledValueField({
  value,
}) {
  return (
    <div className="flex h-11 cursor-not-allowed items-center gap-3 rounded-lg border border-border bg-muted/80 px-3.5">
      <LockKeyhole className="size-4 text-muted-foreground" />

      <span className="truncate text-sm font-medium text-muted-foreground">
        {value}
      </span>
    </div>
  )
}

function inputClass(
  error,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors focus:ring-3",

    error
      ? "border-destructive/50 focus:ring-destructive/10"
      : "border-border focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
}

/* -------------------------------------------------------------------------- */
/* IMAGE                                                                      */
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
      "Canvas not supported",
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

  const base =
    originalFile.name.replace(
      /\.[^/.]+$/,
      "",
    )

  const file =
    new File(
      [blob],
      `${base}-cropped.jpg`,
      {
        type:
          "image/jpeg",
      },
    )

  return {
    file,

    previewUrl:
      URL.createObjectURL(
        blob,
      ),
  }
}

function loadImage(src) {
  return new Promise(
    (
      resolve,
      reject,
    ) => {
      const image =
        new Image()

      image.onload =
        () =>
          resolve(image)

      image.onerror =
        reject

      image.src =
        src
    },
  )
}

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
                "Image creation failed",
              ),
            )

            return
          }

          resolve(blob)
        },
        type,
        quality,
      )
    },
  )
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function createSlug(value) {
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

function formatMapType(
  type,
) {
  const labels = {
    CITY: "City",
    TOWN: "Town",
    VILLAGE: "Village",
    FIELD: "Field",
    FOREST: "Forest",
    RUINS: "Ruins",
    DUNGEON: "Dungeon",
    CAVE: "Cave",
    MOUNTAIN: "Mountain",
    DESERT: "Desert",
    BUILDING: "Building",
    OTHER: "Other",
  }

  return (
    labels[type] ||
    "Other"
  )
}

function getRatioAspect(
  id,
) {
  return (
    imageRatios.find(
      (ratio) =>
        ratio.id === id,
    )?.aspect ||
    4 / 3
  )
}

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
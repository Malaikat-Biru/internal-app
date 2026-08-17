import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"
import Cropper from "react-easy-crop"

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Crop,
  ImageIcon,
  ImagePlus,
  LockKeyhole,
  MapPinned,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Search,
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
    id: "MAP-004",
    name: "Underground Channel",
    type: "DUNGEON",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-005",
    name: "Land Under Cultivation",
    type: "FIELD",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },
  {
    id: "MAP-006",
    name: "Reug Salt Plains",
    type: "FIELD",
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
    id: "MAP-008",
    name: "Dark Manor",
    type: "RUINS",
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
    id: "MAP-011",
    name: "Ultimea Sewer",
    type: "DUNGEON",
    world: {
      id: "WORLD-001",
      name: "Toram World",
    },
  },

  {
    id: "MAP-013",
    name: "Morga Wasteland",
    type: "FIELD",
    world: {
      id: "WORLD-002",
      name: "Iruna World",
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
  {
    id: "MAP-017",
    name: "Freight Corridor",
    type: "FIELD",
    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },
  },
  {
    id: "MAP-018",
    name: "Weredragon's Throat",
    type: "CAVE",
    world: {
      id: "WORLD-002",
      name: "Iruna World",
    },
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
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CreateNpcPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    type: "",
    mapId: "",
    image: null,
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const [savingAction, setSavingAction] =
    useState(null)

  const [cropSource, setCropSource] =
    useState(null)

  const [cropModalOpen, setCropModalOpen] =
    useState(false)

  const isSaving =
    savingAction !== null

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug = useMemo(() => {
    return createSlug(form.name)
  }, [form.name])

  const selectedMap = useMemo(() => {
    return (
      maps.find(
        (map) =>
          map.id === form.mapId,
      ) || null
    )
  }, [form.mapId])

  const selectedWorld =
    selectedMap?.world || null

  const mapOptions = useMemo(() => {
    return maps.map((map) => ({
      value: map.id,
      label: map.name,
      meta: `${map.world.name} · ${formatMapType(
        map.type,
      )}`,
    }))
  }, [])

  /* ---------------------------------------------------------------------- */
  /* FIELD                                                                  */
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
  /* IMAGE                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleImageSelect(
    event,
  ) {
    const file =
      event.target.files?.[0]

    event.target.value = ""

    if (!file) return

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
        if (current?.url) {
          URL.revokeObjectURL(
            current.url,
          )
        }

        return {
          file,
          url: objectUrl,
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
          current.image
            .previewUrl,
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
          current.image
            .previewUrl,
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
  /* PAYLOAD                                                                */
  /* ---------------------------------------------------------------------- */

  function buildPayload(
    status,
  ) {
    return {
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
        null,

      imageRatio:
        form.image?.ratio ||
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

  async function saveNpc(
    status,
  ) {
    if (!validateForm()) {
      return
    }

    setSavingAction(status)

    const payload =
      buildPayload(
        status,
      )

    console.log(
      "Create NPC Payload:",
      payload,
    )

    /*
      TODO:
      await createNpc(payload)
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
      "/data/worlds/npcs",
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
              "/data/worlds/npcs",
            )
          }
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />

          Back to NPCs
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

            <span className="text-primary">
              Create
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Create NPC
          </h1>

          <p className="mt-2 max-w-[720px] text-sm leading-6 text-muted-foreground">
            Tambahkan NPC baru ke database.
            Lokasi, gambar, dan catatan dapat
            dilengkapi jika tersedia.
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
              {/* FIELDS                                                      */}
              {/* =========================================================== */}

              <div className="space-y-6">
                {/* NAME */}
                <Field>
                  <FieldLabel
                    required
                  >
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
                        event.target
                          .value,
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
                    <FieldLabel
                      required
                    >
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
                      onChange={(
                        value,
                      ) =>
                        updateField(
                          "type",
                          value,
                        )
                      }
                    />

                    {errors.type ? (
                      <FieldError>
                        {errors.type}
                      </FieldError>
                    ) : (
                      <FieldHint>
                        Kategori atau fungsi utama NPC.
                      </FieldHint>
                    )}
                  </Field>
                </div>
              </div>

              {/* =========================================================== */}
              {/* IMAGE                                                       */}
              {/* =========================================================== */}

              <div>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel>
                    NPC Image
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
                      Add NPC image
                    </p>

                    <p className="mt-1.5 max-w-[245px] text-xs leading-5 text-muted-foreground">
                      JPG, PNG atau WEBP.
                      Kamu dapat mengatur crop setelah memilih gambar.
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
                            .previewUrl
                        }
                        alt="NPC"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute right-3 top-3 flex gap-2">
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

                    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <ImageIcon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground">
                            {
                              form.image
                                .file
                                .name
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatFileSize(
                              form.image
                                .file
                                .size,
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
                  4:3 direkomendasikan untuk konsistensi tampilan.
                </p>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* 02 LOCATION                                                     */}
          {/* =============================================================== */}

          <div className="border-t border-border p-6">
            <SectionTitle
              number="02"
              title="Location"
              description="Hubungkan NPC dengan map jika memiliki lokasi tertentu."
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
                  Opsional. NPC tetap dapat dibuat tanpa lokasi.
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

            {selectedMap && (
              <div className="mt-5 flex items-center justify-between gap-5 rounded-xl border border-border bg-muted/15 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <MapPinned className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {
                        selectedMap.name
                      }
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {
                        selectedMap
                          .world.name
                      }
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {formatMapType(
                    selectedMap.type,
                  )}
                </span>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* 03 NOTES                                                        */}
          {/* =============================================================== */}

          <div className="border-t border-border p-6">
            <SectionTitle
              number="03"
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
                  Gunakan untuk fungsi, kondisi kemunculan,
                  informasi cerita, atau catatan lainnya.
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
                      event.target
                        .value,
                    )
                  }
                  rows={6}
                  maxLength={
                    1000
                  }
                  placeholder="Tambahkan catatan tentang NPC..."
                  className="min-h-[150px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
                />

                <div className="mt-2 flex items-start justify-between gap-4">
                  <FieldHint>
                    Opsional dan dapat dilengkapi nanti.
                  </FieldHint>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {
                      form.notes
                        .length
                    }
                    /1000
                  </span>
                </div>
              </Field>
            </div>
          </div>

          {/* =============================================================== */}
          {/* FOOTER                                                          */}
          {/* =============================================================== */}

          <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Save NPC
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Pilih apakah NPC akan disimpan sebagai Draft atau Published.
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
                    "/data/worlds/npcs",
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
                  saveNpc(
                    "DRAFT",
                  )
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                <Save className="size-4" />

                {savingAction ===
                "DRAFT"
                  ? "Saving..."
                  : "Save Draft"}
              </Button>

              <Button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  saveNpc(
                    "PUBLISHED",
                  )
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                <CheckCircle2 className="size-4" />

                {savingAction ===
                "PUBLISHED"
                  ? "Publishing..."
                  : "Publish NPC"}
              </Button>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>

      {/* =================================================================== */}
      {/* CROP EDITOR                                                         */}
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

  /* ---------------------------------------------------------------------- */
  /* RATIO                                                                  */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* ZOOM                                                                   */
  /* ---------------------------------------------------------------------- */

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

  /* ---------------------------------------------------------------------- */
  /* APPLY                                                                  */
  /* ---------------------------------------------------------------------- */

  async function applyCrop() {
    if (
      !croppedAreaPixels
    ) {
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

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* ================================================================= */}
        {/* HEADER                                                            */}
        {/* ================================================================= */}

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

        {/* ================================================================= */}
        {/* EDITOR                                                            */}
        {/* ================================================================= */}

        <div className="overflow-y-auto px-6 py-5">
          {/* =============================================================== */}
          {/* IMAGE                                                           */}
          {/* =============================================================== */}

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

          {/* =============================================================== */}
          {/* ZOOM                                                           */}
          {/* =============================================================== */}

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

          {/* =============================================================== */}
          {/* RATIO                                                          */}
          {/* =============================================================== */}

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
                      ].join(" ")}
                    >
                      {ratio.label}
                    </button>
                  )
                },
              )}
            </div>
          </div>

          {/* =============================================================== */}
          {/* RESET                                                          */}
          {/* =============================================================== */}

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

        {/* ================================================================= */}
        {/* FOOTER                                                            */}
        {/* ================================================================= */}

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

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
    }
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
    onChange(option.value)
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
      ref={containerRef}
      className="relative"
    >
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
          className={[
            "flex h-11 w-full items-center gap-3 rounded-lg border px-3.5 text-left outline-none transition-all",

            disabled
              ? "cursor-not-allowed border-border/90 bg-muted/80"
              : "cursor-pointer bg-background hover:bg-muted/20",

            error
              ? "border-destructive/50"
              : "border-border",

            open &&
            !disabled
              ? "border-primary/40 ring-3 ring-primary/10"
              : "",
          ].join(" ")}
        >
          {disabled ? (
            <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />
          ) : Icon ? (
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          ) : null}

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
              "size-4 shrink-0 text-muted-foreground transition-transform",

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
              className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                  placeholder={
                    searchPlaceholder
                  }
                  className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40"
                />
              </div>
            </div>

            <div className="max-h-[260px] overflow-y-auto p-1.5">
              {filteredOptions.length >
              0 ? (
                filteredOptions.map(
                  (option) => {
                    const selected =
                      option.value ===
                      value

                    return (
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
                        className={[
                          "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",

                          selected
                            ? "bg-primary/[0.08] text-primary"
                            : "text-foreground hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
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

                        {selected && (
                          <CheckCircle2 className="size-4 shrink-0" />
                        )}
                      </button>
                    )
                  },
                )
              ) : (
                <div className="flex min-h-[90px] items-center justify-center px-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    {emptyText}
                  </p>
                </div>
              )}
            </div>

            {selectedOption && (
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={
                    clearSelection
                  }
                  className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Clear selection
                </button>
              </div>
            )}
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
      <CircleAlert className="size-3.5 shrink-0" />

      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* DISABLED FIELD                                                             */
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

function inputClass(error) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-3",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ")
}

/* -------------------------------------------------------------------------- */
/* CROP IMAGE                                                                 */
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
      [blob],
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

function formatMapType(type) {
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
  ratioId,
) {
  return (
    imageRatios.find(
      (ratio) =>
        ratio.id === ratioId,
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
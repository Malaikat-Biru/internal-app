import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Eye,
  ImagePlus,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Map,
  MapPinned,
  Mountain,
  Save,
  Search,
  Ship,
  TentTree,
  Trash2,
  Trees,
  Upload,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useCreateMap,
  useMaps,
} from "@/features/data/maps/api/maps.query";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const worlds = [
  {
    value: "TORAM",
    label: "Toram",
  },
  {
    value: "IRUNA",
    label: "Iruna",
  },
];

const mapTypes = [
  {
    value: "FIELD",
    label: "Field",
  },
  {
    value: "TOWN",
    label: "Town",
  },
  {
    value: "RUINS",
    label: "Ruins",
  },
  {
    value: "TOWN_RUINS",
    label: "Town Ruins",
  },
  {
    value: "MOUNTAIN",
    label: "Mountain",
  },
  {
    value: "SHIP",
    label: "Ship",
  },
  {
    value: "FOREST",
    label: "Forest",
  },
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function CreateMapPage() {
  const navigate =
    useNavigate();

  const createMap =
    useCreateMap();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    type: "",
    world: "",
    parentMapId: "",
    image: null,
    notes: "",
    isSavePoint: false,
    isWorldMapVisible: false,
  });

  const [
    connections,
    setConnections,
  ] = useState([]);

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    savingAction,
    setSavingAction,
  ] = useState(null);

  const [
    showPublishPreview,
    setShowPublishPreview,
  ] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* AVAILABLE MAPS                                                         */
  /* ---------------------------------------------------------------------- */

  const {
    data: mapsResponse,
    isFetching:
      isFetchingMaps,
  } = useMaps({
    page: 1,
    limit: 100,
    world: form.world,
    search: "",
  });

  const availableMaps =
    mapsResponse?.data ?? [];

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug =
    useMemo(
      () =>
        createSlug(
          form.name,
        ),
      [form.name],
    );

  const selectedWorld =
    useMemo(() => {
      return (
        worlds.find(
          (world) =>
            world.value ===
            form.world,
        ) ?? null
      );
    }, [form.world]);

  const selectedType =
    useMemo(() => {
      return (
        mapTypes.find(
          (type) =>
            type.value ===
            form.type,
        ) ?? null
      );
    }, [form.type]);

  const selectedParent =
    useMemo(() => {
      return (
        availableMaps.find(
          (map) =>
            map.id ===
            form.parentMapId,
        ) ?? null
      );
    }, [
      availableMaps,
      form.parentMapId,
    ]);

  /* ---------------------------------------------------------------------- */
  /* OPTIONS                                                                */
  /* ---------------------------------------------------------------------- */

  const parentOptions =
    useMemo(() => {
      if (!form.world) {
        return [];
      }

      return availableMaps.map(
        (map) => ({
          value: map.id,

          label:
            formatMapName(
              map.name,
            ),

          meta:
            formatWorld(
              map.world,
            ),
        }),
      );
    }, [
      availableMaps,
      form.world,
    ]);

  /*
   * IMPORTANT
   * ------------------------------------------------------------------------
   *
   * Parent Area dan Connection adalah dua relasi berbeda.
   *
   * parentMapId:
   * - menentukan hierarchy / induk map.
   *
   * connectionIds:
   * - menentukan map mana yang bisa diakses langsung.
   *
   * Karena itu parent map TETAP BOLEH dipilih sebagai connection.
   *
   * Contoh:
   *
   * Gunung Nisel
   * ├── Lereng Gunung Nisel
   * └── Dekat Puncak Gunung Nisel
   *
   * Lereng:
   * parent = Gunung Nisel
   * connections = [Gunung Nisel, Dekat Puncak]
   *
   * Dekat Puncak:
   * parent = Gunung Nisel
   * connections = [Lereng]
   *
   * Jadi jangan filter parentMapId dari connectionOptions.
   */

  const connectionOptions =
    useMemo(() => {
      if (!form.world) {
        return [];
      }

      return availableMaps
        .filter(
          (map) =>
            !connections.some(
              (connection) =>
                connection.id ===
                map.id,
            ),
        )
        .map((map) => ({
          value: map.id,

          label:
            formatMapName(
              map.name,
            ),

          meta:
            map.id ===
            form.parentMapId
              ? `${formatWorld(
                  map.world,
                )} · Parent Area`
              : formatWorld(
                  map.world,
                ),
        }));
    }, [
      availableMaps,
      connections,
      form.parentMapId,
      form.world,
    ]);

  /* ---------------------------------------------------------------------- */
  /* UPDATE FIELD                                                           */
  /* ---------------------------------------------------------------------- */

  function updateField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setErrors(
      (current) => ({
        ...current,
        [field]:
          undefined,
      }),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* WORLD                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleWorldChange(
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        world: value,

        parentMapId: "",
      }),
    );

    /*
     * Parent dan connection hanya boleh
     * berasal dari world yang sama.
     *
     * Kalau world diganti, relasi lama
     * harus dibuang.
     */
    setConnections([]);

    setErrors(
      (current) => ({
        ...current,

        world:
          undefined,
      }),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* IMAGE                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleImageChange(
    event,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      toast.error(
        "Gambar tidak valid",
        {
          description:
            "Gunakan file PNG, JPG, JPEG, atau WEBP.",
        },
      );

      return;
    }

    setForm(
      (current) => ({
        ...current,
        image: file,
      }),
    );

    setErrors(
      (current) => ({
        ...current,
        image:
          undefined,
      }),
    );
  }

  function removeImage() {
    setForm(
      (current) => ({
        ...current,
        image: null,
      }),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* CONNECTIONS                                                            */
  /* ---------------------------------------------------------------------- */

  function addConnection(
    mapId,
  ) {
    const map =
      availableMaps.find(
        (item) =>
          item.id ===
          mapId,
      );

    if (!map) {
      return;
    }

    if (
      connections.some(
        (connection) =>
          connection.id ===
          map.id,
      )
    ) {
      return;
    }

    setConnections(
      (current) => [
        ...current,
        map,
      ],
    );

    setErrors(
      (current) => ({
        ...current,

        connections:
          undefined,
      }),
    );
  }

  function removeConnection(
    mapId,
  ) {
    setConnections(
      (current) =>
        current.filter(
          (connection) =>
            connection.id !==
            mapId,
        ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATION                                                             */
  /* ---------------------------------------------------------------------- */

  function validateForm() {
    const nextErrors =
      {};

    const normalizedName =
      form.name.trim();

    if (!normalizedName) {
      nextErrors.name =
        "Map name wajib diisi.";
    } else if (
      normalizedName.length >
      150
    ) {
      nextErrors.name =
        "Map name maksimal 150 karakter.";
    }

    if (!slug) {
      nextErrors.name =
        nextErrors.name ||
        "Map name tidak dapat menghasilkan slug yang valid.";
    } else if (
      slug.length > 180
    ) {
      nextErrors.name =
        "Slug maksimal 180 karakter.";
    }

    if (!form.type) {
      nextErrors.type =
        "Map type wajib dipilih.";
    }

    if (!form.world) {
      nextErrors.world =
        "World wajib dipilih.";
    }

    setErrors(
      nextErrors,
    );

    if (
      Object.keys(
        nextErrors,
      ).length > 0
    ) {
      toast.error(
        "Form belum lengkap",
        {
          description:
            "Periksa kembali field yang ditandai.",
        },
      );

      return false;
    }

    return true;
  }

  /* ---------------------------------------------------------------------- */
  /* BACKEND ERROR                                                          */
  /* ---------------------------------------------------------------------- */

  function handleBackendError(
    error,
  ) {
    const backendErrors =
      Array.isArray(
        error?.errors,
      )
        ? error.errors
        : [];

    if (
      backendErrors.length >
      0
    ) {
      const nextErrors =
        {};

      backendErrors.forEach(
        (item) => {
          if (
            !item?.field ||
            !item?.message
          ) {
            return;
          }

          const fieldMap = {
            parentMapId:
              "parentMapId",

            name:
              "name",

            slug:
              "name",

            type:
              "type",

            world:
              "world",

            notes:
              "notes",

            isSavePoint:
              "isSavePoint",

            isWorldMapVisible:
              "isWorldMapVisible",

            connectionIds:
              "connections",

            image:
              "image",
          };

          const frontendField =
            fieldMap[
              item.field
            ];

          if (
            frontendField
          ) {
            nextErrors[
              frontendField
            ] =
              item.message;
          }
        },
      );

      setErrors(
        (current) => ({
          ...current,
          ...nextErrors,
        }),
      );
    }

    toast.error(
      "Gagal membuat map",
      {
        description:
          error?.message ||
          "Terjadi kesalahan ketika menyimpan map.",
      },
    );
  }

  /* ---------------------------------------------------------------------- */
  /* BUILD MULTIPART                                                        */
  /* ---------------------------------------------------------------------- */

  function buildFormData(
    status,
  ) {
    const data =
      new FormData();

    data.append(
      "name",
      form.name.trim(),
    );

    data.append(
      "slug",
      slug,
    );

    data.append(
      "type",
      form.type,
    );

    data.append(
      "world",
      form.world,
    );

    data.append(
      "status",
      status,
    );

    data.append(
      "isSavePoint",
      String(
        form.isSavePoint,
      ),
    );

    data.append(
      "isWorldMapVisible",
      String(
        form.isWorldMapVisible,
      ),
    );

    if (
      form.parentMapId
    ) {
      data.append(
        "parentMapId",
        form.parentMapId,
      );
    }

    const normalizedNotes =
      form.notes.trim();

    if (
      normalizedNotes
    ) {
      data.append(
        "notes",
        normalizedNotes,
      );
    }

    if (
      connections.length >
      0
    ) {
      data.append(
        "connectionIds",
        JSON.stringify(
          connections.map(
            (connection) =>
              connection.id,
          ),
        ),
      );
    }

    if (form.image) {
      data.append(
        "image",
        form.image,
      );
    }

    return data;
  }

  /* ---------------------------------------------------------------------- */
  /* CREATE                                                                 */
  /* ---------------------------------------------------------------------- */

  async function submitMap(
    status,
  ) {
    if (
      createMap.isPending
    ) {
      return false;
    }

    if (!validateForm()) {
      return false;
    }

    setSavingAction(
      status,
    );

    try {
      const multipart =
        buildFormData(
          status,
        );

      await createMap.mutateAsync(
        multipart,
      );

      toast.success(
        status ===
          "PUBLISHED"
          ? "Map berhasil dipublikasikan"
          : "Draft berhasil disimpan",
        {
          description:
            status ===
            "PUBLISHED"
              ? "Map sekarang tersedia sebagai Published."
              : "Map tersimpan dengan status Draft.",
        },
      );

      navigate(
        "/data/worlds/maps",
        {
          replace: true,
        },
      );

      return true;
    } catch (error) {
      handleBackendError(
        error,
      );

      return false;
    } finally {
      setSavingAction(
        null,
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /* DRAFT                                                                  */
  /* ---------------------------------------------------------------------- */

  async function saveDraft() {
    await submitMap(
      "DRAFT",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PREVIEW                                                                */
  /* ---------------------------------------------------------------------- */

  function openPublishPreview() {
    if (!validateForm()) {
      return;
    }

    setShowPublishPreview(
      true,
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PUBLISH                                                                */
  /* ---------------------------------------------------------------------- */

  async function publishMap() {
    const success =
      await submitMap(
        "PUBLISHED",
      );

    if (success) {
      setShowPublishPreview(
        false,
      );
    }
  }

  const isSaving =
    createMap.isPending;

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
          disabled={
            isSaving
          }
          onClick={() =>
            navigate(
              "/data/worlds/maps",
            )
          }
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />

          Back to Maps
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
              Maps
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Create
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Create Map
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Tambahkan map baru beserta klasifikasi, relasi,
            catatan, dan informasi pendukung lainnya.
          </p>
        </header>

        {/* ================================================================= */}
        {/* MAIN CARD                                                         */}
        {/* ================================================================= */}

        <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
          {/* =============================================================== */}
          {/* GENERAL                                                         */}
          {/* =============================================================== */}

          <div className="p-6">
            <SectionTitle
              number="01"
              title="General Information"
              description="Masukkan identitas, klasifikasi, world, gambar, dan catatan map."
            />

            <div className="mt-5 flex items-center justify-between gap-6 rounded-xl border border-border bg-muted/20 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                  <CircleAlert className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Basic information first
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    Map Name, Map Type, dan World wajib diisi.
                    Informasi lainnya dapat dilengkapi sekarang atau nanti.
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Optional fields allowed
              </span>
            </div>

            {/* ============================================================= */}
            {/* MAIN GRID                                                     */}
            {/* ============================================================= */}

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_380px] gap-8">
              {/* =========================================================== */}
              {/* LEFT                                                        */}
              {/* =========================================================== */}

              <div className="space-y-6">
                {/* NAME */}

                <Field>
                  <FieldLabel required>
                    Map Name
                  </FieldLabel>

                  <input
                    type="text"
                    value={
                      form.name
                    }
                    disabled={
                      isSaving
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
                    maxLength={150}
                    placeholder="Example: Sofya City"
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
                      Nama utama map yang akan ditampilkan kepada pengguna.
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
                        "generated-from-map-name"
                      }
                    />

                    <FieldHint>
                      Dibuat otomatis berdasarkan Map Name.
                    </FieldHint>
                  </Field>

                  <Field>
                    <FieldLabel required>
                      Map Type
                    </FieldLabel>

                    <SearchableSelect
                      value={
                        form.type
                      }
                      options={
                        mapTypes
                      }
                      disabled={
                        isSaving
                      }
                      placeholder="Select map type"
                      searchPlaceholder="Search map type..."
                      emptyText="No map type found."
                      icon={
                        selectedType
                          ? getMapTypeIcon(
                              selectedType.value,
                            )
                          : MapPinned
                      }
                      error={Boolean(
                        errors.type,
                      )}
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
                        {
                          errors.type
                        }
                      </FieldError>
                    ) : (
                      <FieldHint>
                        Tentukan klasifikasi map sesuai data Toram.
                      </FieldHint>
                    )}
                  </Field>
                </div>

                {/* WORLD */}

                <Field>
                  <FieldLabel required>
                    World
                  </FieldLabel>

                  <div className="relative">
                    <Map className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <select
                      value={
                        form.world
                      }
                      disabled={
                        isSaving
                      }
                      onChange={(
                        event,
                      ) =>
                        handleWorldChange(
                          event.target
                            .value,
                        )
                      }
                      className={[
                        selectClass(
                          errors.world,
                        ),
                        "pl-10",
                      ].join(" ")}
                    >
                      <option value="">
                        Select world
                      </option>

                      {worlds.map(
                        (world) => (
                          <option
                            key={
                              world.value
                            }
                            value={
                              world.value
                            }
                          >
                            {
                              world.label
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {errors.world ? (
                    <FieldError>
                      {
                        errors.world
                      }
                    </FieldError>
                  ) : (
                    <FieldHint>
                      World menentukan Parent Area dan map connection yang dapat dipilih.
                    </FieldHint>
                  )}
                </Field>

                {/* ========================================================= */}
                {/* BEHAVIOR                                                  */}
                {/* ========================================================= */}

                <div className="grid grid-cols-2 gap-4">
                  <BooleanField
                    id="save-point"
                    label="Save Point"
                    description="Tandai jika map ini merupakan save point."
                    checked={
                      form.isSavePoint
                    }
                    disabled={
                      isSaving
                    }
                    onCheckedChange={(
                      checked,
                    ) =>
                      updateField(
                        "isSavePoint",
                        Boolean(
                          checked,
                        ),
                      )
                    }
                  />

                  <BooleanField
                    id="world-visible"
                    label="Visible on World Map"
                    description="Tampilkan map ini pada world map."
                    checked={
                      form.isWorldMapVisible
                    }
                    disabled={
                      isSaving
                    }
                    onCheckedChange={(
                      checked,
                    ) =>
                      updateField(
                        "isWorldMapVisible",
                        Boolean(
                          checked,
                        ),
                      )
                    }
                  />
                </div>
              </div>

              {/* =========================================================== */}
              {/* IMAGE                                                       */}
              {/* =========================================================== */}

              <div>
                <FieldLabel>
                  Map Image
                </FieldLabel>

                {!form.image ? (
                  <label
                    className={[
                      "mt-2 flex h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/15 px-6 text-center transition-colors",

                      isSaving
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:border-primary/30 hover:bg-muted/30",
                    ].join(" ")}
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                      <ImagePlus className="size-5" />
                    </div>

                    <p className="mt-4 text-sm font-medium text-foreground">
                      Upload map image
                    </p>

                    <p className="mt-1.5 max-w-[260px] text-xs leading-5 text-muted-foreground">
                      PNG, JPG atau WEBP. Landscape image direkomendasikan.
                    </p>

                    <span className="mt-4 text-xs font-medium text-primary">
                      Choose image
                    </span>

                    <input
                      type="file"
                      disabled={
                        isSaving
                      }
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="mt-2 overflow-hidden rounded-xl border border-border">
                    <div className="relative h-[205px] bg-muted/30">
                      <MapImagePreview
                        image={
                          form.image
                        }
                      />

                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        disabled={
                          isSaving
                        }
                        onClick={
                          removeImage
                        }
                        className="absolute right-3 top-3 size-9 cursor-pointer rounded-lg"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 border-t border-border px-4 py-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Upload className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {getImageName(
                            form.image,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {getImageMeta(
                            form.image,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================= */}
            {/* NOTES                                                         */}
            {/* ============================================================= */}

            <div className="mt-7 border-t border-border pt-6">
              <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-8">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Map Notes
                  </p>

                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    Tambahkan catatan mengenai karakteristik,
                    akses, atau informasi penting dari map.
                  </p>
                </div>

                <Field>
                  <textarea
                    value={
                      form.notes
                    }
                    disabled={
                      isSaving
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
                    rows={5}
                    placeholder="Example: Area ini merupakan kota utama dan memiliki beberapa NPC penting serta akses menuju area di sekitarnya..."
                    className="min-h-[130px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="mt-2 flex items-start justify-between gap-4">
                    <FieldHint>
                      Opsional. Gunakan untuk informasi yang tidak termasuk pada field lainnya.
                    </FieldHint>

                    <span className="shrink-0 text-xs text-muted-foreground">
                      {
                        form.notes
                          .length
                      }{" "}
                      characters
                    </span>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* DIVIDER                                                         */}
          {/* =============================================================== */}

          <div className="border-t border-border" />

          {/* =============================================================== */}
          {/* RELATIONSHIPS                                                   */}
          {/* =============================================================== */}

          <div className="p-6">
            <SectionTitle
              number="02"
              title="Map Relationships"
              description="Atur struktur area induk dari map. Parent Area tidak otomatis menjadi Map Connection."
            />

            <div className="mt-6 grid grid-cols-2 gap-6">
              {/* =========================================================== */}
              {/* PARENT                                                      */}
              {/* =========================================================== */}

              <Field>
                <FieldLabel>
                  Parent Area
                </FieldLabel>

                <SearchableSelect
                  value={
                    form.parentMapId
                  }
                  options={
                    parentOptions
                  }
                  disabled={
                    !form.world ||
                    isSaving
                  }
                  loading={
                    isFetchingMaps
                  }
                  placeholder={
                    form.world
                      ? "Select parent area"
                      : "Select world first"
                  }
                  searchPlaceholder="Search parent area..."
                  emptyText="No maps found."
                  icon={
                    MapPinned
                  }
                  error={Boolean(
                    errors.parentMapId,
                  )}
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "parentMapId",
                      value,
                    )
                  }
                />

                {errors.parentMapId ? (
                  <FieldError>
                    {
                      errors.parentMapId
                    }
                  </FieldError>
                ) : !form.world ? (
                  <DisabledHint>
                    Pilih World terlebih dahulu untuk mengaktifkan Parent Area.
                  </DisabledHint>
                ) : (
                  <FieldHint>
                    Parent Area hanya menentukan struktur atau induk map.
                    Tidak otomatis membuat connection.
                  </FieldHint>
                )}
              </Field>

              {/* =========================================================== */}
              {/* BGM                                                         */}
              {/* =========================================================== */}

              <Field>
                <FieldLabel>
                  BGM
                </FieldLabel>

                <DisabledValueField
                  value="Available after map creation"
                />

                <FieldHint>
                  Endpoint create map saat ini belum menerima BGM.
                </FieldHint>
              </Field>
            </div>
          </div>

          {/* =============================================================== */}
          {/* DIVIDER                                                         */}
          {/* =============================================================== */}

          <div className="border-t border-border" />

          {/* =============================================================== */}
          {/* CONNECTIONS                                                     */}
          {/* =============================================================== */}

          <div className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_440px] items-start gap-10">
              <SectionTitle
                number="03"
                title="Map Connections"
                description="Tambahkan map yang dapat diakses secara langsung. Parent Area juga tetap dapat dipilih jika memang memiliki akses langsung."
              />

              <Field>
                <SearchableSelect
                  value=""
                  options={
                    connectionOptions
                  }
                  disabled={
                    !form.world ||
                    isSaving
                  }
                  loading={
                    isFetchingMaps
                  }
                  placeholder={
                    form.world
                      ? "Search and add connected map"
                      : "Select world first"
                  }
                  searchPlaceholder="Search maps..."
                  emptyText="No available maps."
                  icon={Link2}
                  error={Boolean(
                    errors.connections,
                  )}
                  onChange={
                    addConnection
                  }
                />

                {errors.connections ? (
                  <FieldError>
                    {
                      errors.connections
                    }
                  </FieldError>
                ) : !form.world ? (
                  <DisabledHint>
                    Pilih World terlebih dahulu untuk menambahkan connection.
                  </DisabledHint>
                ) : (
                  <FieldHint>
                    Connection adalah akses langsung antar map dan terpisah dari struktur Parent Area.
                  </FieldHint>
                )}
              </Field>
            </div>

            {connections.length >
            0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {connections.map(
                  (connection) => {
                    const isParent =
                      connection.id ===
                      form.parentMapId;

                    return (
                      <div
                        key={
                          connection.id
                        }
                        className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/10 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                            <MapPinned className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-foreground">
                                {formatMapName(
                                  connection.name,
                                )}
                              </p>

                              {isParent && (
                                <span className="shrink-0 rounded-full bg-primary/[0.08] px-2 py-0.5 text-[10px] font-medium text-primary">
                                  Parent
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatWorld(
                                connection.world,
                              )}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={
                            isSaving
                          }
                          onClick={() =>
                            removeConnection(
                              connection.id,
                            )
                          }
                          className="size-8 shrink-0 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <RelationEmpty
                icon={Link2}
                title="No map connections"
                description="Map baru ini belum memiliki area yang dapat diakses secara langsung."
              />
            )}
          </div>

          {/* =============================================================== */}
          {/* ACTIONS                                                         */}
          {/* =============================================================== */}

          <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Ready to save?
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Simpan sebagai Draft atau preview terlebih dahulu sebelum
                mempublikasikan map.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={
                  isSaving
                }
                onClick={() =>
                  navigate(
                    "/data/worlds/maps",
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
                onClick={
                  saveDraft
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                {isSaving &&
                savingAction ===
                  "DRAFT" ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {isSaving &&
                savingAction ===
                  "DRAFT"
                  ? "Saving..."
                  : "Save Draft"}
              </Button>

              <Button
                type="button"
                disabled={
                  isSaving
                }
                onClick={
                  openPublishPreview
                }
                className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
              >
                <Eye className="size-4" />

                Preview & Publish
              </Button>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>

      {/* =================================================================== */}
      {/* PREVIEW                                                             */}
      {/* =================================================================== */}

      {showPublishPreview && (
        <PublishPreviewModal
          name={
            form.name
          }
          slug={slug}
          type={
            selectedType
          }
          world={
            selectedWorld
          }
          parentArea={
            selectedParent
          }
          notes={
            form.notes
          }
          image={
            form.image
          }
          connections={
            connections
          }
          isSavePoint={
            form.isSavePoint
          }
          isWorldMapVisible={
            form.isWorldMapVisible
          }
          isSaving={
            isSaving
          }
          onClose={() =>
            setShowPublishPreview(
              false,
            )
          }
          onPublish={
            publishMap
          }
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* BOOLEAN FIELD                                                              */
/* -------------------------------------------------------------------------- */

function BooleanField({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}) {
  return (
    <div className="flex min-h-[86px] items-start gap-3 rounded-xl border border-border bg-muted/10 p-4">
      <Checkbox
        id={id}
        checked={
          checked
        }
        disabled={
          disabled
        }
        onCheckedChange={
          onCheckedChange
        }
        className="mt-0.5"
      />

      <label
        htmlFor={id}
        className={[
          "min-w-0 flex-1",

          disabled
            ? "cursor-not-allowed"
            : "cursor-pointer",
        ].join(" ")}
      >
        <p className="text-sm font-medium text-foreground">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PUBLISH PREVIEW                                                            */
/* -------------------------------------------------------------------------- */

function PublishPreviewModal({
  name,
  slug,
  type,
  world,
  parentArea,
  notes,
  image,
  connections,
  isSavePoint,
  isWorldMapVisible,
  isSaving,
  onClose,
  onPublish,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6 py-8">
      <div className="max-h-full w-full max-w-[780px] overflow-y-auto rounded-2xl border border-border bg-background shadow-xl">
        <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Preview Map
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Pastikan informasi map sudah benar sebelum dipublikasikan.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={
              isSaving
            }
            onClick={
              onClose
            }
            className="size-9 cursor-pointer rounded-lg"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-[230px_minmax(0,1fr)] gap-6">
            <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
              <div className="flex aspect-[16/10] items-center justify-center">
                {image ? (
                  <MapImagePreview
                    image={
                      image
                    }
                  />
                ) : (
                  <div className="px-5 text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-background text-muted-foreground">
                      <MapPinned className="size-5" />
                    </div>

                    <p className="mt-3 text-xs font-medium text-foreground">
                      No map image
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Map
              </p>

              <h3 className="mt-2 truncate text-xl font-semibold tracking-[-0.03em] text-foreground">
                {name}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                /{slug}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
                <PreviewItem
                  label="Map Type"
                  value={
                    type?.label ||
                    "—"
                  }
                />

                <PreviewItem
                  label="World"
                  value={
                    world?.label ||
                    "—"
                  }
                />

                <PreviewItem
                  label="Parent Area"
                  value={
                    parentArea
                      ? formatMapName(
                          parentArea.name,
                        )
                      : "—"
                  }
                />

                <PreviewItem
                  label="Save Point"
                  value={
                    isSavePoint
                      ? "Yes"
                      : "No"
                  }
                />

                <PreviewItem
                  label="World Map Visible"
                  value={
                    isWorldMapVisible
                      ? "Yes"
                      : "No"
                  }
                />

                <PreviewItem
                  label="Connections"
                  value={String(
                    connections.length,
                  )}
                />
              </div>
            </div>
          </div>

          {notes.trim() && (
            <div className="mt-6 rounded-xl border border-border bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Map Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {notes.trim()}
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Map Connections
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Map yang dapat diakses secara langsung dari area ini.
                </p>
              </div>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                {
                  connections.length
                }
              </span>
            </div>

            {connections.length >
            0 ? (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {connections.map(
                  (connection) => {
                    const isParent =
                      connection.id ===
                      parentArea?.id;

                    return (
                      <div
                        key={
                          connection.id
                        }
                        className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3"
                      >
                        <MapPinned className="size-4 shrink-0 text-muted-foreground" />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">
                              {formatMapName(
                                connection.name,
                              )}
                            </p>

                            {isParent && (
                              <span className="shrink-0 rounded-full bg-primary/[0.08] px-2 py-0.5 text-[9px] font-medium text-primary">
                                Parent
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatWorld(
                              connection.world,
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                No map connections selected.
              </p>
            )}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-medium text-foreground">
                Ready to publish
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Setelah dipublikasikan, map akan memiliki status Published
                dan dapat digunakan oleh Aoi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/20 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            disabled={
              isSaving
            }
            onClick={
              onClose
            }
            className="h-10 cursor-pointer px-4 text-sm"
          >
            Back to Edit
          </Button>

          <Button
            type="button"
            disabled={
              isSaving
            }
            onClick={
              onPublish
            }
            className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
          >
            {isSaving ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}

            {isSaving
              ? "Publishing..."
              : "Publish Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PREVIEW ITEM                                                               */
/* -------------------------------------------------------------------------- */

function PreviewItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RELATION EMPTY                                                             */
/* -------------------------------------------------------------------------- */

function RelationEmpty({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mt-6 flex min-h-[110px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 px-6 text-center">
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
  );
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
  );
}

function DisabledHint({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <LockKeyhole className="size-3 shrink-0" />

      {children}
    </p>
  );
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

  loading = false,

  icon: Icon,

  error = false,
}) {
  const containerRef =
    useRef(null);

  const inputRef =
    useRef(null);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const selectedOption =
    options.find(
      (option) =>
        option.value ===
        value,
    ) || null;

  const filteredOptions =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return options;
      }

      return options.filter(
        (option) => {
          const label =
            option.label
              ?.toLowerCase() ||
            "";

          const meta =
            option.meta
              ?.toLowerCase() ||
            "";

          return (
            label.includes(
              keyword,
            ) ||
            meta.includes(
              keyword,
            )
          );
        },
      );
    }, [
      options,
      search,
    ]);

  useEffect(() => {
    function handleOutsideClick(
      event,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

    return () =>
      clearTimeout(timeout);
  }, [open]);

  function handleSelect(
    option,
  ) {
    onChange(
      option.value,
    );

    setOpen(false);
    setSearch("");
  }

  function clearSelection() {
    onChange("");

    setOpen(false);
    setSearch("");
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
              ? "cursor-not-allowed border-border/90 bg-muted/85 shadow-inner"
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
            <LockKeyhole className="size-4 shrink-0 text-muted-foreground/85" />
          ) : loading ? (
            <LoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground" />
          ) : Icon ? (
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          ) : null}

          <span
            className={[
              "min-w-0 flex-1 truncate text-sm",

              disabled
                ? "font-medium text-muted-foreground/80"
                : selectedOption
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

              disabled
                ? "opacity-50"
                : "",

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
              onClick={(
                event,
              ) => {
                event.stopPropagation();

                clearSelection();
              }}
              className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear selection"
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
                    searchPlaceholder
                  }
                  className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
                />
              </div>
            </div>

            <div className="max-h-[250px] overflow-y-auto p-1.5">
              {loading ? (
                <div className="flex min-h-[90px] items-center justify-center">
                  <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
                </div>
              ) : filteredOptions.length >
                0 ? (
                filteredOptions.map(
                  (option) => {
                    const selected =
                      option.value ===
                      value;

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
                    );
                  },
                )
              ) : (
                <div className="flex min-h-[90px] items-center justify-center px-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    {
                      emptyText
                    }
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
  );
}

/* -------------------------------------------------------------------------- */
/* IMAGE PREVIEW                                                              */
/* -------------------------------------------------------------------------- */

function MapImagePreview({
  image,
}) {
  const [
    src,
    setSrc,
  ] = useState(null);

  useEffect(() => {
    if (!image) {
      setSrc(null);
      return;
    }

    if (
      typeof image ===
      "string"
    ) {
      setSrc(image);
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        image,
      );

    setSrc(
      objectUrl,
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [image]);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt="Map preview"
      className="h-full w-full object-cover"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION                                                                    */
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
  );
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
  );
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
  );
}

function FieldHint({
  children,
}) {
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      {children}
    </p>
  );
}

function FieldError({
  children,
}) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <CircleAlert className="size-3.5 shrink-0" />

      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass(
  error,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ");
}

function selectClass(
  error,
) {
  return [
    "h-11 w-full cursor-pointer rounded-lg border bg-background px-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60",

    error
      ? "border-destructive/50 focus:border-destructive/60 focus:ring-destructive/10"
      : "border-border hover:bg-muted/10 focus:border-primary/40 focus:ring-primary/10",
  ].join(" ");
}

/* -------------------------------------------------------------------------- */
/* MAP TYPE                                                                   */
/* -------------------------------------------------------------------------- */

function getMapTypeIcon(
  type,
) {
  switch (type) {
    case "FIELD":
      return TentTree;

    case "TOWN":
    case "TOWN_RUINS":
    case "RUINS":
      return MapPinned;

    case "MOUNTAIN":
      return Mountain;

    case "SHIP":
      return Ship;

    case "FOREST":
      return Trees;

    default:
      return MapPinned;
  }
}

/* -------------------------------------------------------------------------- */
/* IMAGE HELPERS                                                              */
/* -------------------------------------------------------------------------- */

function getImageName(
  image,
) {
  if (!image) {
    return "No image";
  }

  if (
    typeof image ===
    "string"
  ) {
    return "Current map image";
  }

  return (
    image.name ||
    "Map image"
  );
}

function getImageMeta(
  image,
) {
  if (!image) {
    return "";
  }

  if (
    typeof image ===
    "string"
  ) {
    return "Existing image";
  }

  return formatFileSize(
    image.size,
  );
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function createSlug(
  value,
) {
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
    );
}

function formatMapName(
  value,
) {
  if (!value) {
    return "—";
  }

  return String(value)
    .replace(
      /[-_]/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatWorld(
  value,
) {
  if (
    value ===
    "TORAM"
  ) {
    return "Toram";
  }

  if (
    value ===
    "IRUNA"
  ) {
    return "Iruna";
  }

  return (
    value ||
    "—"
  );
}

function formatFileSize(
  bytes,
) {
  if (!bytes) {
    return "0 KB";
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
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
  UserRound,
  Users,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useMapDetail,
  useMaps,
  useUpdateMap,
} from "@/features/data/maps/api/maps.query";

/* -------------------------------------------------------------------------- */
/* OPTIONS                                                                    */
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

export default function EditMapPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const updateMap = useUpdateMap();

  /* ---------------------------------------------------------------------- */
  /* DETAIL QUERY                                                           */
  /* ---------------------------------------------------------------------- */

  const {
    data: mapResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useMapDetail(id);

  const map =
    mapResponse?.data ?? null;

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
  /* ---------------------------------------------------------------------- */

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    type: "",
    world: "",
    parentMapId: "",
    image: null,
    existingImage: null,
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

  /* ---------------------------------------------------------------------- */
  /* PREFILL                                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!map) {
      return;
    }

    setForm({
      name:
        map.name ?? "",

      type:
        map.type ?? "",

      world:
        map.world ?? "",

      parentMapId:
        map.parentArea?.id ?? "",

      image: null,

      existingImage:
        map.image ?? null,

      notes:
        map.notes ?? "",

      isSavePoint:
        Boolean(
          map.isSavePoint,
        ),

      isWorldMapVisible:
        Boolean(
          map.isWorldMapVisible,
        ),
    });

    setConnections(
      Array.isArray(
        map.connections,
      )
        ? map.connections
        : [],
    );

    setErrors({});
  }, [map]);

  /* ---------------------------------------------------------------------- */
  /* AVAILABLE MAP QUERY                                                    */
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
    useMemo(() => {
      return createSlug(
        form.name,
      );
    }, [form.name]);

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

  /*
   * Semua map pada world yang sama,
   * kecuali map yang sedang diedit.
   *
   * Map tidak boleh connect ke dirinya sendiri.
   */
  const mapsInSelectedWorld =
    useMemo(() => {
      if (!form.world) {
        return [];
      }

      return availableMaps.filter(
        (item) =>
          item.id !== id,
      );
    }, [
      availableMaps,
      form.world,
      id,
    ]);

  /* ---------------------------------------------------------------------- */
  /* PARENT OPTIONS                                                         */
  /* ---------------------------------------------------------------------- */

  const parentOptions =
    useMemo(() => {
      return mapsInSelectedWorld.map(
        (item) => {
          const isConnected =
            connections.some(
              (connection) =>
                connection.id ===
                item.id,
            );

          return {
            value: item.id,

            label:
              formatMapName(
                item.name,
              ),

            meta:
              isConnected
                ? `${formatWorld(
                    item.world,
                  )} · Connected`
                : formatWorld(
                    item.world,
                  ),
          };
        },
      );
    }, [
      mapsInSelectedWorld,
      connections,
    ]);

  /* ---------------------------------------------------------------------- */
  /* CONNECTION OPTIONS                                                     */
  /* ---------------------------------------------------------------------- */

  /*
   * IMPORTANT:
   *
   * Parent Area dan Map Connection adalah relasi berbeda.
   *
   * Parent Area:
   * - hierarchy / struktur
   * - menjawab "map ini bagian dari area mana?"
   *
   * Connection:
   * - navigation / traversal
   * - menjawab "dari map ini bisa langsung ke map mana?"
   *
   * Parent TETAP BOLEH menjadi connection.
   *
   * Contoh:
   *
   * Gunung Nisel
   * ├── Lereng Gunung Nisel
   * └── Dekat Puncak Gunung Nisel
   *
   * Lereng:
   * parent = Gunung Nisel
   * connections = [
   *   Gunung Nisel,
   *   Dekat Puncak
   * ]
   *
   * Dekat Puncak:
   * parent = Gunung Nisel
   * connections = [
   *   Lereng
   * ]
   *
   * Karena itu jangan filter:
   *
   * item.id !== form.parentMapId
   */

  const connectionOptions =
    useMemo(() => {
      return mapsInSelectedWorld
        .filter(
          (item) =>
            !connections.some(
              (connection) =>
                connection.id ===
                item.id,
            ),
        )
        .map((item) => {
          const isParent =
            item.id ===
            form.parentMapId;

          return {
            value:
              item.id,

            label:
              formatMapName(
                item.name,
              ),

            meta:
              isParent
                ? `${formatWorld(
                    item.world,
                  )} · Parent Area`
                : formatWorld(
                    item.world,
                  ),
          };
        });
    }, [
      mapsInSelectedWorld,
      connections,
      form.parentMapId,
    ]);

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
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* WORLD CHANGE                                                           */
  /* ---------------------------------------------------------------------- */

  function handleWorldChange(
    value,
  ) {
    setForm((current) => ({
      ...current,

      world: value,

      parentMapId: "",
    }));

    /*
     * Parent dan connections dari world
     * sebelumnya tidak lagi valid ketika
     * world map diganti.
     */
    setConnections([]);

    setErrors((current) => ({
      ...current,
      world: undefined,
    }));
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

    setForm((current) => ({
      ...current,
      image: file,
    }));

    setErrors((current) => ({
      ...current,
      image: undefined,
    }));
  }

  function removeSelectedImage() {
    /*
     * Hanya membatalkan image BARU
     * yang belum dikirim.
     *
     * Existing image backend tidak dihapus.
     */
    setForm((current) => ({
      ...current,
      image: null,
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* CONNECTION                                                             */
  /* ---------------------------------------------------------------------- */

  function addConnection(
    mapId,
  ) {
    const selectedMap =
      availableMaps.find(
        (item) =>
          item.id === mapId,
      );

    if (!selectedMap) {
      return;
    }

    /*
     * Safety:
     * map tidak boleh connect ke dirinya.
     */
    if (
      selectedMap.id === id
    ) {
      return;
    }

    if (
      connections.some(
        (connection) =>
          connection.id ===
          selectedMap.id,
      )
    ) {
      return;
    }

    setConnections(
      (current) => [
        ...current,
        selectedMap,
      ],
    );

    setErrors((current) => ({
      ...current,
      connections: undefined,
    }));
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
    const nextErrors = {};

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

    /*
     * Safety tambahan.
     */
    if (
      form.parentMapId === id
    ) {
      nextErrors.parentMapId =
        "Map tidak dapat menjadi parent untuk dirinya sendiri.";
    }

    if (
      connections.some(
        (connection) =>
          connection.id === id,
      )
    ) {
      nextErrors.connections =
        "Map tidak dapat memiliki connection ke dirinya sendiri.";
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
  /* MULTIPART                                                              */
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

    /*
     * Parent Area tetap dikirim sendiri.
     *
     * Parent tidak otomatis ditambahkan
     * ke connectionIds.
     */
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

    /*
     * Connection sepenuhnya eksplisit.
     *
     * Parent hanya masuk ke connectionIds
     * jika memang dipilih user sebagai
     * connection.
     *
     * [] tetap dikirim supaya backend tahu
     * semua existing connection ingin dihapus.
     */
    data.append(
      "connectionIds",
      JSON.stringify(
        connections.map(
          (connection) =>
            connection.id,
        ),
      ),
    );

    /*
     * Image hanya dikirim jika ada file baru.
     */
    if (form.image) {
      data.append(
        "image",
        form.image,
      );
    }

    return data;
  }

  /* ---------------------------------------------------------------------- */
  /* BACKEND ERROR                                                          */
  /* ---------------------------------------------------------------------- */

  function handleBackendError(
    requestError,
  ) {
    const backendErrors =
      Array.isArray(
        requestError?.errors,
      )
        ? requestError.errors
        : [];

    if (
      backendErrors.length >
      0
    ) {
      const nextErrors = {};

      const fieldMap = {
        name:
          "name",

        slug:
          "name",

        type:
          "type",

        world:
          "world",

        parentMapId:
          "parentMapId",

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

      backendErrors.forEach(
        (item) => {
          const frontendField =
            fieldMap[
              item?.field
            ];

          if (
            frontendField &&
            item?.message
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
      "Gagal memperbarui map",
      {
        description:
          requestError?.message ||
          "Terjadi kesalahan ketika menyimpan perubahan map.",
      },
    );
  }

  /* ---------------------------------------------------------------------- */
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  async function saveChanges(
    status,
  ) {
    if (
      updateMap.isPending
    ) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSavingAction(
      status,
    );

    try {
      const multipart =
        buildFormData(
          status,
        );

      await updateMap.mutateAsync({
        id,
        formData:
          multipart,
      });

      toast.success(
        status ===
          "PUBLISHED"
          ? "Map berhasil diperbarui"
          : "Draft berhasil disimpan",
        {
          description:
            status ===
            "PUBLISHED"
              ? "Perubahan map sudah dipublikasikan."
              : "Perubahan tersimpan sebagai Draft.",
        },
      );

      navigate(
        `/data/worlds/maps/${id}`,
        {
          replace: true,
        },
      );
    } catch (
      requestError
    ) {
      handleBackendError(
        requestError,
      );
    } finally {
      setSavingAction(
        null,
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                */
  /* ---------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <EditMapLoading />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                  */
  /* ---------------------------------------------------------------------- */

  if (
    isError ||
    !map
  ) {
    return (
      <EditMapError
        error={error}
        onRetry={refetch}
        onBack={() =>
          navigate(
            "/data/worlds/maps",
          )
        }
      />
    );
  }

  const isSaving =
    updateMap.isPending;

  const displayedImage =
    form.image ||
    form.existingImage;

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
        disabled={isSaving}
        onClick={() =>
          navigate(
            `/data/worlds/maps/${id}`,
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <ArrowLeft className="size-4" />

        Back to Map
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

          <span className="max-w-[260px] truncate text-muted-foreground">
            {formatMapName(
              map.name,
            )}
          </span>

          <span className="text-muted-foreground/40">
            /
          </span>

          <span className="text-primary">
            Edit
          </span>
        </div>

        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
          Edit Map
        </h1>

        <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
          Perbarui informasi map, struktur area,
          connections, catatan, dan status dari{" "}
          {formatMapName(
            map.name,
          )}.
        </p>
      </header>

      {/* ================================================================== */}
      {/* MAIN CARD                                                          */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-visible rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 GENERAL INFORMATION                                            */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="General Information"
            description="Perbarui identitas, klasifikasi, world, gambar, dan catatan map."
          />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_380px] gap-8">
            {/* ============================================================= */}
            {/* LEFT                                                          */}
            {/* ============================================================= */}

            <div className="space-y-6">
              {/* NAME */}

              <Field>
                <FieldLabel required>
                  Map Name
                </FieldLabel>

                <input
                  type="text"
                  value={form.name}
                  maxLength={150}
                  disabled={isSaving}
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
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
                    Nama map yang ditampilkan kepada pengguna.
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
                    value={form.type}
                    options={mapTypes}
                    disabled={isSaving}
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
                      {errors.type}
                    </FieldError>
                  ) : (
                    <FieldHint>
                      Klasifikasi utama dari map ini.
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
                    value={form.world}
                    disabled={isSaving}
                    onChange={(
                      event,
                    ) =>
                      handleWorldChange(
                        event.target.value,
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
                    {errors.world}
                  </FieldError>
                ) : (
                  <FieldHint>
                    Mengubah World akan menghapus Parent Area dan
                    Map Connections yang sedang dipilih.
                  </FieldHint>
                )}
              </Field>

              {/* MAP FLAGS */}

              <div className="grid grid-cols-2 gap-4">
                <BooleanField
                  id="edit-map-save-point"
                  label="Save Point"
                  description="Tandai jika map ini merupakan save point."
                  checked={
                    form.isSavePoint
                  }
                  disabled={isSaving}
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
                  id="edit-map-world-visible"
                  label="Visible on World Map"
                  description="Tampilkan map ini pada world map."
                  checked={
                    form.isWorldMapVisible
                  }
                  disabled={isSaving}
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

            {/* ============================================================= */}
            {/* IMAGE                                                         */}
            {/* ============================================================= */}

            <div>
              <FieldLabel>
                Map Image
              </FieldLabel>

              {!displayedImage ? (
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
                    PNG, JPG atau WEBP. Landscape image
                    direkomendasikan.
                  </p>

                  <span className="mt-4 text-xs font-medium text-primary">
                    Choose image
                  </span>

                  <input
                    type="file"
                    disabled={isSaving}
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
                        displayedImage
                      }
                    />

                    {form.image && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        disabled={
                          isSaving
                        }
                        onClick={
                          removeSelectedImage
                        }
                        className="absolute right-3 top-3 size-9 cursor-pointer rounded-lg"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Upload className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">
                          {form.image
                            ? getImageName(
                                form.image,
                              )
                            : "Current map image"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {form.image
                            ? getImageMeta(
                                form.image,
                              )
                            : "Existing image"}
                        </p>
                      </div>
                    </div>

                    <label className="shrink-0 cursor-pointer text-xs font-medium text-primary hover:underline">
                      Replace

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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NOTES */}

          <div className="mt-7 border-t border-border pt-6">
            <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-8">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Map Notes
                </p>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Catatan tambahan mengenai karakteristik,
                  akses, atau informasi penting dari map.
                </p>
              </div>

              <Field>
                <textarea
                  value={form.notes}
                  disabled={isSaving}
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "notes",
                      event.target.value,
                    )
                  }
                  rows={5}
                  placeholder="Example: Area ini merupakan kota utama dan memiliki beberapa NPC penting serta akses menuju area di sekitarnya..."
                  className="min-h-[130px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-2 flex items-start justify-between gap-4">
                  <FieldHint>
                    Opsional. Gunakan untuk informasi yang tidak
                    termasuk pada field lainnya.
                  </FieldHint>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {form.notes.length} characters
                  </span>
                </div>
              </Field>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ================================================================= */}
        {/* 02 MAP RELATIONSHIPS                                              */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="02"
            title="Map Relationships"
            description="Atur struktur Parent Area. Parent tidak otomatis menjadi Map Connection."
          />

          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* PARENT */}

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
                icon={MapPinned}
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
                  {errors.parentMapId}
                </FieldError>
              ) : !form.world ? (
                <DisabledHint>
                  Pilih World terlebih dahulu untuk mengaktifkan
                  Parent Area.
                </DisabledHint>
              ) : (
                <FieldHint>
                  Parent Area hanya menentukan induk atau hierarchy map.
                  Tidak otomatis membuat connection.
                </FieldHint>
              )}
            </Field>

            {/* BGM */}

            <Field>
              <FieldLabel>
                BGM
              </FieldLabel>

              <DisabledValueField
                value={
                  map.bgm?.name
                    ? map.bgm.name
                    : "Managed separately"
                }
              />

              <FieldHint>
                Endpoint update map saat ini belum menerima BGM.
              </FieldHint>
            </Field>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ================================================================= */}
        {/* 03 MAP CONNECTIONS                                                */}
        {/* ================================================================= */}

        <div className="p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_440px] items-start gap-10">
            <SectionTitle
              number="03"
              title="Map Connections"
              description="Atur map yang dapat diakses secara langsung. Parent Area tetap dapat dipilih jika memang terhubung langsung."
            />

            <Field>
              <FieldLabel>
                Add Connected Map
              </FieldLabel>

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
                  {errors.connections}
                </FieldError>
              ) : !form.world ? (
                <DisabledHint>
                  Pilih World terlebih dahulu untuk menambahkan
                  connection.
                </DisabledHint>
              ) : (
                <FieldHint>
                  Connection adalah akses langsung antar map dan
                  terpisah dari struktur Parent Area.
                </FieldHint>
              )}
            </Field>
          </div>

          {connections.length >
          0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {connections.map(
                (connection) => {
                  const Icon =
                    getMapTypeIcon(
                      connection.type,
                    );

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
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
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
                            {connection.type
                              ? formatMapType(
                                  connection.type,
                                )
                              : formatWorld(
                                  connection.world,
                                )}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isSaving}
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
              description="Map ini belum memiliki area yang dapat diakses secara langsung."
            />
          )}
        </div>

        <div className="border-t border-border" />

        {/* ================================================================= */}
        {/* 04 MAP CONTENT                                                    */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="04"
            title="Map Content"
            description="Monster dan NPC yang saat ini tercatat pada map ini."
          />

          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* MONSTERS */}

            <RelationManager
              icon={Users}
              title="Monsters"
              description="Monster yang tercatat berada pada area ini."
              count={
                map.monsters
                  ?.length ?? 0
              }
            >
              {map.monsters?.length >
              0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  {map.monsters.map(
                    (monster) => (
                      <div
                        key={
                          monster.id
                        }
                        className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Users className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {formatMapName(
                                monster.name,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatLabel(
                                monster.type,
                              )}

                              {monster.level !=
                              null
                                ? ` · Lv. ${monster.level}`
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <MiniRelationEmpty
                  icon={Users}
                  title="No monsters"
                  description="Belum ada monster yang ditambahkan."
                />
              )}

              <DisabledHint>
                Relasi monster belum termasuk pada endpoint update map.
              </DisabledHint>
            </RelationManager>

            {/* NPCS */}

            <RelationManager
              icon={UserRound}
              title="NPCs"
              description="NPC yang tercatat berada pada area ini."
              count={
                map.npcs?.length ??
                0
              }
            >
              {map.npcs?.length >
              0 ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  {map.npcs.map(
                    (npc) => (
                      <div
                        key={
                          npc.id
                        }
                        className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 last:border-b-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <UserRound className="size-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {formatMapName(
                                npc.name,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatLabel(
                                npc.type,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <MiniRelationEmpty
                  icon={UserRound}
                  title="No NPCs"
                  description="Belum ada NPC yang ditambahkan."
                />
              )}

              <DisabledHint>
                Relasi NPC belum termasuk pada endpoint update map.
              </DisabledHint>
            </RelationManager>
          </div>
        </div>

        {/* ================================================================= */}
        {/* ACTION BAR                                                        */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-8 border-t border-border bg-muted/20 px-6 py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              Current Status
            </p>

            <div className="mt-1.5 flex items-center gap-2.5">
              <CurrentStatusBadge
                status={
                  map.status
                }
              />

              <span className="text-xs text-muted-foreground">
                Pilih cara menyimpan perubahan.
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isSaving}
              onClick={() =>
                navigate(
                  `/data/worlds/maps/${id}`,
                )
              }
              className="h-10 cursor-pointer px-4 text-sm text-muted-foreground"
            >
              Cancel Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() =>
                saveChanges(
                  "DRAFT",
                )
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
                : "Save as Draft"}
            </Button>

            <Button
              type="button"
              disabled={isSaving}
              onClick={() =>
                saveChanges(
                  "PUBLISHED",
                )
              }
              className="h-10 cursor-pointer gap-2 rounded-lg px-5 text-sm"
            >
              {isSaving &&
              savingAction ===
                "PUBLISHED" ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}

              {isSaving &&
              savingAction ===
                "PUBLISHED"
                ? "Publishing..."
                : map.status ===
                    "PUBLISHED"
                  ? "Publish Changes"
                  : "Publish Map"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
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
        checked={checked}
        disabled={disabled}
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
/* LOADING                                                                    */
/* -------------------------------------------------------------------------- */

function EditMapLoading() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-border bg-background">
        <div className="text-center">
          <LoaderCircle className="mx-auto size-6 animate-spin text-muted-foreground" />

          <p className="mt-4 text-sm font-medium text-foreground">
            Loading map
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Menyiapkan data map untuk diedit.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ERROR                                                                      */
/* -------------------------------------------------------------------------- */

function EditMapError({
  error,
  onRetry,
  onBack,
}) {
  const isNotFound =
    error?.status === 404;

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-7 xl:px-8">
      <button
        type="button"
        onClick={onBack}
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to Maps
      </button>

      <div className="mt-7 flex min-h-[460px] items-center justify-center rounded-2xl border border-border bg-background px-6 text-center">
        <div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </div>

          <h1 className="mt-4 text-base font-semibold text-foreground">
            {isNotFound
              ? "Map not found"
              : "Failed to load map"}
          </h1>

          <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-muted-foreground">
            {isNotFound
              ? "Map yang ingin diedit tidak ditemukan."
              : error?.message ||
                "Tidak dapat mengambil data map dari server."}
          </p>

          {!isNotFound && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onRetry()
              }
              className="mt-5 h-9 cursor-pointer rounded-lg px-4 text-sm"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CURRENT STATUS                                                             */
/* -------------------------------------------------------------------------- */

function CurrentStatusBadge({
  status,
}) {
  const published =
    status === "PUBLISHED";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",

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
  );
}

/* -------------------------------------------------------------------------- */
/* RELATION MANAGER                                                           */
/* -------------------------------------------------------------------------- */

function RelationManager({
  icon: Icon,
  title,
  description,
  count,
  children,
}) {
  return (
    <div className="overflow-visible rounded-xl border border-border">
      <div className="flex items-start justify-between gap-5 border-b border-border bg-muted/10 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <span className="flex min-w-8 shrink-0 items-center justify-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
          {count}
        </span>
      </div>

      <div className="p-4">
        {children}
      </div>
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
/* MINI RELATION EMPTY                                                        */
/* -------------------------------------------------------------------------- */

function MiniRelationEmpty({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex min-h-[130px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 px-5 text-center">
      <div>
        <div className="mx-auto flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
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
/* DISABLED VALUE FIELD                                                       */
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

/* -------------------------------------------------------------------------- */
/* DISABLED HINT                                                              */
/* -------------------------------------------------------------------------- */

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

  function clearSelection(
    event,
  ) {
    event.stopPropagation();

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
              onClick={
                clearSelection
              }
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
                  ref={inputRef}
                  type="text"
                  value={search}
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
                            {option.label}
                          </p>

                          {option.meta && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {option.meta}
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
                    {emptyText}
                  </p>
                </div>
              )}
            </div>

            {selectedOption && (
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange("");

                    setOpen(false);
                    setSearch("");
                  }}
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

    setSrc(objectUrl);

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

function formatMapType(
  type,
) {
  const labels = {
    FIELD: "Field",
    TOWN: "Town",
    RUINS: "Ruins",
    TOWN_RUINS:
      "Town Ruins",
    MOUNTAIN:
      "Mountain",
    SHIP: "Ship",
    FOREST: "Forest",
  };

  return (
    labels[type] ||
    formatLabel(type)
  );
}

function getMapTypeIcon(
  type,
) {
  switch (type) {
    case "FIELD":
      return TentTree;

    case "TOWN":
    case "RUINS":
    case "TOWN_RUINS":
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
  world,
) {
  if (
    world === "TORAM"
  ) {
    return "Toram";
  }

  if (
    world === "IRUNA"
  ) {
    return "Iruna";
  }

  return (
    world ||
    "—"
  );
}

function formatLabel(
  value,
) {
  if (!value) {
    return "—";
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
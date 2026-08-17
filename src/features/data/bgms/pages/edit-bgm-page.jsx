import {
  ArrowLeft,
  FileAudio,
  ImageIcon,
  Pause,
  Play,
  Upload,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  Button,
} from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const MAX_AUDIO_SIZE =
  20 * 1024 * 1024

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024

const allowedAudioTypes = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
]

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

/* -------------------------------------------------------------------------- */
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const bgmRecords = [
  {
    id: "BGM-001",

    title: "Sofya City",

    slug: "sofya-city",

    coverUrl:
      "https://placehold.co/960x540/png?text=Sofya+City",

    coverName:
      "sofya-city-cover.png",

    coverSize:
      1240000,

    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

    audioName:
      "sofya-city.mp3",

    audioSize:
      5242880,

    duration: 143,

    notes:
      "Background music yang digunakan untuk area Sofya City.",

    status: "PUBLISHED",
  },

  {
    id: "BGM-002",

    title: "Rakau Plains",

    slug: "rakau-plains",

    coverUrl:
      "https://placehold.co/960x540/png?text=Rakau+Plains",

    coverName:
      "rakau-plains-cover.png",

    coverSize:
      980000,

    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

    audioName:
      "rakau-plains.mp3",

    audioSize:
      4194304,

    duration: 167,

    notes: "",

    status: "PUBLISHED",
  },

  {
    id: "BGM-006",

    title: "Hora Diomedea",

    slug: "hora-diomedea",

    coverUrl: null,

    coverName: null,

    coverSize: null,

    audioUrl: null,

    audioName: null,

    audioSize: null,

    duration: null,

    notes: "",

    status: "DRAFT",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function EditBgmPage() {
  const navigate =
    useNavigate()

  const { id } =
    useParams()

  const imageInputRef =
    useRef(null)

  const audioInputRef =
    useRef(null)

  const audioRef =
    useRef(null)

  /* ---------------------------------------------------------------------- */
  /* EXISTING DATA                                                          */
  /* ---------------------------------------------------------------------- */

  const existingBgm =
    useMemo(() => {
      return (
        bgmRecords.find(
          (bgm) =>
            bgm.id === id,
        ) ||
        bgmRecords[0]
      )
    }, [id])

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
  /* ---------------------------------------------------------------------- */

  const [
    form,
    setForm,
  ] = useState(() => ({
    title:
      existingBgm.title,

    cover: null,

    existingCover:
      existingBgm.coverUrl
        ? {
            url:
              existingBgm.coverUrl,

            name:
              existingBgm.coverName,

            size:
              existingBgm.coverSize,
          }
        : null,

    audio: null,

    existingAudio:
      existingBgm.audioUrl
        ? {
            url:
              existingBgm.audioUrl,

            name:
              existingBgm.audioName,

            size:
              existingBgm.audioSize,
          }
        : null,

    duration:
      existingBgm.duration,

    notes:
      existingBgm.notes ||
      "",
  }))

  const [
    coverPreview,
    setCoverPreview,
  ] = useState(
    existingBgm.coverUrl ||
      "",
  )

  const [
    audioUrl,
    setAudioUrl,
  ] = useState(
    existingBgm.audioUrl ||
      "",
  )

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false)

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0)

  const [
    errors,
    setErrors,
  ] = useState({})

  const [
    savingAction,
    setSavingAction,
  ] = useState(null)

  /* ---------------------------------------------------------------------- */
  /* DERIVED                                                                */
  /* ---------------------------------------------------------------------- */

  const slug =
    useMemo(() => {
      return createSlug(
        form.title,
      )
    }, [form.title])

  const hasCover =
    Boolean(
      form.cover ||
        form.existingCover,
    )

  const coverName =
    form.cover?.name ||
    form.existingCover
      ?.name ||
    null

  const coverSize =
    form.cover?.size ??
    form.existingCover
      ?.size ??
    null

  const hasAudio =
    Boolean(
      form.audio ||
        form.existingAudio,
    )

  const audioName =
    form.audio?.name ||
    form.existingAudio
      ?.name ||
    null

  const audioSize =
    form.audio?.size ??
    form.existingAudio
      ?.size ??
    null

  /* ---------------------------------------------------------------------- */
  /* CLEANUP                                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (
        form.cover &&
        coverPreview
      ) {
        URL.revokeObjectURL(
          coverPreview,
        )
      }

      if (
        form.audio &&
        audioUrl
      ) {
        URL.revokeObjectURL(
          audioUrl,
        )
      }
    }
  }, [
    coverPreview,
    audioUrl,
    form.cover,
    form.audio,
  ])

  /* ---------------------------------------------------------------------- */
  /* FORM                                                                   */
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

    if (
      errors[field]
    ) {
      setErrors(
        (current) => ({
          ...current,

          [field]:
            undefined,
        }),
      )
    }
  }

  /* ---------------------------------------------------------------------- */
  /* COVER                                                                  */
  /* ---------------------------------------------------------------------- */

  function openImagePicker() {
    imageInputRef.current?.click()
  }

  function handleCoverSelect(
    event,
  ) {
    const file =
      event.target
        .files?.[0]

    if (!file) {
      return
    }

    const isAllowedType =
      allowedImageTypes.includes(
        file.type,
      ) ||
      /\.(jpg|jpeg|png|webp)$/i.test(
        file.name,
      )

    if (!isAllowedType) {
      setErrors(
        (current) => ({
          ...current,

          cover:
            "Cover harus berupa JPG, PNG, atau WEBP.",
        }),
      )

      event.target.value =
        ""

      return
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setErrors(
        (current) => ({
          ...current,

          cover:
            "Ukuran cover maksimal 5 MB.",
        }),
      )

      event.target.value =
        ""

      return
    }

    if (
      form.cover &&
      coverPreview
    ) {
      URL.revokeObjectURL(
        coverPreview,
      )
    }

    const nextPreview =
      URL.createObjectURL(
        file,
      )

    setCoverPreview(
      nextPreview,
    )

    setForm(
      (current) => ({
        ...current,

        cover: file,

        existingCover:
          null,
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        cover:
          undefined,
      }),
    )
  }

  function removeCover() {
    if (
      form.cover &&
      coverPreview
    ) {
      URL.revokeObjectURL(
        coverPreview,
      )
    }

    setCoverPreview("")

    setForm(
      (current) => ({
        ...current,

        cover: null,

        existingCover:
          null,
      }),
    )

    if (
      imageInputRef.current
    ) {
      imageInputRef.current.value =
        ""
    }
  }

  /* ---------------------------------------------------------------------- */
  /* AUDIO                                                                  */
  /* ---------------------------------------------------------------------- */

  function openAudioPicker() {
    audioInputRef.current?.click()
  }

  function handleAudioSelect(
    event,
  ) {
    const file =
      event.target
        .files?.[0]

    if (!file) {
      return
    }

    const isAllowedType =
      allowedAudioTypes.includes(
        file.type,
      ) ||
      /\.(mp3|wav|ogg)$/i.test(
        file.name,
      )

    if (!isAllowedType) {
      setErrors(
        (current) => ({
          ...current,

          audio:
            "File audio harus berupa MP3, WAV, atau OGG.",
        }),
      )

      event.target.value =
        ""

      return
    }

    if (
      file.size >
      MAX_AUDIO_SIZE
    ) {
      setErrors(
        (current) => ({
          ...current,

          audio:
            "Ukuran file maksimal 20 MB.",
        }),
      )

      event.target.value =
        ""

      return
    }

    if (
      form.audio &&
      audioUrl
    ) {
      URL.revokeObjectURL(
        audioUrl,
      )
    }

    if (
      audioRef.current
    ) {
      audioRef.current.pause()
    }

    const nextAudioUrl =
      URL.createObjectURL(
        file,
      )

    setAudioUrl(
      nextAudioUrl,
    )

    setCurrentTime(0)
    setIsPlaying(false)

    setForm(
      (current) => ({
        ...current,

        audio: file,

        existingAudio:
          null,

        duration: null,
      }),
    )

    setErrors(
      (current) => ({
        ...current,

        audio:
          undefined,
      }),
    )
  }

  function handleLoadedMetadata(
    event,
  ) {
    const duration =
      event.currentTarget
        .duration

    if (
      Number.isFinite(
        duration,
      )
    ) {
      setForm(
        (current) => ({
          ...current,

          duration:
            Math.round(
              duration,
            ),
        }),
      )
    }
  }

  function handleTimeUpdate(
    event,
  ) {
    setCurrentTime(
      event.currentTarget
        .currentTime,
    )
  }

  function handleAudioEnded() {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  async function toggleAudio() {
    const audio =
      audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      try {
        await audio.play()
      } catch (error) {
        console.error(
          "Failed to play audio:",
          error,
        )
      }

      return
    }

    audio.pause()
  }

  function handleSeek(
    event,
  ) {
    const audio =
      audioRef.current

    if (!audio) {
      return
    }

    const value =
      Number(
        event.target.value,
      )

    audio.currentTime =
      value

    setCurrentTime(
      value,
    )
  }

  function removeAudio() {
    if (
      audioRef.current
    ) {
      audioRef.current.pause()
    }

    if (
      form.audio &&
      audioUrl
    ) {
      URL.revokeObjectURL(
        audioUrl,
      )
    }

    setAudioUrl("")

    setCurrentTime(0)
    setIsPlaying(false)

    setForm(
      (current) => ({
        ...current,

        audio: null,

        existingAudio:
          null,

        duration: null,
      }),
    )

    if (
      audioInputRef.current
    ) {
      audioInputRef.current.value =
        ""
    }
  }

  /* ---------------------------------------------------------------------- */
  /* VALIDATION                                                             */
  /* ---------------------------------------------------------------------- */

  function validate(
    status,
  ) {
    const nextErrors =
      {}

    if (
      !form.title.trim()
    ) {
      nextErrors.title =
        "BGM name is required."
    }

    if (
      status ===
        "PUBLISHED" &&
      !hasAudio
    ) {
      nextErrors.audio =
        "Audio file is required before publishing."
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
  /* SAVE                                                                   */
  /* ---------------------------------------------------------------------- */

  function handleSave(
    status,
  ) {
    if (
      !validate(status)
    ) {
      return
    }

    setSavingAction(
      status,
    )

    const payload = {
      id:
        existingBgm.id,

      title:
        form.title.trim(),

      slug,

      cover:
        form.cover,

      keepExistingCover:
        Boolean(
          form.existingCover,
        ),

      audio:
        form.audio,

      keepExistingAudio:
        Boolean(
          form.existingAudio,
        ),

      duration:
        form.duration,

      notes:
        form.notes.trim() ||
        null,

      status,
    }

    console.log(
      "Update BGM:",
      payload,
    )

    /*
      const formData =
        new FormData()

      formData.append(
        "title",
        payload.title,
      )

      formData.append(
        "slug",
        payload.slug,
      )

      formData.append(
        "status",
        payload.status,
      )

      formData.append(
        "duration",
        String(
          payload.duration ||
          "",
        ),
      )

      formData.append(
        "notes",
        payload.notes ||
        "",
      )

      formData.append(
        "keepExistingCover",
        String(
          payload.keepExistingCover,
        ),
      )

      formData.append(
        "keepExistingAudio",
        String(
          payload.keepExistingAudio,
        ),
      )

      if (
        payload.cover
      ) {
        formData.append(
          "cover",
          payload.cover,
        )
      }

      if (
        payload.audio
      ) {
        formData.append(
          "audio",
          payload.audio,
        )
      }

      await updateBgm(
        existingBgm.id,
        formData,
      )

      navigate(
        `/data/worlds/bgms/${existingBgm.id}`,
      )
    */

    setTimeout(() => {
      setSavingAction(
        null,
      )
    }, 600)
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
            `/data/worlds/bgms/${existingBgm.id}`,
          )
        }
        className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />

        Back to BGM
      </button>

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <header className="mt-5 flex items-end justify-between gap-8">
        <div>
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
              BGM
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-muted-foreground">
              {existingBgm.title}
            </span>

            <span className="text-muted-foreground/40">
              /
            </span>

            <span className="text-primary">
              Edit
            </span>
          </div>

          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-foreground">
            Edit BGM
          </h1>

          <p className="mt-2 max-w-[760px] text-sm leading-6 text-muted-foreground">
            Perbarui informasi, cover, dan file audio BGM.
          </p>
        </div>

        <StatusBadge
          status={
            existingBgm.status
          }
        />
      </header>

      {/* ================================================================== */}
      {/* CARD                                                               */}
      {/* ================================================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
        {/* ================================================================= */}
        {/* 01 INFORMATION                                                   */}
        {/* ================================================================= */}

        <div className="p-6">
          <SectionTitle
            number="01"
            title="BGM Information"
            description="Informasi utama dan cover background music."
          />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-8">
            {/* ============================================================= */}
            {/* LEFT — INFORMATION                                            */}
            {/* ============================================================= */}

            <div className="grid grid-cols-1 gap-5">
              {/* NAME */}

              <Field
                label="BGM Name"
                required
                error={
                  errors.title
                }
              >
                <input
                  type="text"
                  value={
                    form.title
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "title",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Example: Sofya City"
                  className={inputClass(
                    Boolean(
                      errors.title,
                    ),
                  )}
                />
              </Field>

              {/* SLUG */}

              <Field label="Slug">
                <input
                  type="text"
                  value={
                    slug
                  }
                  readOnly
                  className={`${inputClass()} cursor-default bg-muted/30 text-muted-foreground`}
                />
              </Field>

              <div className="border-t border-border pt-4">
                <p className="text-xs leading-5 text-muted-foreground">
                  Cover digunakan sebagai visual untuk membantu
                  mengenali lokasi atau suasana dari BGM.
                </p>
              </div>
            </div>

            {/* ============================================================= */}
            {/* RIGHT — COVER                                                */}
            {/* ============================================================= */}

            <div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-foreground">
                  Cover Image
                </label>

                <span className="text-xs text-muted-foreground">
                  Optional
                </span>
              </div>

              {!hasCover ? (
                <button
                  type="button"
                  onClick={
                    openImagePicker
                  }
                  className={[
                    "mt-2 flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/[0.06] px-5 text-center transition-colors",

                    errors.cover
                      ? "border-destructive/60 hover:bg-destructive/[0.02]"
                      : "border-border hover:border-primary/40 hover:bg-primary/[0.02]",
                  ].join(" ")}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-foreground">
                    Upload cover
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, atau WEBP
                  </p>
                </button>
              ) : (
                <div className="mt-2">
                  {/* COVER */}

                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                    <img
                      src={
                        coverPreview
                      }
                      alt={
                        form.title ||
                        "BGM cover"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* FILE */}

                  <div className="mt-3 flex min-w-0 items-center gap-2.5">
                    <ImageIcon className="size-4 shrink-0 text-muted-foreground" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">
                        {coverName ||
                          "BGM cover"}
                      </p>

                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {coverSize !=
                          null && (
                          <span>
                            {formatFileSize(
                              coverSize,
                            )}
                          </span>
                        )}

                        {form.cover && (
                          <>
                            <span>
                              ·
                            </span>

                            <span className="text-primary">
                              New image
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={
                        openImagePicker
                      }
                      className="h-9 cursor-pointer gap-2 rounded-lg px-3 text-xs"
                    >
                      <Upload className="size-3.5" />

                      Replace
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={
                        removeCover
                      }
                      className="h-9 cursor-pointer gap-2 rounded-lg px-3 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />

                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {errors.cover && (
                <p className="mt-2 text-xs text-destructive">
                  {errors.cover}
                </p>
              )}

              <input
                ref={
                  imageInputRef
                }
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={
                  handleCoverSelect
                }
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 AUDIO                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <div className="flex items-start justify-between gap-6">
            <SectionTitle
              number="02"
              title="Audio"
              description="File audio utama untuk BGM."
            />

            {hasAudio && (
              <Button
                type="button"
                variant="outline"
                onClick={
                  openAudioPicker
                }
                className="h-9 cursor-pointer gap-2 rounded-lg px-3 text-xs"
              >
                <Upload className="size-3.5" />

                Replace Audio
              </Button>
            )}
          </div>

          <div className="mt-6">
            {!hasAudio ? (
              /* ---------------------------------------------------------- */
              /* EMPTY AUDIO                                                */
              /* ---------------------------------------------------------- */

              <button
                type="button"
                onClick={
                  openAudioPicker
                }
                className={[
                  "flex min-h-[160px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/[0.06] px-6 text-center transition-colors",

                  errors.audio
                    ? "border-destructive/60 hover:bg-destructive/[0.02]"
                    : "border-border hover:border-primary/40 hover:bg-primary/[0.02]",
                ].join(" ")}
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Upload className="size-5" />
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  Upload BGM audio
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  MP3, WAV, atau OGG · Maksimal 20 MB
                </p>
              </button>
            ) : (
              /* ---------------------------------------------------------- */
              /* AUDIO PLAYER                                               */
              /* ---------------------------------------------------------- */

              <div className="rounded-xl border border-border">
                {/* AUDIO INFO */}

                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                      <FileAudio className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {audioName ||
                          "BGM Audio"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {audioSize !=
                          null && (
                          <>
                            <span>
                              {formatFileSize(
                                audioSize,
                              )}
                            </span>

                            <span>
                              ·
                            </span>
                          </>
                        )}

                        <span>
                          {form.duration !=
                          null
                            ? formatDuration(
                                form.duration,
                              )
                            : "Reading duration..."}
                        </span>

                        {form.audio && (
                          <>
                            <span>
                              ·
                            </span>

                            <span className="font-medium text-primary">
                              New file
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={
                      removeAudio
                    }
                    className="size-9 shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {/* PLAYER */}

                <div className="flex items-center gap-4 border-t border-border px-5 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={
                      toggleAudio
                    }
                    className="size-10 shrink-0 cursor-pointer rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-current" />
                    ) : (
                      <Play className="size-4 fill-current" />
                    )}
                  </Button>

                  <span className="w-[42px] shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                    {formatDuration(
                      currentTime,
                    )}
                  </span>

                  <input
                    type="range"
                    min="0"
                    max={
                      form.duration ||
                      0
                    }
                    step="0.1"
                    value={
                      Math.min(
                        currentTime,
                        form.duration ||
                          0,
                      )
                    }
                    disabled={
                      !form.duration
                    }
                    onChange={
                      handleSeek
                    }
                    className="h-1.5 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-default"
                  />

                  <span className="w-[42px] shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
                    {form.duration !=
                    null
                      ? formatDuration(
                          form.duration,
                        )
                      : "0:00"}
                  </span>
                </div>
              </div>
            )}

            {errors.audio && (
              <p className="mt-2 text-xs text-destructive">
                {errors.audio}
              </p>
            )}

            <input
              ref={
                audioInputRef
              }
              type="file"
              accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
              onChange={
                handleAudioSelect
              }
              className="hidden"
            />

            {audioUrl && (
              <audio
                ref={
                  audioRef
                }
                src={
                  audioUrl
                }
                preload="metadata"
                onLoadedMetadata={
                  handleLoadedMetadata
                }
                onTimeUpdate={
                  handleTimeUpdate
                }
                onPlay={() =>
                  setIsPlaying(
                    true,
                  )
                }
                onPause={() =>
                  setIsPlaying(
                    false,
                  )
                }
                onEnded={
                  handleAudioEnded
                }
                className="hidden"
              />
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 03 NOTES                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="BGM Notes"
            description="Informasi tambahan mengenai BGM."
            optional
          />

          <div className="mt-6">
            <textarea
              value={
                form.notes
              }
              maxLength={
                1000
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
              placeholder="Add notes about this BGM..."
              className="min-h-[120px] w-full resize-y rounded-lg border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-muted-foreground">
                {
                  form.notes.length
                }
                /1000
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOOTER                                                           */}
        {/* ================================================================= */}

        <div className="flex items-center justify-between gap-6 border-t border-border bg-muted/[0.08] px-6 py-4">
          {/* STATUS */}

          <div>
            <p className="text-xs text-muted-foreground">
              Current Status
            </p>

            <div className="mt-1">
              <StatusBadge
                status={
                  existingBgm.status
                }
              />
            </div>
          </div>

          {/* ACTION */}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(
                  `/data/worlds/bgms/${existingBgm.id}`,
                )
              }
              className="h-10 cursor-pointer px-4"
            >
              Cancel Changes
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={
                Boolean(
                  savingAction,
                )
              }
              onClick={() =>
                handleSave(
                  "DRAFT",
                )
              }
              className="h-10 cursor-pointer px-4"
            >
              {savingAction ===
              "DRAFT"
                ? "Saving..."
                : "Save as Draft"}
            </Button>

            <Button
              type="button"
              disabled={
                Boolean(
                  savingAction,
                )
              }
              onClick={() =>
                handleSave(
                  "PUBLISHED",
                )
              }
              className="h-10 cursor-pointer px-4"
            >
              {savingAction ===
              "PUBLISHED"
                ? "Publishing..."
                : existingBgm.status ===
                    "PUBLISHED"
                  ? "Publish Changes"
                  : "Publish BGM"}
            </Button>
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
        {label}

        {required && (
          <span className="text-destructive">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
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
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
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
/* STATUS                                                                     */
/* -------------------------------------------------------------------------- */

function StatusBadge({
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
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass(
  error = false,
) {
  return [
    "h-11 w-full rounded-lg border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground",

    error
      ? "border-destructive focus:border-destructive focus:ring-3 focus:ring-destructive/10"
      : "border-border focus:border-primary/40 focus:ring-3 focus:ring-primary/10",
  ].join(" ")
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function createSlug(
  value,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      "",
    )
    .replace(
      /\s+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    )
}

function formatDuration(
  seconds,
) {
  if (
    seconds == null ||
    Number.isNaN(
      Number(seconds),
    )
  ) {
    return "0:00"
  }

  const value =
    Math.max(
      0,
      Math.floor(
        Number(seconds),
      ),
    )

  const minutes =
    Math.floor(
      value / 60,
    )

  const remainingSeconds =
    value % 60

  return `${minutes}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`
}

function formatFileSize(
  bytes,
) {
  if (
    bytes == null
  ) {
    return "—"
  }

  if (!bytes) {
    return "0 B"
  }

  const mb =
    bytes /
    (1024 * 1024)

  if (mb >= 1) {
    return `${mb.toFixed(
      2,
    )} MB`
  }

  const kb =
    bytes / 1024

  return `${kb.toFixed(
    0,
  )} KB`
}
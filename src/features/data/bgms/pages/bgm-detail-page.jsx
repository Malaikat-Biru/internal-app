import {
  ArrowLeft,
  Edit3,
  FileAudio,
  ImageIcon,
  Pause,
  Play,
} from "lucide-react"

import {
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
/* MOCK DATA                                                                  */
/* -------------------------------------------------------------------------- */

const bgmRecords = [
  {
    id: "BGM-001",

    title: "Sofya City",

    slug: "sofya-city",

    coverUrl:
      "https://placehold.co/960x540/png?text=Sofya+City",

    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

    audioName:
      "sofya-city.mp3",

    audioSize:
      5242880,

    duration: 143,

    notes:
      "Background music yang digunakan untuk merepresentasikan suasana Sofya City.",

    status: "PUBLISHED",

    createdAt:
      "2026-07-20 14:24",

    updatedAt:
      "2026-08-10 14:42",
  },

  {
    id: "BGM-002",

    title: "Rakau Plains",

    slug: "rakau-plains",

    coverUrl:
      "https://placehold.co/960x540/png?text=Rakau+Plains",

    audioUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

    audioName:
      "rakau-plains.mp3",

    audioSize:
      4194304,

    duration: 167,

    notes: "",

    status: "PUBLISHED",

    createdAt:
      "2026-07-21 10:18",

    updatedAt:
      "2026-08-08 17:32",
  },

  {
    id: "BGM-006",

    title: "Hora Diomedea",

    slug: "hora-diomedea",

    coverUrl: null,

    audioUrl: null,

    audioName: null,

    audioSize: null,

    duration: null,

    notes:
      "Data BGM masih belum lengkap.",

    status: "DRAFT",

    createdAt:
      "2026-08-01 09:30",

    updatedAt:
      "2026-08-09 12:20",
  },
]

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function BgmDetailPage() {
  const navigate =
    useNavigate()

  const { id } =
    useParams()

  const audioRef =
    useRef(null)

  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false)

  const [
    currentTime,
    setCurrentTime,
  ] = useState(0)

  /* ---------------------------------------------------------------------- */
  /* DATA                                                                   */
  /* ---------------------------------------------------------------------- */

  const bgm =
    useMemo(() => {
      return (
        bgmRecords.find(
          (record) =>
            record.id === id,
        ) ||
        bgmRecords[0]
      )
    }, [id])

  /* ---------------------------------------------------------------------- */
  /* AUDIO                                                                  */
  /* ---------------------------------------------------------------------- */

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

  function handleTimeUpdate(
    event,
  ) {
    setCurrentTime(
      event.currentTarget
        .currentTime,
    )
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

  function handleEnded() {
    setIsPlaying(false)
    setCurrentTime(0)
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
            "/data/worlds/bgms",
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
        <div className="min-w-0">
          {/* BREADCRUMB */}

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

            <span className="truncate text-primary">
              {bgm.title}
            </span>
          </div>

          {/* TITLE */}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="truncate text-[30px] font-semibold tracking-[-0.04em] text-foreground">
              {bgm.title}
            </h1>

            <StatusBadge
              status={
                bgm.status
              }
            />
          </div>

          <p className="mt-2 max-w-[780px] text-sm leading-6 text-muted-foreground">
            Informasi BGM, cover visual, file audio, dan catatan
            yang tersimpan di database.
          </p>

          {/* META */}

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Created{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  bgm.createdAt,
                )}
              </span>
            </span>

            <span className="size-1 rounded-full bg-border" />

            <span>
              Last updated{" "}

              <span className="font-medium text-foreground">
                {formatDateTime(
                  bgm.updatedAt,
                )}
              </span>
            </span>
          </div>
        </div>

        {/* EDIT */}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(
              `/data/worlds/bgms/${bgm.id}/edit`,
            )
          }
          className="h-10 shrink-0 cursor-pointer gap-2 rounded-lg px-4 text-sm"
        >
          <Edit3 className="size-4" />

          Edit BGM
        </Button>
      </header>

      {/* ================================================================== */}
      {/* LARGE CARD                                                         */}
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
            {/* LEFT                                                         */}
            {/* ============================================================= */}

            <div className="border-t border-border">
              {/* NAME */}

              <InformationRow label="BGM Name">
                <span className="text-sm font-medium text-foreground">
                  {bgm.title}
                </span>
              </InformationRow>

              {/* SLUG */}

              <InformationRow label="Slug">
                <span className="text-sm text-muted-foreground">
                  /{bgm.slug}
                </span>
              </InformationRow>

              {/* DURATION */}

              <InformationRow
                label="Duration"
                last
              >
                <span
                  className={[
                    "text-sm",

                    bgm.duration !=
                    null
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {bgm.duration !=
                  null
                    ? formatDuration(
                        bgm.duration,
                      )
                    : "No audio"}
                </span>
              </InformationRow>
            </div>

            {/* ============================================================= */}
            {/* RIGHT — COVER                                                */}
            {/* ============================================================= */}

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">
                Cover Image
              </p>

              {bgm.coverUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                  <img
                    src={
                      bgm.coverUrl
                    }
                    alt={`${bgm.title} cover`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-muted/[0.08]">
                  <div className="text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-background text-muted-foreground">
                      <ImageIcon className="size-5" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-foreground">
                      No cover image
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 02 AUDIO                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="02"
            title="Audio"
            description="File audio BGM yang dapat didengarkan."
          />

          {bgm.audioUrl ? (
            <div className="mt-6 rounded-xl border border-border">
              {/* =========================================================== */}
              {/* FILE INFO                                                   */}
              {/* =========================================================== */}

              <div className="flex items-center justify-between gap-6 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                    <FileAudio className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {bgm.audioName ||
                        `${bgm.slug}.mp3`}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      {bgm.audioSize !=
                        null && (
                        <>
                          <span>
                            {formatFileSize(
                              bgm.audioSize,
                            )}
                          </span>

                          <span>
                            ·
                          </span>
                        </>
                      )}

                      <span>
                        {bgm.duration !=
                        null
                          ? formatDuration(
                              bgm.duration,
                            )
                          : "Unknown duration"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================== */}
              {/* PLAYER                                                      */}
              {/* =========================================================== */}

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
                    bgm.duration ||
                    0
                  }
                  step="0.1"
                  value={
                    Math.min(
                      currentTime,
                      bgm.duration ||
                        0,
                    )
                  }
                  disabled={
                    !bgm.duration
                  }
                  onChange={
                    handleSeek
                  }
                  className="h-1.5 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-default"
                />

                <span className="w-[42px] shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
                  {bgm.duration !=
                  null
                    ? formatDuration(
                        bgm.duration,
                      )
                    : "0:00"}
                </span>

                <audio
                  ref={
                    audioRef
                  }
                  src={
                    bgm.audioUrl
                  }
                  preload="metadata"
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
                    handleEnded
                  }
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.06]">
              <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <FileAudio className="size-5" />
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  No audio file
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Audio belum ditambahkan untuk BGM ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 03 NOTES                                                         */}
        {/* ================================================================= */}

        <div className="border-t border-border p-6">
          <SectionTitle
            number="03"
            title="BGM Notes"
            description="Informasi tambahan mengenai BGM."
            optional={!bgm.notes}
          />

          <div className="mt-6 pl-[46px]">
            {bgm.notes ? (
              <p className="max-w-[900px] whitespace-pre-wrap text-sm leading-7 text-foreground">
                {bgm.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional notes for this BGM.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="h-10" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INFORMATION ROW                                                            */
/* -------------------------------------------------------------------------- */

function InformationRow({
  label,
  children,
  last = false,
}) {
  return (
    <div
      className={[
        "grid grid-cols-[160px_minmax(0,1fr)] items-center gap-5 py-4",

        !last
          ? "border-b border-border"
          : "",
      ].join(" ")}
    >
      <p className="text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <div className="min-w-0">
        {children}
      </div>
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
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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

  if (
    mb >= 1
  ) {
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

function formatDateTime(
  value,
) {
  if (!value) {
    return "—"
  }

  const date =
    new Date(
      value.replace(
        " ",
        "T",
      ),
    )

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    "en-GB",
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
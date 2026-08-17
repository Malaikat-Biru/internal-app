import {
  Check,
  ChevronDown,
  MapPinned,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NormalMonsterForm({
  data,
  setForm,
  elementOptions,
  mapOptions,
  itemOptions,
  createLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateNormal(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,
          [field]: value,
        },
      }),
    )
  }

  function updateVariant(
    id,
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,

          variants:
            current.normal.variants.map(
              (variant) =>
                variant.id === id
                  ? {
                      ...variant,
                      [field]: value,
                    }
                  : variant,
            ),
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* VARIANT                                                                */
  /* ---------------------------------------------------------------------- */

  function addVariant() {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,

          variants: [
            ...current.normal.variants,

            {
              id: createLocalId(),

              level: "",
              hp: "",
              exp: "",

              element: "",
              mapId: "",

              drops: [],
            },
          ],
        },
      }),
    )
  }

  function removeVariant(
    id,
  ) {
    setForm(
      (current) => {
        if (
          current.normal.variants
            .length <= 1
        ) {
          return current
        }

        return {
          ...current,

          normal: {
            ...current.normal,

            variants:
              current.normal.variants.filter(
                (variant) =>
                  variant.id !== id,
              ),
          },
        }
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* DROP                                                                   */
  /* ---------------------------------------------------------------------- */

  function addDrop(
    variantId,
    itemId,
  ) {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,

          variants:
            current.normal.variants.map(
              (variant) => {
                if (
                  variant.id !==
                  variantId
                ) {
                  return variant
                }

                if (
                  variant.drops.includes(
                    itemId,
                  )
                ) {
                  return variant
                }

                return {
                  ...variant,

                  drops: [
                    ...variant.drops,
                    itemId,
                  ],
                }
              },
            ),
        },
      }),
    )
  }

  function removeDrop(
    variantId,
    itemId,
  ) {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,

          variants:
            current.normal.variants.map(
              (variant) =>
                variant.id ===
                variantId
                  ? {
                      ...variant,

                      drops:
                        variant.drops.filter(
                          (id) =>
                            id !==
                            itemId,
                        ),
                    }
                  : variant,
            ),
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* TAMING                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateTamable(
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        normal: {
          ...current.normal,

          tamable: value,

          requirement:
            value
              ? current.normal
                  .requirement
              : "",

          petUse:
            value
              ? current.normal
                  .petUse
              : "",
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      {/* ================================================================== */}
      {/* 02 MONSTER VARIANTS                                                */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        <div className="flex items-start justify-between gap-6">
          <SectionTitle
            number="02"
            title="Monster Variants"
            description="Level, stats, element, lokasi spawn, dan item drop untuk setiap variant."
          />

          <Button
            type="button"
            variant="outline"
            onClick={addVariant}
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Variant
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {data.variants.map(
            (
              variant,
              index,
            ) => (
              <div
                key={variant.id}
                className="overflow-visible rounded-xl border border-border"
              >
                {/* ========================================================= */}
                {/* HEADER                                                    */}
                {/* ========================================================= */}

                <div className="flex items-center justify-between border-b border-border bg-muted/20 px-5 py-3.5">
                  <p className="text-sm font-semibold text-foreground">
                    Variant{" "}
                    {index + 1}
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={
                      data.variants
                        .length <= 1
                    }
                    onClick={() =>
                      removeVariant(
                        variant.id,
                      )
                    }
                    className="size-8 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* ========================================================= */}
                {/* FORM                                                      */}
                {/* ========================================================= */}

                <div className="p-5">
                  <div className="grid grid-cols-3 gap-5">
                    {/* LEVEL */}

                    <NumberField
                      label="Level"
                      required
                      value={variant.level}
                      placeholder="15"
                      onChange={(
                        value,
                      ) =>
                        updateVariant(
                          variant.id,
                          "level",
                          value,
                        )
                      }
                    />

                    {/* HP */}

                    <NumberField
                      label="HP"
                      required
                      value={variant.hp}
                      placeholder="320"
                      onChange={(
                        value,
                      ) =>
                        updateVariant(
                          variant.id,
                          "hp",
                          value,
                        )
                      }
                    />

                    {/* EXP */}

                    <NumberField
                      label="EXP"
                      value={variant.exp}
                      placeholder="12"
                      onChange={(
                        value,
                      ) =>
                        updateVariant(
                          variant.id,
                          "exp",
                          value,
                        )
                      }
                    />

                    {/* ELEMENT */}

                    <Field>
                      <FieldLabel required>
                        Element
                      </FieldLabel>

                      <SelectMenu
                        value={
                          variant.element
                        }
                        options={
                          elementOptions
                        }
                        placeholder="Select element"
                        onChange={(
                          value,
                        ) =>
                          updateVariant(
                            variant.id,
                            "element",
                            value,
                          )
                        }
                      />
                    </Field>

                    {/* SPAWN MAP */}

                    <div className="col-span-2">
                      <Field>
                        <FieldLabel required>
                          Spawn Map
                        </FieldLabel>

                        <SearchableSelect
                          value={
                            variant.mapId
                          }
                          options={
                            mapOptions
                          }
                          icon={MapPinned}
                          placeholder="Search map..."
                          onChange={(
                            value,
                          ) =>
                            updateVariant(
                              variant.id,
                              "mapId",
                              value,
                            )
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  {/* ======================================================= */}
                  {/* DROPS                                                   */}
                  {/* ======================================================= */}

                  <div className="mt-6 border-t border-border pt-5">
                    <FieldLabel>
                      Item Drops
                    </FieldLabel>

                    <DropsEditor
                      value={
                        variant.drops
                      }
                      itemOptions={
                        itemOptions
                      }
                      onAdd={(
                        itemId,
                      ) =>
                        addDrop(
                          variant.id,
                          itemId,
                        )
                      }
                      onRemove={(
                        itemId,
                      ) =>
                        removeDrop(
                          variant.id,
                          itemId,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 03 TAMING                                                          */}
      {/* ================================================================== */}

      <div className="border-t border-border p-6">
        {/* ================================================================= */}
        {/* HEADER + TAMABLE                                                  */}
        {/* ================================================================= */}

        <div className="flex items-start justify-between gap-8">
          <SectionTitle
            number="03"
            title="Taming"
            description="Informasi taming untuk monster yang dapat dijadikan pet."
          />

          <div className="flex shrink-0 items-center gap-5 pt-1">
            <span className="text-sm font-medium text-foreground">
              Tamable
            </span>

            <div className="flex items-center gap-5">
              <RadioOption
                checked={data.tamable}
                label="Yes"
                onClick={() =>
                  updateTamable(true)
                }
              />

              <RadioOption
                checked={
                  !data.tamable
                }
                label="No"
                onClick={() =>
                  updateTamable(false)
                }
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* TAMING DATA                                                       */}
        {/* ================================================================= */}

        {data.tamable && (
          <div className="mt-6 grid grid-cols-2 gap-6">
            {/* REQUIREMENT */}

            <Field>
              <FieldLabel>
                Requirement
              </FieldLabel>

              <textarea
                value={
                  data.requirement
                }
                onChange={(
                  event,
                ) =>
                  updateNormal(
                    "requirement",
                    event.target.value,
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Example: Character level should be higher than monster level."
                className={textareaClass()}
              />

              <FieldHint>
                Syarat atau kondisi untuk melakukan taming.
              </FieldHint>
            </Field>

            {/* PET USE */}

            <Field>
              <FieldLabel>
                Pet Use
              </FieldLabel>

              <textarea
                value={
                  data.petUse
                }
                onChange={(
                  event,
                ) =>
                  updateNormal(
                    "petUse",
                    event.target.value,
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Example: Useful for pet collection or early pet setup."
                className={textareaClass()}
              />

              <FieldHint>
                Informasi kegunaan monster ketika menjadi pet.
              </FieldHint>
            </Field>
          </div>
        )}

        {/* ================================================================= */}
        {/* NOT TAMABLE                                                       */}
        {/* ================================================================= */}

        {!data.tamable && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">
              No taming information available.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* RADIO OPTION                                                               */
/* -------------------------------------------------------------------------- */

function RadioOption({
  checked,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
      className="flex cursor-pointer items-center gap-2.5"
    >
      <span
        className={[
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",

          checked
            ? "border-primary"
            : "border-border",
        ].join(" ")}
      >
        {checked && (
          <span className="size-2.5 rounded-full bg-primary" />
        )}
      </span>

      <span
        className={[
          "text-sm transition-colors",

          checked
            ? "font-medium text-foreground"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* DROPS                                                                      */
/* -------------------------------------------------------------------------- */

function DropsEditor({
  value,
  itemOptions,
  onAdd,
  onRemove,
}) {
  const available =
    itemOptions.filter(
      (item) =>
        !value.includes(
          item.id,
        ),
    )

  return (
    <div>
      <SearchableSelect
        value=""
        options={available}
        icon={Package}
        placeholder="Search item to add..."
        onChange={(
          itemId,
        ) => {
          if (itemId) {
            onAdd(itemId)
          }
        }}
      />

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map(
            (itemId) => {
              const item =
                itemOptions.find(
                  (candidate) =>
                    candidate.id ===
                    itemId,
                )

              if (!item) {
                return null
              }

              return (
                <div
                  key={item.id}
                  className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/20 pl-3 pr-1.5"
                >
                  <Package className="size-3.5 shrink-0 text-muted-foreground" />

                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(
                        item.id,
                      )
                    }
                    className="flex size-6 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )
            },
          )}
        </div>
      )}
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
  placeholder,
  icon: Icon = Search,
}) {
  const rootRef =
    useRef(null)

  const inputRef =
    useRef(null)

  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    search,
    setSearch,
  ] = useState("")

  const selected =
    options.find(
      (option) =>
        option.id === value,
    ) || null

  const filtered =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase()

      if (!keyword) {
        return options.slice(
          0,
          20,
        )
      }

      return options
        .filter(
          (option) =>
            option.name
              .toLowerCase()
              .includes(
                keyword,
              ),
        )
        .slice(
          0,
          20,
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
        rootRef.current &&
        !rootRef.current.contains(
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
    if (!open) {
      return
    }

    const timeout =
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)

    return () =>
      clearTimeout(timeout)
  }, [open])

  function selectOption(
    option,
  ) {
    onChange(option.id)

    setOpen(false)
    setSearch("")
  }

  return (
    <div
      ref={rootRef}
      className="relative min-w-0"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
          className={[
            "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border px-3.5 text-left outline-none transition-all",

            selected
              ? "bg-background"
              : "bg-muted/20",

            open
              ? "border-primary/40 ring-3 ring-primary/10"
              : "hover:bg-muted/30",
          ].join(" ")}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />

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

          <ChevronDown
            className={[
              "size-4 shrink-0 text-muted-foreground transition-transform",

              open
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>

        {selected && (
          <button
            type="button"
            onClick={(
              event,
            ) => {
              event.stopPropagation()

              onChange("")
            }}
            className="absolute right-9 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
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
                placeholder="Search..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
              />
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto p-1.5">
            {filtered.length >
            0 ? (
              filtered.map(
                (option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      selectOption(
                        option,
                      )
                    }
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {option.name}
                    </span>

                    {option.id ===
                      value && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center px-4">
                <p className="text-xs text-muted-foreground">
                  No data found.
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
            "truncate text-sm",

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
                {option.label}
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

function FieldHint({
  children,
}) {
  return (
    <p className="mt-2 text-xs leading-5 text-muted-foreground">
      {children}
    </p>
  )
}

/* -------------------------------------------------------------------------- */
/* NUMBER FIELD                                                               */
/* -------------------------------------------------------------------------- */

function NumberField({
  label,
  required = false,
  value,
  placeholder,
  onChange,
}) {
  return (
    <Field>
      <FieldLabel
        required={required}
      >
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className={inputClass()}
      />
    </Field>
  )
}

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass() {
  return "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

/* -------------------------------------------------------------------------- */
/* TEXTAREA                                                                   */
/* -------------------------------------------------------------------------- */

function textareaClass() {
  return "min-h-[120px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}
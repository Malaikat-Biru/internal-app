import {
  Award,
  Check,
  ChevronDown,
  Gift,
  Hammer,
  Package,
  Plus,
  Search,
  Sparkles,
  Swords,
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

/* -------------------------------------------------------------------------- */
/* WEAPON TYPE                                                                */
/* -------------------------------------------------------------------------- */

const weaponTypeOptions = [
  {
    value: "ONE_HANDED_SWORD",
    label: "One-Handed Sword",
  },
  {
    value: "TWO_HANDED_SWORD",
    label: "Two-Handed Sword",
  },
  {
    value: "BOW",
    label: "Bow",
  },
  {
    value: "BOWGUN",
    label: "Bowgun",
  },
  {
    value: "STAFF",
    label: "Staff",
  },
  {
    value: "MAGIC_DEVICE",
    label: "Magic Device",
  },
  {
    value: "KNUCKLES",
    label: "Knuckles",
  },
  {
    value: "HALBERD",
    label: "Halberd",
  },
  {
    value: "KATANA",
    label: "Katana",
  },
]

/* -------------------------------------------------------------------------- */
/* ELEMENT                                                                    */
/* -------------------------------------------------------------------------- */

const elementOptions = [
  {
    value: "NONE",
    label: "None",
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
/* CONDITIONAL                                                                */
/* -------------------------------------------------------------------------- */

const conditionOptions = [
  {
    value: "WITH_SHIELD",
    label: "With Shield",
  },
  {
    value: "WITH_DAGGER",
    label: "With Dagger",
  },
  {
    value: "WITH_ARROW",
    label: "With Arrow",
  },
  {
    value: "WITH_MAGIC_DEVICE",
    label: "With Magic Device",
  },
  {
    value: "WITH_KNUCKLES",
    label: "With Knuckles",
  },
  {
    value: "WITH_NINJUTSU_SCROLL",
    label: "With Ninjutsu Scroll",
  },
  {
    value: "WITHOUT_SUB_WEAPON",
    label: "Without Sub Weapon",
  },
]

/* -------------------------------------------------------------------------- */
/* PROCESS                                                                    */
/* -------------------------------------------------------------------------- */

const materialTypeOptions = [
  {
    value: "METAL",
    label: "Metal",
  },
  {
    value: "CLOTH",
    label: "Cloth",
  },
  {
    value: "BEAST",
    label: "Beast",
  },
  {
    value: "WOOD",
    label: "Wood",
  },
  {
    value: "MEDICINE",
    label: "Medicine",
  },
  {
    value: "MANA",
    label: "Mana",
  },
]

/* -------------------------------------------------------------------------- */
/* REWARD                                                                     */
/* -------------------------------------------------------------------------- */

const rewardTypeOptions = [
  {
    value: "QUEST",
    label: "Quest Reward",
  },
  {
    value: "EMBLEM",
    label: "Emblem Reward",
  },
  {
    value: "EVENT",
    label: "Event Reward",
  },
  {
    value: "ACHIEVEMENT",
    label: "Achievement Reward",
  },
  {
    value: "LOGIN",
    label: "Login Reward",
  },
  {
    value: "MISSION",
    label: "Mission Reward",
  },
  {
    value: "OTHER",
    label: "Other Reward",
  },
]

/* -------------------------------------------------------------------------- */
/* MOCK MONSTERS                                                              */
/* -------------------------------------------------------------------------- */

const defaultMonsterOptions = [
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
    name: "Goblin",
    type: "NORMAL",
    level: 20,
  },
  {
    id: "MONSTER-004",
    name: "Colon",
    type: "NORMAL",
    level: 1,
  },
  {
    id: "MONSTER-005",
    name: "Warmonger",
    type: "MINI_BOSS",
    level: 54,
  },
]

/* -------------------------------------------------------------------------- */
/* LOCAL ID                                                                   */
/* -------------------------------------------------------------------------- */

function generateLocalId() {
  return `LOCAL-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

/* -------------------------------------------------------------------------- */
/* VERSION FACTORY                                                            */
/* -------------------------------------------------------------------------- */

function createObtainedVersion() {
  return {
    id: generateLocalId(),

    type: "OBTAINED",

    baseAtk: "",
    stability: "",
    element: "NONE",

    additionalStats: [],
    conditionalStats: [],

    acquisitionSources: [],

    process: {
      materialType: "",
      points: "",
    },

    sellPrice: "",
  }
}

function createNpcCraftVersion() {
  return {
    id: generateLocalId(),

    type: "NPC_CRAFT",

    baseAtk: "",
    stability: "",
    element: "NONE",

    additionalStats: [],
    conditionalStats: [],

    process: {
      materialType: "",
      points: "",
    },

    sellPrice: "",

    recipe: {
      materials: [],
      craftFee: "",
    },
  }
}

function createPlayerCraftVersion() {
  return {
    id: generateLocalId(),

    type: "PLAYER_CRAFT",

    baseAtk: "",
    stability: "",

    basePotential: "",

    process: {
      materialType: "",
      points: "",
    },

    sellPrice: "",

    recipe: {
      materials: [],

      craftLevel: "",

      difficulty: "",
    },
  }
}

/* -------------------------------------------------------------------------- */
/* ACQUISITION FACTORY                                                        */
/* -------------------------------------------------------------------------- */

function createMonsterDropSource(
  createLocalId,
) {
  return {
    id: createLocalId(),

    type: "MONSTER_DROP",

    monsterId: "",
  }
}

function createEventExchangeSource(
  createLocalId,
) {
  return {
    id: createLocalId(),

    type:
      "EVENT_POINT_EXCHANGE",

    eventName: "",

    pointName: "",

    requiredPoints: "",
  }
}

function createRewardSource(
  createLocalId,
) {
  return {
    id: createLocalId(),

    type: "REWARD",

    rewardType: "QUEST",

    name: "",

    description: "",

    quantity: 1,
  }
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function WeaponForm({
  data,
  setForm,
  itemOptions = [],
  monsterOptions = defaultMonsterOptions,
  createLocalId = generateLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* SAFE DATA                                                              */
  /* ---------------------------------------------------------------------- */

  const versions =
    Array.isArray(
      data?.versions,
    )
      ? data.versions
      : []

  const obtainedVersion =
    versions.find(
      (version) =>
        version.type ===
        "OBTAINED",
    )

  const npcCraftVersion =
    versions.find(
      (version) =>
        version.type ===
        "NPC_CRAFT",
    )

  const playerCraftVersion =
    versions.find(
      (version) =>
        version.type ===
        "PLAYER_CRAFT",
    )

  /* ---------------------------------------------------------------------- */
  /* WEAPON                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateWeaponField(
    field,
    value,
  ) {
    setForm(
      (current) => ({
        ...current,

        weapon: {
          ...current.weapon,

          [field]: value,
        },
      }),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* VERSION                                                                */
  /* ---------------------------------------------------------------------- */

  function addVersion(
    type,
  ) {
    if (
      type ===
        "OBTAINED" &&
      obtainedVersion
    ) {
      return
    }

    if (
      type ===
        "NPC_CRAFT" &&
      npcCraftVersion
    ) {
      return
    }

    if (
      type ===
        "PLAYER_CRAFT" &&
      playerCraftVersion
    ) {
      return
    }

    let newVersion = null

    if (
      type ===
      "OBTAINED"
    ) {
      newVersion =
        createObtainedVersion()
    }

    if (
      type ===
      "NPC_CRAFT"
    ) {
      newVersion =
        createNpcCraftVersion()
    }

    if (
      type ===
      "PLAYER_CRAFT"
    ) {
      newVersion =
        createPlayerCraftVersion()
    }

    if (!newVersion) {
      return
    }

    updateWeaponField(
      "versions",
      [
        ...versions,
        newVersion,
      ],
    )
  }

  function removeVersion(
    type,
  ) {
    updateWeaponField(
      "versions",
      versions.filter(
        (version) =>
          version.type !==
          type,
      ),
    )
  }

  function updateVersion(
    versionId,
    field,
    value,
  ) {
    updateWeaponField(
      "versions",
      versions.map(
        (version) =>
          version.id ===
          versionId
            ? {
                ...version,

                [field]:
                  value,
              }
            : version,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* ACQUISITION SOURCES                                                    */
  /* ---------------------------------------------------------------------- */

  function addAcquisitionSource(
    version,
    type,
  ) {
    const sources =
      Array.isArray(
        version.acquisitionSources,
      )
        ? version.acquisitionSources
        : []

    let source = null

    switch (type) {
      case "MONSTER_DROP":
        source =
          createMonsterDropSource(
            createLocalId,
          )
        break

      case "EVENT_POINT_EXCHANGE":
        source =
          createEventExchangeSource(
            createLocalId,
          )
        break

      case "REWARD":
        source =
          createRewardSource(
            createLocalId,
          )
        break

      default:
        return
    }

    updateVersion(
      version.id,
      "acquisitionSources",
      [
        ...sources,
        source,
      ],
    )
  }

  function updateAcquisitionSource(
    version,
    sourceId,
    field,
    value,
  ) {
    const sources =
      Array.isArray(
        version.acquisitionSources,
      )
        ? version.acquisitionSources
        : []

    updateVersion(
      version.id,
      "acquisitionSources",
      sources.map(
        (source) =>
          source.id ===
          sourceId
            ? {
                ...source,

                [field]:
                  value,
              }
            : source,
      ),
    )
  }

  function removeAcquisitionSource(
    version,
    sourceId,
  ) {
    const sources =
      Array.isArray(
        version.acquisitionSources,
      )
        ? version.acquisitionSources
        : []

    updateVersion(
      version.id,
      "acquisitionSources",
      sources.filter(
        (source) =>
          source.id !==
          sourceId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* PROCESS                                                                */
  /* ---------------------------------------------------------------------- */

  function updateProcess(
    version,
    field,
    value,
  ) {
    updateVersion(
      version.id,
      "process",
      {
        ...version.process,

        [field]:
          value,
      },
    )
  }

  /* ---------------------------------------------------------------------- */
  /* ADDITIONAL STAT                                                        */
  /* ---------------------------------------------------------------------- */

  function addAdditionalStat(
    version,
  ) {
    const stats =
      Array.isArray(
        version.additionalStats,
      )
        ? version.additionalStats
        : []

    updateVersion(
      version.id,
      "additionalStats",
      [
        ...stats,

        {
          id:
            createLocalId(),

          stat: "",

          value: "",
        },
      ],
    )
  }

  function updateAdditionalStat(
    version,
    statId,
    field,
    value,
  ) {
    updateVersion(
      version.id,
      "additionalStats",
      version.additionalStats.map(
        (stat) =>
          stat.id === statId
            ? {
                ...stat,

                [field]:
                  value,
              }
            : stat,
      ),
    )
  }

  function removeAdditionalStat(
    version,
    statId,
  ) {
    updateVersion(
      version.id,
      "additionalStats",
      version.additionalStats.filter(
        (stat) =>
          stat.id !==
          statId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* CONDITIONAL STAT                                                       */
  /* ---------------------------------------------------------------------- */

  function addConditionalStat(
    version,
  ) {
    const stats =
      Array.isArray(
        version.conditionalStats,
      )
        ? version.conditionalStats
        : []

    updateVersion(
      version.id,
      "conditionalStats",
      [
        ...stats,

        {
          id:
            createLocalId(),

          condition: "",

          stat: "",

          value: "",
        },
      ],
    )
  }

  function updateConditionalStat(
    version,
    statId,
    field,
    value,
  ) {
    updateVersion(
      version.id,
      "conditionalStats",
      version.conditionalStats.map(
        (stat) =>
          stat.id ===
          statId
            ? {
                ...stat,

                [field]:
                  value,
              }
            : stat,
      ),
    )
  }

  function removeConditionalStat(
    version,
    statId,
  ) {
    updateVersion(
      version.id,
      "conditionalStats",
      version.conditionalStats.filter(
        (stat) =>
          stat.id !==
          statId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RECIPE                                                                 */
  /* ---------------------------------------------------------------------- */

  function updateRecipe(
    version,
    field,
    value,
  ) {
    updateVersion(
      version.id,
      "recipe",
      {
        ...version.recipe,

        [field]:
          value,
      },
    )
  }

  function addRecipeMaterial(
    version,
    itemId,
  ) {
    const materials =
      Array.isArray(
        version.recipe
          ?.materials,
      )
        ? version.recipe.materials
        : []

    const exists =
      materials.some(
        (material) =>
          material.itemId ===
          itemId,
      )

    if (exists) {
      return
    }

    updateRecipe(
      version,
      "materials",
      [
        ...materials,

        {
          id:
            createLocalId(),

          itemId,

          quantity: 1,
        },
      ],
    )
  }

  function updateRecipeMaterial(
    version,
    materialId,
    quantity,
  ) {
    updateRecipe(
      version,
      "materials",
      version.recipe.materials.map(
        (material) =>
          material.id ===
          materialId
            ? {
                ...material,

                quantity,
              }
            : material,
      ),
    )
  }

  function removeRecipeMaterial(
    version,
    materialId,
  ) {
    updateRecipe(
      version,
      "materials",
      version.recipe.materials.filter(
        (material) =>
          material.id !==
          materialId,
      ),
    )
  }

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="border-t border-border p-6">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <SectionTitle
        number="02"
        title="Weapon Data"
        description="Tentukan jenis weapon dan seluruh versi data item yang tersedia."
      />

      {/* ================================================================== */}
      {/* WEAPON TYPE                                                        */}
      {/* ================================================================== */}

      <div className="mt-6 max-w-[420px]">
        <Field>
          <FieldLabel required>
            Weapon Type
          </FieldLabel>

          <SelectMenu
            value={
              data?.type || ""
            }
            options={
              weaponTypeOptions
            }
            placeholder="Select weapon type"
            onChange={(
              value,
            ) =>
              updateWeaponField(
                "type",
                value,
              )
            }
          />
        </Field>
      </div>

      {/* ================================================================== */}
      {/* VERSIONS                                                           */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Acquisition Versions
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Tambahkan versi weapon sesuai cara item tersedia di dalam game.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {/* OBTAINED */}

          <VersionButton
            icon={Swords}
            title="Obtained Version"
            description="Drop, exchange, reward, atau sumber non-craft."
            active={
              Boolean(
                obtainedVersion,
              )
            }
            onAdd={() =>
              addVersion(
                "OBTAINED",
              )
            }
            onRemove={() =>
              removeVersion(
                "OBTAINED",
              )
            }
          />

          {/* NPC */}

          <VersionButton
            icon={Hammer}
            title="NPC Craft Version"
            description="Weapon yang dibuat melalui NPC Blacksmith."
            active={
              Boolean(
                npcCraftVersion,
              )
            }
            onAdd={() =>
              addVersion(
                "NPC_CRAFT",
              )
            }
            onRemove={() =>
              removeVersion(
                "NPC_CRAFT",
              )
            }
          />

          {/* PLAYER */}

          <VersionButton
            icon={Sparkles}
            title="Player Craft Version"
            description="Weapon yang dapat dibuat melalui Player Smith."
            active={
              Boolean(
                playerCraftVersion,
              )
            }
            onAdd={() =>
              addVersion(
                "PLAYER_CRAFT",
              )
            }
            onRemove={() =>
              removeVersion(
                "PLAYER_CRAFT",
              )
            }
          />
        </div>

        {versions.length ===
          0 && (
          <div className="mt-5 flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.06] px-6">
            <p className="text-xs text-muted-foreground">
              Tambahkan minimal satu versi untuk mulai mengisi data weapon.
            </p>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* OBTAINED                                                           */}
      {/* ================================================================== */}

      {obtainedVersion && (
        <div className="mt-8">
          <VersionSectionHeader
            icon={Swords}
            label="OBTAINED"
            title="Obtained Version"
            description="Data weapon yang diperoleh melalui drop, exchange, reward, atau sumber non-craft lainnya."
          />

          <div className="mt-5 border-l-2 border-primary/20 pl-6">
            <WeaponVersionFields
              version={
                obtainedVersion
              }
              monsterOptions={
                monsterOptions
              }
              itemOptions={
                itemOptions
              }
              updateVersion={
                updateVersion
              }
              updateProcess={
                updateProcess
              }
              addAcquisitionSource={
                addAcquisitionSource
              }
              updateAcquisitionSource={
                updateAcquisitionSource
              }
              removeAcquisitionSource={
                removeAcquisitionSource
              }
              addAdditionalStat={
                addAdditionalStat
              }
              updateAdditionalStat={
                updateAdditionalStat
              }
              removeAdditionalStat={
                removeAdditionalStat
              }
              addConditionalStat={
                addConditionalStat
              }
              updateConditionalStat={
                updateConditionalStat
              }
              removeConditionalStat={
                removeConditionalStat
              }
              updateRecipe={
                updateRecipe
              }
              addRecipeMaterial={
                addRecipeMaterial
              }
              updateRecipeMaterial={
                updateRecipeMaterial
              }
              removeRecipeMaterial={
                removeRecipeMaterial
              }
            />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* NPC CRAFT                                                          */}
      {/* ================================================================== */}

      {npcCraftVersion && (
        <div
          className={[
            "mt-8",

            obtainedVersion
              ? "border-t border-border pt-8"
              : "",
          ].join(" ")}
        >
          <VersionSectionHeader
            icon={Hammer}
            label="NPC CRAFT"
            title="NPC Craft Version"
            description="Data weapon hasil craft melalui NPC Blacksmith."
          />

          <div className="mt-5 border-l-2 border-primary/40 pl-6">
            <WeaponVersionFields
              version={
                npcCraftVersion
              }
              monsterOptions={
                monsterOptions
              }
              itemOptions={
                itemOptions
              }
              updateVersion={
                updateVersion
              }
              updateProcess={
                updateProcess
              }
              addAcquisitionSource={
                addAcquisitionSource
              }
              updateAcquisitionSource={
                updateAcquisitionSource
              }
              removeAcquisitionSource={
                removeAcquisitionSource
              }
              addAdditionalStat={
                addAdditionalStat
              }
              updateAdditionalStat={
                updateAdditionalStat
              }
              removeAdditionalStat={
                removeAdditionalStat
              }
              addConditionalStat={
                addConditionalStat
              }
              updateConditionalStat={
                updateConditionalStat
              }
              removeConditionalStat={
                removeConditionalStat
              }
              updateRecipe={
                updateRecipe
              }
              addRecipeMaterial={
                addRecipeMaterial
              }
              updateRecipeMaterial={
                updateRecipeMaterial
              }
              removeRecipeMaterial={
                removeRecipeMaterial
              }
            />
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* PLAYER CRAFT                                                       */}
      {/* ================================================================== */}

      {playerCraftVersion && (
        <div
          className={[
            "mt-8",

            obtainedVersion ||
            npcCraftVersion
              ? "border-t border-border pt-8"
              : "",
          ].join(" ")}
        >
          <VersionSectionHeader
            icon={Sparkles}
            label="PLAYER CRAFT"
            title="Player Craft Version"
            description="Data weapon yang dapat dibuat melalui Player Smith dan memiliki Base Potential."
          />

          <div className="mt-5 border-l-2 border-primary/50 pl-6">
            <PlayerCraftVersionFields
              version={
                playerCraftVersion
              }
              itemOptions={
                itemOptions
              }
              updateVersion={
                updateVersion
              }
              updateProcess={
                updateProcess
              }
              updateRecipe={
                updateRecipe
              }
              addRecipeMaterial={
                addRecipeMaterial
              }
              updateRecipeMaterial={
                updateRecipeMaterial
              }
              removeRecipeMaterial={
                removeRecipeMaterial
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* OBTAINED / NPC VERSION FIELDS                                              */
/* -------------------------------------------------------------------------- */

function WeaponVersionFields({
  version,

  monsterOptions,
  itemOptions,

  updateVersion,
  updateProcess,

  addAcquisitionSource,
  updateAcquisitionSource,
  removeAcquisitionSource,

  addAdditionalStat,
  updateAdditionalStat,
  removeAdditionalStat,

  addConditionalStat,
  updateConditionalStat,
  removeConditionalStat,

  updateRecipe,
  addRecipeMaterial,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  const isObtained =
    version.type ===
    "OBTAINED"

  const isNpcCraft =
    version.type ===
    "NPC_CRAFT"

  const acquisitionSources =
    Array.isArray(
      version.acquisitionSources,
    )
      ? version.acquisitionSources
      : []

  return (
    <div>
      {/* ================================================================== */}
      {/* BASE ATTRIBUTES                                                    */}
      {/* ================================================================== */}

      <div>
        <SubsectionTitle
          title="Base Attributes"
        />

        <div className="mt-4 grid grid-cols-3 gap-5">
          <NumberField
            label="Base ATK"
            required
            value={
              version.baseAtk
            }
            placeholder="100"
            onChange={(
              value,
            ) =>
              updateVersion(
                version.id,
                "baseAtk",
                value,
              )
            }
          />

          <PercentageField
            label="Stability"
            value={
              version.stability
            }
            onChange={(
              value,
            ) =>
              updateVersion(
                version.id,
                "stability",
                value,
              )
            }
          />

          <Field>
            <FieldLabel>
              Element
            </FieldLabel>

            <SelectMenu
              value={
                version.element
              }
              options={
                elementOptions
              }
              placeholder="Select element"
              onChange={(
                value,
              ) =>
                updateVersion(
                  version.id,
                  "element",
                  value,
                )
              }
            />
          </Field>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ADDITIONAL STATS                                                   */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-6">
          <SubsectionTitle
            title="Additional Stats"
            optional
          />

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addAdditionalStat(
                version,
              )
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Stat
          </Button>
        </div>

        {version.additionalStats
          .length > 0 ? (
          <div className="mt-4 space-y-3">
            {version.additionalStats.map(
              (
                stat,
                index,
              ) => (
                <div
                  key={
                    stat.id
                  }
                  className="grid grid-cols-[32px_minmax(0,1fr)_280px_40px] items-center gap-4"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                    {index +
                      1}
                  </div>

                  <input
                    type="text"
                    value={
                      stat.stat
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAdditionalStat(
                        version,
                        stat.id,
                        "stat",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Example: Critical Rate"
                    className={inputClass()}
                  />

                  <input
                    type="text"
                    value={
                      stat.value
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAdditionalStat(
                        version,
                        stat.id,
                        "value",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Example: +20"
                    className={inputClass()}
                  />

                  <DeleteButton
                    onClick={() =>
                      removeAdditionalStat(
                        version,
                        stat.id,
                      )
                    }
                  />
                </div>
              ),
            )}
          </div>
        ) : (
          <EmptyInline text="No additional stats." />
        )}
      </div>

      {/* ================================================================== */}
      {/* CONDITIONAL STATS                                                  */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-center justify-between gap-6">
          <SubsectionTitle
            title="Conditional Stats"
            optional
          />

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              addConditionalStat(
                version,
              )
            }
            className="h-9 cursor-pointer gap-2 rounded-lg px-3.5 text-xs"
          >
            <Plus className="size-3.5" />

            Add Conditional Stat
          </Button>
        </div>

        {version.conditionalStats
          .length > 0 ? (
          <div className="mt-4 space-y-5">
            {version.conditionalStats.map(
              (
                stat,
                index,
              ) => (
                <div
                  key={
                    stat.id
                  }
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      Conditional Stat{" "}
                      {index +
                        1}
                    </span>

                    <DeleteButton
                      onClick={() =>
                        removeConditionalStat(
                          version,
                          stat.id,
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-[280px_minmax(0,1fr)_260px] gap-5">
                    <Field>
                      <FieldLabel>
                        Condition
                      </FieldLabel>

                      <SelectMenu
                        value={
                          stat.condition
                        }
                        options={
                          conditionOptions
                        }
                        placeholder="Select condition"
                        onChange={(
                          value,
                        ) =>
                          updateConditionalStat(
                            version,
                            stat.id,
                            "condition",
                            value,
                          )
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>
                        Stat
                      </FieldLabel>

                      <input
                        type="text"
                        value={
                          stat.stat
                        }
                        onChange={(
                          event,
                        ) =>
                          updateConditionalStat(
                            version,
                            stat.id,
                            "stat",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Example: Physical Pierce"
                        className={inputClass()}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>
                        Value
                      </FieldLabel>

                      <input
                        type="text"
                        value={
                          stat.value
                        }
                        onChange={(
                          event,
                        ) =>
                          updateConditionalStat(
                            version,
                            stat.id,
                            "value",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Example: +10%"
                        className={inputClass()}
                      />
                    </Field>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <EmptyInline text="No conditional stats." />
        )}
      </div>

      {/* ================================================================== */}
      {/* ACQUISITION SOURCES                                                */}
      {/* ================================================================== */}

      {isObtained && (
        <div className="mt-7 border-t border-border pt-6">
          <SubsectionTitle
            title="Acquisition Sources"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Tambahkan semua cara yang dapat digunakan untuk mendapatkan versi weapon ini.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <AddSourceButton
              icon={Swords}
              title="Monster Drop"
              description="Drop dari satu atau beberapa monster."
              onClick={() =>
                addAcquisitionSource(
                  version,
                  "MONSTER_DROP",
                )
              }
            />

            <AddSourceButton
              icon={Gift}
              title="Event Point Exchange"
              description="Ditukar menggunakan point event."
              onClick={() =>
                addAcquisitionSource(
                  version,
                  "EVENT_POINT_EXCHANGE",
                )
              }
            />

            <AddSourceButton
              icon={Award}
              title="Reward"
              description="Quest, event, emblem, login, atau reward lainnya."
              onClick={() =>
                addAcquisitionSource(
                  version,
                  "REWARD",
                )
              }
            />
          </div>

          {acquisitionSources.length ===
            0 && (
            <div className="mt-5 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
              <p className="text-xs text-muted-foreground">
                Belum ada acquisition source.
              </p>
            </div>
          )}

          {acquisitionSources.length >
            0 && (
            <div className="mt-5 space-y-4">
              {acquisitionSources.map(
                (
                  source,
                ) => (
                  <AcquisitionSourceRow
                    key={
                      source.id
                    }
                    source={
                      source
                    }
                    version={
                      version
                    }
                    monsterOptions={
                      monsterOptions
                    }
                    updateAcquisitionSource={
                      updateAcquisitionSource
                    }
                    removeAcquisitionSource={
                      removeAcquisitionSource
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* PROCESS + STORE                                                    */}
      {/* ================================================================== */}

      <ProcessStoreFields
        version={
          version
        }
        updateVersion={
          updateVersion
        }
        updateProcess={
          updateProcess
        }
      />

      {/* ================================================================== */}
      {/* NPC RECIPE                                                         */}
      {/* ================================================================== */}

      {isNpcCraft && (
        <NpcRecipeFields
          version={
            version
          }
          itemOptions={
            itemOptions
          }
          updateRecipe={
            updateRecipe
          }
          addRecipeMaterial={
            addRecipeMaterial
          }
          updateRecipeMaterial={
            updateRecipeMaterial
          }
          removeRecipeMaterial={
            removeRecipeMaterial
          }
        />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* PLAYER CRAFT VERSION                                                       */
/* -------------------------------------------------------------------------- */

function PlayerCraftVersionFields({
  version,
  itemOptions,

  updateVersion,
  updateProcess,

  updateRecipe,
  addRecipeMaterial,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  return (
    <div>
      {/* ================================================================== */}
      {/* BASE CRAFT DATA                                                    */}
      {/* ================================================================== */}

      <div>
        <SubsectionTitle
          title="Base Craft Data"
        />

        <div className="mt-4 grid grid-cols-3 gap-5">
          {/* BASE ATK */}

          <NumberField
            label="Base ATK"
            required
            value={
              version.baseAtk
            }
            placeholder="100"
            onChange={(
              value,
            ) =>
              updateVersion(
                version.id,
                "baseAtk",
                value,
              )
            }
          />

          {/* STABILITY */}

          <PercentageField
            label="Stability"
            value={
              version.stability
            }
            onChange={(
              value,
            ) =>
              updateVersion(
                version.id,
                "stability",
                value,
              )
            }
          />

          {/* POTENTIAL */}

          <NumberField
            label="Base Potential"
            required
            value={
              version.basePotential
            }
            placeholder="38"
            onChange={(
              value,
            ) =>
              updateVersion(
                version.id,
                "basePotential",
                value,
              )
            }
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* PLAYER SMITH RECIPE                                                */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
            <Sparkles className="size-3.5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <SubsectionTitle
                title="Player Smith Recipe"
              />

              <span className="rounded-md bg-primary/[0.07] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] text-primary">
                PLAYER SMITH
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Material dan requirement untuk membuat weapon melalui Smith Skill.
            </p>
          </div>
        </div>

        {/* =============================================================== */}
        {/* MATERIAL                                                        */}
        {/* =============================================================== */}

        <div className="mt-5">
          <FieldLabel>
            Recipe Materials
          </FieldLabel>

          <RecipeItemSelect
            options={itemOptions.filter(
              (item) =>
                !version.recipe.materials.some(
                  (
                    material,
                  ) =>
                    material.itemId ===
                    item.id,
                ),
            )}
            onChange={(
              itemId,
            ) =>
              addRecipeMaterial(
                version,
                itemId,
              )
            }
          />
        </div>

        {/* =============================================================== */}
        {/* MATERIAL LIST                                                   */}
        {/* =============================================================== */}

        {version.recipe.materials
          .length > 0 && (
          <RecipeMaterialList
            version={
              version
            }
            itemOptions={
              itemOptions
            }
            updateRecipeMaterial={
              updateRecipeMaterial
            }
            removeRecipeMaterial={
              removeRecipeMaterial
            }
          />
        )}

        {/* =============================================================== */}
        {/* REQUIREMENT                                                     */}
        {/* =============================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-5">
          <NumberField
            label="Craft Level"
            value={
              version.recipe
                .craftLevel
            }
            placeholder="150"
            onChange={(
              value,
            ) =>
              updateRecipe(
                version,
                "craftLevel",
                value,
              )
            }
          />

          <NumberField
            label="Difficulty"
            value={
              version.recipe
                .difficulty
            }
            placeholder="170"
            onChange={(
              value,
            ) =>
              updateRecipe(
                version,
                "difficulty",
                value,
              )
            }
          />
        </div>
      </div>

      {/* ================================================================== */}
      {/* PROCESS + STORE                                                    */}
      {/* ================================================================== */}

      <ProcessStoreFields
        version={
          version
        }
        updateVersion={
          updateVersion
        }
        updateProcess={
          updateProcess
        }
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* PROCESS + STORE                                                            */
/* -------------------------------------------------------------------------- */

function ProcessStoreFields({
  version,
  updateVersion,
  updateProcess,
}) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-10 border-t border-border pt-6">
      {/* PROCESS */}

      <div>
        <SubsectionTitle
          title="Process Result"
          optional
        />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              Material Type
            </FieldLabel>

            <SelectMenu
              value={
                version.process
                  .materialType
              }
              options={
                materialTypeOptions
              }
              placeholder="Select material"
              onChange={(
                value,
              ) =>
                updateProcess(
                  version,
                  "materialType",
                  value,
                )
              }
            />
          </Field>

          <NumberField
            label="Points"
            value={
              version.process
                .points
            }
            placeholder="120"
            onChange={(
              value,
            ) =>
              updateProcess(
                version,
                "points",
                value,
              )
            }
          />
        </div>
      </div>

      {/* STORE */}

      <div>
        <SubsectionTitle
          title="General Store"
          optional
        />

        <div className="mt-4">
          <Field>
            <FieldLabel>
              Sell Price
            </FieldLabel>

            <div className="relative">
              <input
                type="number"
                min="0"
                value={
                  version.sellPrice
                }
                onChange={(
                  event,
                ) =>
                  updateVersion(
                    version.id,
                    "sellPrice",
                    event.target
                      .value,
                  )
                }
                placeholder="0"
                className={`${inputClass()} pr-20`}
              />

              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                Spina
              </span>
            </div>
          </Field>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* NPC RECIPE                                                                 */
/* -------------------------------------------------------------------------- */

function NpcRecipeFields({
  version,
  itemOptions,

  updateRecipe,
  addRecipeMaterial,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  return (
    <div className="mt-7 border-t border-border pt-6">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
          <Hammer className="size-3.5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <SubsectionTitle
              title="NPC Recipe"
            />

            <span className="rounded-md bg-primary/[0.07] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] text-primary">
              NPC ONLY
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Material dan biaya yang diperlukan untuk craft melalui NPC Blacksmith.
          </p>
        </div>
      </div>

      {/* MATERIAL */}

      <div className="mt-5">
        <FieldLabel>
          Recipe Materials
        </FieldLabel>

        <RecipeItemSelect
          options={itemOptions.filter(
            (item) =>
              !version.recipe.materials.some(
                (
                  material,
                ) =>
                  material.itemId ===
                  item.id,
              ),
          )}
          onChange={(
            itemId,
          ) =>
            addRecipeMaterial(
              version,
              itemId,
            )
          }
        />
      </div>

      {/* MATERIAL LIST */}

      {version.recipe.materials
        .length > 0 && (
        <RecipeMaterialList
          version={
            version
          }
          itemOptions={
            itemOptions
          }
          updateRecipeMaterial={
            updateRecipeMaterial
          }
          removeRecipeMaterial={
            removeRecipeMaterial
          }
        />
      )}

      {/* CRAFT FEE */}

      <div className="mt-5 max-w-[360px]">
        <Field>
          <FieldLabel>
            Craft Fee
          </FieldLabel>

          <div className="relative">
            <input
              type="number"
              min="0"
              value={
                version.recipe
                  .craftFee
              }
              onChange={(
                event,
              ) =>
                updateRecipe(
                  version,
                  "craftFee",
                  event.target
                    .value,
                )
              }
              placeholder="0"
              className={`${inputClass()} pr-20`}
            />

            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              Spina
            </span>
          </div>
        </Field>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ACQUISITION SOURCE                                                         */
/* -------------------------------------------------------------------------- */

function AcquisitionSourceRow({
  source,
  version,
  monsterOptions,
  updateAcquisitionSource,
  removeAcquisitionSource,
}) {
  /* ---------------------------------------------------------------------- */
  /* MONSTER                                                                */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "MONSTER_DROP"
  ) {
    return (
      <SourceBlock
        icon={Swords}
        title="Monster Drop"
        badge="MONSTER"
        onRemove={() =>
          removeAcquisitionSource(
            version,
            source.id,
          )
        }
      >
        <Field>
          <FieldLabel>
            Monster
          </FieldLabel>

          <SearchEntitySelect
            value={
              source.monsterId
            }
            options={
              monsterOptions
            }
            placeholder="Search monster..."
            emptyText="No monster found."
            getLabel={(
              monster,
            ) =>
              monster.name
            }
            getMeta={(
              monster,
            ) => {
              const type =
                formatMonsterType(
                  monster.type,
                )

              if (
                monster.level
              ) {
                return `${type} • Lv ${monster.level}`
              }

              return type
            }}
            onChange={(
              monsterId,
            ) =>
              updateAcquisitionSource(
                version,
                source.id,
                "monsterId",
                monsterId,
              )
            }
          />
        </Field>
      </SourceBlock>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* EVENT EXCHANGE                                                         */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "EVENT_POINT_EXCHANGE"
  ) {
    return (
      <SourceBlock
        icon={Gift}
        title="Event Point Exchange"
        badge="EVENT EXCHANGE"
        onRemove={() =>
          removeAcquisitionSource(
            version,
            source.id,
          )
        }
      >
        <div className="grid grid-cols-3 gap-5">
          <Field>
            <FieldLabel>
              Event Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.eventName
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  version,
                  source.id,
                  "eventName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Snowball Fight"
              className={inputClass()}
            />
          </Field>

          <Field>
            <FieldLabel>
              Point Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.pointName
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  version,
                  source.id,
                  "pointName",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Snowball Points"
              className={inputClass()}
            />
          </Field>

          <NumberField
            label="Required Points"
            value={
              source.requiredPoints
            }
            placeholder="5000"
            onChange={(
              value,
            ) =>
              updateAcquisitionSource(
                version,
                source.id,
                "requiredPoints",
                value,
              )
            }
          />
        </div>
      </SourceBlock>
    )
  }

  /* ---------------------------------------------------------------------- */
  /* REWARD                                                                 */
  /* ---------------------------------------------------------------------- */

  if (
    source.type ===
    "REWARD"
  ) {
    return (
      <SourceBlock
        icon={Award}
        title="Reward"
        badge="REWARD"
        onRemove={() =>
          removeAcquisitionSource(
            version,
            source.id,
          )
        }
      >
        <div className="grid grid-cols-[280px_minmax(0,1fr)_180px] gap-5">
          <Field>
            <FieldLabel>
              Reward Type
            </FieldLabel>

            <SelectMenu
              value={
                source.rewardType
              }
              options={
                rewardTypeOptions
              }
              placeholder="Select reward type"
              onChange={(
                value,
              ) =>
                updateAcquisitionSource(
                  version,
                  source.id,
                  "rewardType",
                  value,
                )
              }
            />
          </Field>

          <Field>
            <FieldLabel>
              Reward Name
            </FieldLabel>

            <input
              type="text"
              value={
                source.name
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  version,
                  source.id,
                  "name",
                  event.target
                    .value,
                )
              }
              placeholder="Example: Main Quest Chapter 10"
              className={inputClass()}
            />
          </Field>

          <NumberField
            label="Quantity"
            value={
              source.quantity
            }
            placeholder="1"
            onChange={(
              value,
            ) =>
              updateAcquisitionSource(
                version,
                source.id,
                "quantity",
                value,
              )
            }
          />
        </div>

        <div className="mt-4">
          <Field>
            <FieldLabel>
              Reward Description
            </FieldLabel>

            <textarea
              value={
                source.description
              }
              onChange={(
                event,
              ) =>
                updateAcquisitionSource(
                  version,
                  source.id,
                  "description",
                  event.target
                    .value,
                )
              }
              maxLength={500}
              rows={3}
              placeholder="Jelaskan bagaimana reward ini diperoleh..."
              className={textareaClass()}
            />
          </Field>
        </div>
      </SourceBlock>
    )
  }

  return null
}

/* -------------------------------------------------------------------------- */
/* SOURCE BLOCK                                                               */
/* -------------------------------------------------------------------------- */

function SourceBlock({
  icon: Icon,
  title,
  badge,
  children,
  onRemove,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.04] p-4">
      <div className="mb-4 flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>

            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-muted-foreground">
              {badge}
            </span>
          </div>
        </div>

        <DeleteButton
          onClick={
            onRemove
          }
        />
      </div>

      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* ADD SOURCE                                                                 */
/* -------------------------------------------------------------------------- */

function AddSourceButton({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="group flex min-h-[88px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:border-primary/25 hover:bg-primary/[0.025]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Plus className="size-4" />
      </div>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* VERSION BUTTON                                                             */
/* -------------------------------------------------------------------------- */

function VersionButton({
  icon: Icon,
  title,
  description,
  active,
  onAdd,
  onRemove,
}) {
  return (
    <div
      className={[
        "flex min-h-[96px] items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors",

        active
          ? "border-primary/30 bg-primary/[0.045]"
          : "border-border bg-background",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center rounded-xl",

          active
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Icon className="size-4" />
      </div>

      <button
        type="button"
        onClick={
          active
            ? undefined
            : onAdd
        }
        className={[
          "min-w-0 flex-1 text-left",

          active
            ? "cursor-default"
            : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            {title}
          </p>

          {active && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Check className="size-3" />

              Added
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </button>

      <button
        type="button"
        onClick={
          active
            ? onRemove
            : onAdd
        }
        className={[
          "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",

          active
            ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
        ].join(" ")}
      >
        {active ? (
          <X className="size-4" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* VERSION HEADER                                                             */
/* -------------------------------------------------------------------------- */

function VersionSectionHeader({
  icon: Icon,
  label,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
        <Icon className="size-4" />
      </div>

      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {title}
          </h3>

          <span className="rounded-md border border-primary/15 bg-primary/[0.07] px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-primary">
            {label}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* RECIPE MATERIAL LIST                                                       */
/* -------------------------------------------------------------------------- */

function RecipeMaterialList({
  version,
  itemOptions,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  return (
    <div className="mt-3 space-y-2">
      {version.recipe.materials.map(
        (
          material,
        ) => {
          const item =
            itemOptions.find(
              (
                candidate,
              ) =>
                candidate.id ===
                material.itemId,
            )

          if (!item) {
            return null
          }

          return (
            <div
              key={
                material.id
              }
              className="grid min-h-[62px] grid-cols-[minmax(0,1fr)_180px_40px] items-center gap-4 rounded-xl border border-border bg-muted/[0.06] px-4 py-2.5"
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
                    {formatCategory(
                      item.category,
                    )}
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={
                    material.quantity
                  }
                  onChange={(
                    event,
                  ) =>
                    updateRecipeMaterial(
                      version,
                      material.id,
                      event.target
                        .value,
                    )
                  }
                  className={`${inputClass()} pr-12`}
                />

                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Qty
                </span>
              </div>

              <DeleteButton
                onClick={() =>
                  removeRecipeMaterial(
                    version,
                    material.id,
                  )
                }
              />
            </div>
          )
        },
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SEARCH ENTITY                                                              */
/* -------------------------------------------------------------------------- */

function SearchEntitySelect({
  value,
  options,
  placeholder,
  emptyText,
  getLabel,
  getMeta,
  onChange,
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
    )

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
          (option) => {
            const label =
              getLabel(
                option,
              )
                ?.toLowerCase() ||
              ""

            const meta =
              getMeta?.(
                option,
              )
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
        .slice(
          0,
          20,
        )
    }, [
      options,
      search,
      getLabel,
      getMeta,
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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(
        () => {
          inputRef.current?.focus()
        },
        0,
      )

    return () =>
      clearTimeout(
        timeout,
      )
  }, [open])

  return (
    <div
      ref={
        rootRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm",

            selected
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {selected
            ? getLabel(
                selected,
              )
            : placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

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
                    event.target
                      .value,
                  )
                }
                placeholder={
                  placeholder
                }
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-1.5">
            {filtered.length >
            0 ? (
              filtered.map(
                (
                  option,
                ) => (
                  <button
                    key={
                      option.id
                    }
                    type="button"
                    onClick={() => {
                      onChange(
                        option.id,
                      )

                      setOpen(false)
                      setSearch("")
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {getLabel(
                          option,
                        )}
                      </p>

                      {getMeta && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {getMeta(
                            option,
                          )}
                        </p>
                      )}
                    </div>

                    {value ===
                      option.id && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[80px] items-center justify-center">
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
/* RECIPE SELECT                                                              */
/* -------------------------------------------------------------------------- */

function RecipeItemSelect({
  options,
  onChange,
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

  const filteredItems =
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
          (item) => {
            const name =
              item.name
                ?.toLowerCase() ||
              ""

            const category =
              formatCategory(
                item.category,
              ).toLowerCase()

            return (
              name.includes(
                keyword,
              ) ||
              category.includes(
                keyword,
              )
            )
          },
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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      )
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const timeout =
      setTimeout(
        () => {
          inputRef.current?.focus()
        },
        0,
      )

    return () =>
      clearTimeout(
        timeout,
      )
  }, [open])

  return (
    <div
      ref={
        rootRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className={[
          "flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/20 px-3.5 text-left outline-none transition-all",

          open
            ? "border-primary/40 bg-background ring-3 ring-primary/10"
            : "hover:bg-muted/30",
        ].join(" ")}
      >
        <Package className="size-4 shrink-0 text-muted-foreground" />

        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          Search recipe material...
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

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
                    event.target
                      .value,
                  )
                }
                placeholder="Search material..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-1.5">
            {filteredItems.length >
            0 ? (
              filteredItems.map(
                (item) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={() => {
                      onChange(
                        item.id,
                      )

                      setOpen(false)
                      setSearch("")
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-muted"
                  >
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
                        {formatCategory(
                          item.category,
                        )}
                      </p>
                    </div>
                  </button>
                ),
              )
            ) : (
              <div className="flex min-h-[90px] items-center justify-center">
                <p className="text-xs text-muted-foreground">
                  No material found.
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
            className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none hover:bg-muted/20"
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
          {selected?.label ||
            placeholder}
        </span>

        <ChevronDown className="size-4 text-muted-foreground" />
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
                className="flex cursor-pointer items-center justify-between"
              >
                {option.label}

                {option.value ===
                  value && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */
/* TITLES                                                                     */
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

function SubsectionTitle({
  title,
  optional = false,
}) {
  return (
    <div className="flex items-center gap-2.5">
      <h4 className="text-sm font-semibold text-foreground">
        {title}
      </h4>

      {optional && (
        <span className="text-xs text-muted-foreground">
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

/* -------------------------------------------------------------------------- */
/* NUMBER                                                                     */
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
        required={
          required
        }
      >
        {label}
      </FieldLabel>

      <input
        type="number"
        min="0"
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className={inputClass()}
      />
    </Field>
  )
}

/* -------------------------------------------------------------------------- */
/* PERCENTAGE                                                                 */
/* -------------------------------------------------------------------------- */

function PercentageField({
  label,
  value,
  onChange,
}) {
  return (
    <Field>
      <FieldLabel>
        {label}
      </FieldLabel>

      <div className="relative">
        <input
          type="number"
          min="0"
          max="100"
          value={
            value
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          placeholder="0"
          className={`${inputClass()} pr-10`}
        />

        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
    </Field>
  )
}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

function DeleteButton({
  onClick,
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={
        onClick
      }
      className="size-9 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/* EMPTY                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyInline({
  text,
}) {
  return (
    <div className="mt-4 flex h-12 items-center justify-center rounded-lg bg-muted/[0.18]">
      <p className="text-xs text-muted-foreground">
        {text}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass() {
  return "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

function textareaClass() {
  return "min-h-[90px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10"
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatCategory(
  value,
) {
  const labels = {
    WEAPON:
      "Weapon",

    ARMOR:
      "Armor",

    ADDITIONAL:
      "Additional",

    SPECIAL_GEAR:
      "Special Gear",

    SUB_WEAPON:
      "Sub Weapon",

    MATERIAL:
      "Material",

    CONSUMABLE:
      "Consumable",

    QUEST_ITEM:
      "Quest Item",

    EVENT_ITEM:
      "Event Item",

    OTHER:
      "Other",
  }

  return (
    labels[value] ||
    value ||
    "Unknown"
  )
}

function formatMonsterType(
  value,
) {
  const labels = {
    NORMAL:
      "Normal Monster",

    MINI_BOSS:
      "Mini Boss",

    BOSS:
      "Boss",
  }

  return (
    labels[value] ||
    value ||
    "Monster"
  )
}
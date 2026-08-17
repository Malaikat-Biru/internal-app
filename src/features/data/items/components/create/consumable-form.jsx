import {
  Award,
  Check,
  ChevronDown,
  FlaskConical,
  Gift,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------- */
/* CONSUMABLE TYPE                                                            */
/* -------------------------------------------------------------------------- */

const consumableTypeOptions = [
  {
    value: "RECOVERY",
    label: "Recovery",
  },
  {
    value: "MP",
    label: "MP",
  },
  {
    value: "BUFF",
    label: "Buff",
  },
  {
    value: "SUPPORT",
    label: "Support",
  },
  {
    value: "UTILITY",
    label: "Utility",
  },
];

/* -------------------------------------------------------------------------- */
/* VISUAL TYPE                                                                */
/* -------------------------------------------------------------------------- */

const consumableVisualTypeOptions = [
  {
    value: "POTION",
    label: "Potion",
  },
  {
    value: "FOOD",
    label: "Food",
  },
  {
    value: "DRINK",
    label: "Drink",
  },
  {
    value: "CANDY",
    label: "Candy",
  },
  {
    value: "OIL",
    label: "Oil",
  },
  {
    value: "CHARM",
    label: "Charm",
  },
  {
    value: "MEDICINE",
    label: "Medicine",
  },
  {
    value: "SCROLL_BOOK",
    label: "Scroll / Book",
  },
  {
    value: "CONTAINER",
    label: "Box / Container",
  },
  {
    value: "TOOL",
    label: "Tool",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

/* -------------------------------------------------------------------------- */
/* DURATION UNIT                                                              */
/* -------------------------------------------------------------------------- */

const durationUnitOptions = [
  {
    value: "SECOND",
    label: "Seconds",
  },
  {
    value: "MINUTE",
    label: "Minutes",
  },
  {
    value: "HOUR",
    label: "Hours",
  },
];

/* -------------------------------------------------------------------------- */
/* USE SCOPE                                                                  */
/* -------------------------------------------------------------------------- */

const useScopeOptions = [
  {
    value: "FIELD",
    label: "Field",
  },
  {
    value: "BATTLE",
    label: "Battle",
  },
  {
    value: "BOSS_BATTLE",
    label: "Boss Battle",
  },
  {
    value: "PARTY",
    label: "Party",
  },
  {
    value: "OUTSIDE_BATTLE",
    label: "Outside Battle",
  },
];

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
];

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
];

/* -------------------------------------------------------------------------- */
/* CRAFT METHOD                                                               */
/* -------------------------------------------------------------------------- */

const craftMethodOptions = [
  {
    value: "NPC_SYNTHESIST",
    label: "NPC Synthesist",
  },
  {
    value: "PLAYER_ALCHEMY",
    label: "Player Alchemy",
  },
];

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
];

/* -------------------------------------------------------------------------- */
/* LOCAL ID                                                                   */
/* -------------------------------------------------------------------------- */

function generateLocalId() {
  return `LOCAL-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* -------------------------------------------------------------------------- */
/* FACTORIES                                                                  */
/* -------------------------------------------------------------------------- */

function createEffect(createLocalId) {
  return {
    id: createLocalId(),

    stat: "",

    value: "",

    intervalSeconds: "",
  };
}

function createMonsterDropSource(createLocalId) {
  return {
    id: createLocalId(),

    type: "MONSTER_DROP",

    monsterId: "",
  };
}

function createEventExchangeSource(createLocalId) {
  return {
    id: createLocalId(),

    type: "EVENT_POINT_EXCHANGE",

    eventName: "",

    pointName: "",

    requiredPoints: "",
  };
}

function createRewardSource(createLocalId) {
  return {
    id: createLocalId(),

    type: "REWARD",

    rewardType: "QUEST",

    name: "",

    description: "",

    quantity: 1,
  };
}

function createCraftMethod(type, createLocalId) {
  return {
    id: createLocalId(),

    type,

    recipe: {
      materials: [],

      setQuantity: 1,

      level: "",

      difficulty: "",

      craftFee: "",
    },
  };
}

function createRecommendation(createLocalId) {
  return {
    id: createLocalId(),

    text: "",
  };
}

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function ConsumableForm({
  data,
  setForm,
  itemOptions = [],
  monsterOptions = defaultMonsterOptions,
  createLocalId = generateLocalId,
}) {
  /* ---------------------------------------------------------------------- */
  /* SAFE DATA                                                              */
  /* ---------------------------------------------------------------------- */

  const effects = Array.isArray(data?.effects) ? data.effects : [];

  const useScope = Array.isArray(data?.useScope) ? data.useScope : [];

  const bestUsedFor = Array.isArray(data?.bestUsedFor) ? data.bestUsedFor : [];

  const acquisitionSources = Array.isArray(data?.acquisitionSources)
    ? data.acquisitionSources
    : [];

  const craftMethods = Array.isArray(data?.craftMethods)
    ? data.craftMethods
    : [];

  const duration = data?.duration || {
    value: "",
    unit: "MINUTE",
  };

  const process = data?.process || {
    materialType: "MEDICINE",

    points: "",
  };

  /* ---------------------------------------------------------------------- */
  /* ROOT UPDATE                                                            */
  /* ---------------------------------------------------------------------- */

  function updateConsumableField(field, value) {
    setForm((current) => ({
      ...current,

      consumable: {
        ...current.consumable,

        [field]: value,
      },
    }));
  }

  /* ---------------------------------------------------------------------- */
  /* DURATION                                                               */
  /* ---------------------------------------------------------------------- */

  function updateDuration(field, value) {
    updateConsumableField("duration", {
      ...duration,

      [field]: value,
    });
  }

  function clearDuration() {
    updateConsumableField("duration", null);
  }

  function enableDuration() {
    updateConsumableField("duration", {
      value: "",

      unit: "MINUTE",
    });
  }

  /* ---------------------------------------------------------------------- */
  /* EFFECT                                                                 */
  /* ---------------------------------------------------------------------- */

  function addEffect() {
    updateConsumableField("effects", [...effects, createEffect(createLocalId)]);
  }

  function updateEffect(effectId, field, value) {
    updateConsumableField(
      "effects",
      effects.map((effect) =>
        effect.id === effectId
          ? {
              ...effect,

              [field]: value,
            }
          : effect,
      ),
    );
  }

  function removeEffect(effectId) {
    updateConsumableField(
      "effects",
      effects.filter((effect) => effect.id !== effectId),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* USE SCOPE                                                              */
  /* ---------------------------------------------------------------------- */

  function toggleUseScope(value) {
    const exists = useScope.includes(value);

    updateConsumableField(
      "useScope",
      exists ? useScope.filter((item) => item !== value) : [...useScope, value],
    );
  }

  /* ---------------------------------------------------------------------- */
  /* BEST USED FOR                                                          */
  /* ---------------------------------------------------------------------- */

  function addRecommendation() {
    updateConsumableField("bestUsedFor", [
      ...bestUsedFor,

      createRecommendation(createLocalId),
    ]);
  }

  function updateRecommendation(recommendationId, value) {
    updateConsumableField(
      "bestUsedFor",
      bestUsedFor.map((recommendation) =>
        recommendation.id === recommendationId
          ? {
              ...recommendation,

              text: value,
            }
          : recommendation,
      ),
    );
  }

  function removeRecommendation(recommendationId) {
    updateConsumableField(
      "bestUsedFor",
      bestUsedFor.filter(
        (recommendation) => recommendation.id !== recommendationId,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ACQUISITION                                                            */
  /* ---------------------------------------------------------------------- */

  function addAcquisitionSource(type) {
    let source = null;

    switch (type) {
      case "MONSTER_DROP":
        source = createMonsterDropSource(createLocalId);
        break;

      case "EVENT_POINT_EXCHANGE":
        source = createEventExchangeSource(createLocalId);
        break;

      case "REWARD":
        source = createRewardSource(createLocalId);
        break;

      default:
        return;
    }

    updateConsumableField("acquisitionSources", [
      ...acquisitionSources,

      source,
    ]);
  }

  function updateAcquisitionSource(sourceId, field, value) {
    updateConsumableField(
      "acquisitionSources",
      acquisitionSources.map((source) =>
        source.id === sourceId
          ? {
              ...source,

              [field]: value,
            }
          : source,
      ),
    );
  }

  function removeAcquisitionSource(sourceId) {
    updateConsumableField(
      "acquisitionSources",
      acquisitionSources.filter((source) => source.id !== sourceId),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* CRAFT METHODS                                                          */
  /* ---------------------------------------------------------------------- */

  function addCraftMethod(type) {
    const exists = craftMethods.some((method) => method.type === type);

    if (exists) {
      return;
    }

    updateConsumableField("craftMethods", [
      ...craftMethods,

      createCraftMethod(type, createLocalId),
    ]);
  }

  function removeCraftMethod(methodId) {
    updateConsumableField(
      "craftMethods",
      craftMethods.filter((method) => method.id !== methodId),
    );
  }

  function updateCraftMethodRecipe(methodId, field, value) {
    updateConsumableField(
      "craftMethods",
      craftMethods.map((method) =>
        method.id === methodId
          ? {
              ...method,

              recipe: {
                ...method.recipe,

                [field]: value,
              },
            }
          : method,
      ),
    );
  }

  function addRecipeMaterial(method, itemId) {
    const materials = Array.isArray(method.recipe?.materials)
      ? method.recipe.materials
      : [];

    const exists = materials.some((material) => material.itemId === itemId);

    if (exists) {
      return;
    }

    updateCraftMethodRecipe(method.id, "materials", [
      ...materials,

      {
        id: createLocalId(),

        itemId,

        quantity: 1,
      },
    ]);
  }

  function updateRecipeMaterial(method, materialId, quantity) {
    updateCraftMethodRecipe(
      method.id,
      "materials",
      method.recipe.materials.map((material) =>
        material.id === materialId
          ? {
              ...material,

              quantity,
            }
          : material,
      ),
    );
  }

  function removeRecipeMaterial(method, materialId) {
    updateCraftMethodRecipe(
      method.id,
      "materials",
      method.recipe.materials.filter((material) => material.id !== materialId),
    );
  }

  /* ---------------------------------------------------------------------- */
  /* PROCESS                                                                */
  /* ---------------------------------------------------------------------- */

  function updateProcess(field, value) {
    updateConsumableField("process", {
      ...process,

      [field]: value,
    });
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
        title="Consumable Data"
        description="Kelola tipe, visual, effect, penggunaan, sumber perolehan, dan metode crafting consumable."
      />

      {/* ================================================================== */}
      {/* BASIC CONSUMABLE DATA                                              */}
      {/* ================================================================== */}

      <div className="mt-6">
        <div className="grid grid-cols-2 gap-5">
          {/* TYPE */}

          <Field>
            <FieldLabel required>Consumable Type</FieldLabel>

            <SelectMenu
              value={data?.type || ""}
              options={consumableTypeOptions}
              placeholder="Select consumable type"
              onChange={(value) => updateConsumableField("type", value)}
            />
          </Field>

          {/* VISUAL TYPE */}

          <Field>
            <FieldLabel required>Visual Type</FieldLabel>

            <SelectMenu
              value={data?.visualType || ""}
              options={consumableVisualTypeOptions}
              placeholder="Select visual type"
              onChange={(value) => updateConsumableField("visualType", value)}
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Bentuk visual atau template icon consumable seperti Potion, Candy,
              Oil, Charm, atau Food.
            </p>
          </Field>
        </div>

        {/* MAIN EFFECT */}

        <div className="mt-5">
          <Field>
            <FieldLabel required>Main Effect</FieldLabel>

            <input
              type="text"
              value={data?.mainEffect || ""}
              onChange={(event) =>
                updateConsumableField("mainEffect", event.target.value)
              }
              placeholder="Example: Restores HP periodically."
              className={inputClass()}
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Ringkasan singkat fungsi utama consumable. Detail stat tetap
              disimpan pada Effect List.
            </p>
          </Field>
        </div>
      </div>

      {/* ================================================================== */}
      {/* DURATION                                                           */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SubsectionTitle title="Effect Duration" optional />

            <p className="mt-1 text-xs text-muted-foreground">
              Gunakan untuk consumable dengan buff atau effect yang memiliki
              durasi.
            </p>
          </div>

          {data?.duration ? (
            <Button
              type="button"
              variant="ghost"
              onClick={clearDuration}
              className="h-9 cursor-pointer gap-2 px-3 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
              Instant Effect
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={enableDuration}
              className="h-9 cursor-pointer gap-2 px-3.5 text-xs"
            >
              <Plus className="size-3.5" />
              Add Duration
            </Button>
          )}
        </div>

        {data?.duration ? (
          <div className="mt-4 grid max-w-[520px] grid-cols-[220px_260px] gap-4">
            <NumberField
              label="Duration"
              value={duration.value}
              placeholder="30"
              onChange={(value) => updateDuration("value", value)}
            />

            <Field>
              <FieldLabel>Unit</FieldLabel>

              <SelectMenu
                value={duration.unit}
                options={durationUnitOptions}
                placeholder="Select unit"
                onChange={(value) => updateDuration("unit", value)}
              />
            </Field>
          </div>
        ) : (
          <div className="mt-4 flex min-h-[64px] items-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-4">
            <p className="text-xs text-muted-foreground">
              Instant effect — consumable tidak memiliki duration.
            </p>
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* EFFECT LIST                                                        */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SubsectionTitle title="Effect List" />

            <p className="mt-1 text-xs text-muted-foreground">
              Tambahkan seluruh effect atau stat yang diberikan saat consumable
              digunakan.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addEffect}
            className="h-9 cursor-pointer gap-2 px-3.5 text-xs"
          >
            <Plus className="size-3.5" />
            Add Effect
          </Button>
        </div>

        {effects.length === 0 && (
          <div className="mt-4 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
            <p className="text-xs text-muted-foreground">Belum ada effect.</p>
          </div>
        )}

        {effects.length > 0 && (
          <div className="mt-5 space-y-3">
            {effects.map((effect, index) => (
              <div
                key={effect.id}
                className="grid grid-cols-[32px_minmax(0,1fr)_260px_240px_40px] items-end gap-4"
              >
                <div className="mb-1.5 flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </div>

                {/* STAT */}

                <Field>
                  <FieldLabel>Stat / Effect</FieldLabel>

                  <input
                    type="text"
                    value={effect.stat}
                    onChange={(event) =>
                      updateEffect(effect.id, "stat", event.target.value)
                    }
                    placeholder="Example: MaxHP"
                    className={inputClass()}
                  />
                </Field>

                {/* VALUE */}

                <Field>
                  <FieldLabel>Value</FieldLabel>

                  <input
                    type="text"
                    value={effect.value}
                    onChange={(event) =>
                      updateEffect(effect.id, "value", event.target.value)
                    }
                    placeholder="Example: +2000"
                    className={inputClass()}
                  />
                </Field>

                {/* INTERVAL */}

                <Field>
                  <FieldLabel>Interval</FieldLabel>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={effect.intervalSeconds}
                      onChange={(event) =>
                        updateEffect(
                          effect.id,
                          "intervalSeconds",
                          event.target.value,
                        )
                      }
                      placeholder="Optional"
                      className={`${inputClass()} pr-20`}
                    />

                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      seconds
                    </span>
                  </div>
                </Field>

                <div className="mb-1">
                  <DeleteButton onClick={() => removeEffect(effect.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* USE SCOPE                                                          */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div>
          <SubsectionTitle title="Use Scope" optional />

          <p className="mt-1 text-xs text-muted-foreground">
            Tentukan konteks gameplay di mana consumable ini relevan digunakan.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {useScopeOptions.map((option) => {
            const active = useScope.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleUseScope(option.value)}
                className={[
                  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3.5 text-xs font-medium transition-colors",

                  active
                    ? "border-primary/30 bg-primary/[0.07] text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                ].join(" ")}
              >
                {active && <Check className="size-3.5" />}

                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================== */}
      {/* BEST USED FOR                                                      */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <SubsectionTitle title="Best Used For" optional />

            <p className="mt-1 text-xs text-muted-foreground">
              Rekomendasi manual untuk membantu Aoi memahami build atau kondisi
              yang cocok menggunakan consumable ini.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addRecommendation}
            className="h-9 cursor-pointer gap-2 px-3.5 text-xs"
          >
            <Plus className="size-3.5" />
            Add Recommendation
          </Button>
        </div>

        {bestUsedFor.length === 0 && (
          <div className="mt-4 flex min-h-[70px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
            <p className="text-xs text-muted-foreground">
              Belum ada recommendation.
            </p>
          </div>
        )}

        {bestUsedFor.length > 0 && (
          <div className="mt-4 space-y-3">
            {bestUsedFor.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className="grid grid-cols-[32px_minmax(0,1fr)_40px] items-center gap-4"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </div>

                <input
                  type="text"
                  value={recommendation.text}
                  onChange={(event) =>
                    updateRecommendation(recommendation.id, event.target.value)
                  }
                  placeholder="Example: Useful for long boss battles with high incoming damage."
                  className={inputClass()}
                />

                <DeleteButton
                  onClick={() => removeRecommendation(recommendation.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* ACQUISITION SOURCES                                                */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div>
          <SubsectionTitle title="Acquisition Sources" />

          <p className="mt-1 text-xs text-muted-foreground">
            Tambahkan sumber non-crafting untuk mendapatkan consumable ini.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <AddSourceButton
            icon={Package}
            title="Monster Drop"
            description="Drop dari satu atau beberapa monster."
            onClick={() => addAcquisitionSource("MONSTER_DROP")}
          />

          <AddSourceButton
            icon={Gift}
            title="Event Point Exchange"
            description="Ditukar menggunakan point event."
            onClick={() => addAcquisitionSource("EVENT_POINT_EXCHANGE")}
          />

          <AddSourceButton
            icon={Award}
            title="Reward"
            description="Quest, event, login, atau reward lainnya."
            onClick={() => addAcquisitionSource("REWARD")}
          />
        </div>

        {acquisitionSources.length === 0 && (
          <div className="mt-5 flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05] px-6">
            <p className="text-xs text-muted-foreground">
              Belum ada acquisition source.
            </p>
          </div>
        )}

        {acquisitionSources.length > 0 && (
          <div className="mt-5 space-y-4">
            {acquisitionSources.map((source) => (
              <AcquisitionSourceRow
                key={source.id}
                source={source}
                monsterOptions={monsterOptions}
                updateAcquisitionSource={updateAcquisitionSource}
                removeAcquisitionSource={removeAcquisitionSource}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* CRAFT METHODS                                                      */}
      {/* ================================================================== */}

      <div className="mt-7 border-t border-border pt-6">
        <div>
          <SubsectionTitle title="Craft Methods" optional />

          <p className="mt-1 text-xs text-muted-foreground">
            Tambahkan metode crafting jika consumable tersedia melalui
            Synthesist atau Player Alchemy.
          </p>
        </div>

        <div className="mt-4 grid max-w-[760px] grid-cols-2 gap-3">
          {craftMethodOptions.map((option) => {
            const method = craftMethods.find(
              (candidate) => candidate.type === option.value,
            );

            return (
              <CraftMethodButton
                key={option.value}
                title={option.label}
                active={Boolean(method)}
                onAdd={() => addCraftMethod(option.value)}
                onRemove={() => method && removeCraftMethod(method.id)}
              />
            );
          })}
        </div>

        {craftMethods.length === 0 && (
          <div className="mt-5 flex min-h-[70px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/[0.05]">
            <p className="text-xs text-muted-foreground">
              Consumable ini belum memiliki craft method.
            </p>
          </div>
        )}

        {craftMethods.length > 0 && (
          <div className="mt-6 space-y-7">
            {craftMethods.map((method, index) => (
              <CraftMethodFields
                key={method.id}
                method={method}
                index={index}
                itemOptions={itemOptions}
                updateCraftMethodRecipe={updateCraftMethodRecipe}
                addRecipeMaterial={addRecipeMaterial}
                updateRecipeMaterial={updateRecipeMaterial}
                removeRecipeMaterial={removeRecipeMaterial}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* PROCESS + STORE                                                    */}
      {/* ================================================================== */}

      <div className="mt-7 grid grid-cols-2 gap-10 border-t border-border pt-6">
        {/* PROCESS */}

        <div>
          <SubsectionTitle title="Process Result" optional />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Material Type</FieldLabel>

              <SelectMenu
                value={process.materialType || ""}
                options={materialTypeOptions}
                placeholder="Select material"
                onChange={(value) => updateProcess("materialType", value)}
              />
            </Field>

            <NumberField
              label="Points"
              value={process.points || ""}
              placeholder="10"
              onChange={(value) => updateProcess("points", value)}
            />
          </div>
        </div>

        {/* STORE */}

        <div>
          <SubsectionTitle title="General Store" optional />

          <div className="mt-4">
            <Field>
              <FieldLabel>Sell Price</FieldLabel>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={data?.sellPrice || ""}
                  onChange={(event) =>
                    updateConsumableField("sellPrice", event.target.value)
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ACQUISITION SOURCE                                                         */
/* -------------------------------------------------------------------------- */

function AcquisitionSourceRow({
  source,
  monsterOptions,
  updateAcquisitionSource,
  removeAcquisitionSource,
}) {
  if (source.type === "MONSTER_DROP") {
    return (
      <SourceBlock
        icon={Package}
        title="Monster Drop"
        badge="MONSTER"
        onRemove={() => removeAcquisitionSource(source.id)}
      >
        <Field>
          <FieldLabel>Monster</FieldLabel>

          <SearchEntitySelect
            value={source.monsterId}
            options={monsterOptions}
            placeholder="Search monster..."
            emptyText="No monster found."
            getLabel={(monster) => monster.name}
            getMeta={(monster) => {
              const type = formatMonsterType(monster.type);

              if (monster.level) {
                return `${type} • Lv ${monster.level}`;
              }

              return type;
            }}
            onChange={(monsterId) =>
              updateAcquisitionSource(source.id, "monsterId", monsterId)
            }
          />
        </Field>
      </SourceBlock>
    );
  }

  if (source.type === "EVENT_POINT_EXCHANGE") {
    return (
      <SourceBlock
        icon={Gift}
        title="Event Point Exchange"
        badge="EVENT EXCHANGE"
        onRemove={() => removeAcquisitionSource(source.id)}
      >
        <div className="grid grid-cols-3 gap-5">
          <Field>
            <FieldLabel>Event Name</FieldLabel>

            <input
              type="text"
              value={source.eventName}
              onChange={(event) =>
                updateAcquisitionSource(
                  source.id,
                  "eventName",
                  event.target.value,
                )
              }
              placeholder="Example: Snowball Fight"
              className={inputClass()}
            />
          </Field>

          <Field>
            <FieldLabel>Point Name</FieldLabel>

            <input
              type="text"
              value={source.pointName}
              onChange={(event) =>
                updateAcquisitionSource(
                  source.id,
                  "pointName",
                  event.target.value,
                )
              }
              placeholder="Example: Snowball Points"
              className={inputClass()}
            />
          </Field>

          <NumberField
            label="Required Points"
            value={source.requiredPoints}
            placeholder="500"
            onChange={(value) =>
              updateAcquisitionSource(source.id, "requiredPoints", value)
            }
          />
        </div>
      </SourceBlock>
    );
  }

  if (source.type === "REWARD") {
    return (
      <SourceBlock
        icon={Award}
        title="Reward"
        badge="REWARD"
        onRemove={() => removeAcquisitionSource(source.id)}
      >
        <div className="grid grid-cols-[280px_minmax(0,1fr)_180px] gap-5">
          <Field>
            <FieldLabel>Reward Type</FieldLabel>

            <SelectMenu
              value={source.rewardType}
              options={rewardTypeOptions}
              placeholder="Select reward type"
              onChange={(value) =>
                updateAcquisitionSource(source.id, "rewardType", value)
              }
            />
          </Field>

          <Field>
            <FieldLabel>Reward Name</FieldLabel>

            <input
              type="text"
              value={source.name}
              onChange={(event) =>
                updateAcquisitionSource(source.id, "name", event.target.value)
              }
              placeholder="Example: Main Quest Reward"
              className={inputClass()}
            />
          </Field>

          <NumberField
            label="Quantity"
            value={source.quantity}
            placeholder="1"
            onChange={(value) =>
              updateAcquisitionSource(source.id, "quantity", value)
            }
          />
        </div>

        <div className="mt-4">
          <Field>
            <FieldLabel>Reward Description</FieldLabel>

            <textarea
              value={source.description}
              onChange={(event) =>
                updateAcquisitionSource(
                  source.id,
                  "description",
                  event.target.value,
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
    );
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* CRAFT METHOD                                                               */
/* -------------------------------------------------------------------------- */

function CraftMethodFields({
  method,
  index,
  itemOptions,

  updateCraftMethodRecipe,
  addRecipeMaterial,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  const isNpc = method.type === "NPC_SYNTHESIST";

  return (
    <div className={index > 0 ? "border-t border-border pt-7" : ""}>
      {/* HEADER */}

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
          {isNpc ? (
            <FlaskConical className="size-4" />
          ) : (
            <Sparkles className="size-4" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2.5">
            <h4 className="text-sm font-semibold text-foreground">
              {isNpc ? "NPC Synthesist" : "Player Alchemy"}
            </h4>

            <span className="rounded-md bg-primary/[0.07] px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] text-primary">
              {isNpc ? "NPC" : "PLAYER"}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {isNpc
              ? "Recipe consumable melalui NPC Synthesist."
              : "Recipe consumable melalui Player Alchemy Skill."}
          </p>
        </div>
      </div>

      {/* MATERIAL SELECT */}

      <div className="mt-5">
        <FieldLabel>Recipe Materials</FieldLabel>

        <RecipeItemSelect
          options={itemOptions.filter(
            (item) =>
              !method.recipe.materials.some(
                (material) => material.itemId === item.id,
              ),
          )}
          onChange={(itemId) => addRecipeMaterial(method, itemId)}
        />
      </div>

      {/* MATERIAL LIST */}

      {method.recipe.materials.length > 0 && (
        <RecipeMaterialList
          method={method}
          itemOptions={itemOptions}
          updateRecipeMaterial={updateRecipeMaterial}
          removeRecipeMaterial={removeRecipeMaterial}
        />
      )}

      {/* RECIPE META */}

      <div className="mt-5 grid grid-cols-4 gap-5">
        <NumberField
          label="Set Quantity"
          value={method.recipe.setQuantity}
          placeholder="1"
          onChange={(value) =>
            updateCraftMethodRecipe(method.id, "setQuantity", value)
          }
        />

        <NumberField
          label="Level"
          value={method.recipe.level}
          placeholder="100"
          onChange={(value) =>
            updateCraftMethodRecipe(method.id, "level", value)
          }
        />

        <NumberField
          label="Difficulty"
          value={method.recipe.difficulty}
          placeholder="120"
          onChange={(value) =>
            updateCraftMethodRecipe(method.id, "difficulty", value)
          }
        />

        {isNpc ? (
          <Field>
            <FieldLabel>Craft Fee</FieldLabel>

            <div className="relative">
              <input
                type="number"
                min="0"
                value={method.recipe.craftFee}
                onChange={(event) =>
                  updateCraftMethodRecipe(
                    method.id,
                    "craftFee",
                    event.target.value,
                  )
                }
                placeholder="0"
                className={`${inputClass()} pr-20`}
              />

              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Spina
              </span>
            </div>
          </Field>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RECIPE MATERIAL LIST                                                       */
/* -------------------------------------------------------------------------- */

function RecipeMaterialList({
  method,
  itemOptions,
  updateRecipeMaterial,
  removeRecipeMaterial,
}) {
  return (
    <div className="mt-3 space-y-2">
      {method.recipe.materials.map((material) => {
        const item = itemOptions.find(
          (candidate) => candidate.id === material.itemId,
        );

        if (!item) {
          return null;
        }

        return (
          <div
            key={material.id}
            className="grid min-h-[62px] grid-cols-[minmax(0,1fr)_180px_40px] items-center gap-4 rounded-xl border border-border bg-muted/[0.06] px-4 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Package className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatCategory(item.category)}
                </p>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="1"
                value={material.quantity}
                onChange={(event) =>
                  updateRecipeMaterial(method, material.id, event.target.value)
                }
                className={`${inputClass()} pr-12`}
              />

              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Qty
              </span>
            </div>

            <DeleteButton
              onClick={() => removeRecipeMaterial(method, material.id)}
            />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CRAFT METHOD BUTTON                                                        */
/* -------------------------------------------------------------------------- */

function CraftMethodButton({ title, active, onAdd, onRemove }) {
  return (
    <div
      className={[
        "flex min-h-[82px] items-center gap-3 rounded-xl border px-4 py-3 transition-colors",

        active
          ? "border-primary/30 bg-primary/[0.045]"
          : "border-border bg-background",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-9 shrink-0 items-center justify-center rounded-lg",

          active
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <FlaskConical className="size-4" />
      </div>

      <button
        type="button"
        onClick={active ? undefined : onAdd}
        className={[
          "min-w-0 flex-1 text-left",

          active ? "cursor-default" : "cursor-pointer",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>

          {active && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              <Check className="size-3" />
              Added
            </span>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={active ? onRemove : onAdd}
        className={[
          "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors",

          active
            ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
        ].join(" ")}
      >
        {active ? <X className="size-4" /> : <Plus className="size-4" />}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SOURCE BLOCK                                                               */
/* -------------------------------------------------------------------------- */

function SourceBlock({ icon: Icon, title, badge, children, onRemove }) {
  return (
    <div className="rounded-xl border border-border bg-muted/[0.04] p-4">
      <div className="mb-4 flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>

            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-muted-foreground">
              {badge}
            </span>
          </div>
        </div>

        <DeleteButton onClick={onRemove} />
      </div>

      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ADD SOURCE                                                                 */
/* -------------------------------------------------------------------------- */

function AddSourceButton({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[88px] cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:border-primary/25 hover:bg-primary/[0.025]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Plus className="size-4" />
      </div>
    </button>
  );
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
  const rootRef = useRef(null);

  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const selected = options.find((option) => option.id === value);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return options.slice(0, 20);
    }

    return options
      .filter((option) => {
        const label = getLabel(option)?.toLowerCase() || "";

        const meta = getMeta?.(option)?.toLowerCase() || "";

        return label.includes(keyword) || meta.includes(keyword);
      })
      .slice(0, 20);
  }, [options, search, getLabel, getMeta]);

  useEffect(() => {
    function handleOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm",

            selected ? "font-medium text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {selected ? getLabel(selected) : placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+7px)] z-[90] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background"
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-1.5">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);

                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {getLabel(option)}
                    </p>

                    {getMeta && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {getMeta(option)}
                      </p>
                    )}
                  </div>

                  {value === option.id && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="flex min-h-[80px] items-center justify-center">
                <p className="text-xs text-muted-foreground">{emptyText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RECIPE ITEM SELECT                                                         */
/* -------------------------------------------------------------------------- */

function RecipeItemSelect({ options, onChange }) {
  const rootRef = useRef(null);

  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return options.slice(0, 20);
    }

    return options
      .filter((item) => {
        const name = item.name?.toLowerCase() || "";

        const category = formatCategory(item.category).toLowerCase();

        return name.includes(keyword) || category.includes(keyword);
      })
      .slice(0, 20);
  }, [options, search]);

  useEffect(() => {
    function handleOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
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
                ref={inputRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search material..."
                className="h-10 w-full rounded-lg border border-border bg-muted/20 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-1.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.id);

                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Package className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCategory(item.category)}
                    </p>
                  </div>
                </button>
              ))
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
  );
}

/* -------------------------------------------------------------------------- */
/* SELECT                                                                     */
/* -------------------------------------------------------------------------- */

function SelectMenu({ value, options, onChange, placeholder }) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-background px-3.5 text-left outline-none transition-colors hover:bg-muted/20"
          />
        }
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm",

            selected ? "font-medium text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {selected?.label || placeholder}
        </span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[220px]">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              {option.label}

              {option.value === value && (
                <Check className="size-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------- */
/* TITLES                                                                     */
/* -------------------------------------------------------------------------- */

function SectionTitle({ number, title, description }) {
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

function SubsectionTitle({ title, optional = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>

      {optional && (
        <span className="text-xs text-muted-foreground">Optional</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({ children }) {
  return <div className="min-w-0">{children}</div>;
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}

      {required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );
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
      <FieldLabel required={required}>{label}</FieldLabel>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass()}
      />
    </Field>
  );
}

/* -------------------------------------------------------------------------- */
/* DELETE                                                                     */
/* -------------------------------------------------------------------------- */

function DeleteButton({ onClick }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="size-9 cursor-pointer rounded-lg text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* INPUT                                                                      */
/* -------------------------------------------------------------------------- */

function inputClass() {
  return "h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10";
}

function textareaClass() {
  return "min-h-[90px] w-full resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-muted/10 focus:border-primary/40 focus:ring-3 focus:ring-primary/10";
}

/* -------------------------------------------------------------------------- */
/* FORMAT                                                                     */
/* -------------------------------------------------------------------------- */

function formatMonsterType(value) {
  const labels = {
    NORMAL: "Normal Monster",

    MINI_BOSS: "Mini Boss",

    BOSS: "Boss",
  };

  return labels[value] || value || "Monster";
}

function formatCategory(value) {
  const labels = {
    WEAPON: "Weapon",

    ARMOR: "Armor",

    ADDITIONAL: "Additional",

    SPECIAL_GEAR: "Special Gear",

    SUB_WEAPON: "Sub Weapon",

    MATERIAL: "Material",

    CONSUMABLE: "Consumable",
  };

  return labels[value] || value || "Unknown";
}

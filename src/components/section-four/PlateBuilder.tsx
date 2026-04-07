import { useCallback, useId, useState } from "react";

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: Category;
  fiber: number; // grams
  glycemicImpact: "low" | "medium" | "high";
}

type Category = "grains" | "fruits" | "vegetables" | "proteins" | "dairy" | "fats";

const CATEGORY_COLORS: Record<Category, string> = {
  grains: "var(--color-orange)",
  fruits: "var(--color-success)",
  vegetables: "var(--color-green-mid)",
  proteins: "var(--color-green-dark)",
  dairy: "#6b9bd2",
  fats: "#d4a843",
};

const CATEGORY_LABELS: Record<Category, string> = {
  grains: "Whole Grains",
  fruits: "Fruits",
  vegetables: "Vegetables",
  proteins: "Lean Proteins",
  dairy: "Dairy",
  fats: "Healthy Fats",
};

const FOOD_ITEMS: FoodItem[] = [
  { id: "oats", name: "Oatmeal", emoji: "\uD83E\uDD63", category: "grains", fiber: 4, glycemicImpact: "low" },
  { id: "brown-rice", name: "Brown Rice", emoji: "\uD83C\uDF5A", category: "grains", fiber: 3.5, glycemicImpact: "medium" },
  { id: "whole-wheat", name: "Whole Wheat Bread", emoji: "\uD83C\uDF5E", category: "grains", fiber: 3, glycemicImpact: "medium" },
  { id: "apple", name: "Apple", emoji: "\uD83C\uDF4E", category: "fruits", fiber: 4.4, glycemicImpact: "low" },
  { id: "berries", name: "Berries", emoji: "\uD83C\uDF53", category: "fruits", fiber: 5, glycemicImpact: "low" },
  { id: "banana", name: "Banana", emoji: "\uD83C\uDF4C", category: "fruits", fiber: 2.6, glycemicImpact: "medium" },
  { id: "broccoli", name: "Broccoli", emoji: "\uD83E\uDD66", category: "vegetables", fiber: 5.1, glycemicImpact: "low" },
  { id: "spinach", name: "Spinach", emoji: "\uD83E\uDD6C", category: "vegetables", fiber: 4.3, glycemicImpact: "low" },
  { id: "sweet-potato", name: "Sweet Potato", emoji: "\uD83C\uDF60", category: "vegetables", fiber: 3.8, glycemicImpact: "medium" },
  { id: "chicken", name: "Grilled Chicken", emoji: "\uD83C\uDF57", category: "proteins", fiber: 0, glycemicImpact: "low" },
  { id: "fish", name: "Salmon", emoji: "\uD83D\uDC1F", category: "proteins", fiber: 0, glycemicImpact: "low" },
  { id: "lentils", name: "Lentils", emoji: "\uD83E\uDED8", category: "proteins", fiber: 7.8, glycemicImpact: "low" },
  { id: "milk", name: "Low-fat Milk", emoji: "\uD83E\uDD5B", category: "dairy", fiber: 0, glycemicImpact: "low" },
  { id: "yogurt", name: "Greek Yogurt", emoji: "\uD83E\uDD64", category: "dairy", fiber: 0, glycemicImpact: "low" },
  { id: "avocado", name: "Avocado", emoji: "\uD83E\uDD51", category: "fats", fiber: 6.7, glycemicImpact: "low" },
  { id: "nuts", name: "Mixed Nuts", emoji: "\uD83E\uDD5C", category: "fats", fiber: 3, glycemicImpact: "low" },
  { id: "olive-oil", name: "Olive Oil", emoji: "\uD83E\uDED2", category: "fats", fiber: 0, glycemicImpact: "low" },
];

const MAX_PLATE_ITEMS = 5;

function getGlycemicScore(items: FoodItem[]): { label: string; color: string; score: number } {
  if (items.length === 0) return { label: "Empty plate", color: "var(--color-text-muted)", score: 0 };
  const scores = { low: 1, medium: 2, high: 3 };
  const avg = items.reduce((sum, item) => sum + scores[item.glycemicImpact], 0) / items.length;
  if (avg <= 1.3) return { label: "Low glycemic impact", color: "var(--color-success)", score: avg };
  if (avg <= 2) return { label: "Moderate glycemic impact", color: "var(--color-orange)", score: avg };
  return { label: "High glycemic impact", color: "var(--color-danger)", score: avg };
}

export default function PlateBuilder() {
  const [plateItems, setPlateItems] = useState<FoodItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const selectId = useId();

  const addToPlate = useCallback((item: FoodItem) => {
    setPlateItems((prev) => {
      if (prev.length >= MAX_PLATE_ITEMS) return prev;
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromPlate = useCallback((id: string) => {
    setPlateItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const totalFiber = plateItems.reduce((sum, item) => sum + item.fiber, 0);
  const glycemic = getGlycemicScore(plateItems);
  const categories = [...new Set(plateItems.map((i) => i.category))];

  return (
    <div className="mx-auto w-full max-w-lg">
      <h3 className="font-display mb-3 text-center text-xl" style={{ color: "var(--color-green-dark)" }}>
        Build Your Plate
      </h3>

      {/* Plate area */}
      <div
        className="relative mx-auto mb-4 flex min-h-50 w-70 flex-wrap items-center justify-center gap-2 rounded-full border-4 border-dashed p-8 transition-colors"
        style={{
          borderColor: dragOver ? "var(--color-green-mid)" : "var(--color-cream)",
          backgroundColor: dragOver ? "rgba(98, 129, 65, 0.05)" : "rgba(229, 217, 182, 0.2)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const id = e.dataTransfer.getData("text/plain");
          const item = FOOD_ITEMS.find((f) => f.id === id);
          if (item) addToPlate(item);
        }}
        role="region"
        aria-label={`Plate with ${plateItems.length} of ${MAX_PLATE_ITEMS} items`}
      >
        {plateItems.length === 0 && (
          <p className="font-body text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            Drag foods here or use the menu below
          </p>
        )}
        {plateItems.map((item) => (
          <button
            key={item.id}
            onClick={() => removeFromPlate(item.id)}
            className="flex flex-col items-center rounded-lg p-1 transition-transform hover:scale-110"
            aria-label={`Remove ${item.name} from plate`}
            title={`Remove ${item.name}`}
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="font-body text-xs" style={{ color: "var(--color-text-primary)" }}>
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Keyboard-accessible select menu */}
      <div className="mb-4 flex gap-2">
        <label htmlFor={selectId} className="sr-only">
          Add food to plate
        </label>
        <select
          id={selectId}
          className="font-body flex-1 rounded-lg border-2 px-3 py-2 text-sm"
          style={{ borderColor: "var(--color-cream)", backgroundColor: "var(--color-bg)" }}
          defaultValue=""
          onChange={(e) => {
            const item = FOOD_ITEMS.find((f) => f.id === e.target.value);
            if (item) addToPlate(item);
            e.target.value = "";
          }}
          disabled={plateItems.length >= MAX_PLATE_ITEMS}
        >
          <option value="" disabled>
            Add a food item...
          </option>
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <optgroup key={cat} label={label}>
              {FOOD_ITEMS.filter((f) => f.category === cat).map((f) => (
                <option key={f.id} value={f.id} disabled={plateItems.some((p) => p.id === f.id)}>
                  {f.emoji} {f.name} ({f.fiber}g fiber)
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {plateItems.length > 0 && (
          <button onClick={() => setPlateItems([])} className="font-body rounded-lg px-3 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--color-danger)" }}>
            Clear
          </button>
        )}
      </div>

      {/* Draggable food items */}
      <div className="mb-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        {FOOD_ITEMS.map((item) => {
          const onPlate = plateItems.some((p) => p.id === item.id);
          return (
            <button
              key={item.id}
              draggable={!onPlate && plateItems.length < MAX_PLATE_ITEMS}
              onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
              onClick={() => !onPlate && addToPlate(item)}
              disabled={onPlate || plateItems.length >= MAX_PLATE_ITEMS}
              className="flex min-h-11 min-w-11 flex-col items-center rounded-lg p-2 text-center transition-opacity"
              style={{
                opacity: onPlate ? 0.35 : 1,
                backgroundColor: onPlate ? "transparent" : CATEGORY_COLORS[item.category] + "15",
                border: `1px solid ${CATEGORY_COLORS[item.category]}40`,
                cursor: onPlate || plateItems.length >= MAX_PLATE_ITEMS ? "default" : "grab",
              }}
              aria-label={`${item.name}, ${item.fiber}g fiber, ${item.glycemicImpact} glycemic impact${onPlate ? " (on plate)" : ""}`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="font-body text-xs leading-tight" style={{ color: "var(--color-text-primary)" }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Meters */}
      <div className="space-y-3 rounded-xl p-4" style={{ backgroundColor: "var(--color-cream)" + "40" }}>
        {/* Fiber meter */}
        <div>
          <div className="font-body mb-1 flex justify-between text-sm">
            <span style={{ color: "var(--color-text-primary)" }}>Fiber</span>
            <span className="font-semibold" style={{ color: totalFiber >= 8 ? "var(--color-success)" : "var(--color-text-muted)" }}>
              {totalFiber.toFixed(1)}g
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-cream)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalFiber / 25) * 100, 100)}%`,
                backgroundColor: totalFiber >= 8 ? "var(--color-success)" : "var(--color-orange)",
              }}
              role="meter"
              aria-label="Fiber content"
              aria-valuenow={totalFiber}
              aria-valuemin={0}
              aria-valuemax={25}
            />
          </div>
          <p className="font-body mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Goal: 25g+ daily
          </p>
        </div>

        {/* Glycemic impact */}
        <div>
          <div className="font-body mb-1 flex justify-between text-sm">
            <span style={{ color: "var(--color-text-primary)" }}>Glycemic Impact</span>
            <span className="font-semibold" style={{ color: glycemic.color }}>
              {glycemic.label}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--color-cream)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: plateItems.length === 0 ? "0%" : `${(glycemic.score / 3) * 100}%`,
                backgroundColor: glycemic.color,
              }}
              role="meter"
              aria-label="Glycemic impact"
              aria-valuenow={glycemic.score}
              aria-valuemin={0}
              aria-valuemax={3}
            />
          </div>
        </div>

        {/* Category diversity */}
        {plateItems.length > 0 && (
          <div className="font-body flex flex-wrap gap-1.5 pt-1">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: CATEGORY_COLORS[cat] }}>
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

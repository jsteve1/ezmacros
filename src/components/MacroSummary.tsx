import { useMacroTotals } from '../context/MacroTotalsContext';

export default function MacroSummary() {
  const { totals, error } = useMacroTotals();
  console.log('MacroSummary totals:', totals);

  // Calculate total calories (4 calories per gram of carbs/protein, 9 calories per gram of fat)
  const totalCalories = (totals.carbs * 4) + (totals.fat * 9) + (totals.protein * 4);

  if (error) {
    return (
      <div class="text-center text-red-600 dark:text-red-400">
        Error loading macros: {error}
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-4">
        <div class="bg-macro-carbs text-white p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-2">Carbs</h2>
          <p class="text-3xl font-bold">
            {`${totals.carbs}g`}
          </p>
        </div>
        <div class="bg-macro-fat text-white p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-2">Fat</h2>
          <p class="text-3xl font-bold">
            {`${totals.fat}g`}
          </p>
        </div>
        <div class="bg-macro-protein text-white p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold mb-2">Protein</h2>
          <p class="text-3xl font-bold">
            {`${totals.protein}g`}
          </p>
        </div>
      </div>
      <div class="text-center text-xs text-gray-500 dark:text-gray-400">
        {totalCalories} calories
      </div>
    </div>
  );
} 
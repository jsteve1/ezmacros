import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { useMacros } from '../hooks/useMacros';

interface MacroTotalsContextType {
  totals: { carbs: number; fat: number; protein: number };
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const MacroTotalsContext = createContext<MacroTotalsContextType>({
  totals: { carbs: 0, fat: 0, protein: 0 },
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function MacroTotalsProvider({ children }: { children: preact.ComponentChildren }) {
  const macros = useMacros();
  console.log('MacroTotalsProvider updated. Value:', macros);
  return (
    <MacroTotalsContext.Provider value={macros}>
      {children}
    </MacroTotalsContext.Provider>
  );
}

export const useMacroTotals = () => useContext(MacroTotalsContext); 
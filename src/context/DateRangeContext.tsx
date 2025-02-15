import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { startOfDay, endOfDay } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType>({
  dateRange: {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
    label: 'Today'
  },
  setDateRange: () => {}
});

export function DateRangeProvider({ children }: { children: preact.ComponentChildren }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
    label: 'Today'
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
} 
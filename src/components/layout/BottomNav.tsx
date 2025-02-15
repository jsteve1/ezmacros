import { useState } from 'preact/hooks';
import { format } from 'date-fns';
import DateRangeModal from '../DateRangeModal';
import AddEntryModal from '../AddEntryModal';
import EntriesModal from '../EntriesModal';
import { useDateRange } from '../../context/DateRangeContext';
import { useMacroTotals } from '../../context/MacroTotalsContext';

export default function BottomNav() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isEntriesOpen, setIsEntriesOpen] = useState(false);
  const { dateRange, setDateRange } = useDateRange();
  const { refresh: refreshMacros } = useMacroTotals();

  const handleDateSelect = (start: Date, end: Date) => {
    setDateRange({
      start,
      end,
      label: format(start, 'MMM d') === format(end, 'MMM d')
        ? format(start, 'MMM d')
        : `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`
    });
  };

  const handleEntrySuccess = () => {
    console.log('handleEntrySuccess called in BottomNav');
    refreshMacros();
    console.log('refreshMacros called');
  };

  return (
    <>
      <nav class="fixed bottom-0 left-0 right-0 h-16 px-4 flex items-center justify-center bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-accent relative">
        <button
          onClick={() => setIsDatePickerOpen(true)}
          class="absolute left-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 dark:text-gray-200">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <span class="text-gray-700 dark:text-gray-200">{dateRange.label}</span>
        </button>

        <div class="flex items-center gap-2">
          <button
            onClick={() => setIsAddEntryOpen(true)}
            class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 bg-transparent border-none rounded-full"
            aria-label="Add entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-gray-900 dark:text-gray-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <button
            onClick={() => setIsEntriesOpen(true)}
            class="absolute right-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-700 dark:text-gray-200">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span class="text-gray-700 dark:text-gray-200">Entries</span>
          </button>
        </div>
      </nav>

      <DateRangeModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateSelect}
      />

      <AddEntryModal
        isOpen={isAddEntryOpen}
        onClose={() => setIsAddEntryOpen(false)}
        onSuccess={handleEntrySuccess}
      />

      <EntriesModal
        isOpen={isEntriesOpen}
        onClose={() => setIsEntriesOpen(false)}
        onEntryDeleted={handleEntrySuccess}
      />
    </>
  );
} 
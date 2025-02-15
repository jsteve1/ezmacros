import { Dialog } from '@headlessui/react';
import { useState } from 'preact/hooks';
import { format, startOfDay, endOfDay } from 'date-fns';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: Date, end: Date) => void;
}

type PresetRange = {
  label: string;
  getValue: () => { start: Date; end: Date };
};

const presets: PresetRange[] = [
  {
    label: 'Today',
    getValue: () => {
      const now = new Date();
      return {
        start: startOfDay(now),
        end: now
      };
    }
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return {
        start: startOfDay(yesterday),
        end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59)
      };
    }
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const now = new Date();
      const sixDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      return {
        start: startOfDay(sixDaysAgo),
        end: endOfDay(now)
      };
    }
  }
];

export default function DateRangeModal({ isOpen, onClose, onSelect }: DateRangeModalProps) {
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [activePreset, setActivePreset] = useState<string>('Today');

  const handlePresetClick = (preset: PresetRange) => {
    const { start, end } = preset.getValue();
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
    setActivePreset(preset.label);
  };

  const handleApply = () => {
    if (activePreset === 'Today') {
      onSelect(startOfDay(new Date()), new Date());
    } else if (activePreset === 'Yesterday') {
      const now = new Date();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      onSelect(startOfDay(yesterday), new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59));
    } else if (activePreset === 'Last 7 days') {
      const now = new Date();
      const sixDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      onSelect(startOfDay(sixDaysAgo), endOfDay(now));
    } else {
      onSelect(new Date(startDate), new Date(endDate));
    }
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      class="relative z-50"
    >
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel class="relative bg-white dark:bg-dark-bg rounded-lg w-full max-w-md">
          <div class="p-6">
            <Dialog.Title class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Select Date Range
            </Dialog.Title>

            <div class="space-y-4">
              <div class="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    class={`px-4 py-2 text-sm rounded-lg ${
                      activePreset === preset.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-accent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-dark-hover'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Custom Range
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-500 dark:text-gray-400">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate((e.target as HTMLInputElement).value);
                        setActivePreset('Custom');
                      }}
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-accent bg-white dark:bg-dark-accent text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm text-gray-500 dark:text-gray-400">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => {
                        setEndDate((e.target as HTMLInputElement).value);
                        setActivePreset('Custom');
                      }}
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-accent bg-white dark:bg-dark-accent text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 
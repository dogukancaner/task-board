import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { calendarStyles } from '@/styles/calendarStyles'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  label: string
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  minDate?: Date
}

export function DatePicker({
  label,
  date,
  onSelect,
  isOpen,
  onOpenChange,
  minDate,
}: DatePickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700">{label}</Label>
      <div className="hidden sm:block">
        <Popover open={isOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50',
                !date && 'text-gray-500'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {date ? format(date, 'PP') : `Select ${label}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onSelect}
              initialFocus
              className="mx-auto border border-gray-200 rounded-lg"
              classNames={calendarStyles}
              disabled={minDate ? (date) => date < minDate : undefined}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

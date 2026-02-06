"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  date?: Date;
  setDate: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
}
export function DatePicker({ date, setDate, disabled, placeholder }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-full h-12.5 justify-start text-left text-lg font-normal"
        >
          <CalendarIcon />
          {date ?
            format(date, "PPP")
          : <span>{placeholder ? placeholder : " Select Date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}

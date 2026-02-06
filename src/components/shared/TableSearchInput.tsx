import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props<TData> {
  filters: Array<{
    columnId: string;
    label: string;
  }>;
  table: Table<TData>;
}

export default function TableSearchInput<TData>({
  filters,
  table,
}: Props<TData>) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchValue(value);

    if (selectedFilter && value) {
      table?.getColumn(selectedFilter)?.setFilterValue(value.trim());
    } else if (!value) {
      table.resetColumnFilters();
    }
  };

  const handleColumnChange = (value: string) => {
    table.resetColumnFilters();
    setSelectedFilter(value);
    if (searchValue.length > 0) {
      const column = table.getColumn(value);
      if (column) {
        column.setFilterValue({
          value: searchValue.trim(),
        });
      }
    }
  };

  return (
    <Field className="w-150 ml-auto">
      <InputGroup className="focus-visible:ring-primary placeholder:text-lg  h-15 ">
        <InputGroupInput
          value={searchValue}
          onChange={
            selectedFilter.trim().length > 0 ? handleInputChange : undefined
          }
          className="min-w-100"
          id="input-group-url"
          placeholder={`Search By ${filters.find((each) => each.columnId === selectedFilter)?.label ?? "Name Or Email"}...`}
        />
        <InputGroupAddon>
          <SearchIcon className="scale-[1.3]" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Select onValueChange={handleColumnChange}>
            <SelectTrigger className="w-full h-15 text-sm">
              <SelectValue placeholder="Search By" />
            </SelectTrigger>
            <SelectContent className="w-full  shadow-2xl  py-4 text-sm">
              {filters.map(({ columnId, label }) => {
                return (
                  <SelectItem
                    className="text-lg focus:bg-primary focus:text-white"
                    key={columnId}
                    value={columnId}
                  >
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

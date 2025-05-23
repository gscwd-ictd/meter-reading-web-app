"use client";

import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { Button } from "@mr/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mr/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Employee } from "@mr/lib/types/personnel";
import { cn } from "@mr/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Check, CircleUserRoundIcon, User2Icon } from "lucide-react";
import { FunctionComponent, useEffect, useState } from "react";

export const SearchPersonnelCombobox: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [currentEmployees, setCurrentEmployees] = useState<Employee[]>([]);
  const employees = usePersonnelStore((state) => state.employees);

  useEffect(() => {
    setCurrentEmployees(employees.filter((employee) => employee.isMeterReader === false));
  }, [employees]);

  const setSelectedEmployee = usePersonnelStore((state) => state.setSelectedEmployee);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <span className="flex gap-2 items-center">
              <User2Icon className="size-4" />
              {currentEmployees?.find((employee) => employee.fullName === value)?.fullName}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <MagnifyingGlassIcon /> Select Employee...
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command>
          <CommandInput placeholder="Search employee..." />
          <CommandList>
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {currentEmployees &&
                currentEmployees.map((employee) => (
                  <CommandItem
                    key={employee.idNo}
                    value={employee.fullName}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setSelectedEmployee(employee);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CircleUserRoundIcon className="size-7" />
                      <div className="flex flex-col">
                        <span className="font-semibold">{employee.fullName}</span>
                        <span className="text-xs  text-gray-500">{employee.designation}</span>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value.toLowerCase().includes(employee.fullName.toLowerCase())
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

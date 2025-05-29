/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { Button } from "@mr/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { FunctionComponent, useEffect } from "react";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { PlusCircleIcon, Users2Icon } from "lucide-react";
import { PersonnelTabs } from "./PersonnelTabs";
import { SearchPersonnelCombobox } from "./SearchPersonnelCombobox";
import { Employee } from "@mr/lib/types/personnel";
import { toast } from "sonner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

export const AddPersonnelDialog: FunctionComponent = () => {
  const setSelectedEmployee = usePersonnelStore((state) => state.setSelectedEmployee);
  const addPersonnelDialogIsOpen = usePersonnelStore((state) => state.addPersonnelDialogIsOpen);
  const selectedEmployee = usePersonnelStore((state) => state.selectedEmployee);
  const setAddPersonnelDialogIsOpen = usePersonnelStore((state) => state.setAddPersonnelDialogIsOpen);
  const meterReaders = usePersonnelStore((state) => state.meterReaders);
  const setMeterReaders = usePersonnelStore((state) => state.setMeterReaders);
  const employees = usePersonnelStore((state) => state.employees);
  const setEmployees = usePersonnelStore((state) => state.setEmployees);
  const selectedRestDay = usePersonnelStore((state) => state.selectedRestDay);
  const setSelectedRestDay = usePersonnelStore((state) => state.setSelectedRestDay);
  const setMeterReaderZonebooks = useZonebookStore((state) => state.setMeterReaderZonebooks);
  const meterReaderZonebooks = useZonebookStore((state) => state.meterReaderZonebooks);

  const zonebookSelectorIsOpen = useZonebookStore((state) => state.zonebookSelectorIsOpen);

  const submitPersonnel = () => {
    if (selectedRestDay !== undefined) {
      const newMeterReaders = [...meterReaders];
      newMeterReaders?.push({
        ...selectedEmployee,
        name: selectedEmployee?.name!,
        mobileNumber: selectedEmployee?.mobileNumber!,
        positionTitle: selectedEmployee?.positionTitle!,
        companyId: selectedEmployee?.companyId!,
        employeeId: selectedEmployee?.employeeId!,
        photoUrl: selectedEmployee?.photoUrl!,
        isMeterReader: true,
        restDay: selectedRestDay,
        zonebooks: meterReaderZonebooks,
      });

      const newEmployees = [...employees];
      const employeeToChange = newEmployees.find(
        (employee) => employee.companyId === selectedEmployee?.companyId
      );
      if (employeeToChange) {
        employeeToChange.isMeterReader = true;
      }

      setEmployees(newEmployees);
      setMeterReaders(newMeterReaders);
      setAddPersonnelDialogIsOpen(false);
      setSelectedRestDay(undefined);
      setMeterReaderZonebooks([]);

      toast.success("Success", {
        description: "You have successfully added a meter reader!",
        position: "top-right",
      });
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (addPersonnelDialogIsOpen) setSelectedEmployee(undefined);
  }, [addPersonnelDialogIsOpen]);

  return (
    <Dialog
      open={addPersonnelDialogIsOpen}
      onOpenChange={() => {
        setAddPersonnelDialogIsOpen(!addPersonnelDialogIsOpen);
        setMeterReaderZonebooks([]);
      }}
      modal
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircleIcon />
          Add personnel
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-full w-[42rem]"
        onInteractOutside={(e) => {
          if (zonebookSelectorIsOpen) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-col gap-0 ">
          <DialogTitle className="text-xl font-bold text-primary flex gap-1 items-center">
            <Users2Icon className="size-5" /> Personnel
          </DialogTitle>
          <DialogDescription className="text-gray-500">Add new meter reader</DialogDescription>
        </DialogHeader>
        <div className="">
          <SearchPersonnelCombobox />
          <PersonnelTabs />
        </div>

        <DialogFooter className="grid grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setAddPersonnelDialogIsOpen(false);
              setSelectedEmployee({} as Employee);
            }}
          >
            Cancel
          </Button>

          <Button size="lg" disabled={!selectedEmployee ? true : false} onClick={submitPersonnel}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
import { PlusCircleIcon } from "lucide-react";
import { PersonnelTabs } from "./PersonnelTabs";
import { SearchPersonnelCombobox } from "./SearchPersonnelCombobox";
import { Employee } from "@mr/lib/types/personnel";
import { toast } from "sonner";

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

  const submitPersonnel = () => {
    if (selectedRestDay !== undefined) {
      const newMeterReaders = [...meterReaders];
      newMeterReaders?.push({
        ...selectedEmployee,
        fullName: selectedEmployee?.fullName!,
        contactNumber: selectedEmployee?.contactNumber!,
        designation: selectedEmployee?.designation!,
        idNo: selectedEmployee?.idNo!,
        isMeterReader: true,
        restDay: selectedRestDay,
      });

      const newEmployees = [...employees];
      const employeeToChange = newEmployees.find((employee) => employee.idNo === selectedEmployee?.idNo);
      if (employeeToChange) {
        employeeToChange.isMeterReader = true;
      }

      setEmployees(newEmployees);
      setMeterReaders(newMeterReaders);
      setAddPersonnelDialogIsOpen(false);
      setSelectedRestDay(undefined);

      toast.success("Success", {
        description: "You have successfully added a meter reader!",
        position: "top-right",
      });
    } else toast.error("No rest day", { description: "Please select a rest day", position: "top-right" });
  };

  // set the selected employee to undefined when the modal is closed
  useEffect(() => {
    if (addPersonnelDialogIsOpen) setSelectedEmployee({} as Employee);
  }, [addPersonnelDialogIsOpen]);

  return (
    <Dialog open={addPersonnelDialogIsOpen} onOpenChange={setAddPersonnelDialogIsOpen} modal>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircleIcon />
          Add personnel
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader className="flex flex-col gap-0 px-2">
          <DialogTitle className="text-xl font-bold text-gray-700">Personnel</DialogTitle>
          <DialogDescription className="text-gray-500">Add new meter reader</DialogDescription>
        </DialogHeader>
        <div className="px-2 py-5">
          <SearchPersonnelCombobox />
          <PersonnelTabs />
        </div>

        <DialogFooter className="grid grid-cols-2">
          <Button
            variant="outline"
            onClick={() => {
              setAddPersonnelDialogIsOpen(false);
              setSelectedEmployee({} as Employee);
            }}
          >
            Cancel
          </Button>
          <Button onClick={submitPersonnel}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

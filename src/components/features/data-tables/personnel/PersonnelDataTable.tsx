"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { usePersonnelColumns } from "./PersonnelColumns";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { Employee } from "@mr/lib/types/personnel";

const employeesDump: Employee[] = [
  {
    idNo: "2022-021",
    fullName: "Ricardo Vincent P. Narvaiza",
    contactNumber: "09988788888",
    designation: "Customer Service Assistant A",
    isMeterReader: false,
  },
  {
    idNo: "2003-010",
    fullName: "Kallen Klauser M. Cabanlit",
    contactNumber: "09988788888",
    designation: "Customer Service Assistant A",
    isMeterReader: false,
  },
  {
    idNo: "2006-002",
    fullName: "Ricky Joseph B. Landingin",
    contactNumber: "09988788888",
    designation: "Customer Service Assistant A",
    isMeterReader: false,
  },
  {
    idNo: "2003-001",
    fullName: "Paul Ryner F. Ogdamin",
    contactNumber: "09988788888",
    designation: "Customer Service Assistant A",
    isMeterReader: false,
  },
  {
    idNo: "2004-005",
    fullName: "Testy Boy",
    contactNumber: "09988788888",
    designation: "Customer Service Assistant A",
    isMeterReader: true,
  },
];

export const PersonnelDataTable: FunctionComponent = () => {
  const meterReaders = usePersonnelStore((state) => state.meterReaders);
  const employees = usePersonnelStore((state) => state.employees);
  const setMeterReaders = usePersonnelStore((state) => state.setMeterReaders);
  const setEmployees = usePersonnelStore((state) => state.setEmployees);

  useEffect(() => {
    setEmployees(employeesDump); //! REMOVE THIS!!!
  }, []);

  useEffect(() => {
    const currentMeterReaders = employees.filter((employee) => employee.isMeterReader === true);
    setMeterReaders(
      currentMeterReaders.map((meterReader) => {
        return { ...meterReader, zoneBooks: [] };
      })
    );
  }, [employees, setMeterReaders]);

  const personnelColumns = usePersonnelColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ?? []} columns={personnelColumns} />
    </Suspense>
  );
};

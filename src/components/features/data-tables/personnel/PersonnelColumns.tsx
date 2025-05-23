"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { PersonnelRowActions } from "./PersonnelRowActions";
import { MeterReader as PersonnelColumn } from "@mr/lib/types/personnel";

export const usePersonnelColumns = (data: PersonnelColumn[] | undefined) => {
  const [personnelColumns, setPersonnelColumns] = useState<ColumnDef<PersonnelColumn>[]>([]);

  const filterFn: FilterFn<PersonnelColumn> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<PersonnelColumn>[] = [
      {
        accessorKey: "idNo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID No." />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.idNo}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span>{row.original.fullName}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "designation",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Designation" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.designation}</span>,
        meta: {
          exportLabel: "Designation",
        },
      },

      {
        accessorKey: "contactNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No." />,
        cell: ({ row }) => <span>{row.original.contactNumber}</span>,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <PersonnelRowActions idNo={row.original.idNo} />,
      },
    ];

    setPersonnelColumns(cols);
  }, [data]);

  return personnelColumns;
};

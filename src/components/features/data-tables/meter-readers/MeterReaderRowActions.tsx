/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReader } from "@mr/lib/types/personnel";
import { CircleXIcon, MapPinnedIcon } from "lucide-react";
import { FunctionComponent } from "react";

type PersonnelRowActionsProps = {
  meterReader: MeterReader;
};

// zone 8-63

export const MeterReaderRowActions: FunctionComponent<PersonnelRowActionsProps> = ({ meterReader }) => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);
  const setZonebookDialogIsOpen = useSchedulesStore((state) => state.setZonebookDialogIsOpen);

  const assignZonebook = (meterReader: MeterReader) => {
    setSelectedMeterReader(meterReader);
    setZonebookDialogIsOpen(true);
  };

  const removeMeterReader = (companyId: string) => {
    const temporaryMeterReaders = [...selectedScheduleEntry!.meterReaders!];

    setSelectedScheduleEntry({
      ...selectedScheduleEntry,
      readingDate: selectedScheduleEntry?.readingDate!,
      disconnectionDate: selectedScheduleEntry?.disconnectionDate!,
      dueDate: selectedScheduleEntry?.dueDate!,
      meterReaders: temporaryMeterReaders.filter((mr) => mr.companyId !== companyId),
    });
  };

  return (
    <>
      <div className="flex grid-cols-2 gap-2">
        <div className="col-span-1">
          <Button className="w-full px-2" size="sm" onClick={() => assignZonebook(meterReader)}>
            <MapPinnedIcon className="size-2 sm:size-2 lg:size-4" />
            <span className="text-xs"> Zonebooks</span>
          </Button>
        </div>
        <div className="col-span-1">
          <Button
            variant="destructive"
            className="w-full px-2"
            size="sm"
            onClick={() => removeMeterReader(meterReader.companyId)}
          >
            <CircleXIcon className="size-2 sm:size-2 lg:size-4 fill-red-600 text-white" />
            <span className="text-xs">Remove</span>
          </Button>
        </div>
        {/* <div className="col-span-1">
          <Button
            variant="outline"
            className="w-full px-2"
            size="sm"
            onClick={() => console.log(selectedScheduleEntry)}
          >
            <XIcon className="size-2 sm:size-2 lg:size-4" /> <span className="text-xs">Log Meter Reader</span>
          </Button>
        </div> */}
      </div>
    </>
  );
};

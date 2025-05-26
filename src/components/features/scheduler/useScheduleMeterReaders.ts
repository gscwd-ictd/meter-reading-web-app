import { MeterReader } from "@mr/lib/types/personnel";
import { MeterReadingSchedule } from "./useScheduler";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

export type ScheduleMeterReaders = ReturnType<typeof useScheduleMeterReaders>;

export const useScheduleMeterReaders = (schedule: MeterReadingSchedule[], meterReaders?: MeterReader[]) => {
  // Utility function to have a uniform format for dates  , added dd
  const formatDate = (date: Date | undefined, dateFormat?: "yyyy-MM-dd" | "MMM dd" | "dd") => {
    if (!date) return undefined;

    if (!dateFormat) {
      dateFormat = "yyyy-MM-dd";
    }

    return format(date, dateFormat);
  };

  const allReadingDates = useCallback((): Date[] => {
    const schedDates: Date[] = [];

    schedule.filter((sched) => {
      if (sched.readingDate !== undefined) return schedDates.push(sched.readingDate);
    });

    return schedDates;
  }, [schedule]);

  //   schedule.filter((sched) => sched.readingDate !== undefined);

  // const getRestDayDates = useMemo(()=>meterReaders.map((meterReader)=>{

  // // function getSundayRestDays(dates:Date[])

  //     return {restDays: []}
  // }),[meterReaders])

  return { allReadingDates };
};

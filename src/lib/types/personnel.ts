import { MeterReadingSchedule } from "@mr/components/features/scheduler/useScheduler";

export type Employee = {
  fullName: string;
  idNo: string;
  contactNumber: string;
  designation: string;
  isMeterReader?: boolean;
};

export type MeterReader = Employee & { restDay: "sunday" | "saturday" | undefined };

export type MeterReaderWithSchedules = {
  meterReadingSchedule: Array<MeterReadingSchedule>;
};

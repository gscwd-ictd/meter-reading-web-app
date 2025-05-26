import { create } from "zustand";
import { MeterReadingSchedule } from "../features/scheduler/useScheduler";

type SchedulesStore = {
  schedule: MeterReadingSchedule[];
  setSchedule: (schedule: MeterReadingSchedule[]) => void;
};

export const useSchedulesStore = create<SchedulesStore>((set) => ({
  schedule: [],
  setSchedule: (schedule) => set({ schedule }),
}));

import {
  addDays,
  compareAsc,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isSunday,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

type DueDate = {
  readingDate: Date;
  dueDate: Date;
};

type DisconnectionDate = {
  readingDate: Date;
  dueDate: Date;
  disconnectionDate: Date;
};

export type MeterReadingSchedule = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export class MeterReadingScheduler {
  private restDays: Date[] = [];
  private currentDate: Date;
  private holidays: string[] = [];

  constructor(holidays: Holiday[], restDays: Date[], currentDate?: Date) {
    this.restDays = restDays;
    this.currentDate = !currentDate ? new Date() : currentDate;
    this.holidays = this.parseHolidays(holidays);
  }

  public formatDate(date: Date | undefined, dateFormat?: "yyyy-MM-dd" | "MMM dd") {
    if (!date) return undefined;

    if (!dateFormat) {
      dateFormat = "yyyy-MM-dd";
    }

    return format(date, dateFormat);
  }

  public parseHolidays(holidays: Holiday[]) {
    return holidays.map((holiday) =>
      format(parse(holiday.holidayDate, "MMMM dd, yyyy", new Date()), "yyyy-MM-dd")
    );
  }

  public isHoliday(date: Date) {
    return this.holidays.includes(this.formatDate(date) as string);
  }

  public isRestDay(date: Date) {
    return this.restDays.includes(date);
  }

  public addBusinessDays(originalDate: Date, daysToAdd: number) {
    let daysAdded = 0;
    let date = originalDate;

    while (daysAdded < daysToAdd) {
      date = addDays(date, 1);

      if (!isWeekend(date) && !this.isHoliday(date)) {
        daysAdded++;
      }
    }

    return date;
  }

  public adjustForHolidayOrWeekend(originalDate: Date) {
    let date = originalDate;

    while (this.isHoliday(date) || isWeekend(date)) {
      if (this.isHoliday(date)) {
        date = addDays(date, 1);
      }

      if (isWeekend(date)) {
        date = nextMonday(date);
      }
    }

    return date;
  }

  public removeDuplicateDates(dates: Date[]) {
    const uniqueDates = new Map<string, Date>();

    dates.forEach((date) => {
      const formattedDate = this.formatDate(date) as string; // Normalize to YYYY-MM-DD format

      if (!uniqueDates.has(formattedDate)) {
        uniqueDates.set(formattedDate, date);
      }
    });

    return Array.from(uniqueDates.values());
  }

  public addSundayReadings(schedule: MeterReadingSchedule[]) {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        currentReading.dueDate = previousReading.dueDate;
        currentReading.disconnectionDate = previousReading.disconnectionDate;
      }
    }

    return updatedSchedule;
  }

  public removeSundayReadings(schedule: MeterReadingSchedule[]) {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        currentReading.dueDate = undefined;
        currentReading.disconnectionDate = undefined;
      }
    }

    return updatedSchedule;
  }

  public getCalendarDays() {
    const firstDayOfMonth = startOfMonth(this.currentDate);
    const lastDayOfMonth = endOfMonth(this.currentDate);

    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    const calendarDays = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });

    return calendarDays;
  }

  public getStartingReadingDate() {
    const monthStart = startOfMonth(this.currentDate);

    let startOfReadingDate = monthStart;

    //* Use this instead, if starting date requires to skip holidays as well.
    // while (isHoliday(startOfReadingDate) || isSunday(startOfReadingDate)) {
    //   startOfReadingDate = adjustForHolidayOrWeekend(startOfReadingDate);
    // }

    if (isSunday(startOfReadingDate)) {
      startOfReadingDate = nextMonday(startOfReadingDate);
    }

    while (this.isRestDay(startOfReadingDate)) {
      startOfReadingDate = addDays(startOfReadingDate, 1);
    }

    return { monthStart, startOfReadingDate };
  }

  public calculateDueDates() {
    const { monthStart, startOfReadingDate } = this.getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let dueDate = readingDate;
    let readingCount = 1;

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingCount < 22) {
      dueDate = this.adjustForHolidayOrWeekend(dueDate);

      if (isSunday(readingDate)) {
        readingDate = nextMonday(readingDate);
      }

      if (this.isRestDay(readingDate)) {
        readingDate = addDays(readingDate, 1);
      }

      dueDates.push({ readingDate, dueDate });

      readingDate = addDays(readingDate, 1);
      dueDate = addDays(dueDate, 1);
      readingCount++;
    }

    return dueDates;
  }

  public calculateDisconnectionDates(dueDates: DueDate[]): DisconnectionDate[] {
    let disconnectionDate = dueDates[0]!.dueDate;

    const disconnectionDates = dueDates.map((date, index) => {
      if (index === 0) {
        disconnectionDate = this.addBusinessDays(disconnectionDate, 3);
      } else {
        disconnectionDate = addDays(disconnectionDate, 1);
      }

      disconnectionDate = this.adjustForHolidayOrWeekend(disconnectionDate);

      return { ...date, disconnectionDate };
    });

    return disconnectionDates;
  }

  public calculateMeterReadingSchedule() {
    const calendarDays = this.getCalendarDays();
    const dueDates = this.calculateDueDates();
    const disconnectionDates = this.calculateDisconnectionDates(dueDates);

    const schedule = calendarDays.map((date) => {
      const existingEntry = disconnectionDates.find(
        (dateEntry) => this.formatDate(dateEntry.readingDate) === this.formatDate(date)
      );

      return existingEntry
        ? existingEntry
        : {
            readingDate: date,
            dueDate: undefined,
            disconnectionDate: undefined,
          };
    });

    return schedule;
  }

  public splitDates(selectedDates: Date[]) {
    const schedule = this.calculateMeterReadingSchedule();

    // Sort the selected dates chronologically
    const sortedSelectedDates = [...selectedDates].sort(compareAsc);

    let split: MeterReadingSchedule[] = [...schedule];

    // Helper function to find previous valid reading with defined dates
    const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
      let lookBack = 1;

      while (
        (!readings[idx - lookBack]?.dueDate && !readings[idx - lookBack]?.disconnectionDate) ||
        isSunday(readings[idx - lookBack]?.readingDate as Date)
      ) {
        lookBack++;
      }

      return readings[idx - lookBack];
    };

    // Process each selected date
    for (let i = 0; i < sortedSelectedDates.length; i++) {
      const result: MeterReadingSchedule[] = [];
      let startIndex = 0;

      const currentSelectedDate = sortedSelectedDates[i]!;

      for (let j = startIndex; j < split.length; j++) {
        // Insert all leading dates before the first selected date
        if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
          result.push(split[j]!);
        }

        // Handle case when selected date is found
        if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
          const curr = split[j];
          const prev = findPreviousValidReading(split, j);

          const currentReading: MeterReadingSchedule = {
            readingDate: curr?.readingDate as Date,
            dueDate: [curr?.dueDate, prev?.dueDate] as Date[],
            disconnectionDate: [curr?.disconnectionDate, prev?.disconnectionDate] as Date[],
          };

          result.push(currentReading);

          startIndex = j + 1;

          // Process the remaining readings
          for (let k = startIndex; k < split.length; k++) {
            const curr = split[k];

            // If the current dueDate and disconnectionDate is undefined, skip shifting dates
            if (!curr?.dueDate && !curr?.disconnectionDate) {
              result.push(curr!);
              continue;
            }

            // Find previous valid reading to get dates from
            const prev = findPreviousValidReading(split, k);

            const nextReadingDate: MeterReadingSchedule = {
              readingDate: curr?.readingDate as Date,
              dueDate: prev?.dueDate,
              disconnectionDate: prev?.disconnectionDate,
            };

            result.push(nextReadingDate);
          }
        }
      }

      split = [...result];
    }

    return split;
  }
}

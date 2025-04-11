/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, type FunctionComponent } from "react";
import { MeterReadingSchedule, useScheduler } from "./useScheduler";
import { holidays } from "./holidays";
import { endOfMonth, format, formatDate, startOfMonth } from "date-fns";
import { Button } from "@mr/components/ui/Button";
import { CalendarPlus, ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { ButtonGroup } from "@mr/components/ui/ButtonGroup";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { users } from "./users";

export const Scheduler: FunctionComponent = () => {
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([]);
  const [schedule, setSchedule] = useState<MeterReadingSchedule[]>([]);

  const scheduler = useScheduler(holidays, []);

  useEffect(() => {
    setSchedule(scheduler.calculateSchedule());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler.currentDate]);

  // Calculate number of rows needed for the calendar
  const numberOfWeeks = Math.ceil(scheduler.calculateSchedule().length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  return (
    <div className="flex h-full flex-col border-y">
      <header className="flex items-center justify-between p-4">
        <section className="flex items-center gap-4">
          <div className="flex size-14 flex-col overflow-clip rounded-lg border">
            <div className="bg-secondary text-secondary-foreground/70 flex flex-1 items-center justify-center border-b text-xs font-semibold tracking-wider uppercase">
              {format(new Date(), "MMM")}
            </div>

            <div className="flex flex-1 items-center justify-center text-lg font-bold">
              {format(new Date(), "dd")}
            </div>
          </div>

          <div>
            <h1 className="text-lg font-bold">{format(scheduler.currentDate, "MMMM yyyy")}</h1>

            <section className="text-muted-foreground flex items-center gap-1 text-sm">
              <p>{format(startOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
              <p>{`-`}</p>
              <p>{format(endOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
            </section>
          </div>
        </section>

        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => {
              scheduler.goToPreviousMonth();
              setDatesToSplit([]);
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              scheduler.today();
              setDatesToSplit([]);
            }}
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              scheduler.goToNextMonth();
              setDatesToSplit([]);
            }}
          >
            <ChevronRight />
          </Button>
        </ButtonGroup>

        <section className="flex items-center gap-2">
          <section className="flex items-center gap-4">
            <StackedAvatars users={users} />
            <div className="space-x-2">
              <Button>
                <CalendarPlus />
                Add schedule
              </Button>
              <Button size="icon" variant="outline">
                <Ellipsis />
              </Button>
            </div>
          </section>
        </section>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden h-full">
        <section className="grid grid-cols-7 border-y">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div
              key={index}
              className="border-l py-2 text-center text-xs font-semibold uppercase first:border-l-0"
            >
              {day}
            </div>
          ))}
        </section>

        <section className="flex-1" style={gridStyle}>
          {schedule.map((date, index) => {
            // const isWithinMonth = isSameMonth(date.readingDate, startOfMonth(scheduler.currentDate));

            return (
              <div
                key={index}
                className="col-span-1 overflow-hidden border-t border-l p-2 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0 h-full"
              >
                {formatDate(date.readingDate, "dd")}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Fragment, useEffect, useState } from "react";
import { MeterReadingSchedule, useScheduler } from "./useScheduler";
import { holidays } from "./holidays";
import {
  compareAsc,
  endOfMonth,
  format,
  formatDate,
  getDate,
  isSameMonth,
  isSaturday,
  isSunday,
  startOfMonth,
} from "date-fns";
import { Button } from "@mr/components/ui/Button";
import { CalendarPlus, ChevronLeft, ChevronRight, Ellipsis, EllipsisIcon, LogsIcon } from "lucide-react";
import { ButtonGroup } from "@mr/components/ui/ButtonGroup";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { users } from "./users";
import { Badge } from "@mr/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { toast } from "sonner";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { useScheduleMeterReaders } from "./useScheduleMeterReaders";

export default function Scheduler() {
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([]);
  const schedule = useSchedulesStore((state) => state.schedule);
  const setSchedule = useSchedulesStore((state) => state.setSchedule);

  const meterReaders = usePersonnelStore((state) => state.meterReaders);
  const scheduleMeterReaders = useScheduleMeterReaders(schedule);

  // console.log(schedule);

  const scheduler = useScheduler(holidays, []);

  const sundayReadings = scheduler.addSundayReadings(schedule!);

  // console.log(sundayReadings);

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

  // useEffect(() => {
  //   const newDates = scheduler.splitDates(datesToSplit);
  //   // setSchedule(newDates);
  //   console.log(newDates);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [datesToSplit, schedule]);

  return (
    <div className="flex h-full flex-col ">
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

        <section className="flex items-center gap-0">
          <section className="flex items-center gap-4">
            <StackedAvatars
              users={meterReaders.map((meterReader) => {
                return { id: meterReader.idNo, image: "", name: meterReader.fullName };
              })}
            />
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log(scheduleMeterReaders.allReadingDates());
                }}
              >
                <LogsIcon />
                Log Schedule
              </Button>
              <Button
                disabled={meterReaders.length < 1 ? true : false}
                onClick={() => {
                  // console.log(scheduleMeterReaders.allReadingDates());
                }}
              >
                <CalendarPlus />
                Populate schedule
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
          {schedule &&
            schedule.map((date, index) => {
              const isWithinMonth = isSameMonth(date.readingDate, startOfMonth(scheduler.currentDate));
              const dateIsSunday = isSunday(date.readingDate);
              const dateIsSaturday = isSaturday(date.readingDate);

              return (
                <div
                  key={index}
                  className="grid grid-rows-4 gap-0 relative group overflow-hidden border-t border-l p-0.5 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0 h-full"
                >
                  <div
                    className={`flex justify-center items-center font-bold ${
                      isWithinMonth ? "" : "text-gray-300"
                    } items-center text-center`}
                  >
                    {formatDate(date.readingDate, "dd")}
                  </div>

                  {/* Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`border-0 bg-white shadow-none transition-all absolute top-2 right-2 ${
                          isWithinMonth && !dateIsSunday ? "invisible  group-hover:visible " : "invisible"
                        }`}
                      >
                        <EllipsisIcon className="text-gray-700 size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => {
                          if (
                            getDate(schedule[index].readingDate) > 1 &&
                            date.dueDate !== undefined &&
                            date.disconnectionDate !== undefined &&
                            !Array.isArray(schedule[index - 1].dueDate) &&
                            !Array.isArray(schedule[index + 1].dueDate)
                          ) {
                            const newSplitDates = [...datesToSplit];
                            newSplitDates.push(date.readingDate);
                            setDatesToSplit(newSplitDates);
                            setSchedule(scheduler.splitDates(newSplitDates));
                          } else if (
                            getDate(schedule[index].readingDate) === 1 &&
                            date.dueDate !== undefined &&
                            date.disconnectionDate !== undefined &&
                            !Array.isArray(schedule[index + 1].dueDate)
                          )
                            toast.error("Error", {
                              description: "Cannot split dates on the beginning of the month!",
                              position: "top-right",
                              duration: 2000,
                            });
                          else
                            toast.error("Error", {
                              description:
                                "Cannot split date, multiple same-day reading dates are not allowed!",
                              position: "top-right",
                              duration: 2000,
                            });
                        }}
                      >
                        Split Dates
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* DUE */}
                  {Array.isArray(date.dueDate) ? (
                    <div className=" flex justify-center items-center">
                      {(() => {
                        const days = date.dueDate.sort(compareAsc);

                        return (
                          <>
                            <Badge className="rounded-none bg-blue-200 w-full gap-0">
                              <span className="text-blue-600">
                                {days.map((day, idx) => {
                                  if (idx === 0)
                                    return (
                                      <span className="font-bold" key={idx}>
                                        {formatDate(day, "MMM dd")}
                                      </span>
                                    );
                                  else if (idx === 1)
                                    return (
                                      <span className="font-bold" key={idx}>
                                        /{formatDate(day, "dd")}
                                      </span>
                                    );
                                })}
                              </span>
                            </Badge>
                          </>
                        );
                      })()}
                    </div>
                  ) : date.dueDate ? (
                    <div className="flex justify-center items-center">
                      <Badge className="rounded-none w-full bg-blue-200 gap-0">
                        <span className="text-blue-600 font-bold ">
                          {scheduler.formatDate(date.dueDate, "MMM dd")}
                        </span>
                      </Badge>
                    </div>
                  ) : null}

                  {/* DISCONNECTION */}
                  {Array.isArray(date.disconnectionDate) ? (
                    <div className="flex justify-center items-center">
                      {(() => {
                        const days = date.disconnectionDate.sort(compareAsc);

                        return (
                          <>
                            <Badge className="rounded-none w-full bg-red-200 gap-0">
                              <span className="text-red-600">
                                {days.map((day, idx) => {
                                  if (idx === 0)
                                    return (
                                      <span className="font-bold" key={idx}>
                                        {formatDate(day, "MMM dd")}
                                      </span>
                                    );
                                  else if (idx === 1)
                                    return (
                                      <span className="font-bold" key={idx}>
                                        /{formatDate(day, "dd")}
                                      </span>
                                    );
                                })}
                              </span>
                            </Badge>
                          </>
                        );
                      })()}
                    </div>
                  ) : date.disconnectionDate ? (
                    <div className="flex justify-center items-center">
                      <Badge className="rounded-none bg-red-200 w-full gap-0">
                        <span className="text-red-600 font-bold">
                          {scheduler.formatDate(date.disconnectionDate, "MMM dd")}
                        </span>
                      </Badge>
                    </div>
                  ) : null}

                  {(dateIsSunday || dateIsSaturday) && isWithinMonth && date.dueDate && (
                    <div className="flex justify-center items-center">
                      <Badge className=" rounded-none font-medium bg-gray-200 gap-0 w-full text-[5px] sm:text-[5px] lg:text-xs tracking-wide text-gray-600">
                        Applicable Rest Day
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
        </section>
      </main>
    </div>
  );
}

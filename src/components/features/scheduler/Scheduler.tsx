/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Fragment, useEffect, useState } from "react";
import { MeterReadingSchedule, useScheduler } from "./useScheduler";
import { holidays } from "./holidays";
import { compareAsc, endOfMonth, format, formatDate, getDate, isSameMonth, startOfMonth } from "date-fns";
import { Button } from "@mr/components/ui/Button";
import { CalendarPlus, ChevronLeft, ChevronRight, Ellipsis, EllipsisIcon } from "lucide-react";
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

export default function Scheduler() {
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([]);
  const [schedule, setSchedule] = useState<MeterReadingSchedule[]>([]);

  // console.log(schedule);

  const scheduler = useScheduler(holidays, []);

  // const sundayReadings = scheduler.addSundayReadings(schedule);

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
            const isWithinMonth = isSameMonth(date.readingDate, startOfMonth(scheduler.currentDate));

            return (
              <div
                key={index}
                className="flex flex-col gap-0.5 relative group overflow-hidden border-t border-l p-0.5 text-sm [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0 h-full"
              >
                <div className="flex justify-center items-center pb-5 ">
                  <div className={`font-bold ${isWithinMonth ? "" : "text-gray-300"}`}>
                    {formatDate(date.readingDate, "dd")}
                  </div>
                </div>

                {/* Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`border-0 bg-white shadow-none transition-all absolute top-2 right-2 ${
                        isWithinMonth ? "invisible  group-hover:visible " : "invisible"
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
                  <div className=" grid grid-cols-3 items-center">
                    {(() => {
                      const days = date.dueDate.sort(compareAsc);

                      return (
                        <>
                          <Badge className="rounded-none bg-blue-200 text-blue-500 h-[2rem]  w-full col-span-3 gap-2">
                            <span className="col-span-2">
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
                            <Badge className="text-white bg-blue-500 w-[3rem] text-center">Due</Badge>
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                ) : date.dueDate ? (
                  <div className=" grid grid-cols-3 items-center">
                    <Badge className="rounded-none h-[2rem] bg-blue-200 w-full col-span-3 gap-2">
                      <span className="text-blue-500 font-bold col-span-2">
                        {scheduler.formatDate(date.dueDate, "MMM dd")}
                      </span>
                      <Badge className="text-white w-[3rem] bg-blue-500 text-center">Due</Badge>
                    </Badge>
                  </div>
                ) : null}

                {/* DISCONNECTION */}
                {Array.isArray(date.disconnectionDate) ? (
                  <div className=" grid grid-cols-3 items-center">
                    {(() => {
                      const days = date.disconnectionDate.sort(compareAsc);

                      return (
                        <>
                          <Badge className="rounded-none bg-red-200 text-red-600 h-[2rem]  w-full col-span-3 gap-2">
                            <span className="col-span-2">
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
                            <Badge className="text-white bg-red-500 w-[3rem] text-center ">Disc</Badge>
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                ) : date.dueDate ? (
                  <div className=" grid grid-cols-3 items-center">
                    <Badge className="rounded-none h-[2rem] bg-red-200 w-full col-span-3 gap-2">
                      <span className="text-red-500 font-bold col-span-2">
                        {scheduler.formatDate(date.disconnectionDate, "MMM dd")}
                      </span>
                      <Badge className="text-white bg-red-500 w-[3rem] text-center ">Disc</Badge>
                    </Badge>
                  </div>
                ) : null}

                {/* {date.dueDate === undefined && (
                  <Badge className="rounded-none bg-gray-300 h-[2rem] items-center w-full ">Rest Day</Badge>
                )} */}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

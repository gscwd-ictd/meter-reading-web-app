// import { Heading } from "@mr/components/features/typography/Heading";
// import { Paragraph } from "@mr/components/features/typography/Paragraph";
// import { Scheduler } from "@mr/components/features/scheduler/Scheduler";
import { Scheduler } from "@mr/components/features/scheduler/Scheduler";
import { users } from "@mr/components/features/scheduler/users";
import { Heading } from "@mr/components/features/typography/Heading";
import { Paragraph } from "@mr/components/features/typography/Paragraph";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mr/components/ui/Breadcrumb";
import { Button } from "@mr/components/ui/Button";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { CalendarFold, CalendarPlus, Ellipsis, Star, Users } from "lucide-react";
import Link from "next/link";

export default function SchedulePage() {
  return (
    <div className="h-full grid grid-rows-[auto_1fr] pt-5">
      <div className="px-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Schedule</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mt-4 mb-10 flex items-center justify-between">
          <section>
            <Heading variant="h2">Schedule</Heading>
            <Paragraph className="text-muted-foreground">
              Prepare a detailed meter reading schedule.
            </Paragraph>
          </section>

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
        </header>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 border-b-2 pb-2 border-b-primary">
              <CalendarFold className="size-4" />
              <Link href="#">Calendar</Link>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground pb-2">
              <Users className="size-4" />
              <Link href="#">Meter Readers</Link>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground pb-2">
              <Star className="size-4" />
              <Link href="#">Holidays</Link>
            </div>
          </div>
        </div>
      </div>

      <Scheduler />
    </div>
  );
}

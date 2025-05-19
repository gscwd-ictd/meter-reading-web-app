/* This component is created due to SSR issues*/
"use client";

import dynamic from "next/dynamic";

const Scheduler = dynamic(() => import("@mr/components/features/scheduler/Scheduler"), { ssr: false });

export default function SchedulerWrapper() {
  return (
    <div className="m-10 border rounded">
      <Scheduler />
    </div>
  );
}

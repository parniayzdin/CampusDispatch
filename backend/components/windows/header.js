"use client";

import { ClipboardPen, Signal, Wifi } from "lucide-react";
import Clock from "react-live-clock";

function AppHeader() {
  return (
    <div className="py-2 px-4 border rounded mt-4 mx-4 flex items-center uppercase gap-6 font-extralight">
      <h1>CAMPUSDISPATCH</h1>
      <p>LITE::DISPATCHER</p>
      <p className="ml-auto">HAMILTON, ON</p>
      <Clock format="YYYY-MM-DD" ticking={false} timezone={"America/Toronto"} />
      <p>-2°C</p>
      <Wifi className="ml-12" strokeWidth={0.5} />
      <Signal className="-ml-3" strokeWidth={0.5} />
      <ClipboardPen className="-ml-3" strokeWidth={0.5} />
    </div>
  );
}

export default AppHeader;

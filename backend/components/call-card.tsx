// components/call-card.tsx

import useCallLog from "@/context/use-call-log";
import { cn } from "@/utils";
import { callTypeMap } from "@/utils/types"; 
import { format } from "date-fns";
import {
  Ambulance,
  Box,
  Ear,
  Flame,
  LifeBuoy,
  PawPrint,
  Siren,
  TrafficCone,
  Zap,
} from "lucide-react";
import React from "react";

// small icon map – we can treat these as "campus categories"
// even though the keys are the old ones (Fire, Medical, etc.)
const typeIconMap: Record<string, React.ReactElement> = {
  Fire: <Flame strokeWidth={0.8} />,
  Medical: <Ambulance strokeWidth={0.8} />,
  Police: <Siren strokeWidth={0.8} />,
  Traffic: <TrafficCone strokeWidth={0.8} />,
  Rescue: <LifeBuoy strokeWidth={0.8} />,
  Utility: <Zap strokeWidth={0.8} />,
  PublicDisturbance: <Ear strokeWidth={0.8} />,
  AnimalControl: <PawPrint strokeWidth={0.8} />,
  Violence: <Ear strokeWidth={0.8} />, // could swap later if we want
  Other: <Box strokeWidth={0.8} />,
};

function CallCard({ log }: { log: any }) {
  const { selectedCallLog, setSelectedCallLog } = useCallLog();
  const { id, createdAt, status, type } = log;

  return (
    <div
      onClick={() => {
        // clicking a row picks that call in the rest of the dashboard
        setSelectedCallLog(log);
      }}
      className={cn(
        "flex items-center px-4 py-2 border-b relative cursor-pointer hover:bg-[#131f35] transition-all",
        selectedCallLog?.id === id && "bg-[#192b4a] hover:bg-[#192b4a]"
      )}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full">
        {/* show an icon if we know this type */}
        {type && typeIconMap[type]}
      </div>
      <div className="flex-1">
        <div className="flex items-center ml-2">
          {/* callTypeMap can say “Maintenance”, “Security”, etc. for us */}
          <p className="text-sm font-light">{type && callTypeMap[type]}</p>
          <p
            className={cn(
              "ml-auto text-xs font-light uppercase tracking-[1px]",
              status === "pending" && "text-yellow-500",
              status === "active" && "text-red-500",
              status === "resolved" && "text-green-500",
              status === "cancelled" && "text-gray-500"
            )}
          >
            {status}
          </p>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-muted ml-2">#{id}</p>
          <p className="ml-auto text-xs text-gray-500">
            {format(createdAt, "yyyy-MM-dd HH:mm:ss")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CallCard;

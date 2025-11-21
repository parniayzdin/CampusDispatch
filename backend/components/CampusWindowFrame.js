// components/window.js
// kinda basic frame for each panel in the dispatch dashboard
// (I'll clean this up later)

import useCallLog from "@/context/use-call-log";
import { cn } from "@/utils";
import {
  Circle,
  EllipsisVertical,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function CampusWindowFrame({
  title,
  loading,
  children,
  className,
  parentID,
  controlSelected,
//components/sort-button.js

"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp } from "lucide-react";

export function CallSortToggle({ options, sort, setSort }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ArrowDownUp
          strokeWidth={0.7}
          size={18}
          className="ml-1.5 cursor-pointer"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(value) => setSort(value)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

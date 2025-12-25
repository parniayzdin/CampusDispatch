"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/utils";

const labelVariants = cva(
  "text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
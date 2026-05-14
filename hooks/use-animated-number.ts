"use client";

import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function useAnimatedNumber(value: number, formatter: (value: number) => string = (item) => String(Math.round(item))) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => formatter(latest));
  const [display, setDisplay] = useState(formatter(0));

  useEffect(() => {
    const unsubscribe = rounded.on("change", setDisplay);
    const controls = animate(motionValue, value, { type: "spring", stiffness: 70, damping: 18 });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [formatter, motionValue, rounded, value]);

  return display;
}

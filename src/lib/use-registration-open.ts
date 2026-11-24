"use client";

import { useEffect, useState } from "react";
import { isRegistrationOpen, oprecConfig } from "@/config/oprec.config";

const MAX_TIMEOUT_MS = 2_147_483_647; // setTimeout 32-bit signed int max (~24.8 days)

export function useRegistrationOpen(): boolean {
  const [open, setOpen] = useState<boolean>(oprecConfig.isOpen);

  useEffect(() => {
    const currentlyOpen = isRegistrationOpen();
    setOpen(currentlyOpen);

    if (!currentlyOpen) return;

    const deadlineMs = Date.parse(oprecConfig.registrationDeadlineIso);
    if (Number.isNaN(deadlineMs)) return;

    const remainingMs = deadlineMs - Date.now() + 1000;
    if (remainingMs <= 0) {
      setOpen(false);
      return;
    }

    if (remainingMs <= MAX_TIMEOUT_MS) {
      const timerId = window.setTimeout(() => {
        setOpen(isRegistrationOpen());
      }, remainingMs);

      return () => window.clearTimeout(timerId);
    }
  }, []);

  return open;
}

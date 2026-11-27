"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function filterOwnerTraffic(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("va-disable") === "true"
    ) {
      return null;
    }
  } catch {
    // Ignore storage access errors in restricted/private browser contexts
  }

  return event;
}

export function VercelAnalytics() {
  return <Analytics beforeSend={filterOwnerTraffic} />;
}

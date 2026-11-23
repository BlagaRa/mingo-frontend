import {
  bookingStatusLabel,
  bookingStatusTone,
} from "@/lib/mock/booking-display";
import type { BookingStatus } from "@/lib/mock/types";

function StatusIcon({ status }: { status: BookingStatus }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 12 12",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (status) {
    case "open":
      return (
        <svg {...common} data-testid="status-icon-open">
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M6 3.75V6.2L7.7 7.4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "confirmed":
      return (
        <svg {...common} data-testid="status-icon-confirmed">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "cancelled":
      return (
        <svg {...common} data-testid="status-icon-cancelled">
          <path
            d="M3.2 3.2L8.8 8.8M8.8 3.2L3.2 8.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pending":
      return (
        <svg {...common} data-testid="status-icon-pending">
          <circle
            cx="6"
            cy="6"
            r="4.25"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="2 2"
          />
        </svg>
      );
    case "full":
      return (
        <svg {...common} data-testid="status-icon-full">
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="6" cy="6" r="1.6" fill="currentColor" />
        </svg>
      );
  }
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const tone = bookingStatusTone(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={tone}
    >
      <StatusIcon status={status} />
      {bookingStatusLabel(status)}
    </span>
  );
}

export type UserRole = "player" | "owner" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: "active" | "suspended";
};

export type Pitch = {
  id: string;
  name: string;
  ownerId: string;
  judet: string;
  oras: string;
  zona: string;
  capacity: number;
  pricePerHourRon: number;
  surface: "Sintetic" | "Iarbă artificială" | "Natural";
  description: string;
  photos: string[];
  lat: number;
  lng: number;
  covered: boolean;
  nightLights: boolean;
  indoor: boolean;
};

export type Slot = {
  id: string;
  pitchId: string;
  startsAt: string;
  endsAt: string;
};

export type BookingStatus =
  | "open"
  | "full"
  | "confirmed"
  | "cancelled"
  | "pending";

export type Booking = {
  id: string;
  pitchId: string;
  slotId: string;
  hostId: string;
  playerIds: string[];
  status: BookingStatus;
  seatsNeeded: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

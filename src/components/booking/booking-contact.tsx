type BookingContactProps = {
  email: string;
  phone: string;
};

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      data-testid="booking-contact-row"
      className="flex flex-col gap-0.5 text-[var(--type-small)]"
    >
      <span className="font-medium uppercase tracking-wide opacity-70 text-[var(--color-ivory)]">
        {label}
      </span>
      <span className="text-[0.95rem] font-medium text-[var(--color-ivory)]">
        {value}
      </span>
    </div>
  );
}

export function BookingContact({ email, phone }: BookingContactProps) {
  return (
    <div className="flex flex-col gap-2">
      <ContactRow label="Email" value={email} />
      <ContactRow label="Telefon" value={phone} />
    </div>
  );
}
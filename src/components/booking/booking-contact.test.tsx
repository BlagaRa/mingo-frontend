import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingContact } from "./booking-contact";

describe("BookingContact", () => {
  it("renders labeled email and phone rows with distinct label styling", () => {
    render(
      <BookingContact email="andrei@example.com" phone="0721123456" />,
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Telefon")).toBeInTheDocument();
    expect(screen.getByText("andrei@example.com")).toBeInTheDocument();
    expect(screen.getByText("0721123456")).toBeInTheDocument();

    const emailLabel = screen.getByText("Email");
    const emailValue = screen.getByText("andrei@example.com");
    expect(emailLabel.className).toContain("opacity-70");
    expect(emailValue.className).not.toContain("opacity-70");
  });

  it("orders Telefon below Email", () => {
    const { container } = render(
      <BookingContact email="a@b.ro" phone="0700000000" />,
    );
    const rows = container.querySelectorAll("[data-testid='booking-contact-row']");
    expect(rows[0]).toHaveTextContent("Email");
    expect(rows[0]).toHaveTextContent("a@b.ro");
    expect(rows[1]).toHaveTextContent("Telefon");
    expect(rows[1]).toHaveTextContent("0700000000");
  });
});
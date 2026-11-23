import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoCarousel } from "./photo-carousel";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PhotoCarousel", () => {
  it("moves with dots and keeps manual control", async () => {
    const user = userEvent.setup();
    render(
      <PhotoCarousel
        alt="Teren"
        photos={[
          "https://images.unsplash.com/photo-1",
          "https://images.unsplash.com/photo-2",
        ]}
      />,
    );
    expect(screen.getByAltText("Teren — poza 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mergi la poza 2" }));
    expect(screen.getByAltText("Teren — poza 2")).toBeInTheDocument();
  });

  it("slides on pointer swipe even when setPointerCapture fails", () => {
    Element.prototype.setPointerCapture = () => {
      throw new DOMException(
        "No active pointer with the given id is found.",
        "NotFoundError",
      );
    };

    const { container } = render(
      <PhotoCarousel
        alt="Teren swipe"
        photos={[
          "https://images.unsplash.com/photo-1",
          "https://images.unsplash.com/photo-2",
        ]}
      />,
    );
    const track = container.querySelector('[aria-roledescription="carousel"]');
    expect(track).toBeTruthy();
    expect(() => {
      fireEvent.pointerDown(track!, { clientX: 200, pointerId: 1 });
      fireEvent.pointerMove(window, { clientX: 120, pointerId: 1 });
      fireEvent.pointerUp(window, { clientX: 120, pointerId: 1 });
    }).not.toThrow();
    expect(screen.getByAltText("Teren swipe — poza 2")).toBeInTheDocument();
  });
});

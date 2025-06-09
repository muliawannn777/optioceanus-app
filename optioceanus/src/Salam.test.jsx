import React from "react";
import { render, screen } from "@testing-library/react";
import Salam from "./Salam";
import { describe, expect, test } from "vitest";

describe("Komponen Salam", () => {
  test("harus merender salam default jika tidak ada props yang diberikan", () => {
    render(<Salam />);

    const headingElement = screen.getByRole("heading");
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(
      "Halo, Pengunjung dari Bumi! Ini dari Komponen Salam."
    );
  });

  test("harus merender salam dengan nama dan asal yang diberikan", () => {
    const namaProps = "Kapten Har";
    const asalProps = "Indonesia";
    render(<Salam nama={namaProps} asal={asalProps} />);

    const headingElement = screen.getByRole("heading");
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(
      `Halo, ${namaProps} dari ${asalProps}! Ini dari Komponen Salam.`
    );
  });
  test("harus merender salam dengan asal yang diberikan dan nama default", () => {
    const asalProps = "Mars";
    render(<Salam asal={asalProps} />);

    const headingElement = screen.getByRole("heading");
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(`Halo, Pengunjung dari ${asalProps}! Ini dari Komponen Salam.`);
  });
});

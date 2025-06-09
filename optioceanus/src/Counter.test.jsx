import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";
import { describe, test, expect } from "vitest";

describe("Komponen Counter", () => {
  test("harus menampilkan nilai awal 0", () => {
    render(<Counter />);
    const countDisplay = screen.getByText(/Nilai saat ini:/i);
    expect(countDisplay).toHaveTextContent("Nilai saat ini: 0");
  });

  test('harus menambah nilai saat tombol "Tambah (+)" diklik', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: /tambah/i });
    const countDisplay = screen.getByText(/Nilai saat ini:/i);

    expect(countDisplay).toHaveTextContent("Nilai saat ini: 0");

    await user.click(incrementButton);

    expect(countDisplay).toHaveTextContent("Nilai saat ini: 1");

    await user.click(incrementButton);
    expect(countDisplay).toHaveTextContent("Nilai saat ini: 2");
  });

  test('harus mengurangi nilai saat tombol "Kurang (-)" diklik', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const decrementButton = screen.getByRole("button", { name: /kurang/i });
    const incrementButton = screen.getByRole("button", { name: /tambah/i });
    const countDisplay = screen.getByText(/Nilai saat ini:/i);

    await user.click(incrementButton);
    await user.click(incrementButton);

    await user.click(decrementButton);

    expect(countDisplay).toHaveTextContent("Nilai saat ini: 1");

    await user.click(decrementButton);
    expect(countDisplay).toHaveTextContent("Nilai saat ini: 0");
  });
});

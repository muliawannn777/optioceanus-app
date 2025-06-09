import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import DataFetcher from "./DataFetcher";
import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("axios");

describe("Komponen DataFetcher", () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  test("harus menampilkan status loading pada awalnya", () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<DataFetcher />);

    expect(screen.getByText(/memuat data.../i)).toBeInTheDocument();
  });

  test("harus menampilkan data ketika fetch berhasil", async () => {
    const mockTodos = [
      { id: 1, title: "Todo Test 1", completed: false },
      { id: 2, title: "Todo Test 2", completed: true },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTodos });

    render(<DataFetcher />);

    await waitFor(() => {
      expect(screen.getByText(/todo test 1/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/todo test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/todo test 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/memuat data.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/terjadi kesalahan:/i)).not.toBeInTheDocument();
  });

  test("harus menampilkan pesan error ketika fetch gagal", async () => {
    const errorMessage = "Network Error";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    render(<DataFetcher />);

    await waitFor(() => {
      expect(
        screen.getByText(`Terjadi kesalahan: ${errorMessage}`)
      ).toBeInTheDocument();
    });

    expect(screen.queryByText(/memuat data.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/todo test 1/i)).not.toBeInTheDocument();
  });
});

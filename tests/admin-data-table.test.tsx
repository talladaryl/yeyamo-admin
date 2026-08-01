import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminDataTable, type AdminColumn } from "@/components/admin/ui/admin-data-table";

type Row = { id: string; name: string };
const columns: AdminColumn<Row>[] = [{ id: "name", header: "Nom", cell: (row) => row.name, sortable: true }];
const rows = [{ id: "1", name: "Alice" }, { id: "2", name: "Brice" }];
const base = { columns, rowKey: (row: Row) => row.id };

describe("AdminDataTable", () => {
  it("affiche loading, empty et erreur sans inventer de données", () => {
    const { rerender } = render(<AdminDataTable {...base} rows={[]} loading/>);
    expect(screen.getByText("Chargement en cours")).toBeInTheDocument();
    rerender(<AdminDataTable {...base} rows={[]}/>);
    expect(screen.getByText("Aucune donnée")).toBeInTheDocument();
    rerender(<AdminDataTable {...base} rows={[]} error="Backend indisponible"/>);
    expect(screen.getByRole("alert")).toHaveTextContent("Backend indisponible");
  });

  it("rend les données, trie et pagine côté serveur", () => {
    const onSort = vi.fn();
    const onPageChange = vi.fn();
    render(<AdminDataTable {...base} rows={rows} total={40} page={0} size={20} onSort={onSort} onPageChange={onPageChange}/>);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Trier par Nom" }));
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }));
    expect(onSort).toHaveBeenCalledWith("name");
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("gère la sélection simple et multiple", () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(<AdminDataTable {...base} rows={rows} selected={[]} onSelectionChange={onSelectionChange}/>);
    fireEvent.click(screen.getByRole("checkbox", { name: "Sélectionner 1" }));
    expect(onSelectionChange).toHaveBeenCalledWith(["1"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Tout sélectionner" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(["1", "2"]);
    rerender(<AdminDataTable {...base} rows={rows} selected={["1","2"]} onSelectionChange={onSelectionChange}/>);
    expect(screen.getByRole("checkbox", { name: "Tout sélectionner" })).toBeChecked();
  });
});

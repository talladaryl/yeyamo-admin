import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdminConfirmDialog, AdminStatusBadge, AdminTabs, normalizeAdminStatus } from "@/components/admin/ui/admin-foundation";

describe("Primitives UI admin", () => {
  it("normalise les statuts métier", () => {
    expect(normalizeAdminStatus("VALIDATED")).toBe("approved");
    expect(normalizeAdminStatus("CANCELED")).toBe("cancelled");
    expect(normalizeAdminStatus("PAID")).toBe("completed");
  });

  it("expose le statut normalisé sans perdre le libellé", () => {
    render(<AdminStatusBadge status="VALIDATED"/>);
    expect(screen.getByText("VALIDATED")).toHaveAttribute("data-status", "approved");
  });

  it("ferme un dialogue avec Escape et bloque le double submit", () => {
    const close = vi.fn();
    const confirm = vi.fn();
    render(<AdminConfirmDialog open title="Confirmer" message="Action sensible" busy onClose={close} onConfirm={confirm}/>);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Traitement…" })).toBeDisabled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalledOnce();
    expect(confirm).not.toHaveBeenCalled();
  });

  it("navigue dans les onglets au clavier", () => {
    const change = vi.fn();
    render(<AdminTabs tabs={[{ id: "a", label: "Résumé" }, { id: "b", label: "Audit" }]} active="a" onChange={change}/>);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(change).toHaveBeenCalledWith("b");
  });
});

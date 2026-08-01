import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLoginForm } from "@/components/admin-login-form";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));

describe("Authentification administrateur", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));

  it("affiche les identifiants invalides retournés par le serveur", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ message: "Identifiants invalides" }), { status: 401, headers: { "Content-Type": "application/json" } }));
    render(<AdminLoginForm/>);
    fireEvent.change(screen.getByLabelText("Email ou téléphone"), { target: { value: "admin@yeyamo.test" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "incorrect1" } });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Identifiants invalides");
  });

  it("empêche une double soumission pendant la connexion", async () => {
    let resolveResponse: (value: Response) => void = () => undefined;
    vi.mocked(fetch).mockReturnValueOnce(new Promise((resolve) => { resolveResponse = resolve; }));
    render(<AdminLoginForm/>);
    fireEvent.change(screen.getByLabelText("Email ou téléphone"), { target: { value: "admin@yeyamo.test" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: "Se connecter" }));
    expect(screen.getByRole("button", { name: "Connexion…" })).toBeDisabled();
    expect(fetch).toHaveBeenCalledTimes(1);
    resolveResponse(new Response(JSON.stringify({ message: "Stop" }), { status: 401, headers: { "Content-Type": "application/json" } }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Se connecter" })).toBeEnabled());
  });

  it("envoie uniquement les champs attendus au proxy sécurisé", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({ message: "Stop" }), { status: 401, headers: { "Content-Type": "application/json" } }));
    render(<AdminLoginForm/>);
    fireEvent.change(screen.getByLabelText("Email ou téléphone"), { target: { value: "admin@yeyamo.test" } });
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "password1" } });
    fireEvent.submit(screen.getByRole("button", { name: "Se connecter" }).closest("form")!);
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/auth/login", expect.objectContaining({ method: "POST", body: JSON.stringify({ identifier: "admin@yeyamo.test", password: "password1" }) })));
  });
});
